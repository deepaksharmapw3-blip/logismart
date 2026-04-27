import { isSupabaseConfigured, testConnection } from '../config/database';
import { DataStore as MemoryStore } from './store';
import { SupabaseStore } from './supabaseStore';

// Track if Supabase is actually working (not just configured)
export let supabaseWorking = false;

// Test Supabase on startup
testConnection().then(working => {
  supabaseWorking = working;
  if (!working && isSupabaseConfigured()) {
    console.log('⚠️  Supabase configured but not working - using in-memory storage');
  }
});
import type {
  Shipment,
  DelayPrediction,
  RouteOptimization,
  Alert,
  AnalyticsData,
} from '../types';

// Unified Data Store - uses Supabase when configured, otherwise falls back to in-memory
export const DataStore = {
  // Shipments
  getAllShipments: async (): Promise<Shipment[]> => {
    const memoryData = MemoryStore.getAllShipments();

    if (supabaseWorking) {
      try {
        const supabaseData = await SupabaseStore.getAllShipments();
        // Merge both sources: Start with Supabase data, add memory-only items
        const merged = [...supabaseData];
        memoryData.forEach(memItem => {
          if (!merged.find(s => s.id === memItem.id)) {
            merged.push(memItem);
          }
        });
        return merged;
      } catch (error) {
        console.warn('Supabase getAllShipments failed:', error);
      }
    }
    return memoryData;
  },

  getShipmentById: async (id: string): Promise<Shipment | undefined> => {
    if (isSupabaseConfigured()) {
      return SupabaseStore.getShipmentById(id);
    }
    return MemoryStore.getShipmentById(id);
  },

  addShipment: async (shipment: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Shipment | null> => {
    if (supabaseWorking) {
      try {
        const result = await SupabaseStore.addShipment(shipment);
        if (result) return result;
      } catch (error) {
        console.warn('Supabase addShipment failed:', error);
      }
    }
    console.log('Using memory store for addShipment');
    return MemoryStore.addShipment(shipment);
  },

  updateShipment: async (id: string, updates: Parameters<typeof MemoryStore.updateShipment>[1]): Promise<Shipment | undefined> => {
    if (isSupabaseConfigured()) {
      return SupabaseStore.updateShipment(id, updates);
    }
    return MemoryStore.updateShipment(id, updates);
  },

  deleteShipment: async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured()) {
      return SupabaseStore.deleteShipment(id);
    }
    return MemoryStore.deleteShipment(id);
  },

  // Delay Predictions
  getAllPredictions: async (): Promise<DelayPrediction[]> => {
    const memoryData = MemoryStore.getAllPredictions();
    console.log(`DEBUG getAllPredictions: memoryData=${memoryData.length}, supabaseWorking=${supabaseWorking}`);

    // Temporarily disable Supabase for predictions until tables are created
    // if (supabaseWorking) {
    //   try {
    //     const supabaseData = await SupabaseStore.getAllPredictions();
    //     // Merge both sources
    //     const merged = [...supabaseData];
    //     memoryData.forEach(memItem => {
    //       if (!merged.find(s => s.shipmentId === memItem.shipmentId)) {
    //         merged.push(memItem);
    //       }
    //     });
    //     return merged;
    //   } catch (error) {
    //     console.warn('Supabase getAllPredictions failed:', error);
    //   }
    // }
    return memoryData;
  },

  getPredictionByShipmentId: async (shipmentId: string): Promise<DelayPrediction | undefined> => {
    if (isSupabaseConfigured()) {
      return SupabaseStore.getPredictionByShipmentId(shipmentId);
    }
    return MemoryStore.getPredictionByShipmentId(shipmentId);
  },

  getHighRiskPredictions: async (): Promise<DelayPrediction[]> => {
    if (isSupabaseConfigured()) {
      return SupabaseStore.getHighRiskPredictions();
    }
    return MemoryStore.getHighRiskPredictions();
  },

  addPrediction: async (prediction: Parameters<typeof MemoryStore.addPrediction>[0]): Promise<DelayPrediction | null> => {
    console.log(`DEBUG addPrediction: supabaseWorking=${supabaseWorking}`);
    if (supabaseWorking) {
      try {
        const result = await SupabaseStore.addPrediction(prediction);
        console.log(`DEBUG addPrediction: supabase result=${result ? 'success' : 'null'}`);
        if (result) return result;
      } catch (error) {
        console.warn('Supabase addPrediction failed:', error);
      }
    }
    const memResult = MemoryStore.addPrediction(prediction);
    console.log(`DEBUG addPrediction: memory result, total predictions now=${MemoryStore.getAllPredictions().length}`);
    return memResult;
  },

  // Route Optimizations
  getAllRouteOptimizations: async (): Promise<RouteOptimization[]> => {
    const memoryData = MemoryStore.getAllRouteOptimizations();
    console.log(`DEBUG getAllRouteOptimizations: memoryData=${memoryData.length}, supabaseWorking=${supabaseWorking}`);

    // Temporarily disable Supabase for routes until tables are created
    // if (supabaseWorking) {
    //   try {
    //     const supabaseData = await SupabaseStore.getAllRouteOptimizations();
    //     // Merge both sources
    //     const merged = [...supabaseData];
    //     memoryData.forEach(memItem => {
    //       if (!merged.find(s => s.shipmentId === memItem.shipmentId)) {
    //         merged.push(memItem);
    //       }
    //     });
    //     return merged;
    //   } catch (error) {
    //     console.warn('Supabase getAllRouteOptimizations failed:', error);
    //   }
    // }
    return memoryData;
  },

  getRouteOptimizationByShipmentId: async (shipmentId: string): Promise<RouteOptimization | undefined> => {
    if (isSupabaseConfigured()) {
      return SupabaseStore.getRouteOptimizationByShipmentId(shipmentId);
    }
    return MemoryStore.getRouteOptimizationByShipmentId(shipmentId);
  },

  addRouteOptimization: async (optimization: Omit<RouteOptimization, 'createdAt'>): Promise<RouteOptimization | null> => {
    console.log(`DEBUG addRouteOptimization: supabaseWorking=${supabaseWorking}`);
    if (supabaseWorking) {
      try {
        const result = await SupabaseStore.addRouteOptimization(optimization);
        console.log(`DEBUG addRouteOptimization: supabase result=${result ? 'success' : 'null'}`);
        if (result) return result;
      } catch (error) {
        console.warn('Supabase addRouteOptimization failed:', error);
      }
    }
    console.log('Using memory store for addRouteOptimization');
    return MemoryStore.addRouteOptimization(optimization);
  },

  applyRoute: async (shipmentId: string): Promise<boolean> => {
    // Try memory store first (where routes are actually stored)
    const memoryResult = MemoryStore.applyRoute(shipmentId);
    if (memoryResult) {
      console.log('Route applied from memory store:', shipmentId);
      return true;
    }

    // Fallback to Supabase if not in memory
    if (isSupabaseConfigured()) {
      try {
        const supabaseResult = await SupabaseStore.applyRoute(shipmentId);
        if (supabaseResult) return supabaseResult;
      } catch (error) {
        console.warn('Supabase applyRoute failed:', error);
      }
    }

    return false;
  },

  // Alerts
  getAllAlerts: async (): Promise<Alert[]> => {
    const memoryData = MemoryStore.getAllAlerts();

    if (supabaseWorking) {
      try {
        const supabaseData = await SupabaseStore.getAllAlerts();
        // Merge both sources
        const merged = [...supabaseData];
        memoryData.forEach(memItem => {
          if (!merged.find(s => s.id === memItem.id)) {
            merged.push(memItem);
          }
        });
        return merged;
      } catch (error) {
        console.warn('Supabase getAllAlerts failed:', error);
      }
    }
    return memoryData;
  },

  getUnreadAlerts: async (): Promise<Alert[]> => {
    if (supabaseWorking) {
      try {
        const supabaseData = await SupabaseStore.getUnreadAlerts();
        if (supabaseData.length > 0) return supabaseData;
      } catch (error) {
        console.warn('Supabase getUnreadAlerts failed:', error);
      }
    }
    return MemoryStore.getUnreadAlerts();
  },

  addAlert: async (alert: Parameters<typeof MemoryStore.addAlert>[0]): Promise<Alert | null> => {
    if (supabaseWorking) {
      try {
        const result = await SupabaseStore.addAlert(alert);
        if (result) return result;
      } catch (error) {
        console.warn('Supabase addAlert failed:', error);
      }
    }
    return MemoryStore.addAlert(alert);
  },

  dismissAlert: async (id: string): Promise<boolean> => {
    // Try to dismiss from both sources
    let supabaseResult = false;
    if (isSupabaseConfigured()) {
      try {
        supabaseResult = await SupabaseStore.dismissAlert(id);
      } catch (error) {
        console.warn('Supabase dismissAlert failed:', error);
      }
    }

    // Always call memory store as fallback or concurrent source
    const memoryResult = MemoryStore.dismissAlert(id);

    // Return true if either succeeded (or if it's already gone)
    return supabaseResult || memoryResult;
  },

  markAlertAsRead: async (id: string): Promise<boolean> => {
    // Try to mark in both sources
    let supabaseResult = false;
    if (isSupabaseConfigured()) {
      try {
        supabaseResult = await SupabaseStore.markAlertAsRead(id);
      } catch (error) {
        console.warn('Supabase markAlertAsRead failed:', error);
      }
    }

    const memoryResult = MemoryStore.markAlertAsRead(id);

    return supabaseResult || memoryResult;
  },

  // Analytics
  getAnalytics: async (): Promise<AnalyticsData> => {
    if (isSupabaseConfigured()) {
      return SupabaseStore.getAnalytics();
    }
    return MemoryStore.getAnalytics();
  },

  updateStats: (newStats: Parameters<typeof MemoryStore.updateStats>[0]): void => {
    // Only available in memory store
    MemoryStore.updateStats(newStats);
  },
};

export default DataStore;
