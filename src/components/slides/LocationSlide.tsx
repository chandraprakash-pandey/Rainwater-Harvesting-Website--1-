import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { MapPin, Loader2, ArrowRight, Navigation } from 'lucide-react';
import { UserData } from '../../App';
import { toast } from 'sonner@2.0.3';

interface LocationSlideProps {
  formData: UserData;
  onComplete: (data: Partial<UserData>) => void;
  onPrevious?: () => void;
}

export function LocationSlide({ formData, onComplete }: LocationSlideProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [latitude, setLatitude] = useState(formData.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(formData.longitude?.toString() || '');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    setIsDetecting(true);
    setLocationStatus('idle');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        
        setLatitude(lat);
        setLongitude(lng);
        setLocationStatus('success');
        setIsDetecting(false);
        setErrors({});
        
        toast.success('Location detected successfully!');
      },
      (error) => {
        setIsDetecting(false);
        setLocationStatus('error');
        
        let errorMessage = 'Failed to detect location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location access and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please enter coordinates manually.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again or enter coordinates manually.';
            break;
        }
        
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const validateCoordinates = () => {
    const newErrors: Record<string, string> = {};

    if (!latitude.trim()) {
      newErrors.latitude = 'Latitude is required';
    } else {
      const lat = parseFloat(latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = 'Please enter a valid latitude (-90 to 90)';
      }
    }

    if (!longitude.trim()) {
      newErrors.longitude = 'Longitude is required';
    } else {
      const lng = parseFloat(longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = 'Please enter a valid longitude (-180 to 180)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateCoordinates()) {
      toast.success('Location information saved successfully!');
      onComplete({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
    }
  };

  useEffect(() => {
    // Auto-detect location on component mount if not already set
    if (!formData.latitude && !formData.longitude) {
      setTimeout(() => {
        detectLocation();
      }, 1000);
    } else {
      setLocationStatus('success');
    }
  }, []);

  return (
    <div className="p-8 h-full flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Location Detection</CardTitle>
          <p className="text-muted-foreground">
            We need your location to provide accurate rainfall data for your area
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Auto Detection Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg">Auto-detect Location</h3>
              <Button
                onClick={detectLocation}
                disabled={isDetecting}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isDetecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                {isDetecting ? 'Detecting...' : 'Detect Location'}
              </Button>
            </div>
            
            {locationStatus === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✓ Location detected successfully! Latitude: {latitude}, Longitude: {longitude}
                </p>
              </div>
            )}
            
            {locationStatus === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  ✗ Failed to detect location. Please enter coordinates manually below.
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Manual Entry Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg">Or Enter Coordinates Manually</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="e.g., 19.0760"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className={errors.latitude ? 'border-red-500' : ''}
                />
                {errors.latitude && (
                  <p className="text-sm text-red-500">{errors.latitude}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="e.g., 72.8777"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className={errors.longitude ? 'border-red-500' : ''}
                />
                {errors.longitude && (
                  <p className="text-sm text-red-500">{errors.longitude}</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Tip:</strong> You can find your coordinates by searching your address on Google Maps, 
                right-clicking on your location, and selecting the coordinates that appear.
              </p>
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
                size="lg"
                disabled={!latitude || !longitude}
              >
                Next: Rooftop Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}