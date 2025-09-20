require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const admin = new Admin({
      username: 'admin',
      password: 'admin123'
    });
    
    await admin.save();
    console.log('✅ Admin criado com sucesso!');
    console.log('Username: admin');
    console.log('Password: admin123');
    
  } catch (error) {
    if (error.code === 11000) {
      console.log('⚠️ Admin já existe!');
    } else {
      console.error('❌ Erro:', error.message);
    }
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();