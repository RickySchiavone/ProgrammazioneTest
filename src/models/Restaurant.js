const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true },
    price: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true }
  },
  { _id: false }
);

const restaurantSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    vatNumber: { type: String, required: true, trim: true, unique: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    location: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true }
    },
    menu: [menuItemSchema]
  },
  { timestamps: true }
);

restaurantSchema.index({ name: 'text', city: 'text', address: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
