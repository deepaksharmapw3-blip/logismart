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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">
                  SupplySense AI
                </h1>
                <p className="text-sm text-muted-foreground">
                  Predictive Supply Chain Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-medium">
                  All Systems Operational
                </span>
              </div>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {alerts.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
      <div className="bg-white border-b border-border">
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
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {activeTab === "overview" && (
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
          </div>
        )}

        {activeTab === "predictions" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-medium">
                  Delay Predictions
                </h2>
                <p className="text-sm text-muted-foreground">
                  AI-powered predictions based on real-time data
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {delayPredictions.length} Shipments at Risk
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {delayPredictions.map((prediction) => (
                <DelayPredictionCard
                  key={prediction.shipmentId}
                  prediction={prediction}
                  onViewDetails={handleShipmentClick}
                />
              ))}
            </div>
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