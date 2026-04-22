import { Router, Request, Response } from 'express';
import { DataStore } from '../data';
import { AnalyticsService } from '../services/analyticsService';
import type { ApiResponse, AnalyticsData } from '../types';

const router = Router();

// GET /api/analytics - Get all analytics data (calculated from real data)
router.get('/', async (req: Request, res: Response) => {
  try {
    const analytics = await AnalyticsService.generateAnalytics();
    const response: ApiResponse<AnalyticsData> = {
      success: true,
      data: analytics,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    console.error('Error generating analytics:', error);
    // Fallback to stored analytics if generation fails
    const fallbackAnalytics = await DataStore.getAnalytics();
    const response: ApiResponse<AnalyticsData> = {
      success: true,
      data: fallbackAnalytics,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  }
});

// GET /api/analytics/dashboard - Get dashboard summary with real data
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const analytics = await AnalyticsService.generateAnalytics();
    const shipments = await DataStore.getAllShipments();
    const predictions = await DataStore.getAllPredictions();
    
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
    
    const response: ApiResponse<typeof dashboardData> = {
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    console.error('Error generating dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate dashboard data',
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/analytics/trends - Get delivery trends
router.get('/trends', async (req: Request, res: Response) => {
  try {
    const analytics = await AnalyticsService.generateAnalytics();
    const response: ApiResponse<typeof analytics.deliveryTrends> = {
      success: true,
      data: analytics.deliveryTrends,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching trends:', error);
    const fallbackAnalytics = await DataStore.getAnalytics();
    const response: ApiResponse<typeof fallbackAnalytics.deliveryTrends> = {
      success: true,
      data: fallbackAnalytics.deliveryTrends,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  }
});

// GET /api/analytics/delay-reasons - Get delay reasons breakdown
router.get('/delay-reasons', async (req: Request, res: Response) => {
  try {
    const analytics = await AnalyticsService.generateAnalytics();
    const response: ApiResponse<typeof analytics.delayReasons> = {
      success: true,
      data: analytics.delayReasons,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching delay reasons:', error);
    const fallbackAnalytics = await DataStore.getAnalytics();
    const response: ApiResponse<typeof fallbackAnalytics.delayReasons> = {
      success: true,
      data: fallbackAnalytics.delayReasons,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  }
});

// GET /api/analytics/route-performance - Get route performance data
router.get('/route-performance', async (req: Request, res: Response) => {
  try {
    const analytics = await AnalyticsService.generateAnalytics();
    const response: ApiResponse<typeof analytics.routePerformance> = {
      success: true,
      data: analytics.routePerformance,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching route performance:', error);
    const fallbackAnalytics = await DataStore.getAnalytics();
    const response: ApiResponse<typeof fallbackAnalytics.routePerformance> = {
      success: true,
      data: fallbackAnalytics.routePerformance,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  }
});

// GET /api/analytics/bottlenecks - Get bottleneck data
router.get('/bottlenecks', async (req: Request, res: Response) => {
  try {
    const analytics = await AnalyticsService.generateAnalytics();
    const response: ApiResponse<typeof analytics.bottlenecks> = {
      success: true,
      data: analytics.bottlenecks,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching bottlenecks:', error);
    const fallbackAnalytics = await DataStore.getAnalytics();
    const response: ApiResponse<typeof fallbackAnalytics.bottlenecks> = {
      success: true,
      data: fallbackAnalytics.bottlenecks,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  }
});

// GET /api/analytics/stats - Get key statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const analytics = await AnalyticsService.generateAnalytics();
    const response: ApiResponse<typeof analytics.stats> = {
      success: true,
      data: analytics.stats,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching stats:', error);
    const fallbackAnalytics = await DataStore.getAnalytics();
    const response: ApiResponse<typeof fallbackAnalytics.stats> = {
      success: true,
      data: fallbackAnalytics.stats,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  }
});

// GET /api/analytics/performance - Get performance metrics
router.get('/performance', async (req: Request, res: Response) => {
  try {
    const analytics = await AnalyticsService.generateAnalytics();
    const shipments = await DataStore.getAllShipments();
    
    const onTimeCount = shipments.filter(s => s.status === 'on-time').length;
    const delayedCount = shipments.filter(s => s.status === 'delayed').length;
    const atRiskCount = shipments.filter(s => s.status === 'at-risk').length;
    const total = shipments.length;
    
    const performance = {
      onTimeRate: total > 0 ? Math.round((onTimeCount / total) * 100) : 0,
      delayedRate: total > 0 ? Math.round((delayedCount / total) * 100) : 0,
      atRiskRate: total > 0 ? Math.round((atRiskCount / total) * 100) : 0,
      totalShipments: total,
      averageDelay: Math.round(
        analytics.bottlenecks.reduce((sum, b) => sum + b.delay, 0) / 
        (analytics.bottlenecks.length || 1)
      ),
      criticalBottlenecks: analytics.bottlenecks.filter(b => b.severity === 'high').length,
    };
    
    const response: ApiResponse<typeof performance> = {
      success: true,
      data: performance,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance metrics',
      timestamp: new Date().toISOString(),
    });
  }
});
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

export default router;
