const Meal = require('../models/Meal');

function buildMealQuery(query) {
  const filters = {};
  if (query.name) filters.name = new RegExp(query.name, 'i');
  if (query.type) filters.type = new RegExp(query.type, 'i');
  if (query.maxPrice) filters.basePrice = { $lte: Number(query.maxPrice) };
  if (query.ingredient) filters.ingredients = new RegExp(query.ingredient, 'i');
  if (query.allergy) filters.allergens = { $not: new RegExp(query.allergy, 'i') };
  return filters;
}

async function listMeals(req, res) {
  const meals = await Meal.find(buildMealQuery(req.query)).sort('name');
  return res.json(meals);
}

async function createMeal(req, res) {
  const meal = await Meal.create({ ...req.body, createdBy: req.user._id, isCommon: false });
  return res.status(201).json(meal);
}

async function updateMeal(req, res) {
  const meal = await Meal.findOneAndUpdate(
    { _id: req.params.id, $or: [{ createdBy: req.user._id }, { isCommon: true }] },
    req.body,
    { new: true }
  );
  if (!meal) return res.status(404).json({ message: 'Piatto non trovato' });
  return res.json(meal);
}

async function deleteMeal(req, res) {
  const meal = await Meal.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id, isCommon: false });
  if (!meal) return res.status(404).json({ message: 'Piatto personalizzato non trovato' });
  return res.status(204).send();
}

module.exports = { listMeals, createMeal, updateMeal, deleteMeal };
