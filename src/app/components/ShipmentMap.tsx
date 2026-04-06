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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-teal-500/3" />
      
      {/* Grid Background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px),
                         linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
        backgroundSize: '48px 48px'
      }}></div>

      {/* Map Legend */}
      <div className="absolute top-5 left-5 glass-card rounded-xl p-4 z-10">
        <div className="text-xs font-medium mb-3 text-foreground">Status Legend</div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500"></div>
            <span className="text-xs text-muted-foreground">On Time</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            <span className="text-xs text-muted-foreground">At Risk</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <span className="text-xs text-muted-foreground">Delayed</span>
          </div>
        </div>
      </div>

      {/* Map Stats */}
      <div className="absolute top-5 right-5 glass-card rounded-xl p-3.5 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary/8 rounded-lg flex items-center justify-center border border-primary/10">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground tabular-nums">{shipments.length}</span>
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
                transition={{ delay: index * 0.15 + 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-foreground/80 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-background" />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap glass px-2 py-0.5 rounded text-[9px] font-medium text-muted-foreground">
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
                whileHover={{ scale: 1.1 }}
                transition={{ delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => onShipmentClick(shipment.id)}
              >
                <div className={`relative ${getStatusBorderColor(shipment.status)} border-2 rounded-xl p-2.5 glass-card`}>
                  <Navigation className={`w-4 h-4 ${getStatusColor(shipment.status).replace('bg-', 'text-')}`} />

                  {/* Pulse Animation for at-risk and delayed */}
                  {(shipment.status === 'at-risk' || shipment.status === 'delayed') && (
                    <motion.div
                      className={`absolute inset-0 rounded-xl ${getStatusColor(shipment.status)} opacity-20`}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  {/* Shipment ID Label */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-foreground text-background px-2 py-0.5 rounded text-[9px] font-semibold">
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
        className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        animate={{
          y: [0, 700, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Subtle corner accents */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-teal-500/5 to-transparent pointer-events-none" />
    </div>
  );
}
