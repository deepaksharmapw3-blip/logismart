import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { GoogleMap } from "./components/GoogleMap";
import { DelayPredictionCard } from "./components/DelayPredictionCard";
import { RouteOptimizationCard } from "./components/RouteOptimizationCard";
import { AlertNotifications } from "./components/AlertNotifications";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { ShipmentList } from "./components/ShipmentList";
import { AddShipmentForm } from "./components/AddShipmentForm";
import { ShipmentDetail } from "./components/ShipmentDetail";
import AIConsultant from "./components/AIConsultant";
import { api, type Shipment, type DelayPrediction, type RouteOptimization, type Alert } from "./services/api";
import {
  Package,
  TrendingUp,
  Map,
  BarChart3,
  AlertTriangle,
  Bell,
  Zap,
  Loader2,
  Brain,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "predictions" | "routes" | "analytics" | "ai-consultant"
  >("overview");

  // Data states
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [delayPredictions, setDelayPredictions] = useState<DelayPrediction[]>([]);
  const [routeOptimizations, setRouteOptimizations] = useState<RouteOptimization[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Selected shipment for detail view
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);

  // Track applied routes
  const [appliedRoutes, setAppliedRoutes] = useState<Set<string>>(new Set());

  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [shipmentsData, predictionsData, routesData, alertsData] = await Promise.all([
        api.getShipments(),
        api.getPredictions(),
        api.getRouteOptimizations(),
        api.getAlerts(),
      ]);

      setShipments(shipmentsData);
      setDelayPredictions(predictionsData);
      setRouteOptimizations(routesData);
      setAlerts(alertsData);

      console.log('Data refreshed:', {
        shipments: shipmentsData.length,
        predictions: predictionsData.length,
        routes: routesData.length,
        alerts: alertsData.length
      });

      // Log prediction and route shipment IDs for debugging
      if (predictionsData.length > 0) {
        console.log('Prediction shipment IDs:', predictionsData.map(p => p.shipmentId));
      }
      if (routesData.length > 0) {
        console.log('Route optimization shipment IDs:', routesData.map(r => r.shipmentId));
      }
      if (shipmentsData.length > 0) {
        console.log('Shipment IDs:', shipmentsData.map(s => s.id));
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Refresh data when switching to predictions or routes tabs
  useEffect(() => {
    if (activeTab === 'predictions' || activeTab === 'routes') {
      console.log('Tab changed to:', activeTab, '- refreshing data...');
      fetchData();
    }
  }, [activeTab]);

  const dismissAlert = async (id: string) => {
    try {
      await api.dismissAlert(id);
      setAlerts(alerts.filter((alert) => alert.id !== id));
    } catch (err) {
      console.error("Error dismissing alert:", err);
    }
  };

  const handleShipmentClick = (id: string) => {
    setSelectedShipmentId(id);
  };

  const handleApplyRoute = async (shipmentId: string) => {
    try {
      await api.applyRoute(shipmentId);
      // Refresh ALL data after applying route to show updated shipment status
      const [updatedShipments, updatedAlerts, updatedRoutes] = await Promise.all([
        api.getShipments(),
        api.getAlerts(),
        api.getRouteOptimizations(),
      ]);
      setShipments(updatedShipments);
      setAlerts(updatedAlerts);
      setRouteOptimizations(updatedRoutes);
      setAppliedRoutes(prev => new Set(prev).add(shipmentId));

      // Show success notification
      const route = routeOptimizations.find(r => r.shipmentId === shipmentId);
      const savings = route?.suggestedRoute.savings || 'N/A';
      alert(`Route optimized successfully for shipment #${shipmentId}!\nTime saved: ${savings}\nShipment status updated to: On Time`);
    } catch (err) {
      console.error("Error applying route:", err);
      alert("Failed to apply route. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-700 font-semibold mb-2">Error Loading Data</h2>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Make sure the backend server is running on https://logismart-5.onrender.com
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg"></div>
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      {/* Header */}
      <header className="glass-card border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center glow-primary">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gradient">
                  SupplySense AI
                </h1>
                <p className="text-sm text-white/60">
                  Predictive Supply Chain Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('ai-consultant')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full hover:bg-indigo-500/30 transition-all"
              >
                <Brain className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-indigo-300">AI Insights</span>
              </button>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full glow-success">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-300">
                  All Systems Operational
                </span>
              </div>
              <button className="relative p-2 hover:bg-white/10 rounded-xl transition-all duration-300">
                <Bell className="w-5 h-5 text-white/80" />
                {alerts.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Alert Notifications */}
      <AlertNotifications
        alerts={alerts}
        onDismiss={dismissAlert}
      />

      {/* Navigation Tabs */}
      <div className="glass-card border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex gap-2">
            {[
              {
                id: "overview",
                label: "Overview",
                icon: Package,
              },
              {
                id: "predictions",
                label: "Delay Predictions",
                icon: TrendingUp,
              },
              {
                id: "routes",
                label: "Route Optimization",
                icon: Map,
              },
              {
                id: "analytics",
                label: "Analytics",
                icon: BarChart3,
              },
              {
                id: "ai-consultant",
                label: "AI Consultant",
                icon: Brain,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all duration-300 ${isActive
                      ? "bg-white/10 text-white border-t border-x border-white/20 shadow-lg"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : ''}`} />
                  <span className={isActive ? 'font-medium' : ''}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Shipment Detail Modal */}
      {selectedShipmentId && (
        <ShipmentDetail
          shipmentId={selectedShipmentId}
          onClose={() => setSelectedShipmentId(null)}
        />
      )}

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6 relative z-10">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Add Shipment Form */}
            <AddShipmentForm onShipmentAdded={fetchData} />

            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Shipment List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium">
                    Active Shipments
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {shipments.length} total
                  </span>
                </div>
                <ShipmentList
                  shipments={shipments}
                  onSelectShipment={handleShipmentClick}
                />
              </div>

              {/* Middle & Right Columns - Map */}
              <div className="col-span-2">
                <h2 className="font-medium mb-4">
                  Real-Time Tracking
                </h2>
                <div className="h-[700px]">
                  <GoogleMap
                    shipments={shipments.map((s) => ({
                      id: s.id,
                      status: s.status,
                      location: s.location,
                      destination: s.destination_coords,
                    }))}
                    onShipmentClick={handleShipmentClick}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "predictions" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-medium text-white">
                  Delay Predictions
                </h2>
                <p className="text-sm text-white/60">
                  AI-powered predictions based on real-time data
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchData}
                  className="px-4 py-2 glass-card rounded-lg text-sm text-white hover:bg-white/10 transition-colors"
                >
                  Refresh
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full glow-warning">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-amber-300">
                    {delayPredictions.length} Shipments at Risk
                  </span>
                </div>
              </div>
            </div>

            {delayPredictions.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center">
                <TrendingUp className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">All Clear!</h3>
                <p className="text-white/60">No delay predictions at the moment. All shipments are on track.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {delayPredictions.map((prediction, index) => (
                  <motion.div
                    key={prediction.shipmentId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <DelayPredictionCard
                      prediction={prediction}
                      onViewDetails={handleShipmentClick}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "routes" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-medium">
                  Smart Route Optimization
                </h2>
                <p className="text-sm text-muted-foreground">
                  Dynamic route suggestions to minimize delays
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Avg 22 min savings per route
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {routeOptimizations.map((optimization) => (
                <RouteOptimizationCard
                  key={optimization.shipmentId}
                  {...optimization}
                  onApplyRoute={handleApplyRoute}
                  applied={appliedRoutes.has(optimization.shipmentId)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <div className="mb-6">
              <h2 className="font-medium">
                Performance Analytics
              </h2>
              <p className="text-sm text-muted-foreground">
                Insights and trends across your supply chain
              </p>
            </div>
            <AnalyticsDashboard />
          </div>
        )}
      </main>
    </div>
  );
}