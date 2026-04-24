"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataStore = void 0;
const database_1 = require("../config/database");
const store_1 = require("./store");
const supabaseStore_1 = require("./supabaseStore");
// Track if Supabase is actually working (not just configured)
let supabaseWorking = false;
// Test Supabase on startup
(0, database_1.testConnection)().then(working => {
    supabaseWorking = working;
    if (!working && (0, database_1.isSupabaseConfigured)()) {
        console.log('⚠️  Supabase configured but not working - using in-memory storage');
    }
});
// Unified Data Store - uses Supabase when configured, otherwise falls back to in-memory
exports.DataStore = {
    // Shipments
    getAllShipments: () => __awaiter(void 0, void 0, void 0, function* () {
        const memoryData = store_1.DataStore.getAllShipments();
        if (supabaseWorking) {
            try {
                const supabaseData = yield supabaseStore_1.SupabaseStore.getAllShipments();
                // Merge both sources: Start with Supabase data, add memory-only items
                const merged = [...supabaseData];
                memoryData.forEach(memItem => {
                    if (!merged.find(s => s.id === memItem.id)) {
                        merged.push(memItem);
                    }
                });
                return merged;
            }
            catch (error) {
                console.warn('Supabase getAllShipments failed:', error);
            }
        }
        return memoryData;
    }),
    getShipmentById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        if ((0, database_1.isSupabaseConfigured)()) {
            return supabaseStore_1.SupabaseStore.getShipmentById(id);
        }
        return store_1.DataStore.getShipmentById(id);
    }),
    addShipment: (shipment) => __awaiter(void 0, void 0, void 0, function* () {
        if (supabaseWorking) {
            try {
                const result = yield supabaseStore_1.SupabaseStore.addShipment(shipment);
                if (result)
                    return result;
            }
            catch (error) {
                console.warn('Supabase addShipment failed:', error);
            }
        }
        console.log('Using memory store for addShipment');
        return store_1.DataStore.addShipment(shipment);
    }),
    updateShipment: (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
        if ((0, database_1.isSupabaseConfigured)()) {
            return supabaseStore_1.SupabaseStore.updateShipment(id, updates);
        }
        return store_1.DataStore.updateShipment(id, updates);
    }),
    deleteShipment: (id) => __awaiter(void 0, void 0, void 0, function* () {
        if ((0, database_1.isSupabaseConfigured)()) {
            return supabaseStore_1.SupabaseStore.deleteShipment(id);
        }
        return store_1.DataStore.deleteShipment(id);
    }),
    // Delay Predictions
    getAllPredictions: () => __awaiter(void 0, void 0, void 0, function* () {
        const memoryData = store_1.DataStore.getAllPredictions();
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
    }),
    getPredictionByShipmentId: (shipmentId) => __awaiter(void 0, void 0, void 0, function* () {
        if ((0, database_1.isSupabaseConfigured)()) {
            return supabaseStore_1.SupabaseStore.getPredictionByShipmentId(shipmentId);
        }
        return store_1.DataStore.getPredictionByShipmentId(shipmentId);
    }),
    getHighRiskPredictions: () => __awaiter(void 0, void 0, void 0, function* () {
        if ((0, database_1.isSupabaseConfigured)()) {
            return supabaseStore_1.SupabaseStore.getHighRiskPredictions();
        }
        return store_1.DataStore.getHighRiskPredictions();
    }),
    addPrediction: (prediction) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`DEBUG addPrediction: supabaseWorking=${supabaseWorking}`);
        if (supabaseWorking) {
            try {
                const result = yield supabaseStore_1.SupabaseStore.addPrediction(prediction);
                console.log(`DEBUG addPrediction: supabase result=${result ? 'success' : 'null'}`);
                if (result)
                    return result;
            }
            catch (error) {
                console.warn('Supabase addPrediction failed:', error);
            }
        }
        const memResult = store_1.DataStore.addPrediction(prediction);
        console.log(`DEBUG addPrediction: memory result, total predictions now=${store_1.DataStore.getAllPredictions().length}`);
        return memResult;
    }),
    // Route Optimizations
    getAllRouteOptimizations: () => __awaiter(void 0, void 0, void 0, function* () {
        const memoryData = store_1.DataStore.getAllRouteOptimizations();
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
    }),
    getRouteOptimizationByShipmentId: (shipmentId) => __awaiter(void 0, void 0, void 0, function* () {
        if ((0, database_1.isSupabaseConfigured)()) {
            return supabaseStore_1.SupabaseStore.getRouteOptimizationByShipmentId(shipmentId);
        }
        return store_1.DataStore.getRouteOptimizationByShipmentId(shipmentId);
    }),
    addRouteOptimization: (optimization) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`DEBUG addRouteOptimization: supabaseWorking=${supabaseWorking}`);
        if (supabaseWorking) {
            try {
                const result = yield supabaseStore_1.SupabaseStore.addRouteOptimization(optimization);
                console.log(`DEBUG addRouteOptimization: supabase result=${result ? 'success' : 'null'}`);
                if (result)
                    return result;
            }
            catch (error) {
                console.warn('Supabase addRouteOptimization failed:', error);
            }
        }
        console.log('Using memory store for addRouteOptimization');
        return store_1.DataStore.addRouteOptimization(optimization);
    }),
    applyRoute: (shipmentId) => __awaiter(void 0, void 0, void 0, function* () {
        // Try memory store first (where routes are actually stored)
        const memoryResult = store_1.DataStore.applyRoute(shipmentId);
        if (memoryResult) {
            console.log('Route applied from memory store:', shipmentId);
            return true;
        }
        // Fallback to Supabase if not in memory
        if ((0, database_1.isSupabaseConfigured)()) {
            try {
                const supabaseResult = yield supabaseStore_1.SupabaseStore.applyRoute(shipmentId);
                if (supabaseResult)
                    return supabaseResult;
            }
            catch (error) {
                console.warn('Supabase applyRoute failed:', error);
            }
        }
        return false;
    }),
    // Alerts
    getAllAlerts: () => __awaiter(void 0, void 0, void 0, function* () {
        const memoryData = store_1.DataStore.getAllAlerts();
        if (supabaseWorking) {
            try {
                const supabaseData = yield supabaseStore_1.SupabaseStore.getAllAlerts();
                // Merge both sources
                const merged = [...supabaseData];
                memoryData.forEach(memItem => {
                    if (!merged.find(s => s.id === memItem.id)) {
                        merged.push(memItem);
                    }
                });
                return merged;
            }
            catch (error) {
                console.warn('Supabase getAllAlerts failed:', error);
            }
        }
        return memoryData;
    }),
    getUnreadAlerts: () => __awaiter(void 0, void 0, void 0, function* () {
        if (supabaseWorking) {
            try {
                const supabaseData = yield supabaseStore_1.SupabaseStore.getUnreadAlerts();
                if (supabaseData.length > 0)
                    return supabaseData;
            }
            catch (error) {
                console.warn('Supabase getUnreadAlerts failed:', error);
            }
        }
        return store_1.DataStore.getUnreadAlerts();
    }),
    addAlert: (alert) => __awaiter(void 0, void 0, void 0, function* () {
        if (supabaseWorking) {
            try {
                const result = yield supabaseStore_1.SupabaseStore.addAlert(alert);
                if (result)
                    return result;
            }
            catch (error) {
                console.warn('Supabase addAlert failed:', error);
            }
        }
        return store_1.DataStore.addAlert(alert);
    }),
    dismissAlert: (id) => __awaiter(void 0, void 0, void 0, function* () {
        if ((0, database_1.isSupabaseConfigured)()) {
            return supabaseStore_1.SupabaseStore.dismissAlert(id);
        }
        return store_1.DataStore.dismissAlert(id);
    }),
    markAlertAsRead: (id) => __awaiter(void 0, void 0, void 0, function* () {
        if ((0, database_1.isSupabaseConfigured)()) {
            return supabaseStore_1.SupabaseStore.markAlertAsRead(id);
        }
        return store_1.DataStore.markAlertAsRead(id);
    }),
    // Analytics
    getAnalytics: () => __awaiter(void 0, void 0, void 0, function* () {
        if ((0, database_1.isSupabaseConfigured)()) {
            return supabaseStore_1.SupabaseStore.getAnalytics();
        }
        return store_1.DataStore.getAnalytics();
    }),
    updateStats: (newStats) => {
        // Only available in memory store
        store_1.DataStore.updateStats(newStats);
    },
};
exports.default = exports.DataStore;
