import { motion } from 'motion/react';
import { Navigation, Clock, TrendingUp, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

interface Route {
  routeName: string;
  distance: string;
  estimatedTime: string;
  savings: string;
  trafficLevel: 'low' | 'medium' | 'high';
  recommended: boolean;
}

interface RouteOptimizationCardProps {
  shipmentId: string;
  currentRoute: Route;
  suggestedRoute: Route;
  onApplyRoute: (shipmentId: string) => void;
  applied?: boolean;
}

export function RouteOptimizationCard({
  shipmentId,
  currentRoute,
  suggestedRoute,
  onApplyRoute,
  applied = false,
}: RouteOptimizationCardProps) {
  const getTrafficColor = (level: Route['trafficLevel']) => {
    switch (level) {
      case 'low':
        return 'text-emerald-600 bg-emerald-100';
      case 'medium':
        return 'text-amber-600 bg-amber-100';
      case 'high':
        return 'text-red-600 bg-red-100';
    }
  };

  const RouteCard = ({ route, type }: { route: Route; type: 'current' | 'suggested' }) => (
    <div
      className={`p-4 rounded-lg border-2 ${
        type === 'suggested'
          ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            type === 'suggested' ? 'bg-emerald-500' : 'bg-gray-400'
          }`}>
            <Navigation className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-sm">{route.routeName}</div>
            {type === 'suggested' && (
              <div className="flex items-center gap-1 text-emerald-700 text-xs font-medium">
                <Zap className="w-3 h-3" />
                Recommended
              </div>
            )}
          </div>
        </div>

        <div className={`px-2 py-1 rounded-md text-xs font-medium ${getTrafficColor(route.trafficLevel)}`}>
          {route.trafficLevel.toUpperCase()}
        </div>
      </div>

      {/* Route Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Distance</span>
          <span className="font-medium">{route.distance}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Est. Time</span>
          <span className="font-medium">{route.estimatedTime}</span>
        </div>
        {type === 'suggested' && route.savings !== '0 min' && (
          <div className="flex items-center justify-between text-sm pt-2 border-t border-emerald-200">
            <span className="text-emerald-700 font-medium">Time Saved</span>
            <span className="text-emerald-700 font-bold text-base">{route.savings}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-medium">Shipment #{shipmentId}</h3>
          <p className="text-sm text-muted-foreground">Route Optimization Available</p>
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          Better Route Found
        </div>
      </div>

      {/* Routes Comparison */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-6">
        <RouteCard route={currentRoute} type="current" />

        <div className="flex items-center justify-center">
          <ArrowRight className="w-6 h-6 text-gray-400" />
        </div>

        <RouteCard route={suggestedRoute} type="suggested" />
      </div>

      {/* Savings Highlight */}
      <motion.div
        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90">Potential Time Savings</div>
            <div className="text-2xl font-bold">{suggestedRoute.savings}</div>
          </div>
          <Clock className="w-10 h-10 opacity-80" />
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Compare Details
        </button>
        {applied ? (
          <div className="px-4 py-2.5 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed">
            <CheckCircle2 className="w-4 h-4" />
            Route Applied
          </div>
        ) : (
          <motion.button
            onClick={() => onApplyRoute(shipmentId)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CheckCircle2 className="w-4 h-4" />
            Apply Route
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
