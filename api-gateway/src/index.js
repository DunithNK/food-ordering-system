const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8080;

// ─────────────────────────────────────────────────────────────────
//  CORS — must be FIRST and handle OPTIONS preflight before proxy
// ─────────────────────────────────────────────────────────────────
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Handle OPTIONS preflight explicitly before any proxy sees it
app.options('*', cors(corsOptions));

app.use(morgan('dev'));

// ─────────────────────────────────────────────────────────────────
//  IMPORTANT: Do NOT use express.json() here.
//  Parsing the body here consumes the stream so the proxy can't
//  forward it, causing 408 "request aborted" in downstream services.
// ─────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────
//  Service Registry
// ─────────────────────────────────────────────
const SERVICES = {
  users:       { target: 'http://localhost:8081', name: 'User Service' },
  restaurants: { target: 'http://localhost:8082', name: 'Restaurant Service' },
  orders:      { target: 'http://localhost:8083', name: 'Order Service' },
  payments:    { target: 'http://localhost:8084', name: 'Payment Service' },
};

// Helper: build proxy config for a service
function makeProxy(serviceKey) {
  const svc = SERVICES[serviceKey];
  return createProxyMiddleware({
    target: svc.target,
    changeOrigin: true,
    // Fix body forwarding: restream the body if express already read it
    on: {
      proxyReq: (proxyReq, req) => {
        console.log(`[Gateway] → ${svc.name}: ${req.method} ${req.originalUrl}`);

        // If body was already parsed (shouldn't be now, but safety net)
        if (req.body && Object.keys(req.body).length > 0) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
      error: (err, req, res) => {
        console.error(`[Gateway] Error proxying to ${svc.name}:`, err.message);
        if (!res.headersSent) {
          res.status(502).json({
            success: false,
            message: `${svc.name} is unavailable`,
            error: err.message
          });
        }
      }
    }
  });
}

// ─────────────────────────────────────────────
//  Non-proxied routes (parse JSON only here)
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🚀 Online Food Ordering System — API Gateway',
    version: '1.0.0',
    routes: {
      'User Service':       'http://localhost:8080/users/...',
      'Restaurant Service': 'http://localhost:8080/restaurants/...',
      'Order Service':      'http://localhost:8080/orders/...',
      'Payment Service':    'http://localhost:8080/payments/...',
    },
    swagger: {
      'User Service (direct)':       'http://localhost:8081/api-docs',
      'Restaurant Service (direct)': 'http://localhost:8082/api-docs',
      'Order Service (direct)':      'http://localhost:8083/api-docs',
      'Payment Service (direct)':    'http://localhost:8084/api-docs',
    }
  });
});

app.get('/health', async (req, res) => {
  const http = require('http');
  const checkService = (url) => new Promise((resolve) => {
    http.get(url, (resp) => {
      let data = '';
      resp.on('data', chunk => data += chunk);
      resp.on('end', () => {
        try { resolve({ status: 'UP', response: JSON.parse(data) }); }
        catch { resolve({ status: 'UP' }); }
      });
    }).on('error', () => resolve({ status: 'DOWN' }));
  });

  const results = await Promise.all([
    checkService('http://localhost:8081/health'),
    checkService('http://localhost:8082/health'),
    checkService('http://localhost:8083/health'),
    checkService('http://localhost:8084/health'),
  ]);

  res.status(200).json({
    gateway: 'UP', port: PORT,
    services: {
      'user-service':       results[0],
      'restaurant-service': results[1],
      'order-service':      results[2],
      'payment-service':    results[3],
    }
  });
});

// ─────────────────────────────────────────────
//  Proxy Routes — raw stream, no body parsing
// ─────────────────────────────────────────────
app.use('/users',       makeProxy('users'));
app.use('/restaurants', makeProxy('restaurants'));
app.use('/orders',      makeProxy('orders'));
app.use('/payments',    makeProxy('payments'));

// ─────────────────────────────────────────────
//  404
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `No route found for ${req.method} ${req.originalUrl}`,
    availableRoutes: ['/users', '/restaurants', '/orders', '/payments', '/health']
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║        API GATEWAY — Online Food Order       ║');
  console.log(`║        Running on http://localhost:${PORT}       ║`);
  console.log('╠══════════════════════════════════════════════╣');
  console.log('║  /users        → User Service    :8081       ║');
  console.log('║  /restaurants  → Restaurant Svc  :8082       ║');
  console.log('║  /orders       → Order Service   :8083       ║');
  console.log('║  /payments     → Payment Service :8084       ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
});
