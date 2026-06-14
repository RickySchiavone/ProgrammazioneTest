const express = require('express');
const { listUsers } = require('../controllers/userController');
const asyncHandler = require('../middleware/asyncHandler');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, asyncHandler(listUsers));

module.exports = router;
