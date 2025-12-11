const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { StatusCodes } = require('http-status-codes');
const { supabase } = require('./db/supabase');

// Import routes
const profilesRouter = require('./routes/profiles.routes');
const authRouter = require('./routes/auth');
// Other route imports will be added here

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profiles', profilesRouter);
// Other API routes will be mounted here

// 404 handler
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    error: {
      message: `Cannot ${req.method} ${req.path}`
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Test database connection on startup
async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    if (error) throw error;
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
}

module.exports = {
  app,
  testDatabaseConnection
};
