import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { DataStore } from '../data';
import type { ApiResponse, RouteOptimization } from '../types';

const router = Router();

// Validation schema
const applyRouteSchema = z.object({
  shipmentId: z.string().min(1),
});

// GET /api/routes/optimizations - Get all route optimizations
router.get('/optimizations', async (req: Request, res: Response) => {
  const optimizations = await DataStore.getAllRouteOptimizations();
  const response: ApiResponse<RouteOptimization[]> = {
    success: true,
    data: optimizations,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// GET /api/routes/optimizations/:shipmentId - Get optimization for specific shipment
router.get('/optimizations/:shipmentId', async (req: Request, res: Response) => {
  const { shipmentId } = req.params;
  const optimization = await DataStore.getRouteOptimizationByShipmentId(shipmentId);
  
  if (!optimization) {
    return res.status(404).json({
      success: false,
      error: 'No route optimization found for this shipment',
      timestamp: new Date().toISOString(),
    });
  }
  
  const response: ApiResponse<RouteOptimization> = {
    success: true,
    data: optimization,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// POST /api/routes/generate-missing - Generate route optimizations for shipments without them
router.post('/generate-missing', async (req: Request, res: Response) => {
  try {
    const shipments = await DataStore.getAllShipments();
    const routes = await DataStore.getAllRouteOptimizations();
    const existingRouteIds = new Set(routes.map(r => r.shipmentId));
    
    const missingShipments = shipments.filter(s => !existingRouteIds.has(s.id));
    const generated: RouteOptimization[] = [];
    
    for (const shipment of missingShipments) {
      console.log('Generating route optimization for missing shipment:', shipment.id);
      
      const routeOpt = await DataStore.addRouteOptimization({
        shipmentId: shipment.id,
        currentRoute: {
          routeName: 'Current Route',
          distance: 'TBD',
          estimatedTime: shipment.eta,
          savings: '0%',
          trafficLevel: 'medium',
          recommended: false,
        },
        suggestedRoute: {
          routeName: 'Optimized Route',
          distance: 'TBD',
          estimatedTime: shipment.eta,
          savings: '15%',
          trafficLevel: 'low',
          recommended: true,
        },
      });
      
      generated.push(routeOpt);
    }
    
    const response: ApiResponse<{ generated: number; routes: RouteOptimization[] }> = {
      success: true,
      data: { generated: generated.length, routes: generated },
      message: `Generated ${generated.length} missing route optimizations`,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    console.error('Error generating missing routes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate route optimizations',
      timestamp: new Date().toISOString(),
    });
  }
});

// POST /api/routes/apply - Apply optimized route
router.post('/apply', async (req: Request, res: Response) => {
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
  const applied = await DataStore.applyRoute(shipmentId);
  
  if (!applied) {
    return res.status(404).json({
      success: false,
      error: 'Route optimization not found for this shipment',
      timestamp: new Date().toISOString(),
    });
  }
  
  const response: ApiResponse<{ shipmentId: string; applied: boolean }> = {
    success: true,
    data: { shipmentId, applied: true },
    message: 'Route applied successfully',
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// GET /api/routes/savings - Get total potential savings
router.get('/savings', async (req: Request, res: Response) => {
  const optimizations = await DataStore.getAllRouteOptimizations();
  
  const totalSavings = optimizations.reduce((total, opt) => {
    const savingsMatch = opt.suggestedRoute.savings.match(/(\d+)/);
    const minutes = savingsMatch ? parseInt(savingsMatch[1], 10) : 0;
    return total + minutes;
  }, 0);
  
  const averageSavings = optimizations.length > 0 
    ? Math.round(totalSavings / optimizations.length) 
    : 0;
  
  const response: ApiResponse<{
    totalPotentialSavings: number;
    averageSavingsPerRoute: number;
    totalOptimizationsAvailable: number;
  }> = {
    success: true,
    data: {
      totalPotentialSavings: totalSavings,
      averageSavingsPerRoute: averageSavings,
      totalOptimizationsAvailable: optimizations.length,
    },
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

export default router;
