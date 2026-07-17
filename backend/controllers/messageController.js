const Message = require('../models/Message');
const sendEmail = require('../utils/sendEmail');

// @desc    Fetch all inbox messages (sorted newest first)
// @route   GET /api/admin/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Submit a new contact message
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
  try {
    // 1. Save the message to the database first
    const message = await Message.create(req.body);
    
    // 2. Attempt to send an email notification to the Admin
    try {
      await sendEmail({
        email: process.env.SMTP_EMAIL, // Sending to yourself
        subject: `New Portfolio Message from ${message.name}`,
        message: `You have received a new message.\n\nName: ${message.name}\nEmail: ${message.email}\n\nMessage:\n${message.message}`,
      });
    } catch (emailError) {
      // Log the error for the admin, but DO NOT fail the user's request
      console.error('Email failed to send, but message was saved to DB:', emailError);
    }
    
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to send message', error: error.message });
  }
};

// @desc    Update message status (Mark as Read or Archived)
// @route   PUT /api/admin/messages/:id
// @access  Private/Admin
const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // We use runValidators: true to ensure the new status matches our Enum
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(400).json({ message: 'Invalid status update', error: error.message });
  }
};

// @desc    Delete a message permanently
// @route   DELETE /api/admin/messages/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: 'Message permanently removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getMessages,
  createMessage,
  updateMessageStatus,
  deleteMessage
};