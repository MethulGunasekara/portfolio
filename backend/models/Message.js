const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  subject: { type: String },
  messageBody: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Unread', 'Read', 'Archived'], 
    default: 'Unread' 
  }
}, { 
  timestamps: true // Automatically gives us a createdAt field for sorting inbox messages
});

module.exports = mongoose.model('Message', messageSchema);