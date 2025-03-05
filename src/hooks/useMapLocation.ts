import { useState, useEffect, useCallback } from 'react';
import { mapsService } from '../services/maps';

interface Location {
  lat: number;
  lng: number;
}

interface MapLocationHook {
  location: Location | null;
  isLoading: boolean;
  error: Error | null;
  geocodeAddress: (address: string) => Promise<void>;
  initializeMap: (elementId: string) => Promise<void>;
  addMarker: (title: string, id: string) => Promise<void>;
  removeMarker: (id: string) => void;
  searchNearby: (radius: number, type: string) => Promise<google.maps.places.PlaceResult[]>;
}

export function useMapLocation(initialAddress?: string): MapLocationHook {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const geocodeAddress = useCallback(async (address: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const coordinates = await mapsService.geocodeAddress(address);
      setLocation(coordinates);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to geocode address'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initializeMap = useCallback(async (elementId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const defaultLocation = location || { lat: 55.6761, lng: 12.5683 }; // Copenhagen
      await mapsService.initializeMap(elementId, defaultLocation);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize map'));
    } finally {
      setIsLoading(false);
    }
  }, [location]);

  const addMarker = useCallback(async (title: string, id: string) => {
    if (!location) return;

    try {
      await mapsService.addMarker(location, title, id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add marker'));
    }
  }, [location]);

  const removeMarker = useCallback((id: string) => {
    mapsService.removeMarker(id);
  }, []);

  const searchNearby = useCallback(async (radius: number, type: string) => {
    if (!location) {
      throw new Error('No location set');
    }

    try {
      return await mapsService.searchNearbyLocations(location, radius, type);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search nearby locations'));
      return [];
    }
  }, [location]);

  useEffect(() => {
    if (initialAddress) {
      geocodeAddress(initialAddress);
    }
  }, [initialAddress, geocodeAddress]);

  return {
    location,
    isLoading,
    error,
    geocodeAddress,
    initializeMap,
    addMarker,
    removeMarker,
    searchNearby
  };
}