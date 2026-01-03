/// <reference types="google.maps" />

export interface GoogleHospital {
  id: string;
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  userRatingsTotal?: number;
  location: {
    lat: number;
    lng: number;
  };
  isOpen?: boolean;
  photos?: string[];
  placeId: string;
}

export interface GooglePharmacy {
  id: string;
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  location: {
    lat: number;
    lng: number;
  };
  isOpen?: boolean;
  placeId: string;
}

// Load Google Maps script
export const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
      reject(new Error('Google Maps API key not configured. Please add it to .env file.'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    
    document.head.appendChild(script);
  });
};

// Search nearby hospitals using Google Places API
export const searchNearbyHospitals = (
  latitude: number,
  longitude: number,
  radius: number = 5000
): Promise<GoogleHospital[]> => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      reject(new Error('Google Maps not loaded'));
      return;
    }

    const location = new google.maps.LatLng(latitude, longitude);
    const map = new google.maps.Map(document.createElement('div'));
    const service = new google.maps.places.PlacesService(map);

    const request: google.maps.places.PlaceSearchRequest = {
      location,
      radius,
      type: 'hospital',
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const hospitals: GoogleHospital[] = results.map((place) => ({
          id: place.place_id || '',
          name: place.name || 'Unknown Hospital',
          address: place.vicinity || '',
          phone: place.formatted_phone_number,
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
          location: {
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0,
          },
          isOpen: place.opening_hours?.isOpen?.(),
          photos: place.photos?.map((photo) => 
            photo.getUrl({ maxWidth: 400, maxHeight: 300 })
          ),
          placeId: place.place_id || '',
        }));
        resolve(hospitals);
      } else {
        reject(new Error(`Places service failed: ${status}`));
      }
    });
  });
};

// Search nearby pharmacies using Google Places API
export const searchNearbyPharmacies = (
  latitude: number,
  longitude: number,
  radius: number = 5000
): Promise<GooglePharmacy[]> => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      reject(new Error('Google Maps not loaded'));
      return;
    }

    const location = new google.maps.LatLng(latitude, longitude);
    const map = new google.maps.Map(document.createElement('div'));
    const service = new google.maps.places.PlacesService(map);

    const request: google.maps.places.PlaceSearchRequest = {
      location,
      radius,
      type: 'pharmacy',
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const pharmacies: GooglePharmacy[] = results.map((place) => ({
          id: place.place_id || '',
          name: place.name || 'Unknown Pharmacy',
          address: place.vicinity || '',
          phone: place.formatted_phone_number,
          rating: place.rating,
          location: {
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0,
          },
          isOpen: place.opening_hours?.isOpen?.(),
          placeId: place.place_id || '',
        }));
        resolve(pharmacies);
      } else {
        reject(new Error(`Places service failed: ${status}`));
      }
    });
  });
};

// Get place details
export const getPlaceDetails = (placeId: string): Promise<google.maps.places.PlaceResult> => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      reject(new Error('Google Maps not loaded'));
      return;
    }

    const map = new google.maps.Map(document.createElement('div'));
    const service = new google.maps.places.PlacesService(map);

    const request: google.maps.places.PlaceDetailsRequest = {
      placeId,
      fields: [
        'name',
        'formatted_address',
        'formatted_phone_number',
        'rating',
        'opening_hours',
        'photos',
        'geometry',
        'user_ratings_total',
        'website',
      ],
    };

    service.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        resolve(place);
      } else {
        reject(new Error(`Failed to get place details: ${status}`));
      }
    });
  });
};

// Calculate distance between two points (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Distance in km, rounded to 1 decimal
};
