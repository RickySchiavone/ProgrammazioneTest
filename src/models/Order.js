const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true },
    nameSnapshot: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    items: [orderItemSchema],
    pickupMode: { type: String, enum: ['restaurant', 'delivery'], required: true },
    deliveryAddress: String,
    deliveryDistanceKm: { type: Number, default: 0 },
    deliveryCost: { type: Number, default: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    estimatedWaitMinutes: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['ordinato', 'in_preparazione', 'in_consegna', 'consegnato'],
      default: 'ordinato',
      index: true
    },
    statusHistory: [statusHistorySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
