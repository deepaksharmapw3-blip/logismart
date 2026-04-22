import { useEffect, useRef, useState } from 'react';

interface Shipment {
  id: string;
  status: 'on-time' | 'at-risk' | 'delayed';
  location: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}

interface GoogleMapProps {
  shipments: Shipment[];
  onShipmentClick: (id: string) => void;
}

export function GoogleMap({ shipments, onShipmentClick }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const markersRef = useRef<any[]>([]);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = async () => {
      // Fetch API key from backend
      let apiKey: string;
      try {
        const response = await fetch('http://localhost:3001/api/config');
        const config = await response.json();
        apiKey = config.data?.googleMapsApiKey;
        
        if (!apiKey) {
          console.error('Google Maps API key not found in backend config');
          setLoadError('API key not configured');
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Failed to fetch config from backend:', error);
        setLoadError('Failed to load configuration');
        setIsLoading(false);
        return;
      }

      // Check if script already exists
      if (document.querySelector(`script[src*="maps.googleapis.com"]`)) {
        setIsLoading(false);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Maps script loaded successfully');
        if (mapRef.current && window.google) {
          try {
            const newMap = new window.google.maps.Map(mapRef.current, {
              center: { lat: 39.8283, lng: -98.5795 }, // Center of USA
              zoom: 4,
              styles: [
                {
                  featureType: 'all',
                  elementType: 'geometry',
                  stylers: [{ color: '#1a1a2e' }]
                },
                {
                  featureType: 'all',
                  elementType: 'labels.text.stroke',
                  stylers: [{ color: '#1a1a2e' }]
                },
                {
                  featureType: 'all',
                  elementType: 'labels.text.fill',
                  stylers: [{ color: '#ffffff' }]
                },
                {
                  featureType: 'water',
                  elementType: 'geometry',
                  stylers: [{ color: '#0f0f23' }]
                },
                {
                  featureType: 'road',
                  elementType: 'geometry',
                  stylers: [{ color: '#2d2d44' }]
                }
              ],
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false
            });
            setMap(newMap);
            setIsLoading(false);
            console.log('Google Map initialized successfully');
          } catch (err) {
            console.error('Error initializing Google Map:', err);
            setLoadError('Failed to initialize map');
            setIsLoading(false);
          }
        } else {
          setLoadError('Google Maps not available');
          setIsLoading(false);
        }
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps script');
        setLoadError('Failed to load Google Maps');
        setIsLoading(false);
      };
      document.head.appendChild(script);

      return () => {
        // Cleanup markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
      };
    };

    loadGoogleMaps();
  }, []);

  // Update markers when shipments or map changes
  useEffect(() => {
    if (!map || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    shipments.forEach((shipment) => {
      // Current location marker
      const currentMarker = new window.google.maps.Marker({
        position: shipment.location,
        map,
        title: `Shipment ${shipment.id}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: shipment.status === 'on-time' ? '#10b981' : 
                     shipment.status === 'at-risk' ? '#f59e0b' : '#ef4444',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff'
        }
      });

      // Destination marker
      const destMarker = new window.google.maps.Marker({
        position: shipment.destination,
        map,
        title: `Destination for ${shipment.id}`,
        icon: {
          path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#6366f1',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff'
        }
      });

      // Route line
      const routePath = new window.google.maps.Polyline({
        path: [shipment.location, shipment.destination],
        geodesic: true,
        strokeColor: shipment.status === 'on-time' ? '#10b981' : 
                     shipment.status === 'at-risk' ? '#f59e0b' : '#ef4444',
        strokeOpacity: 0.6,
        strokeWeight: 2,
        map
      });

      // Click handler
      currentMarker.addListener('click', () => {
        onShipmentClick(shipment.id);
      });

      markersRef.current.push(currentMarker, destMarker);
      bounds.extend(shipment.location);
      bounds.extend(shipment.destination);
    });

    // Fit bounds if we have shipments
    if (shipments.length > 0) {
      map.fitBounds(bounds);
    }
  }, [map, shipments, onShipmentClick]);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-xl">
        <div className="text-center p-6">
          <div className="text-red-400 text-lg mb-2">Map Error</div>
          <div className="text-white/60 text-sm">{loadError}</div>
          <div className="text-white/40 text-xs mt-2">Check console for details</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-xl z-20">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <div className="text-white/60 text-sm">Loading map...</div>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded-xl" />
      
      {/* Legend */}
      <div className="absolute top-4 left-4 glass-card rounded-lg p-3 z-10">
        <div className="text-xs font-medium mb-2 text-white">Status Legend</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-white/80">On Time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs text-white/80">At Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-white/80">Delayed</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-4 right-4 glass-card rounded-lg p-3 z-10">
        <span className="text-sm font-medium text-white">{shipments.length} Active</span>
      </div>
    </div>
  );
}
