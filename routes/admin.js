const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const Admin = require('../models/Admin');
const Building = require('../models/Building');
const Resident = require('../models/Resident');
const router = express.Router();

// Login Admin
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const token = jwt.sign({ id: admin._id, type: 'admin' }, process.env.JWT_SECRET);
    res.json({ token, admin: { username: admin.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'admin') return res.status(403).json({ error: 'Acesso negado' });
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// CRUD Prédios
router.post('/buildings', authMiddleware, async (req, res) => {
  try {
    const building = new Building(req.body);
    await building.save();
    
    res.status(201).json(building);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar catracas de um prédio
router.get('/buildings/:id/turnstiles', authMiddleware, async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) {
      return res.status(404).json({ error: 'Prédio não encontrado' });
    }
    
    const response = await axios.get(`${process.env.TURNSTILE_SERVICE_URL}/turnstiles`, {
      params: { tenant: building.tenantId }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Criar catraca para um prédio
router.post('/buildings/:id/turnstiles', authMiddleware, async (req, res) => {
  try {
    const building = await Building.findById(req.params.id);
    if (!building) {
      return res.status(404).json({ error: 'Prédio não encontrado' });
    }
    
    const turnstileData = {
      id: req.body.id || `${building.tenantId}-${Date.now() - 3 * 60 * 60 * 1000}`,
      name: req.body.name,
      tenant: building.tenantId,
      isActive: true
    };
    
    const response = await axios.post(`${process.env.TURNSTILE_SERVICE_URL}/turnstiles`, turnstileData);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/buildings', authMiddleware, async (req, res) => {
  try {
    const buildings = await Building.find();
    res.json(buildings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/buildings/:id', authMiddleware, async (req, res) => {
  try {
    const building = await Building.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(building);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/buildings/:id', authMiddleware, async (req, res) => {
  try {
    await Building.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CRUD Moradores
router.post('/residents', authMiddleware, async (req, res) => {
  try {
    const resident = new Resident(req.body);
    await resident.save();
    res.status(201).json(resident);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/residents', authMiddleware, async (req, res) => {
  try {
    const residents = await Resident.find().populate('buildingId');
    res.json(residents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar moradores de um prédio específico
router.get('/buildings/:id/residents', authMiddleware, async (req, res) => {
  try {
    const residents = await Resident.find({ buildingId: req.params.id }).populate('buildingId');
    res.json(residents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/residents/:id', authMiddleware, async (req, res) => {
  try {
    const resident = await Resident.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('buildingId');
    res.json(resident);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/residents/:id', authMiddleware, async (req, res) => {
  try {
    await Resident.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar QR Codes ativos de um morador
router.get('/residents/:id/qrcodes', authMiddleware, async (req, res) => {
  try {
    const response = await axios.get(`${process.env.QR_MANAGER_URL}/qrcodes/resident/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.response?.data?.message || 'Erro ao buscar QR Codes' });
  }
});

// Revogar QR Code
router.delete('/qrcodes/:jti', authMiddleware, async (req, res) => {
  try {
    const response = await axios.delete(`${process.env.QR_MANAGER_URL}/qrcodes/${req.params.jti}`);
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.response?.data?.message || 'Erro ao revogar QR Code' });
  }
});

// Atualizar catraca
router.put('/turnstiles/:id', authMiddleware, async (req, res) => {
  try {
    const response = await axios.put(`${process.env.TURNSTILE_SERVICE_URL}/turnstiles/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.response?.data?.message || 'Erro ao atualizar catraca' });
  }
});

module.exports = router;