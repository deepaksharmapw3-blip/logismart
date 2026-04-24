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
const openai_1 = require("../services/openai");
const router = (0, express_1.Router)();
// GET /api/predictions - Get all delay predictions
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const predictions = yield data_1.DataStore.getAllPredictions();
    const response = {
        success: true,
        data: predictions,
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
// GET /api/predictions/high-risk - Get high-risk predictions only
router.get('/high-risk', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const predictions = yield data_1.DataStore.getHighRiskPredictions();
    const response = {
        success: true,
        data: predictions,
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
// GET /api/predictions/:shipmentId - Get prediction for specific shipment
router.get('/:shipmentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shipmentId } = req.params;
    const prediction = yield data_1.DataStore.getPredictionByShipmentId(shipmentId);
    if (!prediction) {
        return res.status(404).json({
            success: false,
            error: 'No prediction found for this shipment',
            timestamp: new Date().toISOString(),
        });
    }
    const response = {
        success: true,
        data: prediction,
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
// POST /api/predictions/generate-missing - Generate predictions for shipments without them
router.post('/generate-missing', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shipments = yield data_1.DataStore.getAllShipments();
        const predictions = yield data_1.DataStore.getAllPredictions();
        const existingPredictionIds = new Set(predictions.map(p => p.shipmentId));
        const missingShipments = shipments.filter(s => !existingPredictionIds.has(s.id));
        const generated = [];
        for (const shipment of missingShipments) {
            console.log('Generating prediction for missing shipment:', shipment.id);
            let predictionData;
            // Try AI prediction first
            const aiPrediction = yield (0, openai_1.generateAIPrediction)(shipment.origin, shipment.destination, shipment.currentLocation, shipment.eta);
            if (aiPrediction) {
                predictionData = {
                    shipmentId: shipment.id,
                    delayProbability: aiPrediction.riskScore,
                    estimatedDelay: aiPrediction.estimatedDelay,
                    reasons: aiPrediction.contributingFactors,
                    riskLevel: aiPrediction.riskLevel,
                    currentLocation: shipment.currentLocation,
                    explanation: aiPrediction.explanation,
                    decisionSuggestion: aiPrediction.decisionSuggestion,
                };
            }
            else {
                // Fallback
                const riskLevel = shipment.delayProbability >= 70 ? 'high' :
                    shipment.delayProbability >= 40 ? 'medium' : 'low';
                predictionData = {
                    shipmentId: shipment.id,
                    delayProbability: shipment.delayProbability,
                    estimatedDelay: `${Math.floor(shipment.delayProbability / 5)}-${Math.floor(shipment.delayProbability / 3)} mins`,
                    reasons: ['Route congestion', 'Weather conditions', 'Traffic patterns'],
                    riskLevel,
                    currentLocation: shipment.currentLocation,
                };
            }
            const newPrediction = yield data_1.DataStore.addPrediction(predictionData);
            if (newPrediction)
                generated.push(newPrediction);
        }
        const response = {
            success: true,
            data: { generated: generated.length, predictions: generated },
            message: `Generated ${generated.length} missing predictions`,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error generating missing predictions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate predictions',
            timestamp: new Date().toISOString(),
        });
    }
}));
// GET /api/predictions/stats/summary - Get prediction statistics
router.get('/stats/summary', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const predictions = yield data_1.DataStore.getAllPredictions();
    const stats = {
        totalAtRisk: predictions.length,
        highRisk: predictions.filter(p => p.riskLevel === 'high').length,
        mediumRisk: predictions.filter(p => p.riskLevel === 'medium').length,
        lowRisk: predictions.filter(p => p.riskLevel === 'low').length,
        averageDelayProbability: predictions.length > 0 ? Math.round(predictions.reduce((sum, p) => sum + p.delayProbability, 0) / predictions.length) : 0,
    };
    const response = {
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
exports.default = router;
