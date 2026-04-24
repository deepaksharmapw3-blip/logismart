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
const applyRouteSchema = zod_1.z.object({
    shipmentId: zod_1.z.string().min(1),
});
// GET /api/routes/optimizations - Get all route optimizations
router.get('/optimizations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const optimizations = yield data_1.DataStore.getAllRouteOptimizations();
    const response = {
        success: true,
        data: optimizations,
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
// GET /api/routes/optimizations/:shipmentId - Get optimization for specific shipment
router.get('/optimizations/:shipmentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shipmentId } = req.params;
    const optimization = yield data_1.DataStore.getRouteOptimizationByShipmentId(shipmentId);
    if (!optimization) {
        return res.status(404).json({
            success: false,
            error: 'No route optimization found for this shipment',
            timestamp: new Date().toISOString(),
        });
    }
    const response = {
        success: true,
        data: optimization,
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
// POST /api/routes/generate-missing - Generate route optimizations for shipments without them
router.post('/generate-missing', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shipments = yield data_1.DataStore.getAllShipments();
        const routes = yield data_1.DataStore.getAllRouteOptimizations();
        const existingRouteIds = new Set(routes.map(r => r.shipmentId));
        const missingShipments = shipments.filter(s => !existingRouteIds.has(s.id));
        const generated = [];
        for (const shipment of missingShipments) {
            console.log('Generating route optimization for missing shipment:', shipment.id);
            // Generate realistic route data
            const baseDistance = Math.floor(Math.random() * 800) + 400;
            const baseTime = Math.floor(Math.random() * 12) + 6;
            const optimizedTime = baseTime - Math.floor(Math.random() * 3) - 1;
            const timeSaved = baseTime - optimizedTime;
            const routeOpt = yield data_1.DataStore.addRouteOptimization({
                shipmentId: shipment.id,
                currentRoute: {
                    routeName: 'Current Route',
                    distance: `${baseDistance} km`,
                    estimatedTime: `${baseTime} hours`,
                    savings: '0 mins',
                    trafficLevel: 'medium',
                    recommended: false,
                },
                suggestedRoute: {
                    routeName: 'Optimized Route',
                    distance: `${baseDistance - Math.floor(Math.random() * 100)} km`,
                    estimatedTime: `${optimizedTime} hours`,
                    savings: `${timeSaved * 60} mins`,
                    trafficLevel: 'low',
                    recommended: true,
                },
            });
            generated.push(routeOpt);
        }
        const response = {
            success: true,
            data: { generated: generated.length, routes: generated },
            message: `Generated ${generated.length} missing route optimizations`,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error generating missing routes:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate route optimizations',
            timestamp: new Date().toISOString(),
        });
    }
}));
// POST /api/routes/apply - Apply optimized route
router.post('/apply', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = applyRouteSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            error: 'Invalid request body',
            details: validation.error.message,
            timestamp: new Date().toISOString(),
        });
    }
    const { shipmentId } = validation.data;
    console.log('Applying route for shipment:', shipmentId);
    // Check if route optimization exists
    let optimization = yield data_1.DataStore.getRouteOptimizationByShipmentId(shipmentId);
    // If not found, generate one on the fly
    if (!optimization) {
        console.log('Route optimization not found, generating for shipment:', shipmentId);
        const shipment = yield data_1.DataStore.getShipmentById(shipmentId);
        if (!shipment) {
            return res.status(404).json({
                success: false,
                error: 'Shipment not found',
                timestamp: new Date().toISOString(),
            });
        }
        // Generate realistic route data
        const baseDistance = Math.floor(Math.random() * 800) + 400;
        const baseTime = Math.floor(Math.random() * 12) + 6;
        const optimizedTime = baseTime - Math.floor(Math.random() * 3) - 1;
        const timeSaved = baseTime - optimizedTime;
        const newOptimization = yield data_1.DataStore.addRouteOptimization({
            shipmentId: shipment.id,
            currentRoute: {
                routeName: 'Current Route',
                distance: `${baseDistance} km`,
                estimatedTime: `${baseTime} hours`,
                savings: '0 mins',
                trafficLevel: 'medium',
                recommended: false,
            },
            suggestedRoute: {
                routeName: 'Optimized Route',
                distance: `${baseDistance - Math.floor(Math.random() * 100)} km`,
                estimatedTime: `${optimizedTime} hours`,
                savings: `${timeSaved * 60} mins`,
                trafficLevel: 'low',
                recommended: true,
            },
        });
        if (newOptimization) {
            optimization = newOptimization;
        }
        console.log('Route optimization generated on-the-fly:', newOptimization ? 'SUCCESS' : 'FAILED');
    }
    const applied = yield data_1.DataStore.applyRoute(shipmentId);
    if (!applied) {
        return res.status(404).json({
            success: false,
            error: 'Failed to apply route',
            timestamp: new Date().toISOString(),
        });
    }
    console.log('Route applied successfully for shipment:', shipmentId);
    const response = {
        success: true,
        data: { shipmentId, applied: true },
        message: 'Route applied successfully',
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
// GET /api/routes/savings - Get total potential savings
router.get('/savings', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const optimizations = yield data_1.DataStore.getAllRouteOptimizations();
    const totalSavings = optimizations.reduce((total, opt) => {
        const savingsMatch = opt.suggestedRoute.savings.match(/(\d+)/);
        const minutes = savingsMatch ? parseInt(savingsMatch[1], 10) : 0;
        return total + minutes;
    }, 0);
    const averageSavings = optimizations.length > 0
        ? Math.round(totalSavings / optimizations.length)
        : 0;
    const response = {
        success: true,
        data: {
            totalPotentialSavings: totalSavings,
            averageSavingsPerRoute: averageSavings,
            totalOptimizationsAvailable: optimizations.length,
        },
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
exports.default = router;
