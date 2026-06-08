const User = require('../models/User');

async function listUsers(req, res) {
  const filters = { isActive: true };
  if (req.query.role) filters.role = req.query.role;
  const users = await User.find(filters).select('-passwordHash').sort('username');
  return res.json(users);
}

module.exports = { listUsers };
