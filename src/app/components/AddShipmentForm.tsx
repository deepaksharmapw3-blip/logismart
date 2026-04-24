import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { api } from '../services/api';
import { Plus, Package, MapPin, Clock, Navigation } from 'lucide-react';

interface AddShipmentFormProps {
  onShipmentAdded: () => void;
}

export function AddShipmentForm({ onShipmentAdded }: AddShipmentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    eta: '',
    currentLocation: '',
    location: { lat: 34.05, lng: -118.24 },
    destination_coords: { lat: 37.77, lng: -122.41 },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Submitting shipment form with data:', formData);
    
    try {
      // Generate realistic delay probability based on random factors
      const baseProbability = Math.floor(Math.random() * 80) + 10; // 10-90%
      
      // Determine status based on probability
      let status: 'on-time' | 'at-risk' | 'delayed' = 'on-time';
      if (baseProbability >= 70) {
        status = 'delayed';
      } else if (baseProbability >= 40) {
        status = 'at-risk';
      }
      
      const shipmentData = {
        ...formData,
        status,
        delayProbability: baseProbability,
      };
      console.log('Creating shipment with:', shipmentData);
      
      const result = await api.createShipment(shipmentData);
      console.log('Shipment created successfully:', result);
      
      setFormData({
        origin: '',
        destination: '',
        eta: '',
        currentLocation: '',
        location: { lat: 34.05, lng: -118.24 },
        destination_coords: { lat: 37.77, lng: -122.41 },
      });
      setIsOpen(false);
      
      // Wait for backend to create prediction and route optimization, then refresh
      setTimeout(() => {
        console.log('Refreshing data after shipment creation...');
        onShipmentAdded();
      }, 1500);
    } catch (error: any) {
      console.error('Failed to create shipment:', error);
      alert(error.message || 'Failed to create shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="mb-4 glow-primary">
        <Plus className="w-4 h-4 mr-2" />
        Add New Shipment
      </Button>
    );
  }

  return (
    <Card className="mb-6 border-indigo-500/30">
      <CardHeader>
        <CardTitle className="text-gradient flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-400" />
          Add New Shipment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="origin" className="text-white/80 flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                Origin
              </Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                placeholder="e.g., Los Angeles, CA"
                required
              />
            </div>
            <div>
              <Label htmlFor="destination" className="text-white/80 flex items-center gap-2 mb-2">
                <Navigation className="w-4 h-4 text-pink-400" />
                Destination
              </Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g., San Francisco, CA"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eta" className="text-white/80 flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                ETA
              </Label>
              <Input
                id="eta"
                value={formData.eta}
                onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
                placeholder="e.g., 4:30 PM"
                required
              />
            </div>
            <div>
              <Label htmlFor="currentLocation" className="text-white/80 flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                Current Location
              </Label>
              <Input
                id="currentLocation"
                value={formData.currentLocation}
                onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                placeholder="e.g., Bakersfield, CA"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="lat" className="text-white/60 text-sm mb-2 block">Current Lat</Label>
              <Input
                id="lat"
                type="number"
                step="0.01"
                value={formData.location.lat}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ 
                    ...formData, 
                    location: { ...formData.location, lat: val === '' ? 0 : parseFloat(val) }
                  });
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="lng" className="text-white/60 text-sm mb-2 block">Current Lng</Label>
              <Input
                id="lng"
                type="number"
                step="0.01"
                value={formData.location.lng}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ 
                    ...formData, 
                    location: { ...formData.location, lng: val === '' ? 0 : parseFloat(val) }
                  });
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="destLat" className="text-white/60 text-sm mb-2 block">Dest Lat</Label>
              <Input
                id="destLat"
                type="number"
                step="0.01"
                value={formData.destination_coords.lat}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ 
                    ...formData, 
                    destination_coords: { ...formData.destination_coords, lat: val === '' ? 0 : parseFloat(val) }
                  });
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="destLng" className="text-white/60 text-sm mb-2 block">Dest Lng</Label>
              <Input
                id="destLng"
                type="number"
                step="0.01"
                value={formData.destination_coords.lng}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ 
                    ...formData, 
                    destination_coords: { ...formData.destination_coords, lng: val === '' ? 0 : parseFloat(val) }
                  });
                }}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="submit" 
              disabled={loading} 
              className="glow-primary"
              onClick={(e) => {
                console.log('Create button clicked');
              }}
            >
              {loading ? 'Creating...' : 'Create Shipment'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
