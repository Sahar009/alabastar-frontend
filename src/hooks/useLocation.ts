import { useState } from 'react';
import toast from 'react-hot-toast';

export interface LocationData {
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  streetNumber?: string;
  streetName?: string;
  postalCode?: string;
  country?: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [detecting, setDetecting] = useState(false);

  /**
   * Detect user's current location using browser geolocation API
   * @param showToast - Whether to show toast notifications (default: true)
   * @returns Promise<LocationData | null>
   */
  const detectLocation = async (showToast: boolean = true): Promise<LocationData | null> => {
    if (!navigator.geolocation) {
      if (showToast) {
        toast.error('Geolocation is not supported by your browser');
      }
      return null;
    }

    setDetecting(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;

      // Try reverse geocoding with our backend first
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(
          `${base}/api/location/reverse-geocode?lat=${latitude}&lng=${longitude}`
        );

        if (response.ok) {
          const data = await response.json();
          const locationData: LocationData = {
            address: data.address || `${data.city}, ${data.state}`,
            city: data.city || '',
            state: data.state || '',
            latitude,
            longitude,
            streetNumber: data.streetNumber || '',
            streetName: data.streetName || '',
            postalCode: data.postalCode || '',
            country: data.country || 'Nigeria'
          };

          setLocation(locationData);
          if (showToast) {
            toast.success('Location detected successfully!');
          }
          return locationData;
        }
      } catch (backendError) {
        console.error('Backend reverse geocoding failed, trying external API:', backendError);
      }

      // Fallback to external reverse geocoding API
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();

        // Build comprehensive address
        const addressParts = [];
        if (data.streetNumber) addressParts.push(data.streetNumber);
        if (data.streetName) addressParts.push(data.streetName);
        if (data.locality) addressParts.push(data.locality);
        if (data.principalSubdivision) addressParts.push(data.principalSubdivision);
        if (data.countryName) addressParts.push(data.countryName);

        const fullAddress = addressParts.join(', ') || 
          `${data.locality || data.city || 'Unknown'}, ${data.principalSubdivision || data.state || 'Unknown'}, ${data.countryName || 'Nigeria'}`;

        const locationData: LocationData = {
          address: fullAddress,
          city: data.locality || data.city || 'Unknown City',
          state: data.principalSubdivision || data.state || 'Unknown State',
          latitude,
          longitude,
          streetNumber: data.streetNumber || '',
          streetName: data.streetName || '',
          postalCode: data.postcode || '',
          country: data.countryName || 'Nigeria'
        };

        setLocation(locationData);
        if (showToast) {
          toast.success('Location detected successfully!');
        }
        return locationData;
      } catch (reverseGeoError) {
        console.error('External reverse geocoding failed:', reverseGeoError);
        
        // Still set coordinates even if reverse geocoding fails
        const locationData: LocationData = {
          address: 'Current Location',
          city: 'Unknown City',
          state: 'Unknown State',
          latitude,
          longitude,
          streetNumber: '',
          streetName: '',
          postalCode: '',
          country: 'Nigeria'
        };

        setLocation(locationData);
        if (showToast) {
          toast.error('Could not get city/state. Please enter manually.');
        }
        return locationData;
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      if (showToast) {
        toast.error('Failed to detect location. Please enable location services.');
      }
      return null;
    } finally {
      setDetecting(false);
    }
  };

  /**
   * Set location manually
   */
  const setManualLocation = (locationData: LocationData) => {
    setLocation(locationData);
  };

  /**
   * Clear current location
   */
  const clearLocation = () => {
    setLocation(null);
  };

  /**
   * Get default location (Lagos, Nigeria)
   */
  const getDefaultLocation = (): LocationData => {
    return {
      address: 'Lagos, Nigeria',
      city: 'Lagos',
      state: 'Lagos',
      latitude: 6.5244,
      longitude: 3.3792,
      streetNumber: '',
      streetName: '',
      postalCode: '',
      country: 'Nigeria'
    };
  };

  return {
    location,
    detecting,
    detectLocation,
    setManualLocation,
    clearLocation,
    getDefaultLocation
  };
};

export default useLocation;
