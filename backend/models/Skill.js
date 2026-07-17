const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Frontend', 'Backend', 'Tools', 'Design'] // Strictly enforces these categories
  },
  iconClass: { type: String }, // Stores the Remix Icon class (e.g., 'ri-reactjs-line')
  proficiency: { 
    type: Number, 
    min: 1, 
    max: 100 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Skill', skillSchema);