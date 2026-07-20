const express = require('express');
const router = express.Router();
const {
  getMessages,
  createMessage,
  updateMessageStatus,
  deleteMessage
} = require('../controllers/messageController');

const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/messages
// @access  Public (Contact Form Submission)
router.post('/', createMessage);

// @route   GET /api/messages
// @access  Private/Admin (View Inbox)
router.get('/', protect, getMessages);

// @route   PUT & DELETE /api/messages/:id
// @access  Private/Admin (Manage specific message)
router.route('/:id')
  .put(protect, updateMessageStatus)
  .delete(protect, deleteMessage);
  
module.exports = router;