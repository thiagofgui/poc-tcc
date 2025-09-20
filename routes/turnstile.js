const express = require('express');
const axios = require('axios');
const router = express.Router();

// Get available turnstiles
router.get('/', async (req, res) => {
  try {
    const { building } = req.query;
    let url = `${process.env.TURNSTILE_SERVICE_URL}/turnstiles`;
    
    if (building) {
      // Get building info to get tenantId
      const Building = require('../models/Building');
      const buildingDoc = await Building.findById(building);
      if (buildingDoc) {
        url += `?tenant=${buildingDoc.tenantId}`;
      }
    }
    
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json([]);
  }
});

// Scan QR Code
router.post('/scan', async (req, res) => {
  try {
    const { token, turnstileId } = req.body;
    
    const response = await axios.post(`${process.env.TURNSTILE_SERVICE_URL}/turnstile/scan`, {
      jwtToken: token,
      gate: turnstileId
    });
    
    res.json(response.data);
  } catch (error) {
    const errorData = error.response?.data;
    res.status(400).json({ 
      success: false,
      message: errorData?.message || errorData?.error?.message || 'Erro ao processar QR Code',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    });
  }
});

module.exports = router;