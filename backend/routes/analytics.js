"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_1 = require("../data");
const analyticsService_1 = require("../services/analyticsService");
const router = (0, express_1.Router)();
// GET /api/analytics - Get all analytics data (calculated from real data)
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const analytics = yield analyticsService_1.AnalyticsService.generateAnalytics();
        const response = {
            success: true,
            data: analytics,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error generating analytics:', error);
        // Fallback to stored analytics if generation fails
        const fallbackAnalytics = yield data_1.DataStore.getAnalytics();
        const response = {
            success: true,
            data: fallbackAnalytics,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
}));
// GET /api/analytics/dashboard - Get dashboard summary with real data
router.get('/dashboard', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const analytics = yield analyticsService_1.AnalyticsService.generateAnalytics();
        const shipments = yield data_1.DataStore.getAllShipments();
        const predictions = yield data_1.DataStore.getAllPredictions();
        const dashboardData = {
            stats: analytics.stats,
            summary: {
                totalShipments: shipments.length,
                activeShipments: shipments.filter(s => s.status !== 'delayed').length,
                delayedShipments: shipments.filter(s => s.status === 'delayed').length,
                atRiskShipments: shipments.filter(s => s.status === 'at-risk').length,
                onTimeShipments: shipments.filter(s => s.status === 'on-time').length,
                predictionsCount: predictions.length,
                criticalPredictions: predictions.filter(p => p.riskLevel === 'high').length,
            },
            recentTrends: analytics.deliveryTrends.slice(-3),
            topBottlenecks: analytics.bottlenecks.slice(0, 3),
            delayReasons: analytics.delayReasons,
            routePerformance: analytics.routePerformance,
        };
        const response = {
            success: true,
            data: dashboardData,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error generating dashboard data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate dashboard data',
            timestamp: new Date().toISOString(),
        });
    }
}));
// GET /api/analytics/trends - Get delivery trends
router.get('/trends', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const analytics = yield analyticsService_1.AnalyticsService.generateAnalytics();
        const response = {
            success: true,
            data: analytics.deliveryTrends,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching trends:', error);
        const fallbackAnalytics = yield data_1.DataStore.getAnalytics();
        const response = {
            success: true,
            data: fallbackAnalytics.deliveryTrends,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
}));
// GET /api/analytics/delay-reasons - Get delay reasons breakdown
router.get('/delay-reasons', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const analytics = yield analyticsService_1.AnalyticsService.generateAnalytics();
        const response = {
            success: true,
            data: analytics.delayReasons,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching delay reasons:', error);
        const fallbackAnalytics = yield data_1.DataStore.getAnalytics();
        const response = {
            success: true,
            data: fallbackAnalytics.delayReasons,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
}));
// GET /api/analytics/route-performance - Get route performance data
router.get('/route-performance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const analytics = yield analyticsService_1.AnalyticsService.generateAnalytics();
        const response = {
            success: true,
            data: analytics.routePerformance,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching route performance:', error);
        const fallbackAnalytics = yield data_1.DataStore.getAnalytics();
        const response = {
            success: true,
            data: fallbackAnalytics.routePerformance,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
}));
// GET /api/analytics/bottlenecks - Get bottleneck data
router.get('/bottlenecks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const analytics = yield analyticsService_1.AnalyticsService.generateAnalytics();
        const response = {
            success: true,
            data: analytics.bottlenecks,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching bottlenecks:', error);
        const fallbackAnalytics = yield data_1.DataStore.getAnalytics();
        const response = {
            success: true,
            data: fallbackAnalytics.bottlenecks,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
}));
// GET /api/analytics/stats - Get key statistics
router.get('/stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const analytics = yield analyticsService_1.AnalyticsService.generateAnalytics();
        const response = {
            success: true,
            data: analytics.stats,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching stats:', error);
        const fallbackAnalytics = yield data_1.DataStore.getAnalytics();
        const response = {
            success: true,
            data: fallbackAnalytics.stats,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
}));
// GET /api/analytics/performance - Get performance metrics
router.get('/performance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const analytics = yield analyticsService_1.AnalyticsService.generateAnalytics();
        const shipments = yield data_1.DataStore.getAllShipments();
        const onTimeCount = shipments.filter(s => s.status === 'on-time').length;
        const delayedCount = shipments.filter(s => s.status === 'delayed').length;
        const atRiskCount = shipments.filter(s => s.status === 'at-risk').length;
        const total = shipments.length;
        const performance = {
            onTimeRate: total > 0 ? Math.round((onTimeCount / total) * 100) : 0,
            delayedRate: total > 0 ? Math.round((delayedCount / total) * 100) : 0,
            atRiskRate: total > 0 ? Math.round((atRiskCount / total) * 100) : 0,
            totalShipments: total,
            averageDelay: Math.round(analytics.bottlenecks.reduce((sum, b) => sum + b.delay, 0) /
                (analytics.bottlenecks.length || 1)),
            criticalBottlenecks: analytics.bottlenecks.filter(b => b.severity === 'high').length,
        };
        const response = {
            success: true,
            data: performance,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching performance metrics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch performance metrics',
            timestamp: new Date().toISOString(),
        });
    }
}));
exports.default = router;
