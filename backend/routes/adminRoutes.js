const express = require('express');
const multer = require('multer');
const router = express.Router();
const { registerAdmin, loginAdmin, updateProfile, uploadMedia, getCloudinarySignature} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/admin/register
// @access  Public (Used initially to set up your account)
router.post('/register', registerAdmin);

// @route   POST /api/admin/login
// @access  Public (Used by the frontend to get the JWT)
router.post('/login', loginAdmin);

// @route   PUT /api/admin/profile
// @access  Private 
router.put('/profile', updateProfile);

// @route   POST /api/admin/upload
// @access  Private
router.post('/upload', protect, upload.single('file'), uploadMedia);

// @route   GET /api/admin/cloudinary-signature
// @access  Private 
router.get('/cloudinary-signature', getCloudinarySignature);

module.exports = router;