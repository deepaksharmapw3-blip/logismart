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
exports.SupabaseStore = void 0;
const database_1 = require("../config/database");
const uuid_1 = require("uuid");
// Helper to safely get supabase client
const getSupabase = () => {
    if (!(0, database_1.isSupabaseConfigured)() || !database_1.supabase) {
        return null;
    }
    return database_1.supabase;
};
// Helper to convert DB shipment to app shipment
const dbToShipment = (db) => ({
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
const shipmentToDb = (s) => (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (s.id && { id: s.id })), (s.origin && { origin: s.origin })), (s.destination && { destination: s.destination })), (s.status && { status: s.status })), (s.eta && { eta: s.eta })), (s.currentLocation && { current_location: s.currentLocation })), (s.delayProbability !== undefined && { delay_probability: s.delayProbability })), (s.location && { location_lat: s.location.lat, location_lng: s.location.lng })), (s.destination_coords && { destination_lat: s.destination_coords.lat, destination_lng: s.destination_coords.lng })));
// Helper to convert DB prediction to app prediction
const dbToPrediction = (db) => ({
    shipmentId: db.shipment_id,
    delayProbability: db.delay_probability,
    estimatedDelay: db.estimated_delay,
    reasons: db.reasons || [],
    riskLevel: db.risk_level,
    currentLocation: db.current_location,
    predictedAt: new Date(db.predicted_at),
});
// Helper to convert DB route optimization to app format
const dbToRouteOptimization = (db) => ({
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
const dbToAlert = (db) => ({
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
exports.SupabaseStore = {
    // Shipments
    getAllShipments: () => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return [];
        const { data, error } = yield client
            .from('shipments')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching shipments:', error);
            return [];
        }
        return (data || []).map(dbToShipment);
    }),
    getShipmentById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return undefined;
        const { data, error } = yield client
            .from('shipments')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data)
            return undefined;
        return dbToShipment(data);
    }),
    addShipment: (shipment) => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return null;
        const dbShipment = {
            id: shipment.id || (0, uuid_1.v4)(),
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
        const { data, error } = yield client
            .from('shipments')
            .insert(dbShipment)
            .select()
            .single();
        if (error || !data) {
            console.error('Error creating shipment:', error);
            return null;
        }
        return dbToShipment(data);
    }),
    updateShipment: (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return undefined;
        const dbUpdates = shipmentToDb(updates);
        const { data, error } = yield client
            .from('shipments')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();
        if (error || !data)
            return undefined;
        return dbToShipment(data);
    }),
    deleteShipment: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return false;
        const { error } = yield client
            .from('shipments')
            .delete()
            .eq('id', id);
        return !error;
    }),
    // Delay Predictions
    getAllPredictions: () => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return [];
        const { data, error } = yield client
            .from('delay_predictions')
            .select('*')
            .order('predicted_at', { ascending: false });
        if (error) {
            console.error('Error fetching predictions:', error);
            return [];
        }
        return (data || []).map(dbToPrediction);
    }),
    getPredictionByShipmentId: (shipmentId) => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return undefined;
        const { data, error } = yield client
            .from('delay_predictions')
            .select('*')
            .eq('shipment_id', shipmentId)
            .single();
        if (error || !data)
            return undefined;
        return dbToPrediction(data);
    }),
    getHighRiskPredictions: () => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return [];
        const { data, error } = yield client
            .from('delay_predictions')
            .select('*')
            .eq('risk_level', 'high');
        if (error) {
            console.error('Error fetching high-risk predictions:', error);
            return [];
        }
        return (data || []).map(dbToPrediction);
    }),
    addPrediction: (prediction) => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return null;
        const dbPrediction = {
            id: `pred-${(0, uuid_1.v4)()}`,
            shipment_id: prediction.shipmentId,
            delay_probability: prediction.delayProbability,
            estimated_delay: prediction.estimatedDelay,
            reasons: prediction.reasons,
            risk_level: prediction.riskLevel,
            current_location: prediction.currentLocation,
            predicted_at: new Date().toISOString(),
        };
        const { data, error } = yield client
            .from('delay_predictions')
            .insert(dbPrediction)
            .select()
            .single();
        if (error) {
            console.error('Error creating prediction:', error);
            return null;
        }
        return dbToPrediction(data);
    }),
    // Route Optimizations
    getAllRouteOptimizations: () => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return [];
        const { data, error } = yield client
            .from('route_optimizations')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching route optimizations:', error);
            return [];
        }
        return (data || []).map(dbToRouteOptimization);
    }),
    getRouteOptimizationByShipmentId: (shipmentId) => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return undefined;
        const { data, error } = yield client
            .from('route_optimizations')
            .select('*')
            .eq('shipment_id', shipmentId)
            .single();
        if (error || !data)
            return undefined;
        return dbToRouteOptimization(data);
    }),
    addRouteOptimization: (optimization) => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return null;
        const dbRouteOpt = {
            id: `route-${(0, uuid_1.v4)()}`,
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
        const { data, error } = yield client
            .from('route_optimizations')
            .insert(dbRouteOpt)
            .select()
            .single();
        if (error) {
            console.error('Error creating route optimization:', error);
            return null;
        }
        return dbToRouteOptimization(data);
    }),
    applyRoute: (shipmentId) => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return false;
        // Check if optimization exists
        const { data: optimization } = yield client
            .from('route_optimizations')
            .select('*')
            .eq('shipment_id', shipmentId)
            .single();
        if (!optimization)
            return false;
        // Create success alert
        yield exports.SupabaseStore.addAlert({
            type: 'success',
            title: 'Route Applied',
            message: `Optimized route applied for shipment #${shipmentId}`,
            shipmentId,
            priority: 'low',
        });
        return true;
    }),
    // Alerts
    getAllAlerts: () => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return [];
        const { data, error } = yield client
            .from('alerts')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching alerts:', error);
            return [];
        }
        return (data || []).map(dbToAlert);
    }),
    getUnreadAlerts: () => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return [];
        const { data, error } = yield client
            .from('alerts')
            .select('*')
            .eq('read', false)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching unread alerts:', error);
            return [];
        }
        return (data || []).map(dbToAlert);
    }),
    addAlert: (alert) => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return null;
        const dbAlert = {
            id: `alert-${(0, uuid_1.v4)()}`,
            type: alert.type,
            title: alert.title,
            message: alert.message,
            shipment_id: alert.shipmentId,
            timestamp: 'Just now',
            priority: alert.priority,
            read: false,
        };
        const { data, error } = yield client
            .from('alerts')
            .insert(dbAlert)
            .select()
            .single();
        if (error || !data) {
            console.error('Error creating alert:', error);
            return null;
        }
        return dbToAlert(data);
    }),
    dismissAlert: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return false;
        const { error } = yield client
            .from('alerts')
            .delete()
            .eq('id', id);
        return !error;
    }),
    markAlertAsRead: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const client = getSupabase();
        if (!client)
            return false;
        const { error } = yield client
            .from('alerts')
            .update({ read: true })
            .eq('id', id);
        return !error;
    }),
    // Analytics
    getAnalytics: () => __awaiter(void 0, void 0, void 0, function* () {
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
        const [{ data: trends }, { data: reasons }, { data: performance }, { data: bottlenecks }, { data: stats },] = yield Promise.all([
            client.from('delivery_trends').select('*').order('day'),
            client.from('delay_reasons').select('*'),
            client.from('route_performance').select('*'),
            client.from('bottlenecks').select('*').order('delay', { ascending: false }),
            client.from('stats').select('*'),
        ]);
        return {
            deliveryTrends: (trends || []).map((t) => ({
                day: t.day,
                onTime: t.on_time,
                delayed: t.delayed,
                atRisk: t.at_risk,
            })),
            delayReasons: (reasons || []).map((r) => ({
                name: r.name,
                value: r.value,
                color: r.color,
            })),
            routePerformance: (performance || []).map((p) => ({
                route: p.route,
                avgDelay: p.avg_delay,
            })),
            bottlenecks: (bottlenecks || []).map((b) => ({
                location: b.location,
                delay: b.delay,
                severity: b.severity,
            })),
            stats: (stats || []).map((s) => ({
                label: s.label,
                value: s.value,
                change: s.change,
                trend: s.trend,
            })),
        };
    }),
};
exports.default = exports.SupabaseStore;
