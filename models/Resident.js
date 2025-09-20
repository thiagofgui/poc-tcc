const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const residentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  apartment: { type: String, required: true },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

residentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

residentSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Resident', residentSchema);