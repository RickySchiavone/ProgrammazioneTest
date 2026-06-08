const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const connectDb = require('./config/db');
const config = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const mealRoutes = require('./routes/mealRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '..', 'docs', 'swagger.yaml'));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'index.html')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'FastFood' }));
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Errore interno' });
});

if (require.main === module) {
  connectDb()
    .then(() => {
      app.listen(config.port, () => {
        console.log(`FastFood API disponibile su http://localhost:${config.port}`);
        console.log(`Swagger UI disponibile su http://localhost:${config.port}/api-docs`);
      });
    })
    .catch((error) => {
      console.error('Connessione MongoDB fallita:', error.message);
      process.exit(1);
    });
}

module.exports = app;
