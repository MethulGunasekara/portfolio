const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/profile
// @access  Public
router.get('/', getProfile);

// @route   PUT /api/admin/profile
// @access  Private/Admin (We will add Auth middleware to protect this later)
router.put('/', updateProfile);

module.exports = router;