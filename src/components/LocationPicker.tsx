"use client";
import { useEffect, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";

interface LocationSuggestion {
  display_name: string;
  lat: number;
  lon: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
  city?: string;
  state?: string;
  country?: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: {
    city: string;
    state: string;
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  initialCity?: string;
  initialState?: string;
  initialLat?: number;
  initialLng?: number;
}

export default function LocationPicker({ 
  onLocationSelect, 
  initialCity = "", 
  initialState = "", 
  initialLat = 0, 
  initialLng = 0 
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    city: initialCity,
    state: initialState,
    latitude: initialLat,
    longitude: initialLng,
    address: ""
  });
  const searchRef = useRef<HTMLDivElement>(null);

  // Nigerian states for validation
  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
    'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ];

  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(
        `${base}/api/location/search?query=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.data.suggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error searching location via API, trying fallback:', error);
      // Fallback to direct Nominatim call with proper headers
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Nigeria')}&limit=5&countrycodes=ng&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'Alabastar-App/1.0'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          const filteredSuggestions = data
            .filter((item: LocationSuggestion) => {
              const address = item.display_name.toLowerCase();
              return nigerianStates.some(state => 
                address.includes(state.toLowerCase())
              );
            })
            .map((item: LocationSuggestion) => ({
              display_name: item.display_name,
              lat: item.lat,
              lon: item.lon,
              address: item.address,
              city: item.address?.city || item.address?.town || item.address?.village || '',
              state: item.address?.state || '',
              country: item.address?.country || ''
            }));
          setSuggestions(filteredSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (fallbackError) {
        console.error('Fallback location search also failed:', fallbackError);
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchLocation(query);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const location = {
      city: suggestion.city || suggestion.address?.city || '',
      state: suggestion.state || suggestion.address?.state || '',
      latitude: suggestion.lat,
      longitude: suggestion.lon,
      address: suggestion.display_name
    };
    
    setSelectedLocation(location);
    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
    console.log('LocationPicker: Calling onLocationSelect with:', location);
    onLocationSelect(location);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
          const response = await fetch(
            `${base}/api/location/reverse?lat=${latitude}&lon=${longitude}`
          );
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.success) {
            const location = data.data;
            setSelectedLocation(location);
            setSearchQuery(location.address);
            console.log('LocationPicker: Calling onLocationSelect with current location:', location);
            onLocationSelect(location);
          } else {
            console.error('Failed to get location details:', data.message);
          }
        } catch (error) {
          console.error('Error getting location details via API, trying fallback:', error);
          // Fallback to direct Nominatim call
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
              {
                headers: {
                  'User-Agent': 'Alabastar-App/1.0'
                }
              }
            );
            
            if (response.ok) {
              const data = await response.json();
              if (data.address) {
                const location = {
                  city: data.address.city || data.address.town || data.address.village || '',
                  state: data.address.state || '',
                  latitude,
                  longitude,
                  address: data.display_name
                };
                
                setSelectedLocation(location);
                setSearchQuery(data.display_name);
                console.log('LocationPicker: Calling onLocationSelect with fallback location:', location);
                onLocationSelect(location);
              }
            }
          } catch (fallbackError) {
            console.error('Fallback reverse geocoding also failed:', fallbackError);
          }
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative" ref={searchRef}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
          <MapPin className="inline w-4 h-4 mr-2" />
          Location *
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for your city or area..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB]/50 focus:border-transparent"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2563EB]"></div>
            </div>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-b-0"
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {suggestion.city && suggestion.state 
                        ? `${suggestion.city}, ${suggestion.state}` 
                        : suggestion.display_name
                      }
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {suggestion.display_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 text-sm text-[#2563EB] hover:text-[#14B8A6] transition-colors disabled:opacity-50"
        >
          <MapPin className="w-4 h-4" />
          <span>Use my current location</span>
        </button>

        {selectedLocation.city && selectedLocation.state && (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Selected: {selectedLocation.city}, {selectedLocation.state}
          </div>
        )}
      </div>

      {/* Hidden inputs for form submission */}
      <input type="hidden" name="locationCity" value={selectedLocation.city} />
      <input type="hidden" name="locationState" value={selectedLocation.state} />
      <input type="hidden" name="latitude" value={selectedLocation.latitude} />
      <input type="hidden" name="longitude" value={selectedLocation.longitude} />
    </div>
  );
}
