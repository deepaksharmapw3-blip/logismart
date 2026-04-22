import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { DataStore } from '../data';
import { generateAIPrediction } from '../services/openai';
import { getCurrentWeather, calculateWeatherImpact } from '../services/weather';
import type { ApiResponse, Shipment, Coordinates } from '../types';

const router = Router();

// Validation schemas
const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

const createShipmentSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  eta: z.string().min(1),
  currentLocation: z.string().min(1),
  location: coordinatesSchema,
  destination_coords: coordinatesSchema,
  status: z.enum(['on-time', 'at-risk', 'delayed']).optional(),
  delayProbability: z.number().min(0).max(100).optional(),
});

const updateShipmentSchema = z.object({
  status: z.enum(['on-time', 'at-risk', 'delayed']).optional(),
  currentLocation: z.string().optional(),
  eta: z.string().optional(),
  location: coordinatesSchema.optional(),
  delayProbability: z.number().min(0).max(100).optional(),
});

// GET /api/shipments - Get all shipments
router.get('/', async (req: Request, res: Response) => {
  const shipments = await DataStore.getAllShipments();
  const response: ApiResponse<Shipment[]> = {
    success: true,
    data: shipments,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// GET /api/shipments/:id - Get shipment by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const shipment = await DataStore.getShipmentById(id);
  
  if (!shipment) {
    return res.status(404).json({
      success: false,
      error: 'Shipment not found',
      timestamp: new Date().toISOString(),
    });
  }
  
  const response: ApiResponse<Shipment> = {
    success: true,
    data: shipment,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// POST /api/shipments - Create new shipment
router.post('/', async (req: Request, res: Response) => {
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
    const newShipment = await DataStore.addShipment({
      ...validation.data,
      status: validation.data.status || 'on-time',
      delayProbability: validation.data.delayProbability ?? Math.floor(Math.random() * 80) + 10,
    });
    
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
      const weather = await getCurrentWeather(
        newShipment.location.lat,
        newShipment.location.lng
      );
      
      if (weather) {
        console.log('Weather data fetched:', weather.description, `${weather.temperature}°C`);
      }
      
      const aiPrediction = await generateAIPrediction(
        newShipment.origin,
        newShipment.destination,
        newShipment.currentLocation,
        newShipment.eta,
        weather
      );
      
      if (aiPrediction) {
        console.log('AI Prediction generated:', aiPrediction);
        
        // Calculate weather impact
        const weatherImpact = weather ? calculateWeatherImpact(weather) : null;
        
        // Combine AI factors with weather factors
        const allReasons = [...aiPrediction.contributingFactors];
        if (weatherImpact && weatherImpact.factors.length > 0) {
          allReasons.push(...weatherImpact.factors);
        }
        
        // Use AI prediction data
        const prediction = await DataStore.addPrediction({
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
          await DataStore.addAlert({
            type: 'delay',
            title: 'High Delay Risk Detected',
            message: `${aiPrediction.explanation}. Suggestion: ${aiPrediction.decisionSuggestion}`,
            shipmentId: newShipment.id,
            priority: 'high',
          });
        }
        
        // Create weather alert if severe
        if (weatherImpact && weatherImpact.delayRisk > 30) {
          await DataStore.addAlert({
            type: 'info',
            title: 'Weather Alert',
            message: `Severe weather at ${newShipment.currentLocation}: ${weather?.description}. Delay risk increased by ${weatherImpact.delayRisk}%`,
            shipmentId: newShipment.id,
            priority: 'medium',
          });
        }
        
        // Generate route optimization
        console.log('Generating route optimization for shipment:', newShipment.id);
        const routeOpt = await DataStore.addRouteOptimization({
          shipmentId: newShipment.id,
          currentRoute: {
            routeName: 'Current Route',
            distance: 'TBD',
            estimatedTime: newShipment.eta,
            savings: '0 mins',
            trafficLevel: 'medium',
            recommended: false,
          },
          suggestedRoute: {
            routeName: 'Optimized Route',
            distance: 'TBD',
            estimatedTime: newShipment.eta,
            savings: '15-20 mins',
            trafficLevel: 'low',
            recommended: true,
          },
        });
        console.log('Route optimization saved:', routeOpt ? 'SUCCESS' : 'FAILED');
      } else {
        // Fallback to basic prediction
        console.log('OpenAI: Using fallback prediction for shipment:', newShipment.id);
        const riskLevel = newShipment.delayProbability >= 70 ? 'high' : 
                         newShipment.delayProbability >= 40 ? 'medium' : 'low';
        
        const fallbackPrediction = await DataStore.addPrediction({
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
        const routeOpt = await DataStore.addRouteOptimization({
          shipmentId: newShipment.id,
          currentRoute: {
            routeName: 'Current Route',
            distance: 'TBD',
            estimatedTime: newShipment.eta,
            savings: '0 mins',
            trafficLevel: 'medium',
            recommended: false,
          },
          suggestedRoute: {
            routeName: 'Optimized Route',
            distance: 'TBD',
            estimatedTime: newShipment.eta,
            savings: '15-20 mins',
            trafficLevel: 'low',
            recommended: true,
          },
        });
        console.log('Route optimization saved:', routeOpt ? 'SUCCESS' : 'FAILED');
      }
    } catch (predError) {
      console.error('Error in prediction creation:', predError);
    }
    
    console.log('Shipment creation complete:', newShipment.id);
    
    const response: ApiResponse<Shipment> = {
      success: true,
      data: newShipment,
      message: 'Shipment created successfully',
      timestamp: new Date().toISOString(),
    };
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating shipment:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
});

// PATCH /api/shipments/:id - Update shipment
router.patch('/:id', async (req: Request, res: Response) => {
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
  
  const updatedShipment = await DataStore.updateShipment(id, validation.data);
  
  if (!updatedShipment) {
    return res.status(404).json({
      success: false,
      error: 'Shipment not found',
      timestamp: new Date().toISOString(),
    });
  }
  
  const response: ApiResponse<Shipment> = {
    success: true,
    data: updatedShipment,
    message: 'Shipment updated successfully',
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// DELETE /api/shipments/:id - Delete shipment
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await DataStore.deleteShipment(id);
  
  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Shipment not found',
      timestamp: new Date().toISOString(),
    });
  }
  
  const response: ApiResponse<null> = {
    success: true,
    data: null,
    message: 'Shipment deleted successfully',
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// GET /api/shipments/:id/location - Get shipment location
router.get('/:id/location', async (req: Request, res: Response) => {
  const { id } = req.params;
  const shipment = await DataStore.getShipmentById(id);
  
  if (!shipment) {
    return res.status(404).json({
      success: false,
      error: 'Shipment not found',
      timestamp: new Date().toISOString(),
    });
  }
  
  const response: ApiResponse<{
    current: Coordinates;
    destination: Coordinates;
    currentLocation: string;
  }> = {
    success: true,
    data: {
      current: shipment.location,
      destination: shipment.destination_coords,
      currentLocation: shipment.currentLocation,
    },
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

export default router;
