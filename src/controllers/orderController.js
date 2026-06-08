const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const { calculateDelivery } = require('../services/deliveryService');

const statusFlow = ['ordinato', 'in_preparazione', 'in_consegna', 'consegnato'];

async function estimateWaitMinutes(restaurantId) {
  const queued = await Order.countDocuments({ restaurant: restaurantId, status: { $in: ['ordinato', 'in_preparazione'] } });
  return 10 + queued * 5;
}

async function createOrder(req, res) {
  const { restaurantId, items, pickupMode, deliveryAddress } = req.body;
  const restaurant = await Restaurant.findById(restaurantId).populate('menu.meal');
  if (!restaurant) return res.status(404).json({ message: 'Ristorante non trovato' });
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Carrello vuoto' });

  const orderItems = [];
  for (const item of items) {
    const menuItem = restaurant.menu.find((entry) => String(entry.meal._id) === String(item.mealId) && entry.available);
    if (!menuItem) return res.status(400).json({ message: `Piatto non disponibile: ${item.mealId}` });
    orderItems.push({
      meal: menuItem.meal._id,
      nameSnapshot: menuItem.meal.name,
      unitPrice: menuItem.price,
      quantity: Number(item.quantity || 1)
    });
  }

  const subtotal = Number(orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0).toFixed(2));
  let deliveryCost = 0;
  let deliveryDistanceKm = 0;
  if (pickupMode === 'delivery') {
    if (!deliveryAddress) return res.status(400).json({ message: 'Indirizzo consegna obbligatorio' });
    const delivery = await calculateDelivery(restaurant.location, deliveryAddress);
    deliveryCost = delivery.cost;
    deliveryDistanceKm = delivery.distanceKm;
  }

  const estimatedWaitMinutes = await estimateWaitMinutes(restaurant._id);
  const status = 'ordinato';
  const order = await Order.create({
    customer: req.user._id,
    restaurant: restaurant._id,
    items: orderItems,
    pickupMode,
    deliveryAddress,
    deliveryCost,
    deliveryDistanceKm,
    subtotal,
    total: Number((subtotal + deliveryCost).toFixed(2)),
    estimatedWaitMinutes,
    status,
    statusHistory: [{ status }]
  });
  return res.status(201).json(order);
}

async function listMyOrders(req, res) {
  let filter = { customer: req.user._id };
  if (req.user.role === 'ristoratore') {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    filter = restaurant ? { restaurant: restaurant._id } : { restaurant: null };
  }
  const orders = await Order.find(filter).populate('restaurant').populate('customer', '-passwordHash').sort('-createdAt');
  return res.json(orders);
}

async function updateStatus(req, res) {
  const order = await Order.findById(req.params.id).populate('restaurant');
  if (!order) return res.status(404).json({ message: 'Ordine non trovato' });
  const ownsRestaurant = req.user.role === 'ristoratore' && String(order.restaurant.owner) === String(req.user._id);
  const ownsOrder = req.user.role === 'cliente' && String(order.customer) === String(req.user._id);
  if (!ownsRestaurant && !ownsOrder) return res.status(403).json({ message: 'Permesso negato' });

  const requested = req.body.status;
  if (!statusFlow.includes(requested)) return res.status(400).json({ message: 'Stato non valido' });
  if (ownsOrder && requested !== 'consegnato') return res.status(403).json({ message: 'Il cliente può solo confermare la consegna' });
  if (order.pickupMode === 'restaurant' && requested === 'in_consegna') return res.status(400).json({ message: 'Il ritiro al ristorante passa direttamente a consegnato' });

  order.status = requested;
  order.statusHistory.push({ status: requested });
  await order.save();
  return res.json(order);
}

async function adminListPurchases(req, res) {
  const restaurant = await Restaurant.findOne({ owner: req.user._id });
  const orders = restaurant
    ? await Order.find({ restaurant: restaurant._id }).populate('customer', '-passwordHash').populate('restaurant').sort('-createdAt')
    : [];
  return res.json(orders);
}

module.exports = { createOrder, listMyOrders, updateStatus, adminListPurchases };
