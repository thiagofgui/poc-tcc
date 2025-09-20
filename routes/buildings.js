const express = require('express');
const Building = require('../models/Building');
const router = express.Router();

// Listar prédios públicos (sem autenticação)
router.get('/', async (req, res) => {
  try {
    const buildings = await Building.find({ isActive: true }).select('name address tenantId');
    res.json(buildings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;