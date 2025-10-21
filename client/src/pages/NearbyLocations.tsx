import { useState, useEffect } from 'react';
import { MapPin, Navigation, Building2, Pill, Phone, Home, Clock, Star, RefreshCw, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { getCurrentLocation, GeolocationCoords } from '../utils/geolocation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import LocationMap from '../components/LocationMap';

interface Hospital {
  _id: string;
  name: string;
  address: string;
  phone: string;
  coordinates: { lat: number; lng: number };
  availableBeds: number;
  totalBeds: number;
  opdAvailable: boolean;
  emergencyAvailable: boolean;
  distance: number;
}

interface MedicalStore {
  _id: string;
  name: string;
  address: string;
  phone: string;
  coordinates: { lat: number; lng: number };
  is24x7: boolean;
  homeDelivery: boolean;
  rating: number;
  availableMedicines: number;
  distance: number;
}

const NearbyLocations = () => {
  const [userLocation, setUserLocation] = useState<GeolocationCoords | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [medicalStores, setMedicalStores] = useState<MedicalStore[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [showPermissionModal, setShowPermissionModal] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [activeTab, setActiveTab] = useState<'hospitals' | 'medicals'>('hospitals');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchMedicine, setSearchMedicine] = useState('');
  const [maxDistance, setMaxDistance] = useState(5000); // 5km default

  useEffect(() => {
    if (userLocation) {
      fetchNearbyData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, maxDistance]);

  const getUserLocation = async () => {
    try {
      setLoading(true);
      setShowPermissionModal(false);
      const location = await getCurrentLocation();
      setUserLocation(location);
      setLocationError('');
      setPermissionDenied(false);
    } catch (error: any) {
      setLocationError(error.message);
      setPermissionDenied(true);
      // Use default Mumbai location as fallback
      setUserLocation({ latitude: 19.0760, longitude: 72.8777, accuracy: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleAllowLocation = () => {
    getUserLocation();
  };

  const handleDenyLocation = () => {
    setShowPermissionModal(false);
    setPermissionDenied(true);
    setLoading(false);
    // Use default Mumbai location
    setUserLocation({ latitude: 19.0760, longitude: 72.8777, accuracy: 0 });
  };

  const fetchNearbyData = async () => {
    if (!userLocation) return;

    try {
      setLoading(true);
      // Fetch nearby hospitals
      const hospitalsRes = await api.get('/hospitals/nearby', {
        params: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          maxDistance,
        },
      });
      setHospitals(hospitalsRes.data.data);

      // Fetch nearby medical stores
      const medicalsRes = await api.get('/medicals/nearby', {
        params: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          maxDistance,
          medicine: searchMedicine || undefined,
        },
      });
      setMedicalStores(medicalsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch nearby data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    getUserLocation();
  };

  const handleSearchMedicine = () => {
    if (userLocation) {
      fetchNearbyData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      {/* Location Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Enable Location Access
              </h2>
              <p className="text-gray-600 mb-6">
                To show you the nearest hospitals and medical stores, we need access to your location.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 font-semibold mb-2">Why we need this:</p>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Find hospitals with available beds near you</li>
                  <li>• Locate medical stores with medicines</li>
                  <li>• Show accurate distances</li>
                  <li>• Help in emergency situations</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleAllowLocation}
                  className="w-full h-12 text-lg"
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  Allow Location Access
                </Button>
                <Button 
                  onClick={handleDenyLocation}
                  variant="outline"
                  className="w-full h-12"
                >
                  Use Default Location
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-10 w-10 text-blue-600" />
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Nearby Locations</h1>
                <p className="text-gray-600">Find hospitals and medical stores near you</p>
              </div>
            </div>
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Location
            </Button>
          </div>

          {/* Location Info */}
          {locationError ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Navigation className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-800">Location {permissionDenied ? 'Denied' : 'Required'}</p>
                  <p className="text-sm text-yellow-700">{locationError}</p>
                  <p className="text-xs text-yellow-600 mt-1">Using default location (Mumbai)</p>
                </div>
              </div>
              <Button onClick={getUserLocation} size="sm" variant="outline">Try Again</Button>
            </div>
          ) : userLocation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <Navigation className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">Location Detected</p>
                <p className="text-sm text-green-700">
                  Lat: {userLocation.latitude.toFixed(4)}, Lng: {userLocation.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Radius
                </label>
                <select
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full h-11 px-4 border border-gray-300 rounded-xl bg-white"
                >
                  <option value={1000}>1 km</option>
                  <option value={2000}>2 km</option>
                  <option value={5000}>5 km</option>
                  <option value={10000}>10 km</option>
                  <option value={20000}>20 km</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Medicine (Medical Stores)
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Paracetamol, Aspirin..."
                    value={searchMedicine}
                    onChange={(e) => setSearchMedicine(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchMedicine()}
                  />
                  <Button onClick={handleSearchMedicine}>Search</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs and View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('hospitals')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'hospitals'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building2 className="h-5 w-5" />
              Hospitals ({hospitals.length})
            </button>
            <button
              onClick={() => setActiveTab('medicals')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'medicals'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Pill className="h-5 w-5" />
              Medical Stores ({medicalStores.length})
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="h-4 w-4" />
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Map className="h-4 w-4" />
              Map
            </button>
          </div>
        </div>

        {/* Map View */}
        {viewMode === 'map' && userLocation && (
          <div className="mb-6">
            <LocationMap
              userLocation={userLocation}
              locations={
                activeTab === 'hospitals'
                  ? hospitals.map((h) => ({
                      id: h._id,
                      name: h.name,
                      address: h.address,
                      phone: h.phone,
                      lat: h.coordinates.lat,
                      lng: h.coordinates.lng,
                      distance: h.distance,
                      type: 'hospital' as const,
                      availableBeds: h.availableBeds,
                      totalBeds: h.totalBeds,
                      opdAvailable: h.opdAvailable,
                      emergencyAvailable: h.emergencyAvailable,
                    }))
                  : medicalStores.map((m) => ({
                      id: m._id,
                      name: m.name,
                      address: m.address,
                      phone: m.phone,
                      lat: m.coordinates.lat,
                      lng: m.coordinates.lng,
                      distance: m.distance,
                      type: 'pharmacy' as const,
                      is24x7: m.is24x7,
                      homeDelivery: m.homeDelivery,
                      rating: m.rating,
                    }))
              }
              selectedType={activeTab === 'hospitals' ? 'hospital' : 'pharmacy'}
            />
          </div>
        )}

        {/* Hospitals Grid */}
        {viewMode === 'list' && activeTab === 'hospitals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hospitals found in this area</p>
              </div>
            ) : (
              hospitals.map((hospital, index) => (
                <motion.div
                  key={hospital._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow border-2 border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{hospital.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{hospital.distance} km away</span>
                          </div>
                        </div>
                        <Building2 className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">{hospital.address}</p>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <a href={`tel:${hospital.phone}`} className="text-sm text-blue-600 hover:underline">
                            {hospital.phone}
                          </a>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <div className="bg-green-50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-green-600">{hospital.availableBeds}</p>
                            <p className="text-xs text-gray-600">Available Beds</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-gray-600">{hospital.totalBeds}</p>
                            <p className="text-xs text-gray-600">Total Beds</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {hospital.opdAvailable && (
                            <Badge variant="secondary" className="text-xs">OPD Available</Badge>
                          )}
                          {hospital.emergencyAvailable && (
                            <Badge className="bg-red-100 text-red-700 text-xs">Emergency</Badge>
                          )}
                        </div>

                        <Button className="w-full mt-2" onClick={() => window.location.href = `/hospital/${hospital._id}`}>
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Medical Stores Grid */}
        {viewMode === 'list' && activeTab === 'medicals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicalStores.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchMedicine 
                    ? `No medical stores found with "${searchMedicine}" in this area` 
                    : 'No medical stores found in this area'}
                </p>
              </div>
            ) : (
              medicalStores.map((store, index) => (
                <motion.div
                  key={store._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow border-2 border-green-100">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{store.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{store.distance} km away</span>
                          </div>
                        </div>
                        <Pill className="h-8 w-8 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">{store.address}</p>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <a href={`tel:${store.phone}`} className="text-sm text-green-600 hover:underline">
                            {store.phone}
                          </a>
                        </div>

                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-2xl font-bold text-green-600 text-center">
                            {store.availableMedicines}
                          </p>
                          <p className="text-xs text-gray-600 text-center">Medicines Available</p>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">{store.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex gap-2">
                            {store.is24x7 && (
                              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                24×7
                              </Badge>
                            )}
                            {store.homeDelivery && (
                              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                <Home className="h-3 w-3" />
                                Delivery
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Button 
                          className="w-full mt-2 bg-green-600 hover:bg-green-700" 
                          onClick={() => window.open(`tel:${store.phone}`)}
                        >
                          Call Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyLocations;
