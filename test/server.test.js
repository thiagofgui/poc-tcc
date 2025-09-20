const request = require('supertest');
const express = require('express');

// Mock do servidor básico para teste
const app = express();
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'POC Frontend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Status endpoint mock
app.get('/api/services/status', (req, res) => {
  res.json({
    qrManager: true,
    turnstile: true,
    frontend: true
  });
});

describe('POC Frontend', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'POC Frontend');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/services/status', () => {
    it('should return services status', async () => {
      const response = await request(app)
        .get('/api/services/status')
        .expect(200);

      expect(response.body).toHaveProperty('qrManager');
      expect(response.body).toHaveProperty('turnstile');
      expect(response.body).toHaveProperty('frontend');
    });
  });
});