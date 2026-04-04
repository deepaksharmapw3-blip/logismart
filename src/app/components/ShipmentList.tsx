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
          color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          icon: TrendingUp,
          label: 'On Time',
        };
      case 'at-risk':
        return {
          color: 'bg-amber-100 text-amber-700 border-amber-200',
          icon: Clock,
          label: 'At Risk',
        };
      case 'delayed':
        return {
          color: 'bg-red-100 text-red-700 border-red-200',
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
            className="w-full text-left bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectShipment(shipment.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">#{shipment.id}</div>
                  <div className="text-xs text-muted-foreground">
                    ETA: {shipment.eta}
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${statusConfig.color}`}>
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </div>
            </div>

            {/* Route */}
            <div className="space-y-2 mb-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">From</div>
                  <div className="text-sm font-medium">{shipment.origin}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3 h-3 text-gray-400 mt-1" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Current</div>
                  <div className="text-sm">{shipment.currentLocation}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">To</div>
                  <div className="text-sm font-medium">{shipment.destination}</div>
                </div>
              </div>
            </div>

            {/* Delay Probability Bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Delay Risk</span>
                <span className="text-xs font-medium">{shipment.delayProbability}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    shipment.delayProbability >= 70
                      ? 'bg-red-500'
                      : shipment.delayProbability >= 50
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${shipment.delayProbability}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                />
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
