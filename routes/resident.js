const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const QRCode = require('qrcode');
const Resident = require('../models/Resident');
const Building = require('../models/Building');
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, buildingId } = req.body;
    const resident = await Resident.findOne({ email, buildingId }).populate('buildingId');
    
    if (!resident || !(await resident.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciais inválidas ou prédio incorreto' });
    }
    
    const token = jwt.sign({ id: resident._id }, process.env.JWT_SECRET);
    res.json({ token, resident });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar catracas do prédio
router.get('/turnstiles', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const resident = await Resident.findById(decoded.id).populate('buildingId');
    
    const response = await axios.get(`${process.env.TURNSTILE_SERVICE_URL}/turnstiles`, {
      params: { tenant: resident.buildingId.tenantId }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao carregar catracas' });
  }
});

// Criar QR Code
router.post('/qrcode', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const resident = await Resident.findById(decoded.id).populate('buildingId');
    
    // Verificar se há catracas disponíveis
    const turnstiles = await axios.get(`${process.env.TURNSTILE_SERVICE_URL}/turnstiles`, {
      params: { tenant: resident.buildingId.tenantId }
    });
    
    if (!turnstiles.data || turnstiles.data.length === 0) {
      return res.status(400).json({ error: 'Nenhuma catraca disponível para este prédio' });
    }
    
    const qrData = {
      visitId: `${resident._id}-${Date.now() - 3 * 60 * 60 * 1000}`,
      visitName: req.body.guestName,
      turnstileId: req.body.turnstileId,
      windowStart: req.body.windowStart,
      windowEnd: req.body.windowEnd,
      maxUses: req.body.maxUses || 1
    };
    
    const response = await axios.post(`${process.env.QR_MANAGER_URL}/qrcodes`, qrData);
    
    // Gerar imagem do QR Code
    const qrCodeImage = await QRCode.toDataURL(response.data.token, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    res.json({
      ...response.data,
      qrCodeImage
    });
  } catch (error) {
    if (error.response && error.response.data) {
      res.status(error.response.status || 400).json({ 
        error: error.response.data.message || error.response.data.error || error.message 
      });
    } else {
      res.status(400).json({ error: 'Erro ao gerar QR Code' });
    }
  }
});

module.exports = router;