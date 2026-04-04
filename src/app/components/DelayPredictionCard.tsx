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
          color: 'bg-red-50 border-red-200',
          textColor: 'text-red-700',
          badgeColor: 'bg-red-100 text-red-700 border-red-200',
          progressColor: 'bg-red-500',
          icon: AlertTriangle,
        };
      case 'medium':
        return {
          color: 'bg-amber-50 border-amber-200',
          textColor: 'text-amber-700',
          badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
          progressColor: 'bg-amber-500',
          icon: Clock,
        };
      case 'low':
        return {
          color: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-700',
          badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
          progressColor: 'bg-blue-500',
          icon: TrendingUp,
        };
    }
  };

  const config = getRiskConfig(prediction.riskLevel);
  const RiskIcon = config.icon;

  return (
    <motion.div
      className={`${config.color} border rounded-xl p-5 hover:shadow-lg transition-all`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-8 h-8 ${config.badgeColor} border rounded-lg flex items-center justify-center`}>
              <RiskIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="font-medium text-sm">Shipment #{prediction.shipmentId}</div>
              <div className="text-xs text-muted-foreground">AI Prediction</div>
            </div>
          </div>
        </div>

        <div className={`px-2 py-1 rounded-md text-xs font-medium border ${config.badgeColor} uppercase`}>
          {prediction.riskLevel} Risk
        </div>
      </div>

      {/* Current Location */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">{prediction.currentLocation}</span>
      </div>

      {/* Delay Probability */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Delay Probability</span>
          <span className={`text-2xl font-bold ${config.textColor}`}>
            {prediction.delayProbability}%
          </span>
        </div>
        <div className="w-full h-2 bg-white rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${config.progressColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${prediction.delayProbability}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Estimated Delay */}
      <div className="mb-4 p-3 bg-white rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Estimated Delay</span>
          <span className="text-sm font-medium">{prediction.estimatedDelay}</span>
        </div>
      </div>

      {/* Reasons */}
      <div className="mb-4">
        <div className="text-sm font-medium mb-2">Contributing Factors</div>
        <div className="space-y-1.5">
          {prediction.reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${config.progressColor}`}></div>
              <span className="text-muted-foreground">{reason}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onViewDetails(prediction.shipmentId)}
        className={`w-full ${config.badgeColor} border px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:scale-[1.02] transition-transform`}
      >
        View Details
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
