const express = require('express');
const { listMeals, createMeal, updateMeal, deleteMeal } = require('../controllers/mealController');
const asyncHandler = require('../middleware/asyncHandler');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', asyncHandler(listMeals));
router.post('/', auth, requireRole('ristoratore'), asyncHandler(createMeal));
router.put('/:id', auth, requireRole('ristoratore'), asyncHandler(updateMeal));
router.delete('/:id', auth, requireRole('ristoratore'), asyncHandler(deleteMeal));

module.exports = router;
