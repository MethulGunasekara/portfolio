const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  technologies: { 
    type: [String], // An array of strings (e.g., ['React', 'Node', 'MongoDB'])
    required: true 
  },
  githubLink: { 
    type: String 
  },
  liveLink: { 
    type: String 
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Project', projectSchema);