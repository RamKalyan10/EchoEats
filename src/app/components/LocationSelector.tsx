import { useState } from 'react';
import { MapPin, Plus, Check, Home, Briefcase, MapPinned } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from './ui/dialog';

interface Location {
  id: number;
  label: string;
  address: string;
  type: 'home' | 'work' | 'other';
}

const initialLocations: Location[] = [
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
  {
    id: 3,
    label: 'Gym',
    address: '789 Fitness Blvd, New York, NY 10003',
    type: 'other',
  },
];

export function LocationSelector() {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLocationLabel, setNewLocationLabel] = useState('');
  const [newLocationAddress, setNewLocationAddress] = useState('');

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
  };

  const handleAddNewLocation = () => {
    if (newLocationLabel.trim() && newLocationAddress.trim()) {
      const newLocation: Location = {
        id: locations.length + 1,
        label: newLocationLabel,
        address: newLocationAddress,
        type: 'other',
      };
      setLocations([...locations, newLocation]);
      setSelectedLocation(newLocation);
      setNewLocationLabel('');
      setNewLocationAddress('');
      setIsAddingNew(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
          <MapPin className="w-5 h-5 text-orange-500" />
          <span className="text-sm">
            Deliver to: <span className="font-medium text-gray-900">{selectedLocation.label}</span>
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Choose Delivery Location</DialogTitle>
          <DialogDescription className="sr-only">
            Select a saved location or add a new delivery address
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
          {/* Saved Locations */}
          {!isAddingNew && (
            <>
              {locations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSelectLocation(location)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:border-orange-300 ${
                    selectedLocation.id === location.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        selectedLocation.id === location.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {getLocationIcon(location.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{location.label}</h3>
                        {selectedLocation.id === location.id && (
                          <Check className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{location.address}</p>
                    </div>
                  </div>
                </button>
              ))}

              {/* Add New Location Button */}
              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 bg-white hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-orange-600"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add New Location</span>
              </button>
            </>
          )}

          {/* Add New Location Form */}
          {isAddingNew && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Label
                </label>
                <input
                  type="text"
                  value={newLocationLabel}
                  onChange={(e) => setNewLocationLabel(e.target.value)}
                  placeholder="e.g., Home, Office, Friend's Place"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address
                </label>
                <textarea
                  value={newLocationAddress}
                  onChange={(e) => setNewLocationAddress(e.target.value)}
                  placeholder="Enter complete address with street, city, and zip code"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddNewLocation}
                  className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Save Location
                </button>
                <button
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewLocationLabel('');
                    setNewLocationAddress('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}