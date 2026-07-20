const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, updateProfile,getCloudinarySignature} = require('../controllers/adminController');

// @route   POST /api/admin/register
// @access  Public (Used initially to set up your account)
router.post('/register', registerAdmin);

// @route   POST /api/admin/login
// @access  Public (Used by the frontend to get the JWT)
router.post('/login', loginAdmin);

// @route   PUT /api/admin/profile
// @access  Private 
router.put('/profile', updateProfile);

// @route   GET /api/admin/cloudinary-signature
// @access  Private 
router.get('/cloudinary-signature', getCloudinarySignature);

module.exports = router;