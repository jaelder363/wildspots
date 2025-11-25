require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { OpenApiValidator } = require('express-openapi-validator');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const apiRouter = require('./routes');
const errorHandler = require('./middleware/errorHandler');

// Create Express app
const app = express();

// Load OpenAPI specification
// Go up two levels from api/src to reach the project root, then into docs
const openApiPath = path.join(__dirname, '../../docs/openapi.yaml');
console.log('Current working directory:', process.cwd());
console.log('Looking for OpenAPI spec at:', openApiPath);

let openApiDocument;
try {
  openApiDocument = YAML.load(openApiPath);
  console.log('Successfully loaded OpenAPI specification');
} catch (error) {
  console.error('Failed to load OpenAPI specification:', error.message);
  process.exit(1);
}

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Logging

// Serve API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// API routes
app.use('/v1', apiRouter);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
