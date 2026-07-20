const Admin = require('../models/Admin');
const Profile = require('../models/Profile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Register a new admin (You may want to disable this route after creating your account)
// @route   POST /api/admin/register
// @access  Public (temporarily)
const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if an admin already exists to prevent duplicates
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // 2. Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the admin record with the hashed password
    const admin = await Admin.create({
      email,
      password: hashedPassword
    });

    if (admin) {
      res.status(201).json({
        _id: admin.id,
        email: admin.email,
        message: 'Admin created successfully'
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Authenticate an admin & get token
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the admin by email
    const admin = await Admin.findOne({ email });

    // 2. Check if admin exists AND passwords match
    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.status(200).json({
        _id: admin.id,
        email: admin.email,
        token: generateToken(admin._id) // Issue the JWT
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update the portfolio profile data
// @route   PUT /api/admin/profile
// @access  Private (Requires a valid JWT)
const updateProfile = async (req, res) => {
  try {
    // In a personal CMS, there is usually only one profile document.
    // We find the first one in the collection.
    let profile = await Profile.findOne();

    if (!profile) {
      // Fallback: if the seed script wasn't run, create the document instead of failing
      profile = await Profile.create(req.body);
      return res.status(201).json(profile);
    }

    // Update the existing document with the incoming data
    const updatedProfile = await Profile.findOneAndUpdate(
      {}, // Empty filter matches the first document
      req.body,
      { new: true } // Returns the updated document instead of the old one
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Generate Cloudinary upload signature
// @route   GET /api/admin/cloudinary-signature
// @access  Private
const getCloudinarySignature = (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // We sign the timestamp using your secret key
    const signature = cloudinary.utils.api_sign_request(
      { timestamp: timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({ timestamp, signature });
  } catch (error) {
    res.status(500).json({ message: 'Signature generation failed', error: error.message });
  }
};

// Helper function to generate JWT
const generateToken = (id) => {
  // Signs the payload (admin ID) using our secret key, expiring in 30 days
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerAdmin,
  loginAdmin,
  updateProfile,
  getCloudinarySignature
};