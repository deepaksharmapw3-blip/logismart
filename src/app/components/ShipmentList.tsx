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
          color: 'bg-teal-500/8 text-teal-700 dark:text-teal-400 border border-teal-500/15',
          icon: TrendingUp,
          label: 'On Time',
        };
      case 'at-risk':
        return {
          color: 'bg-amber-500/8 text-amber-700 dark:text-amber-400 border border-amber-500/15',
          icon: Clock,
          label: 'At Risk',
        };
      case 'delayed':
        return {
          color: 'bg-red-500/8 text-red-700 dark:text-red-400 border border-red-500/15',
          icon: AlertTriangle,
          label: 'Delayed',
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
            className="w-full text-left glass-card rounded-2xl p-5 hover:shadow-glow transition-all duration-300 cursor-pointer group"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onSelectShipment(shipment.id)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/8 rounded-xl flex items-center justify-center border border-primary/10 group-hover:border-primary/20 transition-colors duration-200">
                  <Package className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground">#{shipment.id}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    ETA: {shipment.eta}
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${statusConfig.color}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusConfig.label}
              </div>
            </div>

            {/* Route */}
            <div className="space-y-3 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium">From</div>
                  <div className="text-sm text-foreground">{shipment.origin}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground/60 mt-0.5" />
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium">Current</div>
                  <div className="text-sm text-foreground/80">{shipment.currentLocation}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5"></div>
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium">To</div>
                  <div className="text-sm text-foreground">{shipment.destination}</div>
                </div>
              </div>
            </div>

            {/* Delay Probability Bar */}
            <div className="pt-4 border-t border-border/40">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs text-muted-foreground">Delay Risk</span>
                <span className="text-xs font-semibold text-foreground">{shipment.delayProbability}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    shipment.delayProbability >= 70
                      ? 'bg-red-500'
                      : shipment.delayProbability >= 50
                      ? 'bg-amber-500'
                      : 'bg-teal-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${shipment.delayProbability}%` }}
                  transition={{ duration: 0.8, delay: index * 0.08 + 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
