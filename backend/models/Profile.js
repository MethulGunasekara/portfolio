const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  bio: { type: String, required: true },
  resumeUrl: { type: String }, // Cloudinary PDF link
  githubUrl: { type: String },
  linkedinUrl: { type: String },
  heroImageUrl: { type: String }, // Cloudinary image link
  accentColor: { type: String, default: '#00E5A0' }
}, { 
  timestamps: true // Automatically manages createdAt and updatedAt properties
});

module.exports = mongoose.model('Profile', profileSchema);