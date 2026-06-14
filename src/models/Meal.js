const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true, index: true },
    ingredients: [{ type: String, trim: true, index: true }],
    allergens: [{ type: String, trim: true, index: true }],
    imageUrl: { type: String, trim: true },
    basePrice: { type: Number, required: true, min: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    isCommon: { type: Boolean, default: false }
  },
  { timestamps: true }
);

mealSchema.index({ name: 'text', type: 'text', ingredients: 'text' });

module.exports = mongoose.model('Meal', mealSchema);
