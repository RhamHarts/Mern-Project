const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import model User

const authMiddleware = {
  verifyToken: async (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Auth Header:', authHeader);

    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Access Denied' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token);

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access Denied' });
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Verified:', verified);

      // Mencari user di database
      const user = await User.findById(verified.id).select('username email'); // Mengambil username
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      req.user = user; // Mengisi req.user dengan user yang ditemukan
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(400).json({ success: false, message: 'Invalid Token' });
    }
  }
};

module.exports = authMiddleware;
