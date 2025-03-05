import { Loader } from '@googlemaps/js-api-loader';

// Initialize Google Maps loader
const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places']
});

// Map instance and markers cache
let map: google.maps.Map | null = null;
const markers: { [key: string]: google.maps.Marker } = {};

export const mapsService = {
  async initializeMap(elementId: string, center: { lat: number; lng: number }) {
    try {
      const google = await loader.load();
      
      map = new google.maps.Map(document.getElementById(elementId)!, {
        center,
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      return map;
    } catch (error) {
      console.error('Error initializing map:', error);
      throw error;
    }
  },

  async addMarker(location: { lat: number; lng: number }, title: string, id: string) {
    if (!map) return;

    try {
      const google = await loader.load();
      
      // Remove existing marker if it exists
      if (markers[id]) {
        markers[id].setMap(null);
        delete markers[id];
      }

      // Create new marker
      const marker = new google.maps.Marker({
        position: location,
        map,
        title,
        animation: google.maps.Animation.DROP
      });

      // Store marker reference
      markers[id] = marker;

      // Add click listener
      marker.addListener('click', () => {
        const infoWindow = new google.maps.InfoWindow({
          content: `<div class="p-2">
            <h3 class="font-semibold">${title}</h3>
            <p class="text-sm">Lat: ${location.lat}</p>
            <p class="text-sm">Lng: ${location.lng}</p>
          </div>`
        });

        infoWindow.open(map, marker);
      });

      return marker;
    } catch (error) {
      console.error('Error adding marker:', error);
      throw error;
    }
  },

  async geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
    try {
      const google = await loader.load();
      const geocoder = new google.maps.Geocoder();

      return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng()
            });
          } else {
            reject(new Error('Geocoding failed'));
          }
        });
      });
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw error;
    }
  },

  async searchNearbyLocations(location: { lat: number; lng: number }, radius: number, type: string) {
    if (!map) return [];

    try {
      const google = await loader.load();
      const service = new google.maps.places.PlacesService(map);

      return new Promise((resolve, reject) => {
        service.nearbySearch({
          location,
          radius,
          type
        }, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            reject(new Error('Nearby search failed'));
          }
        });
      });
    } catch (error) {
      console.error('Error searching nearby locations:', error);
      throw error;
    }
  },

  removeMarker(id: string) {
    if (markers[id]) {
      markers[id].setMap(null);
      delete markers[id];
    }
  },

  clearMarkers() {
    Object.values(markers).forEach(marker => marker.setMap(null));
    Object.keys(markers).forEach(key => delete markers[key]);
  },

  panTo(location: { lat: number; lng: number }) {
    if (!map) return;
    map.panTo(location);
  },

  setZoom(zoom: number) {
    if (!map) return;
    map.setZoom(zoom);
  }
};