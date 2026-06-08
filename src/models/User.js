const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    method: { type: String, enum: ['credit_card', 'prepaid_card', 'cash'], default: 'cash' },
    last4: String
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['cliente', 'ristoratore'], required: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phone: { type: String, trim: true },
    preferences: [{ type: String, trim: true }],
    payment: paymentSchema,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const user = this.toObject();
  delete user.passwordHash;
  return user;
};

module.exports = mongoose.model('User', userSchema);
