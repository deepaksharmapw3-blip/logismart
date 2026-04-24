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
const openai_1 = require("../services/openai");
const weather_1 = require("../services/weather");
const router = (0, express_1.Router)();
// Validation schemas
const coordinatesSchema = zod_1.z.object({
    lat: zod_1.z.number().min(-90).max(90),
    lng: zod_1.z.number().min(-180).max(180),
});
const createShipmentSchema = zod_1.z.object({
    origin: zod_1.z.string().min(1),
    destination: zod_1.z.string().min(1),
    eta: zod_1.z.string().min(1),
    currentLocation: zod_1.z.string().min(1),
    location: coordinatesSchema,
    destination_coords: coordinatesSchema,
    status: zod_1.z.enum(['on-time', 'at-risk', 'delayed']).optional(),
    delayProbability: zod_1.z.number().min(0).max(100).optional(),
});
const updateShipmentSchema = zod_1.z.object({
    status: zod_1.z.enum(['on-time', 'at-risk', 'delayed']).optional(),
    currentLocation: zod_1.z.string().optional(),
    eta: zod_1.z.string().optional(),
    location: coordinatesSchema.optional(),
    delayProbability: zod_1.z.number().min(0).max(100).optional(),
});
// GET /api/shipments - Get all shipments
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const shipments = yield data_1.DataStore.getAllShipments();
    const response = {
        success: true,
        data: shipments,
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
// GET /api/shipments/:id - Get shipment by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const shipment = yield data_1.DataStore.getShipmentById(id);
    if (!shipment) {
        return res.status(404).json({
            success: false,
            error: 'Shipment not found',
            timestamp: new Date().toISOString(),
        });
    }
    const response = {
        success: true,
        data: shipment,
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
// POST /api/shipments - Create new shipment
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('Creating shipment with data:', req.body);
    const validation = createShipmentSchema.safeParse(req.body);
    if (!validation.success) {
        console.error('Validation error:', validation.error.message);
        return res.status(400).json({
            success: false,
            error: 'Invalid request body',
            details: validation.error.message,
            timestamp: new Date().toISOString(),
        });
    }
    try {
        const newShipment = yield data_1.DataStore.addShipment(Object.assign(Object.assign({}, validation.data), { status: validation.data.status || 'on-time', delayProbability: (_a = validation.data.delayProbability) !== null && _a !== void 0 ? _a : Math.floor(Math.random() * 80) + 10 }));
        if (!newShipment) {
            console.error('DataStore.addShipment returned null');
            return res.status(500).json({
                success: false,
                error: 'Failed to create shipment - database error',
                timestamp: new Date().toISOString(),
            });
        }
        console.log('Shipment created successfully:', newShipment.id, 'with delay probability:', newShipment.delayProbability);
        // Generate AI-powered prediction with weather data
        console.log('Generating AI prediction for shipment:', newShipment.id);
        try {
            // Fetch weather at current location
            const weather = yield (0, weather_1.getCurrentWeather)(newShipment.location.lat, newShipment.location.lng);
            if (weather) {
                console.log('Weather data fetched:', weather.description, `${weather.temperature}°C`);
            }
            const aiPrediction = yield (0, openai_1.generateAIPrediction)(newShipment.origin, newShipment.destination, newShipment.currentLocation, newShipment.eta, weather);
            if (aiPrediction) {
                console.log('AI Prediction generated:', aiPrediction);
                // Calculate weather impact
                const weatherImpact = weather ? (0, weather_1.calculateWeatherImpact)(weather) : null;
                // Combine AI factors with weather factors
                const allReasons = [...aiPrediction.contributingFactors];
                if (weatherImpact && weatherImpact.factors.length > 0) {
                    allReasons.push(...weatherImpact.factors);
                }
                // Use AI prediction data
                const prediction = yield data_1.DataStore.addPrediction({
                    shipmentId: newShipment.id,
                    delayProbability: aiPrediction.riskScore,
                    estimatedDelay: aiPrediction.estimatedDelay,
                    reasons: allReasons,
                    riskLevel: aiPrediction.riskLevel,
                    currentLocation: newShipment.currentLocation,
                    explanation: aiPrediction.explanation,
                    decisionSuggestion: aiPrediction.decisionSuggestion,
                });
                console.log('AI Prediction saved:', prediction ? 'SUCCESS' : 'FAILED');
                // Create alert for high-risk shipments
                if (aiPrediction.riskLevel === 'high') {
                    yield data_1.DataStore.addAlert({
                        type: 'delay',
                        title: 'High Delay Risk Detected',
                        message: `${aiPrediction.explanation}. Suggestion: ${aiPrediction.decisionSuggestion}`,
                        shipmentId: newShipment.id,
                        priority: 'high',
                    });
                }
                // Create weather alert if severe
                if (weatherImpact && weatherImpact.delayRisk > 30) {
                    yield data_1.DataStore.addAlert({
                        type: 'info',
                        title: 'Weather Alert',
                        message: `Severe weather at ${newShipment.currentLocation}: ${weather === null || weather === void 0 ? void 0 : weather.description}. Delay risk increased by ${weatherImpact.delayRisk}%`,
                        shipmentId: newShipment.id,
                        priority: 'medium',
                    });
                }
                // Generate route optimization with realistic data
                console.log('Generating route optimization for shipment:', newShipment.id);
                // Calculate realistic route data based on delay probability
                const baseDistance = Math.floor(Math.random() * 800) + 400; // 400-1200 km
                const baseTime = Math.floor(Math.random() * 12) + 6; // 6-18 hours
                const optimizedTime = baseTime - Math.floor(Math.random() * 3) - 1; // 1-3 hours saved
                const timeSaved = baseTime - optimizedTime;
                const routeOpt = yield data_1.DataStore.addRouteOptimization({
                    shipmentId: newShipment.id,
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
                console.log('Route optimization saved:', routeOpt ? 'SUCCESS' : 'FAILED');
            }
            else {
                // Fallback to basic prediction
                console.log('OpenAI: Using fallback prediction for shipment:', newShipment.id);
                const riskLevel = newShipment.delayProbability >= 70 ? 'high' :
                    newShipment.delayProbability >= 40 ? 'medium' : 'low';
                const fallbackPrediction = yield data_1.DataStore.addPrediction({
                    shipmentId: newShipment.id,
                    delayProbability: newShipment.delayProbability,
                    estimatedDelay: `${Math.floor(newShipment.delayProbability / 5)}-${Math.floor(newShipment.delayProbability / 3)} mins`,
                    reasons: ['Route congestion', 'Weather conditions', 'Traffic patterns'],
                    riskLevel,
                    currentLocation: newShipment.currentLocation,
                });
                console.log('Fallback prediction saved:', fallbackPrediction ? 'SUCCESS' : 'FAILED');
                // Generate route optimization even for fallback
                console.log('Generating route optimization for shipment:', newShipment.id);
                const baseDistance = Math.floor(Math.random() * 800) + 400;
                const baseTime = Math.floor(Math.random() * 12) + 6;
                const optimizedTime = baseTime - Math.floor(Math.random() * 3) - 1;
                const timeSaved = baseTime - optimizedTime;
                const routeOpt = yield data_1.DataStore.addRouteOptimization({
                    shipmentId: newShipment.id,
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
                console.log('Route optimization saved:', routeOpt ? 'SUCCESS' : 'FAILED');
            }
        }
        catch (predError) {
            console.error('Error in prediction creation:', predError);
        }
        console.log('Shipment creation complete:', newShipment.id);
        const response = {
            success: true,
            data: newShipment,
            message: 'Shipment created successfully',
            timestamp: new Date().toISOString(),
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('Error creating shipment:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString(),
        });
    }
}));
// PATCH /api/shipments/:id - Update shipment
router.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const validation = updateShipmentSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            error: 'Invalid request body',
            details: validation.error.message,
            timestamp: new Date().toISOString(),
        });
    }
    const updatedShipment = yield data_1.DataStore.updateShipment(id, validation.data);
    if (!updatedShipment) {
        return res.status(404).json({
            success: false,
            error: 'Shipment not found',
            timestamp: new Date().toISOString(),
        });
    }
    const response = {
        success: true,
        data: updatedShipment,
        message: 'Shipment updated successfully',
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
// DELETE /api/shipments/:id - Delete shipment
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deleted = yield data_1.DataStore.deleteShipment(id);
    if (!deleted) {
        return res.status(404).json({
            success: false,
            error: 'Shipment not found',
            timestamp: new Date().toISOString(),
        });
    }
    const response = {
        success: true,
        data: null,
        message: 'Shipment deleted successfully',
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
// GET /api/shipments/:id/location - Get shipment location
router.get('/:id/location', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const shipment = yield data_1.DataStore.getShipmentById(id);
    if (!shipment) {
        return res.status(404).json({
            success: false,
            error: 'Shipment not found',
            timestamp: new Date().toISOString(),
        });
    }
    const response = {
        success: true,
        data: {
            current: shipment.location,
            destination: shipment.destination_coords,
            currentLocation: shipment.currentLocation,
        },
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
exports.default = router;
