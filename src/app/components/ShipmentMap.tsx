import { motion } from 'motion/react';
import { MapPin, Navigation, Package } from 'lucide-react';

interface Shipment {
  id: string;
  status: 'on-time' | 'at-risk' | 'delayed';
  location: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}

interface ShipmentMapProps {
  shipments: Shipment[];
  onShipmentClick: (id: string) => void;
}

export function ShipmentMap({ shipments, onShipmentClick }: ShipmentMapProps) {
  const getStatusColor = (status: Shipment['status']) => {
    switch (status) {
      case 'on-time':
        return 'bg-emerald-500';
      case 'at-risk':
        return 'bg-amber-500';
      case 'delayed':
        return 'bg-red-500';
    }
  };

  const getStatusBorderColor = (status: Shipment['status']) => {
    switch (status) {
      case 'on-time':
        return 'border-emerald-500';
      case 'at-risk':
        return 'border-amber-500';
      case 'delayed':
        return 'border-red-500';
    }
  };

  return (
    <div className="relative w-full h-full glass-card rounded-2xl overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5" />
      
      {/* Grid Background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(99, 102, 241, 0.08) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>

      {/* Map Legend */}
      <div className="absolute top-4 left-4 glass-card rounded-xl p-4 z-10">
        <div className="text-xs font-semibold mb-3 text-foreground">Status Legend</div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-xs text-foreground/70 font-medium">On Time</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            <span className="text-xs text-foreground/70 font-medium">At Risk</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
            <span className="text-xs text-foreground/70 font-medium">Delayed</span>
          </div>
        </div>
      </div>

      {/* Map Stats */}
      <div className="absolute top-4 right-4 glass-card rounded-xl p-3 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-lg flex items-center justify-center border border-indigo-500/20">
            <Package className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <span className="text-sm font-bold text-foreground">{shipments.length}</span>
            <span className="text-xs text-muted-foreground ml-1">Active</span>
          </div>
        </div>
      </div>

      {/* Shipments and Routes */}
      <div className="relative w-full h-full">
        {shipments.map((shipment, index) => {
          const startX = `${shipment.location.lng}%`;
          const startY = `${shipment.location.lat}%`;
          const endX = `${shipment.destination.lng}%`;
          const endY = `${shipment.destination.lat}%`;

          return (
            <div key={shipment.id}>
              {/* Route Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id={`gradient-${shipment.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                <motion.line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={`url(#gradient-${shipment.id})`}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: index * 0.2 }}
                />
              </svg>

              {/* Destination Marker */}
              <motion.div
                className="absolute"
                style={{
                  left: endX,
                  top: endY,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 + 0.5 }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-400 dark:to-slate-600 rounded-lg flex items-center justify-center shadow-lg">
                    <MapPin className="w-4 h-4 text-white dark:text-slate-900" />
                  </div>
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap glass px-2 py-1 rounded-lg text-[10px] font-semibold text-foreground">
                    Destination
                  </div>
                </div>
              </motion.div>

              {/* Shipment Vehicle Marker (Animated) */}
              <motion.button
                className="absolute z-10 cursor-pointer"
                style={{
                  left: startX,
                  top: startY,
                }}
                initial={{ scale: 0, x: '-50%', y: '-50%' }}
                animate={{
                  scale: 1,
                  x: '-50%',
                  y: '-50%',
                }}
                whileHover={{ scale: 1.15 }}
                transition={{ delay: index * 0.2 }}
                onClick={() => onShipmentClick(shipment.id)}
              >
                <div className={`relative ${getStatusBorderColor(shipment.status)} border-2 rounded-xl p-2.5 glass-card shadow-glow`}>
                  <Navigation className={`w-5 h-5 ${getStatusColor(shipment.status).replace('bg-', 'text-')}`} />

                  {/* Pulse Animation for at-risk and delayed */}
                  {(shipment.status === 'at-risk' || shipment.status === 'delayed') && (
                    <motion.div
                      className={`absolute inset-0 rounded-xl ${getStatusColor(shipment.status)} opacity-30`}
                      animate={{
                        scale: [1, 1.6, 1],
                        opacity: [0.4, 0, 0.4],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  {/* Shipment ID Label */}
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-200 dark:to-slate-300 text-white dark:text-slate-900 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-lg">
                    {shipment.id}
                  </div>
                </div>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Animated "Scanning" Effect */}
      <motion.div
        className="absolute left-0 top-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60"
        animate={{
          y: [0, 700, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Corner glow effects */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-indigo-500/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-radial from-violet-500/10 to-transparent pointer-events-none" />
    </div>
  );
}
