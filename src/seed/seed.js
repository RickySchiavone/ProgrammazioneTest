const fs = require('fs/promises');
const path = require('path');
const connectDb = require('../config/db');
const Meal = require('../models/Meal');

async function seed() {
  await connectDb();
  const file = await fs.readFile(path.join(__dirname, '..', '..', 'data', 'meal.json'), 'utf8');
  const meals = JSON.parse(file);
  await Meal.deleteMany({ isCommon: true });
  await Meal.insertMany(meals.map((meal) => ({ ...meal, isCommon: true })));
  console.log(`Caricati ${meals.length} piatti comuni da data/meal.json`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
