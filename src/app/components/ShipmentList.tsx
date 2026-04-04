import { motion } from 'motion/react';
import { Package, MapPin, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: 'on-time' | 'at-risk' | 'delayed';
  eta: string;
  currentLocation: string;
  delayProbability: number;
}

interface ShipmentListProps {
  shipments: Shipment[];
  onSelectShipment: (id: string) => void;
}

export function ShipmentList({ shipments, onSelectShipment }: ShipmentListProps) {
  const getStatusConfig = (status: Shipment['status']) => {
    switch (status) {
      case 'on-time':
        return {
          color: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          icon: TrendingUp,
          label: 'On Time',
          glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
        };
      case 'at-risk':
        return {
          color: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          icon: Clock,
          label: 'At Risk',
          glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
        };
      case 'delayed':
        return {
          color: 'bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-600 dark:text-red-400 border-red-500/20',
          icon: AlertTriangle,
          label: 'Delayed',
          glow: 'shadow-[0_0_12px_rgba(239,68,68,0.3)]',
        };
    }
  };

  return (
    <div className="space-y-3">
      {shipments.map((shipment, index) => {
        const statusConfig = getStatusConfig(shipment.status);
        const StatusIcon = statusConfig.icon;

        return (
          <motion.button
            key={shipment.id}
            className="w-full text-left glass-card rounded-xl p-4 hover:shadow-glow transition-all duration-300 cursor-pointer group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => onSelectShipment(shipment.id)}
            whileHover={{ scale: 1.01, x: 4 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-xl flex items-center justify-center border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                    <Package className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">#{shipment.id}</div>
                  <div className="text-xs text-muted-foreground">
                    ETA: {shipment.eta}
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusConfig.color} ${statusConfig.glow}`}>
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </div>
            </div>

            {/* Route */}
            <div className="space-y-2.5 mb-4 pl-1">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 mt-1.5 shadow-[0_0_6px_rgba(99,102,241,0.5)]"></div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">From</div>
                  <div className="text-sm font-medium text-foreground">{shipment.origin}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Current</div>
                  <div className="text-sm text-foreground/80">{shipment.currentLocation}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mt-1.5 shadow-[0_0_6px_rgba(16,185,129,0.5)]"></div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">To</div>
                  <div className="text-sm font-medium text-foreground">{shipment.destination}</div>
                </div>
              </div>
            </div>

            {/* Delay Probability Bar */}
            <div className="pt-3 border-t border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Delay Risk</span>
                <span className="text-xs font-bold text-foreground">{shipment.delayProbability}%</span>
              </div>
              <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    shipment.delayProbability >= 70
                      ? 'bg-gradient-to-r from-red-500 to-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                      : shipment.delayProbability >= 50
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${shipment.delayProbability}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
