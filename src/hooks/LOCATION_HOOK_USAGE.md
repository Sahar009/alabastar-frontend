# useLocation Hook - Usage Guide

## Overview
The `useLocation` hook provides a reusable way to detect and manage user location across the application.

## Features
- ✅ Browser geolocation detection
- ✅ Automatic reverse geocoding (backend + fallback)
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ Manual location setting
- ✅ Default location fallback

## Installation

```typescript
import useLocation from "../../hooks/useLocation";
```

## Basic Usage

```typescript
export default function MyComponent() {
  const { 
    location,           // Current location data
    detecting,          // Loading state
    detectLocation,     // Function to detect location
    setManualLocation,  // Function to set location manually
    clearLocation,      // Function to clear location
    getDefaultLocation  // Function to get default location (Lagos)
  } = useLocation();

  // Detect location
  const handleDetectLocation = async () => {
    const locationData = await detectLocation(true); // true = show toast
    
    if (locationData) {
      console.log('Location detected:', locationData);
      // Use locationData...
    }
  };

  return (
    <button 
      onClick={handleDetectLocation}
      disabled={detecting}
    >
      {detecting ? 'Detecting...' : 'Detect Location'}
    </button>
  );
}
```

## Location Data Structure

```typescript
interface LocationData {
  address: string;        // Full address string
  city: string;          // City name
  state: string;         // State/Province
  latitude: number;      // GPS latitude
  longitude: number;     // GPS longitude
  streetNumber?: string; // Optional street number
  streetName?: string;   // Optional street name
  postalCode?: string;   // Optional postal code
  country?: string;      // Country name
}
```

## Advanced Usage

### 1. Detect Location Without Toast Notifications

```typescript
const locationData = await detectLocation(false); // false = no toast
```

### 2. Set Location Manually

```typescript
setManualLocation({
  address: 'Victoria Island, Lagos',
  city: 'Lagos',
  state: 'Lagos',
  latitude: 6.4281,
  longitude: 3.4219,
  country: 'Nigeria'
});
```

### 3. Use with Form Data

```typescript
const { detectLocation: detectUserLocation, detecting } = useLocation();
const [formData, setFormData] = useState({
  locationCity: '',
  locationState: '',
  latitude: '',
  longitude: ''
});

const handleDetectLocation = async () => {
  const locationData = await detectUserLocation(true);
  
  if (locationData) {
    setFormData(prev => ({
      ...prev,
      locationCity: locationData.city,
      locationState: locationData.state,
      latitude: locationData.latitude.toString(),
      longitude: locationData.longitude.toString()
    }));
  }
};
```

### 4. Get Default Location

```typescript
const defaultLocation = getDefaultLocation();
// Returns: { address: 'Lagos, Nigeria', city: 'Lagos', state: 'Lagos', ... }
```

## Integration Examples

### Provider Profile Page

```typescript
import useLocation from "../../../hooks/useLocation";

export default function ProviderProfile() {
  const { detectLocation: detectUserLocation, detecting } = useLocation();
  
  const detectLocation = async () => {
    const locationData = await detectUserLocation(true);
    if (locationData) {
      setFormData(prev => ({
        ...prev,
        locationCity: locationData.city,
        locationState: locationData.state,
        latitude: locationData.latitude.toString(),
        longitude: locationData.longitude.toString()
      }));
    }
  };

  return (
    <button onClick={detectLocation} disabled={detecting}>
      {detecting ? 'Detecting...' : 'Detect Location'}
    </button>
  );
}
```

### Become Provider Page

```typescript
import useLocation from "../../hooks/useLocation";

export default function BecomeProviderPage() {
  const { detectLocation, detecting } = useLocation();
  
  const handleLocationDetect = async () => {
    const locationData = await detectLocation(true);
    if (locationData) {
      setFormData(prev => ({
        ...prev,
        locationCity: locationData.city,
        locationState: locationData.state,
        latitude: locationData.latitude.toString(),
        longitude: locationData.longitude.toString()
      }));
    }
  };
}
```

### Providers Search Page

```typescript
import useLocation from "../../hooks/useLocation";

export default function ProvidersPage() {
  const { location, detectLocation, detecting } = useLocation();
  
  useEffect(() => {
    // Auto-detect on mount
    detectLocation(false); // Silent detection
  }, []);
  
  // Use location in search
  useEffect(() => {
    if (location) {
      searchProviders(location.city, location.state);
    }
  }, [location]);
}
```

## Error Handling

The hook handles all errors internally and shows appropriate toast messages:

- ❌ **Browser doesn't support geolocation**: Shows error toast
- ❌ **User denies permission**: Shows error toast
- ❌ **Reverse geocoding fails**: Still sets coordinates, shows warning
- ❌ **Network error**: Shows error toast

## Benefits

1. **DRY Principle**: Write location logic once, use everywhere
2. **Consistent UX**: Same behavior across all pages
3. **Easy Maintenance**: Update in one place
4. **Type Safety**: Full TypeScript support
5. **Error Handling**: Built-in error management
6. **Flexibility**: Optional toast notifications, manual override

## Migration Guide

### Before (Duplicate Code)

```typescript
// In each component
const [detectingLocation, setDetectingLocation] = useState(false);

const detectLocation = async () => {
  if (!navigator.geolocation) {
    toast.error('Geolocation not supported');
    return;
  }
  setDetectingLocation(true);
  // ... 50+ lines of duplicate code
};
```

### After (Using Hook)

```typescript
// In each component
const { detectLocation, detecting } = useLocation();

// That's it! Just call detectLocation()
```

## Future Enhancements

- [ ] Add caching to avoid repeated API calls
- [ ] Add location history
- [ ] Add location search/autocomplete
- [ ] Add distance calculation utilities
- [ ] Add location validation

## Notes

- The hook uses both backend API and external API as fallback
- Location detection requires user permission
- HTTPS is required for geolocation in production
- The hook is client-side only (use in "use client" components)
