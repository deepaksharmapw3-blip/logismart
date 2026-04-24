// API Service for connecting to the backend
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

// Generic fetch wrapper
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', response.status, errorText);
    let error;
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { error: errorText || 'Unknown error' };
    }
    throw new Error(error.error || error.details || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// Shipment types
export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: 'on-time' | 'at-risk' | 'delayed';
  eta: string;
  currentLocation: string;
  delayProbability: number;
  location: { lat: number; lng: number };
  destination_coords: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
}

export interface DelayPrediction {
  shipmentId: string;
  delayProbability: number;
  estimatedDelay: string;
  reasons: string[];
  riskLevel: 'low' | 'medium' | 'high';
  currentLocation: string;
  predictedAt: string;
  explanation?: string;
  decisionSuggestion?: string;
}

export interface Route {
  routeName: string;
  distance: string;
  estimatedTime: string;
  savings: string;
  trafficLevel: 'low' | 'medium' | 'high';
  recommended: boolean;
}

export interface RouteOptimization {
  shipmentId: string;
  currentRoute: Route;
  suggestedRoute: Route;
  createdAt: string;
}

export interface Alert {
  id: string;
  type: 'delay' | 'route-change' | 'success' | 'info';
  title: string;
  message: string;
  shipmentId: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: string;
}

export interface AnalyticsData {
  deliveryTrends: Array<{
    day: string;
    onTime: number;
    delayed: number;
    atRisk: number;
  }>;
  delayReasons: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  routePerformance: Array<{
    route: string;
    avgDelay: number;
  }>;
  bottlenecks: Array<{
    location: string;
    delay: number;
    severity: 'low' | 'medium' | 'high';
  }>;
  stats: Array<{
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
  }>;
}

// API Functions
export const api = {
  // Shipments
  getShipments: () => fetchApi<Shipment[]>('/shipments'),
  getShipment: (id: string) => fetchApi<Shipment>(`/shipments/${id}`),
  createShipment: (shipment: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>) =>
    fetchApi<Shipment>('/shipments', {
      method: 'POST',
      body: JSON.stringify(shipment),
    }),
  updateShipment: (id: string, updates: Partial<Shipment>) =>
    fetchApi<Shipment>(`/shipments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
  deleteShipment: (id: string) =>
    fetchApi<null>(`/shipments/${id}`, {
      method: 'DELETE',
    }),

  // Predictions
  getPredictions: () => fetchApi<DelayPrediction[]>('/predictions'),
  getHighRiskPredictions: () => fetchApi<DelayPrediction[]>('/predictions/high-risk'),
  getPrediction: (shipmentId: string) => fetchApi<DelayPrediction>(`/predictions/${shipmentId}`),

  // Routes
  getRouteOptimizations: () => fetchApi<RouteOptimization[]>('/routes/optimizations'),
  getRouteOptimization: (shipmentId: string) =>
    fetchApi<RouteOptimization>(`/routes/optimizations/${shipmentId}`),
  applyRoute: (shipmentId: string) =>
    fetchApi<{ shipmentId: string; applied: boolean }>('/routes/apply', {
      method: 'POST',
      body: JSON.stringify({ shipmentId }),
    }),

  // Alerts
  getAlerts: () => fetchApi<Alert[]>('/alerts'),
  getUnreadAlerts: () => fetchApi<Alert[]>('/alerts/unread'),
  createAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'createdAt' | 'read'>) =>
    fetchApi<Alert>('/alerts', {
      method: 'POST',
      body: JSON.stringify(alert),
    }),
  dismissAlert: (id: string) =>
    fetchApi<null>(`/alerts/${id}`, {
      method: 'DELETE',
    }),
  markAlertAsRead: (id: string) =>
    fetchApi<null>(`/alerts/${id}/read`, {
      method: 'PATCH',
    }),

  // Analytics
  getAnalytics: () => fetchApi<AnalyticsData>('/analytics'),
  getDashboard: () => fetchApi<{
    stats: AnalyticsData['stats'];
    summary: {
      totalShipments: number;
      activeShipments: number;
      delayedShipments: number;
      atRiskShipments: number;
      onTimeShipments: number;
      predictionsCount: number;
      criticalPredictions: number;
    };
    recentTrends: AnalyticsData['deliveryTrends'];
    topBottlenecks: AnalyticsData['bottlenecks'];
  }>('/analytics/dashboard'),
};

export default api;
