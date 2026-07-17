const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true // Ensures no duplicate admin accounts can be created with this email
  },
  password: { 
    type: String, 
    required: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Admin', adminSchema);