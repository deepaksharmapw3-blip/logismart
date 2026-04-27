// Shipment Types
export type ShipmentStatus = 'on-time' | 'at-risk' | 'delayed';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  eta: string;
  currentLocation: string;
  delayProbability: number;
  location: Coordinates;
  destination_coords: Coordinates;
  createdAt: Date;
  updatedAt: Date;
}

// Delay Prediction Types
export type RiskLevel = 'low' | 'medium' | 'high';

export interface DelayPrediction {
  shipmentId: string;
  delayProbability: number;
  estimatedDelay: string;
  reasons: string[];
  riskLevel: RiskLevel;
  currentLocation: string;
  predictedAt: Date;
  explanation?: string;
  decisionSuggestion?: string;
  weather?: any; // WeatherData from services/weather
}

// Route Optimization Types
export type TrafficLevel = 'low' | 'medium' | 'high';

export interface Route {
  routeName: string;
  distance: string;
  estimatedTime: string;
  savings: string;
  trafficLevel: TrafficLevel;
  recommended: boolean;
}

export interface RouteOptimization {
  shipmentId: string;
  currentRoute: Route;
  suggestedRoute: Route;
  createdAt: Date;
}

// Alert Types
export type AlertType = 'delay' | 'route-change' | 'success' | 'info';
export type AlertPriority = 'low' | 'medium' | 'high';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  shipmentId: string;
  timestamp: string;
  priority: AlertPriority;
  createdAt: Date;
  read: boolean;
}

// Analytics Types
export interface DeliveryTrend {
  day: string;
  onTime: number;
  delayed: number;
  atRisk: number;
}

export interface DelayReason {
  name: string;
  value: number;
  color: string;
}

export interface RoutePerformance {
  route: string;
  avgDelay: number;
}

export interface Bottleneck {
  location: string;
  delay: number;
  severity: RiskLevel;
}

export interface StatMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export interface AnalyticsData {
  deliveryTrends: DeliveryTrend[];
  delayReasons: DelayReason[];
  routePerformance: RoutePerformance[];
  bottlenecks: Bottleneck[];
  stats: StatMetric[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: string;
  timestamp: string;
}

// Request Body Types
export interface CreateShipmentRequest {
  origin: string;
  destination: string;
  eta: string;
  currentLocation: string;
  location: Coordinates;
  destination_coords: Coordinates;
}

export interface UpdateShipmentRequest {
  status?: ShipmentStatus;
  currentLocation?: string;
  eta?: string;
  location?: Coordinates;
  delayProbability?: number;
}

export interface CreateAlertRequest {
  type: AlertType;
  title: string;
  message: string;
  shipmentId: string;
  priority: AlertPriority;
}

export interface ApplyRouteRequest {
  shipmentId: string;
}
