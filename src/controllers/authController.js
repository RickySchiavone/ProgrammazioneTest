const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const { hashPassword, verifyPassword } = require('../services/passwordService');

function signToken(user) {
  return jwt.sign({ sub: user._id, role: user.role }, config.jwtSecret, { expiresIn: '8h' });
}

async function register(req, res) {
  const { username, email, password, role, firstName, lastName, phone, preferences, payment } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: 'username, email, password e role sono obbligatori' });
  }
  const passwordHash = hashPassword(password);
  const user = await User.create({ username, email, passwordHash, role, firstName, lastName, phone, preferences, payment });
  return res.status(201).json({ token: signToken(user), user: user.toSafeJSON() });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email, isActive: true });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Credenziali non valide' });
  }
  return res.json({ token: signToken(user), user: user.toSafeJSON() });
}

async function me(req, res) {
  return res.json(req.user.toSafeJSON());
}

async function updateMe(req, res) {
  const allowed = ['username', 'firstName', 'lastName', 'phone', 'preferences', 'payment'];
  allowed.forEach((field) => {
    if (field in req.body) req.user[field] = req.body[field];
  });
  await req.user.save();
  return res.json(req.user.toSafeJSON());
}

async function deleteMe(req, res) {
  req.user.isActive = false;
  await req.user.save();
  return res.status(204).send();
}

module.exports = { register, login, me, updateMe, deleteMe };
