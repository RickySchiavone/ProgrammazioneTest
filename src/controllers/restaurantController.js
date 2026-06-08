const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

function buildRestaurantQuery(query) {
  const filters = {};
  if (query.name) filters.name = new RegExp(query.name, 'i');
  if (query.city || query.place) filters.city = new RegExp(query.city || query.place, 'i');
  if (query.meal) filters['menu.meal'] = query.meal;
  return filters;
}

async function listRestaurants(req, res) {
  const restaurants = await Restaurant.find(buildRestaurantQuery(req.query)).populate('menu.meal').sort('name');
  return res.json(restaurants);
}

async function getRestaurant(req, res) {
  const restaurant = await Restaurant.findById(req.params.id).populate('owner', '-passwordHash').populate('menu.meal');
  if (!restaurant) return res.status(404).json({ message: 'Ristorante non trovato' });
  return res.json(restaurant);
}

async function upsertMine(req, res) {
  const payload = { ...req.body, owner: req.user._id };
  const restaurant = await Restaurant.findOneAndUpdate({ owner: req.user._id }, payload, { new: true, upsert: true, setDefaultsOnInsert: true });
  return res.status(201).json(restaurant);
}

async function updateMenu(req, res) {
  const restaurant = await Restaurant.findOneAndUpdate({ owner: req.user._id }, { menu: req.body.menu || [] }, { new: true }).populate('menu.meal');
  if (!restaurant) return res.status(404).json({ message: 'Crea prima il ristorante' });
  return res.json(restaurant);
}

async function deleteMine(req, res) {
  await Restaurant.findOneAndDelete({ owner: req.user._id });
  return res.status(204).send();
}

async function stats(req, res) {
  const restaurant = await Restaurant.findOne({ owner: req.user._id });
  if (!restaurant) return res.status(404).json({ message: 'Ristorante non trovato' });
  const byStatus = await Order.aggregate([
    { $match: { restaurant: restaurant._id } },
    { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$total' } } },
    { $sort: { _id: 1 } }
  ]);
  const totalOrders = await Order.countDocuments({ restaurant: restaurant._id });
  const preparingQueue = await Order.countDocuments({ restaurant: restaurant._id, status: { $in: ['ordinato', 'in_preparazione'] } });
  return res.json({ restaurant: restaurant.name, totalOrders, preparingQueue, byStatus });
}

module.exports = { listRestaurants, getRestaurant, upsertMine, updateMenu, deleteMine, stats };
