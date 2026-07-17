const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// Helper function to generate JWT
const generateToken = (id) => {
  // Signs the payload (admin ID) using our secret key, expiring in 30 days
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerAdmin,
  loginAdmin
};