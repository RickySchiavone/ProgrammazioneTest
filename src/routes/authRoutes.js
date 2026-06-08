const express = require('express');
const { register, login, me, updateMe, deleteMe } = require('../controllers/authController');
const asyncHandler = require('../middleware/asyncHandler');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/me', auth, asyncHandler(me));
router.put('/me', auth, asyncHandler(updateMe));
router.delete('/me', auth, asyncHandler(deleteMe));

module.exports = router;
