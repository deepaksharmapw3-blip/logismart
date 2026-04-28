import dotenv from 'dotenv';
// Load environment variables before any other imports
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

// Import routes
import shipmentsRouter from './routes/shipments';
import predictionsRouter from './routes/predictions';
import routesRouter from './routes/routes';
import alertsRouter from './routes/alerts';
import analyticsRouter from './routes/analytics';
import weatherRouter from './routes/weather';
import configRouter from './routes/config';
import aiRouter from './routes/ai';
import MemoryStore from './data/store';

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://supplysense1.netlify.app',
];
const allowedOrigins = Array.from(new Set([
  ...defaultAllowedOrigins,
  ...(process.env.FRONTEND_URL || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean),
]));
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://maps.googleapis.com", "https://maps.gstatic.com", "https://fonts.googleapis.com"],
      scriptSrcElem: ["'self'", "https://maps.googleapis.com", "https://maps.gstatic.com", "https://fonts.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://maps.gstatic.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https://maps.googleapis.com", "https://maps.gstatic.com", "https://*.googleapis.com"],
      connectSrc: ["'self'", "https://maps.googleapis.com", "https://*.googleapis.com"],
      frameSrc: ["'self'", "https://maps.google.com", "https://www.google.com"],
      objectSrc: ["'none'"],
      childSrc: ["'self'", "blob:"],
    },
  },
}));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  });
});

// API routes
app.use('/api/shipments', shipmentsRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/routes', routesRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/config', configRouter);
app.use('/api/ai', aiRouter);

// Debug endpoint - check memory store and supabase status
// Import types and data store for debug
import { DataStore as UnifiedStore, supabaseWorking } from './data';

app.get('/debug/status', async (req: Request, res: Response) => {
  const unifiedShipments = await UnifiedStore.getAllShipments();
  const memoryShipments = MemoryStore.getAllShipments();

  res.json({
    supabase: {
      configured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
      working: supabaseWorking,
      url: process.env.SUPABASE_URL,
    },
    counts: {
      unified: {
        shipments: unifiedShipments.length,
      },
      memory: {
        shipments: memoryShipments.length,
        predictions: MemoryStore.getAllPredictions().length,
        routes: MemoryStore.getAllRouteOptimizations().length,
        alerts: MemoryStore.getAllAlerts().length,
      }
    },
    shipmentIds: {
      unified: unifiedShipments.map(s => s.id),
      memory: memoryShipments.map(s => s.id),
    }
  });
});

// Serve frontend static files (production build)
const frontendDist = path.resolve(__dirname, '../dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api|\/health|\/debug).*/, (req: Request, res: Response) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Backend is running 🚀' });
  });
}

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 SupplySense AI Backend Server                         ║
║                                                            ║
║   Server running on port ${PORT}                            ║
║   API URL: http://localhost:${PORT}                         ║
║                                                            ║
║   Available endpoints:                                     ║
║   • GET  /health              - Health check               ║
║   • GET  /api/shipments       - List all shipments         ║
║   • GET  /api/predictions     - Delay predictions          ║
║   • GET  /api/routes/optimizations - Route optimizations   ║
║   • GET  /api/alerts          - System alerts              ║
║   • GET  /api/analytics       - Analytics data             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
