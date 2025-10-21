import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for different types
const hospitalIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#2563eb">
      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm-1 6h2v3h3v2h-3v3h-2v-3H8v-2h3V8z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const pharmacyIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#16a34a">
      <path d="M21 5h-2.64l1.14-3.14L17.15 1l-1.46 4H3v2l2 6-2 6v2h18v-2l-2-6 2-6V5zm-5 9h-3v3h-2v-3H8v-2h3V9h2v3h3v2z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#dc2626">
      <circle cx="12" cy="12" r="8" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  distance: number;
  type: 'hospital' | 'pharmacy';
  availableBeds?: number;
  totalBeds?: number;
  opdAvailable?: boolean;
  emergencyAvailable?: boolean;
  is24x7?: boolean;
  homeDelivery?: boolean;
  rating?: number;
}

interface LocationMapProps {
  userLocation: { latitude: number; longitude: number };
  locations: Location[];
  selectedType: 'hospital' | 'pharmacy';
}

// Component to handle map centering
function MapCenterController({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

const LocationMap: React.FC<LocationMapProps> = ({ userLocation, locations, selectedType }) => {
  const center: [number, number] = [userLocation.latitude, userLocation.longitude];

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapCenterController center={center} />
        
        {/* OpenStreetMap Tiles - 100% FREE! */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        <Marker position={center} icon={userIcon}>
          <Popup>
            <div className="font-semibold">📍 Your Location</div>
          </Popup>
        </Marker>

        {/* Location Markers */}
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={selectedType === 'hospital' ? hospitalIcon : pharmacyIcon}
          >
            <Popup maxWidth={300}>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2">{location.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                
                <div className="space-y-1 text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">📞</span>
                    <a href={`tel:${location.phone}`} className="text-blue-600 hover:underline">
                      {location.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">📏</span>
                    <span>{location.distance} km away</span>
                  </div>
                </div>

                {selectedType === 'hospital' && (
                  <div className="bg-blue-50 rounded p-2 text-sm">
                    <div className="font-semibold text-blue-900">
                      🛏️ Available Beds: {location.availableBeds}/{location.totalBeds}
                    </div>
                    {location.opdAvailable && (
                      <div className="text-blue-700">✓ OPD Available</div>
                    )}
                    {location.emergencyAvailable && (
                      <div className="text-red-700">🚨 Emergency Available</div>
                    )}
                  </div>
                )}

                {selectedType === 'pharmacy' && (
                  <div className="bg-green-50 rounded p-2 text-sm">
                    {location.rating && (
                      <div className="text-yellow-600 mb-1">
                        ⭐ {location.rating.toFixed(1)}
                      </div>
                    )}
                    {location.is24x7 && (
                      <div className="text-green-700">🕐 Open 24×7</div>
                    )}
                    {location.homeDelivery && (
                      <div className="text-green-700">🏠 Home Delivery</div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`,
                    '_blank'
                  )}
                  className="mt-2 w-full bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
                >
                  Get Directions
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LocationMap;
