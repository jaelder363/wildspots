const serverless = require('serverless-http');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const express = require('express');
const app = express();

// Initialize AWS Secrets Manager client
const secretsManager = new SecretsManagerClient({ 
  region: process.env.AWS_REGION || 'us-east-2' 
});

// Function to load secrets from AWS Secrets Manager
const loadSecrets = async () => {
  if (process.env.IS_OFFLINE) {
    // In offline mode, use dotenv
    require('dotenv').config();
    console.log('Running in offline mode - using .env file');
    return;
  }

  const secretId = process.env.SECRETS_ID;
  if (!secretId) {
    console.warn('SECRETS_ID environment variable is not set');
    return;
  }

  try {
    console.log(`Fetching secret: ${secretId}`);
    const command = new GetSecretValueCommand({ SecretId: secretId });
    const response = await secretsManager.send(command);
    
    if (response.SecretString) {
      const secrets = JSON.parse(response.SecretString);
      // Set secrets as environment variables
      Object.entries(secrets).forEach(([key, value]) => {
        if (!process.env[key]) {
          process.env[key] = String(value);
          console.log(`Set environment variable: ${key}=***`);
        }
      });
      console.log('Successfully loaded secrets from AWS Secrets Manager');
    }
  } catch (error) {
    console.error('Error loading secrets from AWS Secrets Manager:', error.message);
    // Don't throw to allow the app to start even if secrets loading fails
  }
};

// Initialize the app by loading secrets first
const initializeApp = async () => {
  console.log('Initializing application...');
  try {
    await loadSecrets();
    console.log('Application initialization completed successfully');
  } catch (error) {
    console.error('Error during app initialization:', error);
    throw error; // Re-throw to ensure we catch it in the handler
  }
  
  // Basic route for health check
  app.get('/', (req, res) => {
    res.json({ 
      status: 'ok',
      environment: process.env.NODE_ENV || 'development',
      isOffline: !!process.env.IS_OFFLINE,
      timestamp: new Date().toISOString()
    });
  });

  // Test endpoint that doesn't rely on any external dependencies
  app.get('/test', (req, res) => {
    res.json({ 
      success: true,
      message: 'Test endpoint is working',
      timestamp: new Date().toISOString()
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
};

// Create a promise that resolves to the Express app
const appPromise = initializeApp();

// Create the Lambda handler
const handler = async (event, context) => {
  console.log('Lambda event:', JSON.stringify(event, null, 2));
  try {
    const app = await appPromise;
    const serverlessHandler = serverless(app, {
      request: (request, event, context) => {
        request.lambdaEvent = event;
        request.lambdaContext = context;
      }
    });
    
    const result = await serverlessHandler(event, context);
    console.log('Lambda response:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Lambda handler error:', {
      message: error.message,
      stack: error.stack,
      event: event,
      context: context
    });
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        requestId: context.awsRequestId,
        message: process.env.NODE_ENV === 'production' ? 'An error occurred' : error.message
      })
    };
  }
};

// Export the handler for Lambda
module.exports.handler = handler;