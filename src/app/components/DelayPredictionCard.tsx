import { motion } from 'motion/react';
import { AlertTriangle, Clock, MapPin, TrendingUp, ChevronRight, Brain, Zap } from 'lucide-react';

interface Prediction {
  shipmentId: string;
  delayProbability: number;
  estimatedDelay: string;
  reasons: string[];
  riskLevel: 'low' | 'medium' | 'high';
  currentLocation: string;
  explanation?: string;
  decisionSuggestion?: string;
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
          color: 'glass-card border-red-500/30',
          textColor: 'text-red-400',
          badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
          progressColor: 'bg-red-500',
          icon: AlertTriangle,
        };
      case 'medium':
        return {
          color: 'glass-card border-amber-500/30',
          textColor: 'text-amber-400',
          badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          progressColor: 'bg-amber-500',
          icon: Clock,
        };
      case 'low':
        return {
          color: 'glass-card border-blue-500/30',
          textColor: 'text-blue-400',
          badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
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
              <div className="font-medium text-sm text-white">Shipment #{prediction.shipmentId}</div>
              <div className="text-xs text-white/60">AI Prediction</div>
            </div>
          </div>
        </div>

        <div className={`px-2 py-1 rounded-md text-xs font-medium border ${config.badgeColor} uppercase`}>
          {prediction.riskLevel} Risk
        </div>
      </div>

      {/* Current Location */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <MapPin className="w-4 h-4 text-white/60" />
        <span className="text-white/60">{prediction.currentLocation}</span>
      </div>

      {/* Delay Probability */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Delay Probability</span>
          <span className={`text-2xl font-bold ${config.textColor}`}>
            {prediction.delayProbability}%
          </span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${config.progressColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${prediction.delayProbability}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Estimated Delay */}
      <div className="mb-4 p-3 bg-white/10 rounded-lg border border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">Estimated Delay</span>
          <span className="text-sm font-medium text-white">{prediction.estimatedDelay}</span>
        </div>
      </div>

      {/* AI Explanation */}
      {prediction.explanation && (
        <div className="mb-4 p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/30 relative overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-10">
            <Brain className="w-8 h-8 text-indigo-400" />
          </div>
          <div className="text-sm font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5" />
            AI Analysis
          </div>
          <div className="text-sm text-white/80 leading-relaxed italic">"{prediction.explanation}"</div>
        </div>
      )}

      {/* AI Decision Suggestion */}
      {prediction.decisionSuggestion && (
        <div className="mb-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30 relative overflow-hidden">
          <div className="absolute -right-2 -top-2 opacity-10">
            <Zap className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Suggested Action
          </div>
          <div className="text-sm text-white/80 leading-relaxed font-medium">{prediction.decisionSuggestion}</div>
        </div>
      )}

      {/* Reasons */}
      <div className="mb-4">
        <div className="text-sm font-medium text-white mb-2">Contributing Factors</div>
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
              <span className="text-white/60">{reason}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onViewDetails(prediction.shipmentId)}
        className={`w-full ${config.badgeColor} border px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:scale-[1.02] hover:shadow-lg transition-all glow-hover`}
      >
        View Details
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
