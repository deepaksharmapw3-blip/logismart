import { supabase, isSupabaseConfigured } from '../config/database';
import type {
  Shipment,
  DelayPrediction,
  RouteOptimization,
  Alert,
  AnalyticsData,
  Coordinates,
} from '../types';
import { v4 as uuidv4 } from 'uuid';

// Helper to safely get supabase client
const getSupabase = () => {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }
  return supabase;
};

// Helper to convert DB shipment to app shipment
const dbToShipment = (db: any): Shipment => ({
  id: db.id,
  origin: db.origin,
  destination: db.destination,
  status: db.status,
  eta: db.eta,
  currentLocation: db.current_location,
  delayProbability: db.delay_probability,
  location: { lat: db.location_lat, lng: db.location_lng },
  destination_coords: { lat: db.destination_lat, lng: db.destination_lng },
  createdAt: new Date(db.created_at),
  updatedAt: new Date(db.updated_at),
});

// Helper to convert app shipment to DB format
const shipmentToDb = (s: Partial<Shipment>) => ({
  ...(s.id && { id: s.id }),
  ...(s.origin && { origin: s.origin }),
  ...(s.destination && { destination: s.destination }),
  ...(s.status && { status: s.status }),
  ...(s.eta && { eta: s.eta }),
  ...(s.currentLocation && { current_location: s.currentLocation }),
  ...(s.delayProbability !== undefined && { delay_probability: s.delayProbability }),
  ...(s.location && { location_lat: s.location.lat, location_lng: s.location.lng }),
  ...(s.destination_coords && { destination_lat: s.destination_coords.lat, destination_lng: s.destination_coords.lng }),
});

// Helper to convert DB prediction to app prediction
const dbToPrediction = (db: any): DelayPrediction => ({
  shipmentId: db.shipment_id,
  delayProbability: db.delay_probability,
  estimatedDelay: db.estimated_delay,
  reasons: db.reasons || [],
  riskLevel: db.risk_level,
  currentLocation: db.current_location,
  predictedAt: new Date(db.predicted_at),
});

// Helper to convert DB route optimization to app format
const dbToRouteOptimization = (db: any): RouteOptimization => ({
  shipmentId: db.shipment_id,
  currentRoute: {
    routeName: db.current_route_name,
    distance: db.current_route_distance,
    estimatedTime: db.current_route_time,
    savings: db.current_route_savings,
    trafficLevel: db.current_route_traffic,
    recommended: db.current_route_recommended,
  },
  suggestedRoute: {
    routeName: db.suggested_route_name,
    distance: db.suggested_route_distance,
    estimatedTime: db.suggested_route_time,
    savings: db.suggested_route_savings,
    trafficLevel: db.suggested_route_traffic,
    recommended: db.suggested_route_recommended,
  },
  createdAt: new Date(db.created_at),
});

// Helper to convert DB alert to app alert
const dbToAlert = (db: any): Alert => ({
  id: db.id,
  type: db.type,
  title: db.title,
  message: db.message,
  shipmentId: db.shipment_id,
  timestamp: db.timestamp,
  priority: db.priority,
  read: db.read,
  createdAt: new Date(db.created_at),
});

// Supabase Data Store
export const SupabaseStore = {
  // Shipments
  getAllShipments: async (): Promise<Shipment[]> => {
    const client = getSupabase();
    if (!client) return [];
    
    const { data, error } = await client
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching shipments:', error);
      return [];
    }
    
    return (data || []).map(dbToShipment);
  },
  
  getShipmentById: async (id: string): Promise<Shipment | undefined> => {
    const client = getSupabase();
    if (!client) return undefined;
    
    const { data, error } = await client
      .from('shipments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return dbToShipment(data);
  },
  
  addShipment: async (shipment: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Shipment | null> => {
    const client = getSupabase();
    if (!client) return null;
    
    const dbShipment = {
      id: shipment.id || uuidv4(),
      origin: shipment.origin,
      destination: shipment.destination,
      status: shipment.status || 'on-time',
      eta: shipment.eta,
      current_location: shipment.currentLocation,
      delay_probability: shipment.delayProbability || 0,
      location_lat: shipment.location.lat,
      location_lng: shipment.location.lng,
      destination_lat: shipment.destination_coords.lat,
      destination_lng: shipment.destination_coords.lng,
    };
    
    const { data, error } = await client
      .from('shipments')
      .insert(dbShipment)
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error creating shipment:', error);
      return null;
    }
    
    return dbToShipment(data);
  },
  
  updateShipment: async (id: string, updates: Partial<Shipment>): Promise<Shipment | undefined> => {
    const client = getSupabase();
        if (!client) return undefined;
    
    const dbUpdates = shipmentToDb(updates);
    
    const { data, error } = await client
      .from('shipments')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    return dbToShipment(data);
  },
  
  deleteShipment: async (id: string): Promise<boolean> => {
    const client = getSupabase();
        if (!client) return false;
    
    const { error } = await client
      .from('shipments')
      .delete()
      .eq('id', id);
    
    return !error;
  },

  // Delay Predictions
  getAllPredictions: async (): Promise<DelayPrediction[]> => {
    const client = getSupabase();
        if (!client) return [];
    
    const { data, error } = await client
      .from('delay_predictions')
      .select('*')
      .order('predicted_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching predictions:', error);
      return [];
    }
    
    return (data || []).map(dbToPrediction);
  },
  
  getPredictionByShipmentId: async (shipmentId: string): Promise<DelayPrediction | undefined> => {
    const client = getSupabase();
        if (!client) return undefined;
    
    const { data, error } = await client
      .from('delay_predictions')
      .select('*')
      .eq('shipment_id', shipmentId)
      .single();
    
    if (error || !data) return undefined;
    return dbToPrediction(data);
  },
  
  getHighRiskPredictions: async (): Promise<DelayPrediction[]> => {
    const client = getSupabase();
        if (!client) return [];
    
    const { data, error } = await client
      .from('delay_predictions')
      .select('*')
      .eq('risk_level', 'high');
    
    if (error) {
      console.error('Error fetching high-risk predictions:', error);
      return [];
    }
    
    return (data || []).map(dbToPrediction);
  },
  
  addPrediction: async (prediction: Omit<DelayPrediction, 'predictedAt'>): Promise<DelayPrediction | null> => {
    const client = getSupabase();
    if (!client) return null;
    
    const dbPrediction = {
      id: `pred-${uuidv4()}`,
      shipment_id: prediction.shipmentId,
      delay_probability: prediction.delayProbability,
      estimated_delay: prediction.estimatedDelay,
      reasons: prediction.reasons,
      risk_level: prediction.riskLevel,
      current_location: prediction.currentLocation,
      predicted_at: new Date().toISOString(),
    };
    
    const { data, error } = await client
      .from('delay_predictions')
      .insert(dbPrediction)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating prediction:', error);
      return null;
    }
    
    return dbToPrediction(data);
  },

  // Route Optimizations
  getAllRouteOptimizations: async (): Promise<RouteOptimization[]> => {
    const client = getSupabase();
        if (!client) return [];
    
    const { data, error } = await client
      .from('route_optimizations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching route optimizations:', error);
      return [];
    }
    
    return (data || []).map(dbToRouteOptimization);
  },
  
  getRouteOptimizationByShipmentId: async (shipmentId: string): Promise<RouteOptimization | undefined> => {
    const client = getSupabase();
        if (!client) return undefined;
    
    const { data, error } = await client
      .from('route_optimizations')
      .select('*')
      .eq('shipment_id', shipmentId)
      .single();
    
    if (error || !data) return undefined;
    return dbToRouteOptimization(data);
  },
  
  addRouteOptimization: async (optimization: Omit<RouteOptimization, 'createdAt'>): Promise<RouteOptimization | null> => {
    const client = getSupabase();
    if (!client) return null;
    
    const dbRouteOpt = {
      id: `route-${uuidv4()}`,
      shipment_id: optimization.shipmentId,
      current_route_name: optimization.currentRoute.routeName,
      current_route_distance: optimization.currentRoute.distance,
      current_route_time: optimization.currentRoute.estimatedTime,
      current_route_savings: optimization.currentRoute.savings,
      current_route_traffic: optimization.currentRoute.trafficLevel,
      current_route_recommended: optimization.currentRoute.recommended,
      suggested_route_name: optimization.suggestedRoute.routeName,
      suggested_route_distance: optimization.suggestedRoute.distance,
      suggested_route_time: optimization.suggestedRoute.estimatedTime,
      suggested_route_savings: optimization.suggestedRoute.savings,
      suggested_route_traffic: optimization.suggestedRoute.trafficLevel,
      suggested_route_recommended: optimization.suggestedRoute.recommended,
    };
    
    const { data, error } = await client
      .from('route_optimizations')
      .insert(dbRouteOpt)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating route optimization:', error);
      return null;
    }
    
    return dbToRouteOptimization(data);
  },
  
  applyRoute: async (shipmentId: string): Promise<boolean> => {
    const client = getSupabase();
    if (!client) return false;
    
    // Check if optimization exists
    const { data: optimization } = await client
      .from('route_optimizations')
      .select('*')
      .eq('shipment_id', shipmentId)
      .single();
    
    if (!optimization) return false;
    
    // Create success alert
    await SupabaseStore.addAlert({
      type: 'success',
      title: 'Route Applied',
      message: `Optimized route applied for shipment #${shipmentId}`,
      shipmentId,
      priority: 'low',
    });
    
    return true;
  },

  // Alerts
  getAllAlerts: async (): Promise<Alert[]> => {
    const client = getSupabase();
        if (!client) return [];
    
    const { data, error } = await client
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
    
    return (data || []).map(dbToAlert);
  },
  
  getUnreadAlerts: async (): Promise<Alert[]> => {
    const client = getSupabase();
        if (!client) return [];
    
    const { data, error } = await client
      .from('alerts')
      .select('*')
      .eq('read', false)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching unread alerts:', error);
      return [];
    }
    
    return (data || []).map(dbToAlert);
  },
  
  addAlert: async (alert: Omit<Alert, 'id' | 'timestamp' | 'createdAt' | 'read'>): Promise<Alert | null> => {
    const client = getSupabase();
        if (!client) return null;
    
    const dbAlert = {
      id: `alert-${uuidv4()}`,
      type: alert.type,
      title: alert.title,
      message: alert.message,
      shipment_id: alert.shipmentId,
      timestamp: 'Just now',
      priority: alert.priority,
      read: false,
    };
    
    const { data, error } = await client
      .from('alerts')
      .insert(dbAlert)
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error creating alert:', error);
      return null;
    }
    
    return dbToAlert(data);
  },
  
  dismissAlert: async (id: string): Promise<boolean> => {
    const client = getSupabase();
        if (!client) return false;
    
    const { error } = await client
      .from('alerts')
      .delete()
      .eq('id', id);
    
    return !error;
  },
  
  markAlertAsRead: async (id: string): Promise<boolean> => {
    const client = getSupabase();
        if (!client) return false;
    
    const { error } = await client
      .from('alerts')
      .update({ read: true })
      .eq('id', id);
    
    return !error;
  },

  // Analytics
  getAnalytics: async (): Promise<AnalyticsData> => {
    const client = getSupabase();
    if (!client) {
      return {
        deliveryTrends: [],
        delayReasons: [],
        routePerformance: [],
        bottlenecks: [],
        stats: [],
      };
    }
    
    const [
      { data: trends },
      { data: reasons },
      { data: performance },
      { data: bottlenecks },
      { data: stats },
    ] = await Promise.all([
      client.from('delivery_trends').select('*').order('day'),
      client.from('delay_reasons').select('*'),
      client.from('route_performance').select('*'),
      client.from('bottlenecks').select('*').order('delay', { ascending: false }),
      client.from('stats').select('*'),
    ]);
    
    return {
      deliveryTrends: (trends || []).map((t: any) => ({
        day: t.day,
        onTime: t.on_time,
        delayed: t.delayed,
        atRisk: t.at_risk,
      })),
      delayReasons: (reasons || []).map((r: any) => ({
        name: r.name,
        value: r.value,
        color: r.color,
      })),
      routePerformance: (performance || []).map((p: any) => ({
        route: p.route,
        avgDelay: p.avg_delay,
      })),
      bottlenecks: (bottlenecks || []).map((b: any) => ({
        location: b.location,
        delay: b.delay,
        severity: b.severity,
      })),
      stats: (stats || []).map((s: any) => ({
        label: s.label,
        value: s.value,
        change: s.change,
        trend: s.trend,
      })),
    };
  },
};

export default SupabaseStore;
