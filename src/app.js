const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Security middleware - disable CSP for local development to avoid HTTPS upgrade issues
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

if (isDevelopment) {
  // Minimal security for local development
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP completely for local dev
    hsts: false,
  }));
} else {
  // Full security for production
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  }));
}
app.use(cors());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Database configuration
let dbPool = null;
const isDatabaseEnabled = process.env.DB_ENABLED === 'true';

if (isDatabaseEnabled) {
  try {
    dbPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'k8s_practice',
      user: process.env.DB_USER || 'k8s_user',
      password: process.env.DB_PASSWORD || 'password',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test database connection
    dbPool.query('SELECT NOW()', (err, result) => {
      if (err) {
        console.error('Database connection failed:', err.message);
      } else {
        console.log('Database connected successfully at:', result.rows[0].now);
      }
    });
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
  }
}

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      enabled: isDatabaseEnabled,
      status: 'unknown'
    }
  };

  if (isDatabaseEnabled && dbPool) {
    try {
      await dbPool.query('SELECT 1');
      health.database.status = 'connected';
    } catch (error) {
      health.database.status = 'disconnected';
      health.database.error = error.message;
    }
  }

  res.status(200).json(health);
});

// Readiness probe
app.get('/ready', async (req, res) => {
  let ready = true;
  const checks = {
    app: true,
    database: true
  };

  if (isDatabaseEnabled && dbPool) {
    try {
      await dbPool.query('SELECT 1');
    } catch (error) {
      checks.database = false;
      ready = false;
    }
  }

  const status = ready ? 200 : 503;
  res.status(status).json({
    ready,
    checks,
    timestamp: new Date().toISOString()
  });
});

// Liveness probe
app.get('/live', (req, res) => {
  res.status(200).json({
    alive: true,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint - serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoints
app.get('/api/info', (req, res) => {
  res.json({
    app: 'K8s Practice Application',
    version: '1.0.0',
    node_version: process.version,
    platform: process.platform,
    arch: process.arch,
    memory_usage: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    database_enabled: isDatabaseEnabled,
    timestamp: new Date().toISOString()
  });
});

// Simple data endpoint (uses database if available)
app.get('/api/data', async (req, res) => {
  if (!isDatabaseEnabled || !dbPool) {
    return res.json({
      message: 'Database not enabled. Using mock data.',
      data: [
        { id: 1, name: 'Sample Item 1', created_at: new Date().toISOString() },
        { id: 2, name: 'Sample Item 2', created_at: new Date().toISOString() }
      ]
    });
  }

  try {
    const result = await dbPool.query('SELECT * FROM items ORDER BY created_at DESC LIMIT 10');
    res.json({
      message: 'Data retrieved from database',
      data: result.rows
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      error: 'Database query failed',
      message: error.message
    });
  }
});

// Create new item
app.post('/api/data', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!isDatabaseEnabled || !dbPool) {
    return res.json({
      message: 'Database not enabled. Item not persisted.',
      item: { id: Date.now(), name, created_at: new Date().toISOString() }
    });
  }

  try {
    const result = await dbPool.query(
      'INSERT INTO items (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json({
      message: 'Item created successfully',
      item: result.rows[0]
    });
  } catch (error) {
    console.error('Database insert error:', error);
    res.status(500).json({
      error: 'Failed to create item',
      message: error.message
    });
  }
});

// Environment variables endpoint
app.get('/api/env', (req, res) => {
  const safeEnvVars = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    DB_ENABLED: process.env.DB_ENABLED,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    // Note: We don't expose the password for security
    KUBERNETES_SERVICE_HOST: process.env.KUBERNETES_SERVICE_HOST,
    HOSTNAME: process.env.HOSTNAME,
    POD_NAME: process.env.POD_NAME,
    POD_NAMESPACE: process.env.POD_NAMESPACE
  };

  res.json({
    message: 'Environment variables (safe ones only)',
    env: safeEnvVars
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  if (dbPool) {
    dbPool.end();
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  if (dbPool) {
    dbPool.end();
  }
  process.exit(0);
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`🚀 K8s Practice App running on http://${HOST}:${PORT}`);
  console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
  console.log(`🔍 API info: http://${HOST}:${PORT}/api/info`);
  console.log(`💾 Database enabled: ${isDatabaseEnabled}`);
});