const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Invalid authorization header' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token is required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Access token expired' });
    }
    console.error('Authentication error:', error.message);
    return res.status(403).json({ success: false, message: 'Invalid access token' });
  }
};

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('User role:', req.user?.role);
    console.log('Allowed roles:', allowedRoles);
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json({ message: 'Không xác định được vai trò người dùng' });
      }

      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: `User role: ${userRole} - Allowed roles: [ ${allowedRoles.join(', ')} ]`
        });
      }

      next();
    } catch (err) {
      console.error('Role middleware error:', err);
      res.status(500).json({ message: 'Lỗi phân quyền' });
    }
  };
};

module.exports = { authMiddleware, roleMiddleware };
