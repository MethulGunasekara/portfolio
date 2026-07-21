const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  tagline: { type: String },
  category: { type: String },
  technologies: { type: [String], required: true },
  githubLink: { type: String },
  liveLink: { type: String },
  previewImages: { type: [String], default: [] },
  videoUrl: { type: String },
  problemStatement: { type: String },
  solution: { type: String },
  outcomes: { type: String },
  documentation: { type: String },
  documentationUrl: { type: String },
  myRole: { type: String },
  teamSize: { type: String },
  duration: { type: String },
  methodology: { type: String },
  keyFeatures: { type: [String] },
}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema);