const express = require('express');
const { listRestaurants, getRestaurant, upsertMine, updateMenu, deleteMine, stats } = require('../controllers/restaurantController');
const asyncHandler = require('../middleware/asyncHandler');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', asyncHandler(listRestaurants));
router.get('/mine/stats', auth, requireRole('ristoratore'), asyncHandler(stats));
router.get('/:id', asyncHandler(getRestaurant));
router.put('/mine', auth, requireRole('ristoratore'), asyncHandler(upsertMine));
router.put('/mine/menu', auth, requireRole('ristoratore'), asyncHandler(updateMenu));
router.delete('/mine', auth, requireRole('ristoratore'), asyncHandler(deleteMine));

module.exports = router;
