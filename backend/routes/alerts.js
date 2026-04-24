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
const zod_1 = require("zod");
const data_1 = require("../data");
const router = (0, express_1.Router)();
// Validation schema
const createAlertSchema = zod_1.z.object({
    type: zod_1.z.enum(['delay', 'route-change', 'success', 'info']),
    title: zod_1.z.string().min(1),
    message: zod_1.z.string().min(1),
    shipmentId: zod_1.z.string().min(1),
    priority: zod_1.z.enum(['low', 'medium', 'high']),
});
// GET /api/alerts - Get all alerts
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const alerts = yield data_1.DataStore.getAllAlerts();
    const response = {
        success: true,
        data: alerts,
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
// GET /api/alerts/unread - Get unread alerts
router.get('/unread', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const alerts = yield data_1.DataStore.getUnreadAlerts();
    const response = {
        success: true,
        data: alerts,
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
// GET /api/alerts/count - Get alert counts
router.get('/count', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allAlerts = yield data_1.DataStore.getAllAlerts();
    const unreadAlerts = yield data_1.DataStore.getUnreadAlerts();
    const counts = {
        total: allAlerts.length,
        unread: unreadAlerts.length,
        byPriority: {
            high: allAlerts.filter(a => a.priority === 'high').length,
            medium: allAlerts.filter(a => a.priority === 'medium').length,
            low: allAlerts.filter(a => a.priority === 'low').length,
        },
        byType: {
            delay: allAlerts.filter(a => a.type === 'delay').length,
            routeChange: allAlerts.filter(a => a.type === 'route-change').length,
            success: allAlerts.filter(a => a.type === 'success').length,
            info: allAlerts.filter(a => a.type === 'info').length,
        },
    };
    const response = {
        success: true,
        data: counts,
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
// POST /api/alerts - Create new alert
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = createAlertSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            error: 'Invalid request body',
            details: validation.error.message,
            timestamp: new Date().toISOString(),
        });
    }
    const newAlert = yield data_1.DataStore.addAlert(validation.data);
    if (!newAlert) {
        return res.status(500).json({
            success: false,
            error: 'Failed to create alert',
            timestamp: new Date().toISOString(),
        });
    }
    const response = {
        success: true,
        data: newAlert,
        message: 'Alert created successfully',
        timestamp: new Date().toISOString(),
    };
    res.status(201).json(response);
}));
// DELETE /api/alerts/:id - Dismiss/delete alert
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const dismissed = yield data_1.DataStore.dismissAlert(id);
    if (!dismissed) {
        return res.status(404).json({
            success: false,
            error: 'Alert not found',
            timestamp: new Date().toISOString(),
        });
    }
    const response = {
        success: true,
        data: null,
        message: 'Alert dismissed successfully',
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
// PATCH /api/alerts/:id/read - Mark alert as read
router.patch('/:id/read', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const marked = yield data_1.DataStore.markAlertAsRead(id);
    if (!marked) {
        return res.status(404).json({
            success: false,
            error: 'Alert not found',
            timestamp: new Date().toISOString(),
        });
    }
    const response = {
        success: true,
        data: null,
        message: 'Alert marked as read',
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
// PATCH /api/alerts/read-all - Mark all alerts as read
router.patch('/read-all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const alerts = yield data_1.DataStore.getAllAlerts();
    yield Promise.all(alerts.map(alert => data_1.DataStore.markAlertAsRead(alert.id)));
    const response = {
        success: true,
        data: null,
        message: 'All alerts marked as read',
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
exports.default = router;
