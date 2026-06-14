const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fastfood',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  osmUserAgent: process.env.OSM_USER_AGENT || 'FastFoodStudentProject/1.0',
  deliveryBaseCost: Number(process.env.DELIVERY_BASE_COST || 2.5),
  deliveryCostPerKm: Number(process.env.DELIVERY_COST_PER_KM || 1.2)
};

module.exports = config;
