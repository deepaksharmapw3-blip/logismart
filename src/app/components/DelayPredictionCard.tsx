import { motion } from 'motion/react';
import { AlertTriangle, Clock, MapPin, TrendingUp, ChevronRight } from 'lucide-react';

interface Prediction {
  shipmentId: string;
  delayProbability: number;
  estimatedDelay: string;
  reasons: string[];
  riskLevel: 'low' | 'medium' | 'high';
  currentLocation: string;
}

interface DelayPredictionCardProps {
  prediction: Prediction;
  onViewDetails: (id: string) => void;
}

export function DelayPredictionCard({ prediction, onViewDetails }: DelayPredictionCardProps) {
  const getRiskConfig = (riskLevel: Prediction['riskLevel']) => {
    switch (riskLevel) {
      case 'high':
        return {
          color: 'glass-card border-red-500/20',
          gradient: 'from-red-500/5 to-rose-500/5',
          textColor: 'text-red-600 dark:text-red-400',
          badgeColor: 'bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-600 dark:text-red-400 border-red-500/20',
          progressColor: 'bg-gradient-to-r from-red-500 to-rose-500',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
          icon: AlertTriangle,
        };
      case 'medium':
        return {
          color: 'glass-card border-amber-500/20',
          gradient: 'from-amber-500/5 to-orange-500/5',
          textColor: 'text-amber-600 dark:text-amber-400',
          badgeColor: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          progressColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
          icon: Clock,
        };
      case 'low':
        return {
          color: 'glass-card border-indigo-500/20',
          gradient: 'from-indigo-500/5 to-violet-500/5',
          textColor: 'text-indigo-600 dark:text-indigo-400',
          badgeColor: 'bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
          progressColor: 'bg-gradient-to-r from-indigo-500 to-violet-500',
          glow: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]',
          icon: TrendingUp,
        };
    }
  };

  const config = getRiskConfig(prediction.riskLevel);
  const RiskIcon = config.icon;

  return (
    <motion.div
      className={`${config.color} ${config.glow} rounded-2xl p-6 hover:shadow-glow transition-all duration-300 relative overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} pointer-events-none`} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${config.badgeColor} border rounded-xl flex items-center justify-center`}>
              <RiskIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-foreground">Shipment #{prediction.shipmentId}</div>
              <div className="text-xs text-muted-foreground">AI Prediction</div>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${config.badgeColor} uppercase tracking-wide`}>
            {prediction.riskLevel} Risk
          </div>
        </div>

        {/* Current Location */}
        <div className="flex items-center gap-2 mb-5 text-sm glass rounded-xl px-3 py-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground/80">{prediction.currentLocation}</span>
        </div>

        {/* Delay Probability */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Delay Probability</span>
            <span className={`text-3xl font-bold ${config.textColor}`}>
              {prediction.delayProbability}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${config.progressColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${prediction.delayProbability}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ boxShadow: '0 0 12px currentColor' }}
            />
          </div>
        </div>

        {/* Estimated Delay */}
        <div className="mb-5 p-4 glass rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estimated Delay</span>
            <span className="text-base font-bold text-foreground">{prediction.estimatedDelay}</span>
          </div>
        </div>

        {/* Reasons */}
        <div className="mb-5">
          <div className="text-sm font-semibold mb-3 text-foreground">Contributing Factors</div>
          <div className="space-y-2">
            {prediction.reasons.map((reason, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-2 h-2 rounded-full ${config.progressColor}`}></div>
                <span className="text-foreground/70">{reason}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={() => onViewDetails(prediction.shipmentId)}
          className={`w-full ${config.badgeColor} border px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
