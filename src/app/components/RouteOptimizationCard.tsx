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
        return 'text-teal-700 dark:text-teal-400 bg-teal-500/8 border border-teal-500/15';
      case 'medium':
        return 'text-amber-700 dark:text-amber-400 bg-amber-500/8 border border-amber-500/15';
      case 'high':
        return 'text-red-700 dark:text-red-400 bg-red-500/8 border border-red-500/15';
    }
  };

  const RouteCard = ({ route, type }: { route: Route; type: 'current' | 'suggested' }) => (
    <div
      className={`p-5 rounded-2xl transition-all duration-300 ${
        type === 'suggested'
          ? 'glass-card border-teal-500/20 shadow-glow-success'
          : 'glass-card border-border/40'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            type === 'suggested' 
              ? 'bg-teal-500 shadow-glow-success' 
              : 'bg-muted'
          }`}>
            <Navigation className={`w-5 h-5 ${type === 'suggested' ? 'text-white' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <div className="font-medium text-sm text-foreground">{route.routeName}</div>
            {type === 'suggested' && (
              <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400 text-xs font-medium mt-0.5">
                <Zap className="w-3 h-3" />
                Recommended
              </div>
            )}
          </div>
        </div>

        <div className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold tracking-wide ${getTrafficColor(route.trafficLevel)}`}>
          {route.trafficLevel.toUpperCase()}
        </div>
      </div>

      {/* Route Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Distance</span>
          <span className="font-medium text-foreground">{route.distance}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Est. Time</span>
          <span className="font-medium text-foreground">{route.estimatedTime}</span>
        </div>
        {type === 'suggested' && route.savings !== '0 min' && (
          <div className="flex items-center justify-between text-sm pt-3 border-t border-teal-500/15">
            <span className="text-teal-600 dark:text-teal-400 font-medium">Time Saved</span>
            <span className="text-teal-600 dark:text-teal-400 font-semibold text-lg tabular-nums">{route.savings}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 hover:shadow-glow transition-all duration-300"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-medium text-lg text-foreground">Shipment #{shipmentId}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Route Optimization Available</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-primary/8 text-primary rounded-xl text-sm font-medium border border-primary/15">
          <TrendingUp className="w-4 h-4" />
          Better Route Found
        </div>
      </div>

      {/* Routes Comparison */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-6">
        <RouteCard route={currentRoute} type="current" />

        <div className="flex items-center justify-center">
          <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight className="w-5 h-5 text-muted-foreground/60" />
          </motion.div>
        </div>

        <RouteCard route={suggestedRoute} type="suggested" />
      </div>

      {/* Savings Highlight */}
      <motion.div
        className="relative overflow-hidden bg-teal-500 text-white rounded-2xl p-5 mb-6 shadow-glow-success"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12),_transparent_60%)]" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90 font-medium">Potential Time Savings</div>
            <div className="text-3xl font-semibold tabular-nums">{suggestedRoute.savings}</div>
          </div>
          <Clock className="w-10 h-10 opacity-70" />
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button 
          className="px-4 py-3 glass border border-border/40 rounded-xl text-sm font-medium text-foreground hover:bg-muted/30 transition-all duration-200"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          Compare Details
        </motion.button>
        <motion.button
          onClick={() => onApplyRoute(shipmentId)}
          className="px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-glow-success"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <CheckCircle2 className="w-4 h-4" />
          Apply Route
        </motion.button>
      </div>
    </motion.div>
  );
}
