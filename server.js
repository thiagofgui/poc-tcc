require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro MongoDB:', err));

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/resident', require('./routes/resident'));
app.use('/api/turnstile', require('./routes/turnstile'));
app.use('/api/turnstiles', require('./routes/turnstile'));
app.use('/api/buildings', require('./routes/buildings'));
app.use('/health', require('./routes/health'));

// Health check endpoint for services
app.get('/api/services/status', async (req, res) => {
  const services = {
    qrManager: false,
    turnstile: false,
    frontend: true
  };
  
  const fetch = (await import('node-fetch')).default;
  
  // Check QR Manager
  try {
    const qrManagerUrl = process.env.QR_MANAGER_URL || 'http://localhost:8000';
    const response = await fetch(`${qrManagerUrl}/health`, { timeout: 3000 });
    if (response.ok) services.qrManager = true;
  } catch (e) {}
  
  // Check Turnstile
  try {
    const turnstileUrl = process.env.TURNSTILE_SERVICE_URL || 'http://localhost:8001';
    const response = await fetch(`${turnstileUrl}/health`, { timeout: 3000 });
    if (response.ok) services.turnstile = true;
  } catch (e) {}
  
  res.json(services);
});

// Serve HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public/admin/index.html')));
app.get('/resident', (req, res) => res.sendFile(path.join(__dirname, 'public/resident/index.html')));
app.get('/turnstile', (req, res) => res.sendFile(path.join(__dirname, 'public/turnstile/index.html')));
app.get('/status', (req, res) => res.sendFile(path.join(__dirname, 'public/status/index.html')));

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => console.log(`POC rodando na porta ${PORT}`));