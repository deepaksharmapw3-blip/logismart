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
      <header className="glass-card sticky top-0 z-40 border-b border-border/50">
        <div className="max-w-[1600px] mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-105">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl blur-lg opacity-40 -z-10 transition-opacity group-hover:opacity-60"></div>
              </div>
              <div>
                <h1 className="font-semibold text-xl tracking-tight text-foreground">
                  LogiSmart
                </h1>
                <p className="text-sm text-muted-foreground tracking-wide">
                  Predictive Supply Chain Intelligence
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-teal-500/8 text-teal-700 dark:text-teal-400 rounded-xl border border-teal-500/15">
                <div className="relative flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  <div className="absolute w-2 h-2 rounded-full bg-teal-500 animate-ping opacity-75"></div>
                </div>
                <span className="text-sm font-medium">
                  All Systems Operational
                </span>
              </div>
              <motion.button 
                className="relative p-3 glass-card rounded-xl hover:shadow-glow transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                {alerts.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background"></span>
                )}
              </motion.button>
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
      <nav className="glass border-b border-border/30">
        <div className="max-w-[1600px] mx-auto px-8">
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
            ].map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center gap-2.5 px-5 py-4 transition-all duration-200 rounded-t-xl ${
                    isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground/80"
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-primary' : ''}`} />
                  <span className="text-sm">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-8 py-10">
        {activeTab === "overview" && (
          <motion.div 
            className="grid grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Left Column - Shipment List */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-lg text-foreground">
                  Active Shipments
                </h2>
                <span className="text-xs text-muted-foreground px-3 py-1.5 glass rounded-full font-medium">
                  {shipments.length} total
                </span>
              </div>
              <ShipmentList
                shipments={shipments}
                onSelectShipment={handleShipmentClick}
              />
            </div>

            {/* Middle & Right Columns - Map */}
            <div className="col-span-2 space-y-5">
              <h2 className="font-medium text-lg text-foreground">
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-medium text-xl text-foreground">
                  Delay Predictions
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                  AI-powered predictions based on real-time data
                </p>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-amber-500/8 text-amber-700 dark:text-amber-400 rounded-xl border border-amber-500/15">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {delayPredictions.length} Shipments at Risk
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {delayPredictions.map((prediction, index) => (
                <motion.div
                  key={prediction.shipmentId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-medium text-xl text-foreground">
                  Smart Route Optimization
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Dynamic route suggestions to minimize delays
                </p>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-teal-500/8 text-teal-700 dark:text-teal-400 rounded-xl border border-teal-500/15 shadow-glow-success">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Avg 22 min savings per route
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {routeOptimizations.map((optimization, index) => (
                <motion.div
                  key={optimization.shipmentId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-10">
              <h2 className="font-medium text-xl text-foreground">
                Performance Analytics
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
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
