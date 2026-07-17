const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminController');

// @route   POST /api/admin/register
// @access  Public (Used initially to set up your account)
router.post('/register', registerAdmin);

// @route   POST /api/admin/login
// @access  Public (Used by the frontend to get the JWT)
router.post('/login', loginAdmin);

module.exports = router;