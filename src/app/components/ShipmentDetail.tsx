import { useState, useEffect } from 'react';
import { X, Package, MapPin, Clock, TrendingUp, AlertTriangle, Navigation, Calendar, Activity, Brain, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { api, type Shipment, type DelayPrediction, type RouteOptimization } from '../services/api';
import { WeatherWidget } from './WeatherWidget';


interface ShipmentDetailProps {
  shipmentId: string;
  onClose: () => void;
}

export function ShipmentDetail({ shipmentId, onClose }: ShipmentDetailProps) {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [prediction, setPrediction] = useState<DelayPrediction | null>(null);
  const [routeOpt, setRouteOpt] = useState<RouteOptimization | null>(null);
  const [aiDecision, setAiDecision] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [shipmentsData, predictionsData, routesData] = await Promise.all([
          api.getShipments(),
          api.getPredictions(),
          api.getRouteOptimizations(),
        ]);

        const foundShipment = shipmentsData.find(s => s.id === shipmentId);
        const foundPrediction = predictionsData.find(p => p.shipmentId === shipmentId);
        const foundRoute = routesData.find(r => r.shipmentId === shipmentId);

        setShipment(foundShipment || null);
        setPrediction(foundPrediction || null);
        setRouteOpt(foundRoute || null);

        // Fetch AI Decision if shipment is at risk or delayed
        if (foundShipment && (foundShipment.status === 'at-risk' || foundShipment.status === 'delayed')) {
          try {
            const decision = await api.getAIDecision(shipmentId);
            setAiDecision(decision);
          } catch (e) {
            console.warn('AI Decision not available yet');
          }
        }
      } catch (error) {
        console.error('Error fetching shipment details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [shipmentId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="max-w-lg w-full mx-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Shipment Not Found</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-white/60">The requested shipment could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusConfig = (status: Shipment['status']) => {
    switch (status) {
      case 'on-time':
        return {
          color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          icon: TrendingUp,
          label: 'On Time',
        };
      case 'at-risk':
        return {
          color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          icon: Clock,
          label: 'At Risk',
        };
      case 'delayed':
        return {
          color: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: AlertTriangle,
          label: 'Delayed',
        };
    }
  };

  const statusConfig = getStatusConfig(shipment.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between border-b border-white/10">
          <CardTitle className="text-gradient flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            Shipment #{shipment.id}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10">
            <X className="w-5 h-5 text-white/60" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.color}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="font-medium">{statusConfig.label}</span>
          </div>

          {/* Route Information */}
          <div className="glass-card p-4 rounded-xl space-y-4">
            <h3 className="text-white/80 font-medium flex items-center gap-2">
              <Navigation className="w-4 h-4 text-indigo-400" />
              Route Information
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500 mt-1"></div>
                <div>
                  <div className="text-xs text-white/60">Origin</div>
                  <div className="text-white font-medium">{shipment.origin}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5" />
                <div>
                  <div className="text-xs text-white/60">Current Location</div>
                  <div className="text-white">{shipment.currentLocation}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 mt-1"></div>
                <div>
                  <div className="text-xs text-white/60">Destination</div>
                  <div className="text-white font-medium">{shipment.destination}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ETA & Delay */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-white/60 text-sm">Estimated Arrival</span>
              </div>
              <div className="text-xl font-semibold text-white">{shipment.eta}</div>
            </div>

            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span className="text-white/60 text-sm">Delay Probability</span>
              </div>
              <div className="text-xl font-semibold text-white">{shipment.delayProbability}%</div>
              <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${shipment.delayProbability >= 70 ? 'bg-red-500' :
                    shipment.delayProbability >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  style={{ width: `${shipment.delayProbability}%` }}
                />
              </div>
            </div>
          </div>

          {/* Delay Prediction */}
          {prediction && (
            <div className="glass-card p-4 rounded-xl border-amber-500/20">
              <h3 className="text-amber-400 font-medium flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" />
                Delay Prediction
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">Estimated Delay:</span>
                  <span className="text-white font-medium">{prediction.estimatedDelay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Risk Level:</span>
                  <span className={`font-medium ${prediction.riskLevel === 'high' ? 'text-red-400' :
                    prediction.riskLevel === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                    {prediction.riskLevel.toUpperCase()}
                  </span>
                </div>
                {prediction.reasons.length > 0 && (
                  <div>
                    <span className="text-white/60">Reasons:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {prediction.reasons.map((reason, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Route Optimization */}
          {routeOpt && (
            <div className="glass-card p-4 rounded-xl border-indigo-500/20">
              <h3 className="text-indigo-400 font-medium flex items-center gap-2 mb-3">
                <Navigation className="w-4 h-4" />
                Route Optimization
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-white/60 mb-1">Current Route</div>
                  <div className="text-white font-medium">{routeOpt.currentRoute.routeName}</div>
                  <div className="text-sm text-white/60">{routeOpt.currentRoute.distance}</div>
                  <div className="text-sm text-white/60">{routeOpt.currentRoute.estimatedTime}</div>
                </div>
                <div>
                  <div className="text-xs text-white/60 mb-1">Suggested Route</div>
                  <div className="text-emerald-400 font-medium">{routeOpt.suggestedRoute.routeName}</div>
                  <div className="text-sm text-white/60">{routeOpt.suggestedRoute.distance}</div>
                  <div className="text-sm text-emerald-400">Save {routeOpt.suggestedRoute.savings}</div>
                </div>
              </div>
            </div>
          )}

          {/* AI Decision Support */}
          {aiDecision && (
            <div className="glass-card p-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain className="w-12 h-12 text-indigo-400" />
              </div>
              <h3 className="text-indigo-400 font-bold flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                AI Decision Support
              </h3>

              <div className="space-y-4 relative z-10">
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Recommended Decision</div>
                  <div className="text-white font-medium text-lg leading-snug">{aiDecision.decision}</div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-xs text-white/40 mb-1">Rationale</div>
                    <p className="text-sm text-white/80 italic">"{aiDecision.rationale}"</p>
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-xs text-white/40 mb-2">Immediate Action Items</div>
                    <ul className="space-y-2">
                      {aiDecision.actions.map((action: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2 text-sm">
                  <span className="text-white/40">Expected Impact:</span>
                  <span className="text-emerald-400 font-medium">{aiDecision.impact}</span>
                </div>
              </div>
            </div>
          )}

          {/* Weather Information */}
          <div className="space-y-3">
            <h3 className="text-white/80 font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Current Weather at Location
            </h3>
            <WeatherWidget lat={shipment.location.lat} lon={shipment.location.lng} />
          </div>

          {/* Coordinates */}

          <div className="glass-card p-4 rounded-xl">
            <h3 className="text-white/80 font-medium flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-pink-400" />
              Location Coordinates
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/60">Current Position</div>
                <div className="text-white">Lat: {shipment.location.lat}, Lng: {shipment.location.lng}</div>
              </div>
              <div>
                <div className="text-white/60">Destination</div>
                <div className="text-white">Lat: {shipment.destination_coords.lat}, Lng: {shipment.destination_coords.lng}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
