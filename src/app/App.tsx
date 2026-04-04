import { useState, useEffect } from "react";
import { ShipmentMap } from "./components/ShipmentMap";
import { DelayPredictionCard } from "./components/DelayPredictionCard";
import { RouteOptimizationCard } from "./components/RouteOptimizationCard";
import { AlertNotifications } from "./components/AlertNotifications";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { ShipmentList } from "./components/ShipmentList";
import {
  Package,
  TrendingUp,
  Map,
  BarChart3,
  AlertTriangle,
  Bell,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "predictions" | "routes" | "analytics"
  >("overview");
  const [alerts, setAlerts] = useState([
    {
      id: "alert-1",
      type: "delay" as const,
      title: "Delay Detected",
      message:
        "Heavy traffic on Route A causing 25-minute delay",
      shipmentId: "SH2547",
      timestamp: "2 mins ago",
      priority: "high" as const,
    },
    {
      id: "alert-2",
      type: "route-change" as const,
      title: "Route Optimization Available",
      message: "Alternate route can save 18 minutes",
      shipmentId: "SH2548",
      timestamp: "5 mins ago",
      priority: "medium" as const,
    },
  ]);

  const shipments = [
    {
      id: "SH2547",
      origin: "Los Angeles, CA",
      destination: "San Francisco, CA",
      status: "delayed" as const,
      eta: "4:30 PM",
      currentLocation: "Bakersfield, CA",
      delayProbability: 85,
      location: { lat: 45, lng: 35 },
      destination_coords: { lat: 20, lng: 70 },
    },
    {
      id: "SH2548",
      origin: "Seattle, WA",
      destination: "Portland, OR",
      status: "at-risk" as const,
      eta: "2:15 PM",
      currentLocation: "Tacoma, WA",
      delayProbability: 68,
      location: { lat: 25, lng: 55 },
      destination_coords: { lat: 30, lng: 80 },
    },
    {
      id: "SH2549",
      origin: "Phoenix, AZ",
      destination: "Las Vegas, NV",
      status: "on-time" as const,
      eta: "3:45 PM",
      currentLocation: "Kingman, AZ",
      delayProbability: 22,
      location: { lat: 60, lng: 40 },
      destination_coords: { lat: 65, lng: 25 },
    },
    {
      id: "SH2550",
      origin: "Denver, CO",
      destination: "Salt Lake City, UT",
      status: "on-time" as const,
      eta: "5:00 PM",
      currentLocation: "Vail, CO",
      delayProbability: 15,
      location: { lat: 35, lng: 65 },
      destination_coords: { lat: 50, lng: 85 },
    },
    {
      id: "SH2551",
      origin: "Austin, TX",
      destination: "Houston, TX",
      status: "at-risk" as const,
      eta: "6:20 PM",
      currentLocation: "Columbus, TX",
      delayProbability: 72,
      location: { lat: 70, lng: 50 },
      destination_coords: { lat: 75, lng: 75 },
    },
  ];

  const delayPredictions = [
    {
      shipmentId: "SH2547",
      delayProbability: 85,
      estimatedDelay: "25-30 mins",
      reasons: [
        "Heavy Traffic",
        "Road Construction",
        "Peak Hour",
      ],
      riskLevel: "high" as const,
      currentLocation: "Bakersfield, CA",
    },
    {
      shipmentId: "SH2548",
      delayProbability: 68,
      estimatedDelay: "15-20 mins",
      reasons: ["Weather Conditions", "Traffic"],
      riskLevel: "medium" as const,
      currentLocation: "Tacoma, WA",
    },
    {
      shipmentId: "SH2551",
      delayProbability: 72,
      estimatedDelay: "18-22 mins",
      reasons: ["Warehouse Delay", "Traffic Congestion"],
      riskLevel: "high" as const,
      currentLocation: "Columbus, TX",
    },
  ];

  const routeOptimizations = [
    {
      shipmentId: "SH2547",
      currentRoute: {
        routeName: "Route A (I-5)",
        distance: "285 miles",
        estimatedTime: "4h 45m",
        savings: "0 min",
        trafficLevel: "high" as const,
        recommended: false,
      },
      suggestedRoute: {
        routeName: "Route B (CA-99)",
        distance: "295 miles",
        estimatedTime: "4h 20m",
        savings: "25 min",
        trafficLevel: "low" as const,
        recommended: true,
      },
    },
    {
      shipmentId: "SH2548",
      currentRoute: {
        routeName: "Route C (I-405)",
        distance: "175 miles",
        estimatedTime: "3h 10m",
        savings: "0 min",
        trafficLevel: "medium" as const,
        recommended: false,
      },
      suggestedRoute: {
        routeName: "Route D (WA-167)",
        distance: "182 miles",
        estimatedTime: "2h 52m",
        savings: "18 min",
        trafficLevel: "low" as const,
        recommended: true,
      },
    },
  ];

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const handleShipmentClick = (id: string) => {
    console.log("Shipment clicked:", id);
  };

  const handleApplyRoute = (shipmentId: string) => {
    setAlerts([
      ...alerts,
      {
        id: `alert-${Date.now()}`,
        type: "route-change",
        title: "Route Applied",
        message: `Optimized route applied for shipment #${shipmentId}`,
        shipmentId,
        timestamp: "Just now",
        priority: "low",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card sticky top-0 z-40 border-b border-border">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-glow">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl blur opacity-30 -z-10"></div>
              </div>
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  LogiSmart
                </h1>
                <p className="text-sm text-muted-foreground">
                  Predictive Supply Chain Intelligence
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                <span className="text-sm font-medium">
                  All Systems Operational
                </span>
              </div>
              <button className="relative p-2.5 glass-card rounded-xl hover:shadow-glow transition-all duration-300 group">
                <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                {alerts.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Alert Notifications */}
      <AlertNotifications
        alerts={alerts}
        onDismiss={dismissAlert}
      />

      {/* Navigation Tabs */}
      <div className="glass border-b border-border/50">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex gap-1">
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
            ].map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center gap-2 px-5 py-3.5 transition-all duration-300 ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <motion.div 
            className="grid grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Left Column - Shipment List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Active Shipments
                </h2>
                <span className="text-sm text-muted-foreground px-3 py-1 glass-card rounded-lg">
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
              <h2 className="font-semibold text-lg mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Real-Time Tracking
              </h2>
              <div className="h-[700px]">
                <ShipmentMap
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
          </motion.div>
        )}

        {activeTab === "predictions" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-semibold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Delay Predictions
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  AI-powered predictions based on real-time data
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-500/20">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {delayPredictions.length} Shipments at Risk
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
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
          </motion.div>
        )}

        {activeTab === "routes" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-semibold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Smart Route Optimization
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Dynamic route suggestions to minimize delays
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20 shadow-glow-success">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  Avg 22 min savings per route
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {routeOptimizations.map((optimization, index) => (
                <motion.div
                  key={optimization.shipmentId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                >
                  <RouteOptimizationCard
                    {...optimization}
                    onApplyRoute={handleApplyRoute}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <h2 className="font-semibold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Performance Analytics
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Insights and trends across your supply chain
              </p>
            </div>
            <AnalyticsDashboard />
          </motion.div>
        )}
      </main>
    </div>
  );
}
