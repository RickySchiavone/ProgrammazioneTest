const crypto = require('crypto');

const iterations = 120000;
const keyLength = 64;
const digest = 'sha512';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest).toString('hex');
  return `${iterations}:${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [storedIterations, salt, storedHash] = stored.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, Number(storedIterations), keyLength, digest).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

module.exports = { hashPassword, verifyPassword };
