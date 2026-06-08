const express = require('express');
const { createOrder, listMyOrders, updateStatus, adminListPurchases } = require('../controllers/orderController');
const asyncHandler = require('../middleware/asyncHandler');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, requireRole('cliente'), asyncHandler(createOrder));
router.get('/mine', auth, asyncHandler(listMyOrders));
router.get('/purchases', auth, requireRole('ristoratore'), asyncHandler(adminListPurchases));
router.put('/:id/status', auth, asyncHandler(updateStatus));

module.exports = router;
