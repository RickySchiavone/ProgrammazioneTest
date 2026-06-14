const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');

async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token mancante' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Utente non valido' });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token non valido' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Permesso negato' });
    }
    return next();
  };
}

module.exports = { auth, requireRole };
