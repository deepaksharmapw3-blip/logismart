import { Router, Request, Response } from 'express';
import { getCurrentWeather, getWeatherForecast, calculateWeatherImpact } from '../services/weather';
import type { ApiResponse } from '../types';

const router = Router();

// GET /api/weather/current?lat=...&lon=...
router.get('/current', async (req: Request, res: Response) => {
  const { lat, lon } = req.query;
  
  if (!lat || !lon) {
    return res.status(400).json({
      success: false,
      error: 'Latitude and longitude are required',
      timestamp: new Date().toISOString(),
    });
  }

  const weather = await getCurrentWeather(Number(lat), Number(lon));
  
  if (!weather) {
    return res.status(503).json({
      success: false,
      error: 'Weather data unavailable',
      timestamp: new Date().toISOString(),
    });
  }

  const impact = calculateWeatherImpact(weather);

  const response: ApiResponse<typeof weather & typeof impact> = {
    success: true,
    data: { ...weather, ...impact },
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// GET /api/weather/forecast?lat=...&lon=...
router.get('/forecast', async (req: Request, res: Response) => {
  const { lat, lon } = req.query;
  
  if (!lat || !lon) {
    return res.status(400).json({
      success: false,
      error: 'Latitude and longitude are required',
      timestamp: new Date().toISOString(),
    });
  }

  const forecast = await getWeatherForecast(Number(lat), Number(lon));
  
  if (!forecast) {
    return res.status(503).json({
      success: false,
      error: 'Weather forecast unavailable',
      timestamp: new Date().toISOString(),
    });
  }

  const response: ApiResponse<typeof forecast> = {
    success: true,
    data: forecast,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

export default router;
