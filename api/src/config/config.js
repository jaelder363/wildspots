require('dotenv').config();

const config = {
  // Server configuration
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3001,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    issuer: process.env.JWT_ISSUER || 'wild-spots-api',
    audience: process.env.JWT_AUDIENCE || 'wild-spots-client'
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    dir: 'logs',
    maxSize: '5m',
    maxFiles: '14d'
  },
  
  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY
  },
  
  // API configuration
  api: {
    prefix: '/api/v1',
    docsPath: '/api-docs',
    defaultLimit: 20,
    maxLimit: 100
  }
};

// Validate required configuration
const requiredConfig = [
  'supabase.url',
  'supabase.key',
  'jwt.secret'
];

requiredConfig.forEach((key) => {
  const value = key.split('.').reduce((obj, k) => obj && obj[k], config);
  if (!value) {
    throw new Error(`Missing required configuration: ${key}`);
  }
});

module.exports = config;
