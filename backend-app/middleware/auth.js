// middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = {
  verifyToken: (req, res, next) => {
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
      req.user = verified;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(400).json({ success: false, message: 'Invalid Token' });
    }
  }
};

module.exports = authMiddleware;