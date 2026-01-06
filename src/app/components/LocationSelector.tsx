import { useState, useEffect, useRef } from 'react';
import { MapPin, Plus, Check, Home, Briefcase, MapPinned, Search, X, Crosshair, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from './ui/dialog';
import { toast } from 'sonner';

interface Location {
  id: number;
  label: string;
  address: string;
  type: 'home' | 'work' | 'other';
  placeId?: string;
  lat?: number;
  lng?: number;
}

// Load Google Maps script
const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });
};

export function LocationSelector() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLocationLabel, setNewLocationLabel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);
  const geocoderService = useRef<any>(null);

  // Google Maps API Key - Replace with your actual API key
  const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

  // Load saved locations from localStorage
  useEffect(() => {
    const savedLocations = localStorage.getItem('echoEatsLocations');
    if (savedLocations) {
      const parsed = JSON.parse(savedLocations);
      setLocations(parsed);
      if (parsed.length > 0) {
        setSelectedLocation(parsed[0]);
      }
    } else {
      // Default locations if none saved
      const defaultLocations: Location[] = [
        {
          id: 1,
          label: 'Home',
          address: '123 Main Street, Apartment 4B, New York, NY 10001',
          type: 'home',
        },
        {
          id: 2,
          label: 'Work',
          address: '456 Business Ave, Suite 200, New York, NY 10002',
          type: 'work',
        },
      ];
      setLocations(defaultLocations);
      setSelectedLocation(defaultLocations[0]);
      localStorage.setItem('echoEatsLocations', JSON.stringify(defaultLocations));
    }
  }, []);

  // Initialize Google Maps Places API
  useEffect(() => {
    // Only load if API key is provided (not placeholder)
    if (GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
      loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
        .then(() => {
          autocompleteService.current = new google.maps.places.AutocompleteService();
          const mapDiv = document.createElement('div');
          placesService.current = new google.maps.places.PlacesService(mapDiv);
          geocoderService.current = new google.maps.Geocoder();
        })
        .catch((error) => {
          console.error('Error loading Google Maps:', error);
          toast.error('Failed to load location services');
        });
    }
  }, []);

  // Handle autocomplete search
  useEffect(() => {
    if (!searchQuery.trim() || !autocompleteService.current) {
      setPredictions([]);
      return;
    }

    const timer = setTimeout(() => {
      autocompleteService.current.getPlacePredictions(
        {
          input: searchQuery,
          types: ['address'],
        },
        (predictions: any, status: any) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPredictions(predictions);
          } else {
            setPredictions([]);
          }
        }
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'work':
        return <Briefcase className="w-5 h-5" />;
      default:
        return <MapPinned className="w-5 h-5" />;
    }
  };

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    setIsOpen(false);
    setIsAddingNew(false);
    toast.success(`Delivering to ${location.label}`);
  };

  const handleSelectPrediction = (prediction: any) => {
    if (!placesService.current) {
      // Fallback if Google Maps not loaded
      setSelectedPlace({
        description: prediction.description,
        formatted_address: prediction.description,
      });
      setSearchQuery(prediction.description);
      setPredictions([]);
      return;
    }

    placesService.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['formatted_address', 'geometry', 'name'],
      },
      (place: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          setSelectedPlace({
            placeId: prediction.place_id,
            description: prediction.description,
            formatted_address: place.formatted_address,
            lat: place.geometry?.location?.lat(),
            lng: place.geometry?.location?.lng(),
          });
          setSearchQuery(place.formatted_address);
          setPredictions([]);
        }
      }
    );
  };

  const handleAddNewLocation = () => {
    if (!newLocationLabel.trim()) {
      toast.error('Please enter a location label');
      return;
    }

    if (!selectedPlace && !searchQuery.trim()) {
      toast.error('Please search and select an address');
      return;
    }

    const newLocation: Location = {
      id: Date.now(),
      label: newLocationLabel,
      address: selectedPlace?.formatted_address || searchQuery,
      type: 'other',
      placeId: selectedPlace?.placeId,
      lat: selectedPlace?.lat,
      lng: selectedPlace?.lng,
    };

    const updatedLocations = [...locations, newLocation];
    setLocations(updatedLocations);
    setSelectedLocation(newLocation);
    localStorage.setItem('echoEatsLocations', JSON.stringify(updatedLocations));
    
    // Reset form
    setNewLocationLabel('');
    setSearchQuery('');
    setSelectedPlace(null);
    setIsAddingNew(false);
    setIsOpen(false);
    toast.success('Location saved successfully!');
  };

  const handleDeleteLocation = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedLocations = locations.filter((loc) => loc.id !== id);
    setLocations(updatedLocations);
    localStorage.setItem('echoEatsLocations', JSON.stringify(updatedLocations));
    
    if (selectedLocation?.id === id && updatedLocations.length > 0) {
      setSelectedLocation(updatedLocations[0]);
    }
    toast.success('Location deleted');
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    toast.info('Getting your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // If Google Maps is available, use reverse geocoding
        if (geocoderService.current) {
          const latLng = new google.maps.LatLng(latitude, longitude);
          
          geocoderService.current.geocode(
            { location: latLng },
            (results: any, status: any) => {
              setIsGettingLocation(false);
              
              if (status === 'OK' && results && results[0]) {
                const address = results[0].formatted_address;
                setSelectedPlace({
                  formatted_address: address,
                  lat: latitude,
                  lng: longitude,
                });
                setSearchQuery(address);
                toast.success('Location detected!');
              } else {
                // Fallback to coordinates
                const coordsAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                setSelectedPlace({
                  formatted_address: coordsAddress,
                  lat: latitude,
                  lng: longitude,
                });
                setSearchQuery(coordsAddress);
                toast.success('Location detected! (Coordinates)');
              }
            }
          );
        } else {
          // Fallback without Google Maps
          setIsGettingLocation(false);
          const coordsAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setSelectedPlace({
            formatted_address: coordsAddress,
            lat: latitude,
            lng: longitude,
          });
          setSearchQuery(coordsAddress);
          toast.success('Location detected! (Coordinates)');
        }
      },
      (error) => {
        setIsGettingLocation(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location permission denied. Please enable location access in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable. Please try again.');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out. Please try again.');
            break;
          default:
            toast.error('Failed to get location. Please try again.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
          <MapPin className="w-5 h-5 text-orange-500" />
          <div className="text-left">
            <div className="text-xs text-gray-500">Deliver to</div>
            <div className="text-sm font-semibold text-gray-900 max-w-[200px] truncate">
              {selectedLocation?.label || 'Select Location'}
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isAddingNew ? 'Add New Location' : 'Select Delivery Location'}
          </DialogTitle>
          <DialogDescription>
            {isAddingNew
              ? 'Search for an address and save it for quick access'
              : 'Choose from your saved locations or add a new one'}
          </DialogDescription>
        </DialogHeader>

        {!isAddingNew ? (
          <div className="space-y-4">
            {/* Saved Locations */}
            <div className="space-y-2">
              {locations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSelectLocation(location)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-start gap-3 group ${
                    selectedLocation?.id === location.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                  }`}
                >
                  <div className="text-orange-500 mt-1">
                    {getLocationIcon(location.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {location.label}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {location.address}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedLocation?.id === location.id && (
                      <Check className="w-5 h-5 text-orange-500" />
                    )}
                    <button
                      onClick={(e) => handleDeleteLocation(location.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </button>
              ))}
            </div>

            {/* Add New Location Button */}
            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center gap-2 text-orange-600 hover:text-orange-700"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add New Location</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Location Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Label
              </label>
              <input
                type="text"
                value={newLocationLabel}
                onChange={(e) => setNewLocationLabel(e.target.value)}
                placeholder="e.g., Home, Office, Gym"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Address Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Address
              </label>
              
              {/* Get Current Location Button */}
              <button
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                className="w-full mb-3 p-3 rounded-lg border-2 border-blue-300 bg-blue-50 hover:bg-blue-100 transition-all flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Getting location...</span>
                  </>
                ) : (
                  <>
                    <Crosshair className="w-5 h-5" />
                    <span>Use My Current Location</span>
                  </>
                )}
              </button>

              <div className="relative mb-2 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">or search manually</span>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Start typing address..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedPlace(null);
                      setPredictions([]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Autocomplete Predictions */}
              {predictions.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {predictions.map((prediction) => (
                    <button
                      key={prediction.place_id}
                      onClick={() => handleSelectPrediction(prediction)}
                      className="w-full p-3 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-900">
                            {prediction.structured_formatting.main_text}
                          </div>
                          <div className="text-xs text-gray-500">
                            {prediction.structured_formatting.secondary_text}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setNewLocationLabel('');
                  setSearchQuery('');
                  setSelectedPlace(null);
                  setPredictions([]);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewLocation}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
              >
                Save Location
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
