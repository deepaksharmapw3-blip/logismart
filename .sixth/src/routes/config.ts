import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const router = Router();

// GET /api/config - Return frontend configuration
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || '',
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
