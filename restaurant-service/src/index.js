const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const restaurantRoutes = require('./routes/restaurant.routes');

const app = express();
const PORT = 8082;

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant Service API',
      version: '1.0.0',
      description: 'Restaurant Service - Manage Restaurants & Menus | Developed by Naveen',
    },
    servers: [
      { url: `http://localhost:${PORT}`, description: 'Direct Access' },
      { url: 'http://localhost:8080/restaurants', description: 'Via API Gateway' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/restaurants', restaurantRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'restaurant-service', port: PORT });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

app.listen(PORT, () => {
  console.log(`✅ Restaurant Service running on http://localhost:${PORT}`);
  console.log(`📄 Swagger Docs: http://localhost:${PORT}/api-docs`);
});
