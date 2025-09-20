require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Building = require('../models/Building');
const Resident = require('../models/Resident');

async function initDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Conectado ao MongoDB');

    // Criar admin padrão
    try {
      const admin = new Admin({
        username: 'admin',
        password: 'admin123'
      });
      await admin.save();
      console.log('✅ Admin criado: admin/admin123');
    } catch (error) {
      if (error.code === 11000) {
        console.log('⚠️ Admin já existe');
      }
    }

    // Criar prédio exemplo
    try {
      const building = new Building({
        name: 'Edifício Central',
        address: 'Rua das Flores, 123',
        tenantId: 'edificio-central'
      });
      await building.save();
      console.log('✅ Prédio exemplo criado');

      // Criar morador exemplo
      const resident = new Resident({
        name: 'João Silva',
        email: 'joao@email.com',
        password: '123456',
        apartment: '101',
        buildingId: building._id
      });
      await resident.save();
      console.log('✅ Morador exemplo criado: joao@email.com/123456');

    } catch (error) {
      if (error.code === 11000) {
        console.log('⚠️ Dados exemplo já existem');
      }
    }

    console.log('\n🎉 Banco inicializado com sucesso!');
    console.log('\n📋 Credenciais:');
    console.log('Admin: admin/admin123');
    console.log('Morador: joao@email.com/123456');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

initDatabase();