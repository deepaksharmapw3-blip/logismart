import { Router, Request, Response } from 'express';
import { DataStore } from '../data';
import { generateAIPrediction } from '../services/openai';
import { getCurrentWeather } from '../services/weather';
import type { ApiResponse, DelayPrediction } from '../types';

const router = Router();

// GET /api/predictions - Get all delay predictions
router.get('/', async (req: Request, res: Response) => {
  const predictions = await DataStore.getAllPredictions();
  const response: ApiResponse<DelayPrediction[]> = {
    success: true,
    data: predictions,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// GET /api/predictions/high-risk - Get high-risk predictions only
router.get('/high-risk', async (req: Request, res: Response) => {
  const predictions = await DataStore.getHighRiskPredictions();
  const response: ApiResponse<DelayPrediction[]> = {
    success: true,
    data: predictions,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// GET /api/predictions/:shipmentId - Get prediction for specific shipment
router.get('/:shipmentId', async (req: Request, res: Response) => {
  const { shipmentId } = req.params;
  const prediction = await DataStore.getPredictionByShipmentId(shipmentId);

  if (!prediction) {
    return res.status(404).json({
      success: false,
      error: 'No prediction found for this shipment',
      timestamp: new Date().toISOString(),
    });
  }

  const response: ApiResponse<DelayPrediction> = {
    success: true,
    data: prediction,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// POST /api/predictions/generate-missing - Generate predictions for shipments without them
router.post('/generate-missing', async (req: Request, res: Response) => {
  try {
    const shipments = await DataStore.getAllShipments();
    const predictions = await DataStore.getAllPredictions();
    const existingPredictionIds = new Set(predictions.map(p => p.shipmentId));

    const missingShipments = shipments.filter(s => !existingPredictionIds.has(s.id));
    const generated: DelayPrediction[] = [];

    for (const shipment of missingShipments) {
      console.log('Generating prediction for missing shipment:', shipment.id);

      let predictionData: Omit<DelayPrediction, 'predictedAt'>;

      console.log(`OpenAI: Fetching weather for shipment ${shipment.id} location: ${shipment.location.lat}, ${shipment.location.lng}`);
      const weather = await getCurrentWeather(shipment.location.lat, shipment.location.lng);

      // Try AI prediction first
      const aiPrediction = await generateAIPrediction(
        shipment.origin,
        shipment.destination,
        shipment.currentLocation,
        shipment.eta,
        weather
      );

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
          weather: weather,
        };
      } else {
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

      const newPrediction = await DataStore.addPrediction(predictionData);
      if (newPrediction) generated.push(newPrediction);
    }

    const response: ApiResponse<{ generated: number; predictions: DelayPrediction[] }> = {
      success: true,
      data: { generated: generated.length, predictions: generated },
      message: `Generated ${generated.length} missing predictions`,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    console.error('Error generating missing predictions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate predictions',
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/predictions/stats/summary - Get prediction statistics
router.get('/stats/summary', async (req: Request, res: Response) => {
  const predictions = await DataStore.getAllPredictions();

  const stats = {
    totalAtRisk: predictions.length,
    highRisk: predictions.filter(p => p.riskLevel === 'high').length,
    mediumRisk: predictions.filter(p => p.riskLevel === 'medium').length,
    lowRisk: predictions.filter(p => p.riskLevel === 'low').length,
    averageDelayProbability: predictions.length > 0 ? Math.round(
      predictions.reduce((sum, p) => sum + p.delayProbability, 0) / predictions.length
    ) : 0,
  };

  const response: ApiResponse<typeof stats> = {
    success: true,
    data: stats,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

export default router;
