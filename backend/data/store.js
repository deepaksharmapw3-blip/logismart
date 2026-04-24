"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataStore = exports.analyticsData = exports.alerts = exports.routeOptimizations = exports.delayPredictions = exports.shipments = void 0;
const uuid_1 = require("uuid");
// Helper to generate shipment ID
const generateShipmentId = (num) => `SH${2500 + num}`;
// Helper to get relative timestamp
const getRelativeTime = (minutesAgo) => {
    if (minutesAgo === 0)
        return 'Just now';
    if (minutesAgo === 1)
        return '1 min ago';
    return `${minutesAgo} mins ago`;
};
// Initial Shipments Data
exports.shipments = [
    {
        id: generateShipmentId(47),
        origin: 'Los Angeles, CA',
        destination: 'San Francisco, CA',
        status: 'delayed',
        eta: '4:30 PM',
        currentLocation: 'Bakersfield, CA',
        delayProbability: 85,
        location: { lat: 45, lng: 35 },
        destination_coords: { lat: 20, lng: 70 },
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(),
    },
    {
        id: generateShipmentId(48),
        origin: 'Seattle, WA',
        destination: 'Portland, OR',
        status: 'at-risk',
        eta: '2:15 PM',
        currentLocation: 'Tacoma, WA',
        delayProbability: 68,
        location: { lat: 25, lng: 55 },
        destination_coords: { lat: 30, lng: 80 },
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(),
    },
    {
        id: generateShipmentId(49),
        origin: 'Phoenix, AZ',
        destination: 'Las Vegas, NV',
        status: 'on-time',
        eta: '3:45 PM',
        currentLocation: 'Kingman, AZ',
        delayProbability: 22,
        location: { lat: 60, lng: 40 },
        destination_coords: { lat: 65, lng: 25 },
        createdAt: new Date(Date.now() - 129600000),
        updatedAt: new Date(),
    },
    {
        id: generateShipmentId(50),
        origin: 'Denver, CO',
        destination: 'Salt Lake City, UT',
        status: 'on-time',
        eta: '5:00 PM',
        currentLocation: 'Vail, CO',
        delayProbability: 15,
        location: { lat: 35, lng: 65 },
        destination_coords: { lat: 50, lng: 85 },
        createdAt: new Date(Date.now() - 216000000),
        updatedAt: new Date(),
    },
    {
        id: generateShipmentId(51),
        origin: 'Austin, TX',
        destination: 'Houston, TX',
        status: 'at-risk',
        eta: '6:20 PM',
        currentLocation: 'Columbus, TX',
        delayProbability: 72,
        location: { lat: 70, lng: 50 },
        destination_coords: { lat: 75, lng: 75 },
        createdAt: new Date(Date.now() - 100800000),
        updatedAt: new Date(),
    },
];
// Delay Predictions Data
exports.delayPredictions = [
    {
        shipmentId: generateShipmentId(47),
        delayProbability: 85,
        estimatedDelay: '25-30 mins',
        reasons: ['Heavy Traffic', 'Road Construction', 'Peak Hour'],
        riskLevel: 'high',
        currentLocation: 'Bakersfield, CA',
        predictedAt: new Date(),
    },
    {
        shipmentId: generateShipmentId(48),
        delayProbability: 68,
        estimatedDelay: '15-20 mins',
        reasons: ['Weather Conditions', 'Traffic'],
        riskLevel: 'medium',
        currentLocation: 'Tacoma, WA',
        predictedAt: new Date(),
    },
    {
        shipmentId: generateShipmentId(51),
        delayProbability: 72,
        estimatedDelay: '18-22 mins',
        reasons: ['Warehouse Delay', 'Traffic Congestion'],
        riskLevel: 'high',
        currentLocation: 'Columbus, TX',
        predictedAt: new Date(),
    },
];
// Route Optimizations Data
exports.routeOptimizations = [
    {
        shipmentId: generateShipmentId(47),
        currentRoute: {
            routeName: 'Route A (I-5)',
            distance: '285 miles',
            estimatedTime: '4h 45m',
            savings: '0 min',
            trafficLevel: 'high',
            recommended: false,
        },
        suggestedRoute: {
            routeName: 'Route B (CA-99)',
            distance: '295 miles',
            estimatedTime: '4h 20m',
            savings: '25 min',
            trafficLevel: 'low',
            recommended: true,
        },
        createdAt: new Date(),
    },
    {
        shipmentId: generateShipmentId(48),
        currentRoute: {
            routeName: 'Route C (I-405)',
            distance: '175 miles',
            estimatedTime: '3h 10m',
            savings: '0 min',
            trafficLevel: 'medium',
            recommended: false,
        },
        suggestedRoute: {
            routeName: 'Route D (WA-167)',
            distance: '182 miles',
            estimatedTime: '2h 52m',
            savings: '18 min',
            trafficLevel: 'low',
            recommended: true,
        },
        createdAt: new Date(),
    },
];
// Alerts Data
exports.alerts = [
    {
        id: 'alert-1',
        type: 'delay',
        title: 'Delay Detected',
        message: 'Heavy traffic on Route A causing 25-minute delay',
        shipmentId: generateShipmentId(47),
        timestamp: getRelativeTime(2),
        priority: 'high',
        createdAt: new Date(Date.now() - 120000),
        read: false,
    },
    {
        id: 'alert-2',
        type: 'route-change',
        title: 'Route Optimization Available',
        message: 'Alternate route can save 18 minutes',
        shipmentId: generateShipmentId(48),
        timestamp: getRelativeTime(5),
        priority: 'medium',
        createdAt: new Date(Date.now() - 300000),
        read: false,
    },
];
// Analytics Data
exports.analyticsData = {
    deliveryTrends: [
        { day: 'Mon', onTime: 45, delayed: 8, atRisk: 12 },
        { day: 'Tue', onTime: 52, delayed: 6, atRisk: 10 },
        { day: 'Wed', onTime: 48, delayed: 10, atRisk: 15 },
        { day: 'Thu', onTime: 60, delayed: 5, atRisk: 8 },
        { day: 'Fri', onTime: 55, delayed: 7, atRisk: 11 },
        { day: 'Sat', onTime: 38, delayed: 4, atRisk: 6 },
        { day: 'Sun', onTime: 42, delayed: 3, atRisk: 5 },
    ],
    delayReasons: [
        { name: 'Traffic', value: 35, color: '#ef4444' },
        { name: 'Weather', value: 25, color: '#f59e0b' },
        { name: 'Warehouse', value: 20, color: '#8b5cf6' },
        { name: 'Vehicle', value: 12, color: '#3b82f6' },
        { name: 'Other', value: 8, color: '#6b7280' },
    ],
    routePerformance: [
        { route: 'Route A', avgDelay: 25 },
        { route: 'Route B', avgDelay: 18 },
        { route: 'Route C', avgDelay: 32 },
        { route: 'Route D', avgDelay: 15 },
        { route: 'Route E', avgDelay: 28 },
    ],
    bottlenecks: [
        { location: 'LA Warehouse', delay: 45, severity: 'high' },
        { location: 'I-5 North', delay: 32, severity: 'high' },
        { location: 'Denver Hub', delay: 28, severity: 'medium' },
        { location: 'Phoenix Center', delay: 18, severity: 'medium' },
        { location: 'Seattle Port', delay: 12, severity: 'low' },
    ],
    stats: [
        {
            label: 'Total Shipments',
            value: '1,247',
            change: '+12.5%',
            trend: 'up',
        },
        {
            label: 'On-Time Delivery',
            value: '94.2%',
            change: '+3.2%',
            trend: 'up',
        },
        {
            label: 'Avg Delay Time',
            value: '23 min',
            change: '-8.4%',
            trend: 'down',
        },
        {
            label: 'Critical Issues',
            value: '8',
            change: '-50%',
            trend: 'down',
        },
    ],
};
// Data manipulation helpers
exports.DataStore = {
    // Shipments
    getAllShipments: () => exports.shipments,
    getShipmentById: (id) => {
        return exports.shipments.find(s => s.id === id);
    },
    addShipment: (shipment) => {
        const newShipment = Object.assign(Object.assign({}, shipment), { id: shipment.id || (0, uuid_1.v4)(), createdAt: new Date(), updatedAt: new Date() });
        exports.shipments.push(newShipment);
        return newShipment;
    },
    updateShipment: (id, updates) => {
        const index = exports.shipments.findIndex(s => s.id === id);
        if (index === -1)
            return undefined;
        exports.shipments[index] = Object.assign(Object.assign(Object.assign({}, exports.shipments[index]), updates), { updatedAt: new Date() });
        return exports.shipments[index];
    },
    deleteShipment: (id) => {
        const index = exports.shipments.findIndex(s => s.id === id);
        if (index === -1)
            return false;
        exports.shipments.splice(index, 1);
        return true;
    },
    // Delay Predictions
    getAllPredictions: () => exports.delayPredictions,
    getPredictionByShipmentId: (shipmentId) => {
        return exports.delayPredictions.find(p => p.shipmentId === shipmentId);
    },
    getHighRiskPredictions: () => {
        return exports.delayPredictions.filter(p => p.riskLevel === 'high');
    },
    addPrediction: (prediction) => {
        const newPrediction = Object.assign(Object.assign({}, prediction), { predictedAt: new Date() });
        exports.delayPredictions.push(newPrediction);
        return newPrediction;
    },
    // Route Optimizations
    getAllRouteOptimizations: () => exports.routeOptimizations,
    getRouteOptimizationByShipmentId: (shipmentId) => {
        return exports.routeOptimizations.find(r => r.shipmentId === shipmentId);
    },
    addRouteOptimization: (optimization) => {
        const newOptimization = Object.assign(Object.assign({}, optimization), { createdAt: new Date() });
        exports.routeOptimizations.push(newOptimization);
        return newOptimization;
    },
    applyRoute: (shipmentId) => {
        const optimization = exports.routeOptimizations.find(r => r.shipmentId === shipmentId);
        if (!optimization)
            return false;
        // Update the shipment status to reflect route optimization
        const shipment = exports.shipments.find(s => s.id === shipmentId);
        if (shipment) {
            // Improve the shipment status after applying optimized route
            shipment.status = 'on-time';
            shipment.delayProbability = Math.max(0, shipment.delayProbability - 20);
            shipment.updatedAt = new Date();
        }
        // Create a success alert with detailed information
        exports.DataStore.addAlert({
            type: 'success',
            title: 'Route Optimized Successfully',
            message: `Applied optimized route for shipment #${shipmentId}. Saving: ${optimization.suggestedRoute.savings}. New ETA: ${optimization.suggestedRoute.estimatedTime}`,
            shipmentId,
            priority: 'low',
        });
        console.log(`Route applied for shipment ${shipmentId}: ${optimization.suggestedRoute.savings} saved`);
        return true;
    },
    // Alerts
    getAllAlerts: () => exports.alerts,
    getUnreadAlerts: () => exports.alerts.filter(a => !a.read),
    addAlert: (alert) => {
        const newAlert = Object.assign(Object.assign({}, alert), { id: `alert-${(0, uuid_1.v4)()}`, timestamp: 'Just now', createdAt: new Date(), read: false });
        exports.alerts.unshift(newAlert);
        return newAlert;
    },
    dismissAlert: (id) => {
        const index = exports.alerts.findIndex(a => a.id === id);
        if (index === -1)
            return false;
        exports.alerts.splice(index, 1);
        return true;
    },
    markAlertAsRead: (id) => {
        const alert = exports.alerts.find(a => a.id === id);
        if (!alert)
            return false;
        alert.read = true;
        return true;
    },
    // Analytics
    getAnalytics: () => exports.analyticsData,
    updateStats: (newStats) => {
        exports.analyticsData.stats = newStats;
    },
};
exports.default = exports.DataStore;
