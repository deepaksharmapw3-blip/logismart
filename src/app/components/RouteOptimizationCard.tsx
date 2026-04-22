import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation, Clock, TrendingUp, ArrowRight, CheckCircle2, Zap, X, MapPin, Fuel, AlertCircle } from 'lucide-react';

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
  const [showComparison, setShowComparison] = useState(false);
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
        <motion.button 
          onClick={() => setShowComparison(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowRight className="w-4 h-4" />
          Compare Routes
        </motion.button>
        {applied ? (
          <div className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed">
            <CheckCircle2 className="w-4 h-4" />
            Route Applied
          </div>
        ) : (
          <motion.button
            onClick={() => onApplyRoute(shipmentId)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CheckCircle2 className="w-4 h-4" />
            Apply Route
          </motion.button>
        )}
      </div>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowComparison(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Route Detailed Comparison</h2>
                  <p className="text-slate-400 text-sm">Shipment #{shipmentId}</p>
                </div>
                <button
                  onClick={() => setShowComparison(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Comparison Table */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    Route Metrics
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Metric Header */}
                    <div className="col-span-3 grid grid-cols-3 gap-4 mb-2 pb-2 border-b border-slate-700">
                      <div className="text-slate-400 text-xs font-semibold uppercase">Metric</div>
                      <div className="text-slate-400 text-xs font-semibold uppercase flex items-center gap-2">
                        <Navigation className="w-3 h-3" />
                        Current Route
                      </div>
                      <div className="text-slate-400 text-xs font-semibold uppercase flex items-center gap-2">
                        <Zap className="w-3 h-3 text-emerald-400" />
                        Suggested Route
                      </div>
                    </div>

                    {/* Distance */}
                    <div className="col-span-3 grid grid-cols-3 gap-4 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                      <div className="text-slate-300 font-medium">Distance</div>
                      <div className="text-white flex items-center gap-2">
                        {currentRoute.distance}
                      </div>
                      <div className="text-emerald-400 font-semibold flex items-center gap-2">
                        {suggestedRoute.distance}
                        <span className="text-xs text-emerald-300">↓ Shorter</span>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="col-span-3 grid grid-cols-3 gap-4 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                      <div className="text-slate-300 font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Est. Time
                      </div>
                      <div className="text-white">{currentRoute.estimatedTime}</div>
                      <div className="text-emerald-400 font-semibold">{suggestedRoute.estimatedTime}</div>
                    </div>

                    {/* Traffic Level */}
                    <div className="col-span-3 grid grid-cols-3 gap-4 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                      <div className="text-slate-300 font-medium">Traffic Level</div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          currentRoute.trafficLevel === 'low' ? 'bg-emerald-500/30 text-emerald-300' :
                          currentRoute.trafficLevel === 'medium' ? 'bg-amber-500/30 text-amber-300' :
                          'bg-red-500/30 text-red-300'
                        }`}>
                          {currentRoute.trafficLevel.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          suggestedRoute.trafficLevel === 'low' ? 'bg-emerald-500/30 text-emerald-300' :
                          suggestedRoute.trafficLevel === 'medium' ? 'bg-amber-500/30 text-amber-300' :
                          'bg-red-500/30 text-red-300'
                        }`}>
                          {suggestedRoute.trafficLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Time Savings */}
                    <div className="col-span-3 grid grid-cols-3 gap-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500/30 transition-colors">
                      <div className="text-emerald-300 font-bold flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Time Savings
                      </div>
                      <div className="text-slate-400">-</div>
                      <div className="text-emerald-400 font-bold text-lg">{suggestedRoute.savings}</div>
                    </div>
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    Benefits of Suggested Route
                  </h3>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-white font-medium">Faster Delivery</div>
                        <div className="text-slate-400 text-sm mt-1">Save {suggestedRoute.savings} by taking the recommended route</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-white font-medium">Better Traffic Conditions</div>
                        <div className="text-slate-400 text-sm mt-1">Lower traffic level: {suggestedRoute.trafficLevel} vs {currentRoute.trafficLevel}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-white font-medium">Optimized Distance</div>
                        <div className="text-slate-400 text-sm mt-1">Shorter route: {suggestedRoute.distance} vs {currentRoute.distance}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => setShowComparison(false)}
                    className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Close
                  </button>
                  {!applied && (
                    <motion.button
                      onClick={() => {
                        onApplyRoute(shipmentId);
                        setShowComparison(false);
                      }}
                      className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Apply This Route
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
