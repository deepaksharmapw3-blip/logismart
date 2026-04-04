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
}

export function RouteOptimizationCard({
  shipmentId,
  currentRoute,
  suggestedRoute,
  onApplyRoute,
}: RouteOptimizationCardProps) {
  const getTrafficColor = (level: Route['trafficLevel']) => {
    switch (level) {
      case 'low':
        return 'text-emerald-600 dark:text-emerald-400 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20';
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20';
    }
  };

  const RouteCard = ({ route, type }: { route: Route; type: 'current' | 'suggested' }) => (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 ${
        type === 'suggested'
          ? 'glass-card border-emerald-500/30 shadow-glow-success bg-gradient-to-br from-emerald-500/5 to-teal-500/5'
          : 'glass-card border-border/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            type === 'suggested' 
              ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
              : 'bg-muted'
          }`}>
            <Navigation className={`w-5 h-5 ${type === 'suggested' ? 'text-white' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <div className="font-semibold text-sm text-foreground">{route.routeName}</div>
            {type === 'suggested' && (
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <Zap className="w-3 h-3" />
                Recommended
              </div>
            )}
          </div>
        </div>

        <div className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${getTrafficColor(route.trafficLevel)}`}>
          {route.trafficLevel.toUpperCase()}
        </div>
      </div>

      {/* Route Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Distance</span>
          <span className="font-semibold text-foreground">{route.distance}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Est. Time</span>
          <span className="font-semibold text-foreground">{route.estimatedTime}</span>
        </div>
        {type === 'suggested' && route.savings !== '0 min' && (
          <div className="flex items-center justify-between text-sm pt-3 border-t border-emerald-500/20">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Time Saved</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">{route.savings}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-300"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg text-foreground">Shipment #{shipmentId}</h3>
          <p className="text-sm text-muted-foreground">Route Optimization Available</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-semibold border border-indigo-500/20">
          <TrendingUp className="w-4 h-4" />
          Better Route Found
        </div>
      </div>

      {/* Routes Comparison */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-6">
        <RouteCard route={currentRoute} type="current" />

        <div className="flex items-center justify-center">
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </div>

        <RouteCard route={suggestedRoute} type="suggested" />
      </div>

      {/* Savings Highlight */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl p-5 mb-5 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_50%)]" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90 font-medium">Potential Time Savings</div>
            <div className="text-3xl font-bold">{suggestedRoute.savings}</div>
          </div>
          <Clock className="w-12 h-12 opacity-80" />
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button 
          className="px-4 py-3 glass border border-border/50 rounded-xl text-sm font-semibold text-foreground hover:bg-muted/50 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Compare Details
        </motion.button>
        <motion.button
          onClick={() => onApplyRoute(shipmentId)}
          className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <CheckCircle2 className="w-4 h-4" />
          Apply Route
        </motion.button>
      </div>
    </motion.div>
  );
}
