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
          color: 'glass-card border-red-500/15',
          textColor: 'text-red-600 dark:text-red-400',
          badgeColor: 'bg-red-500/8 text-red-700 dark:text-red-400 border border-red-500/15',
          progressColor: 'bg-red-500',
          icon: AlertTriangle,
        };
      case 'medium':
        return {
          color: 'glass-card border-amber-500/15',
          textColor: 'text-amber-600 dark:text-amber-400',
          badgeColor: 'bg-amber-500/8 text-amber-700 dark:text-amber-400 border border-amber-500/15',
          progressColor: 'bg-amber-500',
          icon: Clock,
        };
      case 'low':
        return {
          color: 'glass-card border-primary/15',
          textColor: 'text-primary',
          badgeColor: 'bg-primary/8 text-primary border border-primary/15',
          progressColor: 'bg-primary',
          icon: TrendingUp,
        };
    }
  };

  const config = getRiskConfig(prediction.riskLevel);
  const RiskIcon = config.icon;

  return (
    <motion.div
      className={`${config.color} rounded-2xl p-6 hover:shadow-glow transition-all duration-300`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 ${config.badgeColor} rounded-xl flex items-center justify-center`}>
            <RiskIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium text-foreground">Shipment #{prediction.shipmentId}</div>
            <div className="text-xs text-muted-foreground mt-0.5">AI Prediction</div>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${config.badgeColor} uppercase tracking-wide`}>
          {prediction.riskLevel} Risk
        </div>
      </div>

      {/* Current Location */}
      <div className="flex items-center gap-2.5 mb-6 text-sm glass rounded-xl px-4 py-3">
        <MapPin className="w-4 h-4 text-muted-foreground/70" />
        <span className="text-foreground/80">{prediction.currentLocation}</span>
      </div>

      {/* Delay Probability */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Delay Probability</span>
          <span className={`text-3xl font-semibold tabular-nums ${config.textColor}`}>
            {prediction.delayProbability}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${config.progressColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${prediction.delayProbability}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Estimated Delay */}
      <div className="mb-6 p-4 glass rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Estimated Delay</span>
          <span className="text-base font-semibold text-foreground">{prediction.estimatedDelay}</span>
        </div>
      </div>

      {/* Reasons */}
      <div className="mb-6">
        <div className="text-sm font-medium mb-3 text-foreground">Contributing Factors</div>
        <div className="space-y-2.5">
          {prediction.reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 text-sm"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${config.progressColor}`}></div>
              <span className="text-foreground/70">{reason}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        onClick={() => onViewDetails(prediction.shipmentId)}
        className={`w-full ${config.badgeColor} px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        View Details
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
