const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extract the token from the header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify token mathematically using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Attach the admin user to the request object (excluding the password field)
      req.admin = await Admin.findById(decoded.id).select('-password');

      next(); // Pass control to the requested controller
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token was found in the headers at all
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };