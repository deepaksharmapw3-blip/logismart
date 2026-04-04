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
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-gray-200 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <div className="text-xs font-medium mb-2 text-gray-700">Status Legend</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-gray-600">On Time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs text-gray-600">At Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-600">Delayed</span>
          </div>
        </div>
      </div>

      {/* Map Stats */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium">{shipments.length} Active</span>
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
                  <MapPin className="w-6 h-6 text-gray-600 drop-shadow-lg" />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2 py-0.5 rounded text-[10px] font-medium shadow-md">
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
                whileHover={{ scale: 1.2 }}
                transition={{ delay: index * 0.2 }}
                onClick={() => onShipmentClick(shipment.id)}
              >
                <div className={`relative ${getStatusBorderColor(shipment.status)} border-2 rounded-full p-2 bg-white shadow-lg`}>
                  <Navigation className={`w-4 h-4 ${getStatusColor(shipment.status).replace('bg-', 'text-')}`} />

                  {/* Pulse Animation for at-risk and delayed */}
                  {(shipment.status === 'at-risk' || shipment.status === 'delayed') && (
                    <motion.div
                      className={`absolute inset-0 rounded-full ${getStatusColor(shipment.status)} opacity-30`}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  {/* Shipment ID Label */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white px-2 py-0.5 rounded text-[10px] font-medium shadow-md">
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
        className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"
        animate={{
          y: [0, 700, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
