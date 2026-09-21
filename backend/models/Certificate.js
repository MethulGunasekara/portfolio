const mongoose = require('mongoose')

const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: String },
  credentialUrl: { type: String },
  imageUrl: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Certificate', certificateSchema)