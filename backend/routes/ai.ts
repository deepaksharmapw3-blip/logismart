import { Router, Request, Response } from 'express';
import { DataStore } from '../data';
import { getAIDecision, getAIRecommendations, getAISystemInsights } from '../services/openai';
import type { ApiResponse } from '../types';

const router = Router();

// GET /api/ai/decisions/:shipmentId - Get AI decision for a specific shipment
router.get('/decisions/:shipmentId', async (req: Request, res: Response) => {
    try {
        const { shipmentId } = req.params;
        const shipment = await DataStore.getShipmentById(shipmentId);

        if (!shipment) {
            return res.status(404).json({
                success: false,
                error: 'Shipment not found',
                timestamp: new Date().toISOString(),
            });
        }

        const decision = await getAIDecision(shipmentId, shipment);

        if (!decision) {
            return res.status(500).json({
                success: false,
                error: 'Failed to generate AI decision',
                timestamp: new Date().toISOString(),
            });
        }

        const response: ApiResponse<any> = {
            success: true,
            data: decision,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    } catch (error) {
        console.error('Error in AI decision route:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString(),
        });
    }
});

// GET /api/ai/recommendations - Get system-wide proactive recommendations
router.get('/recommendations', async (req: Request, res: Response) => {
    try {
        const recommendations = await getAIRecommendations();

        const response: ApiResponse<any> = {
            success: true,
            data: recommendations,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    } catch (error) {
        console.error('Error in AI recommendations route:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString(),
        });
    }
});

// GET /api/ai/insights - Get strategic system insights
router.get('/insights', async (req: Request, res: Response) => {
    try {
        const analytics = await DataStore.getAnalytics();
        const insights = await getAISystemInsights(analytics);

        if (!insights) {
            console.error('AI: No insights generated and no fallback available');
            return res.status(500).json({
                success: false,
                error: 'AI Insights currently unavailable',
                timestamp: new Date().toISOString(),
            });
        }

        const response: ApiResponse<any> = {
            success: true,
            data: insights,
            timestamp: new Date().toISOString(),
        };
        res.json(response);
    } catch (error) {
        console.error('Error in AI insights route:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString(),
        });
    }
});

export default router;
