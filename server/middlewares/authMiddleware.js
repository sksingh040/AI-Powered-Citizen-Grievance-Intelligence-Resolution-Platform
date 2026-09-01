import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getInMemoryStore, isDbMockMode } from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'civic_ai_super_secret_jwt_key_2026_hackathon');

      if (isDbMockMode()) {
        const store = getInMemoryStore();
        req.user = store.users.find((u) => u._id === decoded.id || u.email === decoded.email) || {
          _id: decoded.id,
          name: decoded.name || 'Demo Officer',
          email: decoded.email,
          role: decoded.role || 'citizen'
        };
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role}' is not authorized to access this resource`
      });
    }
    next();
  };
};
