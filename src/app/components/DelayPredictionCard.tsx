import { motion } from 'motion/react';
import {
  AlertTriangle,
  Clock,
  MapPin,
  TrendingUp,
  ChevronRight,
  Brain,
  Zap,
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  CloudLightning,
  Droplets
} from 'lucide-react';
import type { WeatherData } from '../services/api';

interface Prediction {
  shipmentId: string;
  delayProbability: number;
  estimatedDelay: string;
  reasons: string[];
  riskLevel: 'low' | 'medium' | 'high';
  currentLocation: string;
  explanation?: string;
  decisionSuggestion?: string;
  weather?: WeatherData;
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

  const getWeatherIcon = (description: string = '') => {
    const desc = description.toLowerCase();
    if (desc.includes('rain')) return CloudRain;
    if (desc.includes('cloud')) return Cloud;
    if (desc.includes('clear') || desc.includes('sun')) return Sun;
    if (desc.includes('storm') || desc.includes('lightning')) return CloudLightning;
    return Cloud;
  };

  const config = getRiskConfig(prediction.riskLevel);
  const RiskIcon = config.icon;
  const WeatherIcon = getWeatherIcon(prediction.weather?.description);

  return (
    <motion.div
      className={`${config.color} border rounded-2xl p-6 hover:shadow-2xl transition-all relative overflow-hidden`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
    >
      {/* Background Decorative Element */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${config.badgeColor} border rounded-xl flex items-center justify-center shadow-inner`}>
            <RiskIcon className="w-5 h-5 shadow-sm" />
          </div>
          <div>
            <div className="font-black text-base text-white tracking-tight">#{prediction.shipmentId}</div>
            <div className="text-[10px] uppercase font-black tracking-widest text-white/40">AI Risk Assessment</div>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-[10px] font-black border ${config.badgeColor} uppercase tracking-widest bg-black/20 backdrop-blur-md`}>
          {prediction.riskLevel} Risk
        </div>
      </div>

      {/* Current Location & Weather */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
          <MapPin className="w-4 h-4 text-white/40" />
          <span className="text-xs font-bold text-white/80 truncate">{prediction.currentLocation}</span>
        </div>

        {prediction.weather ? (
          <div className="flex items-center gap-3 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <WeatherIcon className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-200">
              {prediction.weather.temperature}°C • {prediction.weather.description}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 opacity-50">
            <Cloud className="w-4 h-4 text-white/20" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Weather Offline</span>
          </div>
        )}
      </div>

      {/* Delay Probability */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-black text-white/60 uppercase tracking-widest">Delay Probability</span>
          <span className={`text-3xl font-black ${config.textColor} text-glow`}>
            {prediction.delayProbability}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className={`h-full ${config.progressColor} shadow-[0_0_15px_rgba(99,102,241,0.5)]`}
            initial={{ width: 0 }}
            animate={{ width: `${prediction.delayProbability}%` }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          />
        </div>
      </div>

      {/* Weather Insights if severe */}
      {prediction.weather && (prediction.weather.windSpeed > 10 || prediction.weather.visibility < 2000) && (
        <div className="mb-5 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center gap-4">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Wind className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xs">
            <div className="font-black text-amber-400 uppercase tracking-widest mb-0.5 text-[9px]">Severe Weather Impact</div>
            <div className="text-amber-200/70 font-medium tracking-tight">
              {prediction.weather.windSpeed > 10 ? `High winds (${prediction.weather.windSpeed}m/s)` : ''}
              {prediction.weather.visibility < 2000 ? ` Low visibility detected` : ''}
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis */}
      {prediction.explanation && (
        <div className="mb-5 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 relative group/ai">
          <div className="text-[10px] font-black text-indigo-400 mb-2 flex items-center gap-2 uppercase tracking-widest">
            <Brain className="w-3.5 h-3.5" />
            Strategic Analysis
          </div>
          <div className="text-xs text-white/80 leading-relaxed italic font-medium italic translate-x-1 border-l-2 border-indigo-500/30 pl-3">
            "{prediction.explanation}"
          </div>
        </div>
      )}

      {/* Suggested Action */}
      {prediction.decisionSuggestion && (
        <div className="mb-6 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 relative overflow-hidden">
          <div className="text-[10px] font-black text-emerald-400 mb-2 flex items-center gap-2 uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" />
            AI Recommended Action
          </div>
          <div className="text-xs text-white/90 font-bold leading-snug">{prediction.decisionSuggestion}</div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={() => onViewDetails(prediction.shipmentId)}
        className={`w-full ${config.badgeColor} border px-6 py-4 rounded-xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] transition-all premium-card group active:scale-95`}
      >
        View Logistics Protocol
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}
