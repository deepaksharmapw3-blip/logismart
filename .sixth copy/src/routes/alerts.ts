import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { DataStore } from '../data';
import type { ApiResponse, Alert } from '../types';

const router = Router();

// Validation schema
const createAlertSchema = z.object({
  type: z.enum(['delay', 'route-change', 'success', 'info']),
  title: z.string().min(1),
  message: z.string().min(1),
  shipmentId: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high']),
});

// GET /api/alerts - Get all alerts
router.get('/', async (req: Request, res: Response) => {
  const alerts = await DataStore.getAllAlerts();
  const response: ApiResponse<Alert[]> = {
    success: true,
    data: alerts,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// GET /api/alerts/unread - Get unread alerts
router.get('/unread', async (req: Request, res: Response) => {
  const alerts = await DataStore.getUnreadAlerts();
  const response: ApiResponse<Alert[]> = {
    success: true,
    data: alerts,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// GET /api/alerts/count - Get alert counts
router.get('/count', async (req: Request, res: Response) => {
  const allAlerts = await DataStore.getAllAlerts();
  const unreadAlerts = await DataStore.getUnreadAlerts();
  
  const counts = {
    total: allAlerts.length,
    unread: unreadAlerts.length,
    byPriority: {
      high: allAlerts.filter(a => a.priority === 'high').length,
      medium: allAlerts.filter(a => a.priority === 'medium').length,
      low: allAlerts.filter(a => a.priority === 'low').length,
    },
    byType: {
      delay: allAlerts.filter(a => a.type === 'delay').length,
      routeChange: allAlerts.filter(a => a.type === 'route-change').length,
      success: allAlerts.filter(a => a.type === 'success').length,
      info: allAlerts.filter(a => a.type === 'info').length,
    },
  };
  
  const response: ApiResponse<typeof counts> = {
    success: true,
    data: counts,
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// POST /api/alerts - Create new alert
router.post('/', async (req: Request, res: Response) => {
  const validation = createAlertSchema.safeParse(req.body);
  
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request body',
      details: validation.error.message,
      timestamp: new Date().toISOString(),
    });
  }
  
  const newAlert = await DataStore.addAlert(validation.data);
  
  if (!newAlert) {
    return res.status(500).json({
      success: false,
      error: 'Failed to create alert',
      timestamp: new Date().toISOString(),
    });
  }
  
  const response: ApiResponse<Alert> = {
    success: true,
    data: newAlert,
    message: 'Alert created successfully',
    timestamp: new Date().toISOString(),
  };
  res.status(201).json(response);
});

// DELETE /api/alerts/:id - Dismiss/delete alert
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const dismissed = await DataStore.dismissAlert(id);
  
  if (!dismissed) {
    return res.status(404).json({
      success: false,
      error: 'Alert not found',
      timestamp: new Date().toISOString(),
    });
  }
  
  const response: ApiResponse<null> = {
    success: true,
    data: null,
    message: 'Alert dismissed successfully',
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// PATCH /api/alerts/:id/read - Mark alert as read
router.patch('/:id/read', async (req: Request, res: Response) => {
  const { id } = req.params;
  const marked = await DataStore.markAlertAsRead(id);
  
  if (!marked) {
    return res.status(404).json({
      success: false,
      error: 'Alert not found',
      timestamp: new Date().toISOString(),
    });
  }
  
  const response: ApiResponse<null> = {
    success: true,
    data: null,
    message: 'Alert marked as read',
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// PATCH /api/alerts/read-all - Mark all alerts as read
router.patch('/read-all', async (req: Request, res: Response) => {
  const alerts = await DataStore.getAllAlerts();
  await Promise.all(alerts.map(alert => DataStore.markAlertAsRead(alert.id)));
  
  const response: ApiResponse<null> = {
    success: true,
    data: null,
    message: 'All alerts marked as read',
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

export default router;
