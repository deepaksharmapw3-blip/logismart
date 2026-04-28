"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Import routes
const shipments_1 = __importDefault(require("./routes/shipments"));
const predictions_1 = __importDefault(require("./routes/predictions"));
const routes_1 = __importDefault(require("./routes/routes"));
const alerts_1 = __importDefault(require("./routes/alerts"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const weather_1 = __importDefault(require("./routes/weather"));
const config_1 = __importDefault(require("./routes/config"));
const store_1 = __importDefault(require("./data/store"));
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
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
const corsOptions = {
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
app.use((0, helmet_1.default)({
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
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
    });
});
// API routes
app.use('/api/shipments', shipments_1.default);
app.use('/api/predictions', predictions_1.default);
app.use('/api/routes', routes_1.default);
app.use('/api/alerts', alerts_1.default);
app.use('/api/analytics', analytics_1.default);
app.use('/api/weather', weather_1.default);
app.use('/api/config', config_1.default);
// Debug endpoint - check memory store
app.get('/debug/memory', (req, res) => {
    res.json({
        shipments: store_1.default.getAllShipments().length,
        predictions: store_1.default.getAllPredictions().length,
        routes: store_1.default.getAllRouteOptimizations().length,
        alerts: store_1.default.getAllAlerts().length,
        shipmentIds: store_1.default.getAllShipments().map(s => s.id),
        predictionIds: store_1.default.getAllPredictions().map(p => p.shipmentId),
        routeIds: store_1.default.getAllRouteOptimizations().map(r => r.shipmentId),
    });
});
// Serve frontend static files (production build)
const frontendDistPath = path_1.default.join(__dirname, '..', '..', 'dist');
app.use(express_1.default.static(frontendDistPath));
// Serve frontend for all non-API routes (SPA support)
app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api/') || req.path.startsWith('/health') || req.path.startsWith('/debug')) {
        return res.status(404).json({
            success: false,
            error: 'Endpoint not found',
            path: req.path,
            timestamp: new Date().toISOString(),
        });
    }
    res.sendFile(path_1.default.join(frontendDistPath, 'index.html'));
});
// Error handler
app.use((err, req, res, next) => {
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
exports.default = app;
