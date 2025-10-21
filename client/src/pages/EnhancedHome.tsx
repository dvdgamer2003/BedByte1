import { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import EnhancedHospitalCard from '../components/EnhancedHospitalCard';
import HospitalCardSkeleton from '../components/HospitalCardSkeleton';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

const EnhancedHome = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const cities = ['Mumbai', 'Delhi', 'Bangalore'];
  const roomTypes = ['General', 'ICU', 'Private'];

  useEffect(() => {
    fetchHospitals();
    const interval = setInterval(() => {
      fetchHospitals();
      setLastRefresh(new Date());
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [selectedCity, selectedRoomType]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedCity) params.city = selectedCity;
      if (selectedRoomType) params.roomType = selectedRoomType;
      if (searchQuery) params.search = searchQuery;

      const response = await api.get('/hospitals', { params });
      setHospitals(response.data.data);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHospitals();
  };

  const handleClearFilters = () => {
    setSelectedCity('');
    setSelectedRoomType('');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            Find Hospital Beds
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Near You
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real-time bed availability and OPD queue management across top hospitals
          </p>
          
          {/* Last updated indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6 mb-8 backdrop-blur-lg"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search hospitals by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex items-center gap-2">
                <Filter className="text-gray-600 h-5 w-5 flex-shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="flex-1 h-11 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                  className="flex-1 h-11 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Room Types</option>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" size="lg" className="flex-1 sm:flex-initial">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleClearFilters}
                  className="flex-1 sm:flex-initial"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCity || selectedRoomType || searchQuery) && (
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedCity && (
                  <Badge variant="secondary" className="text-sm">
                    City: {selectedCity}
                  </Badge>
                )}
                {selectedRoomType && (
                  <Badge variant="secondary" className="text-sm">
                    Room: {selectedRoomType}
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="text-sm">
                    Search: "{searchQuery}"
                  </Badge>
                )}
              </div>
            )}
          </form>
        </motion.div>

        {/* Hospital Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <HospitalCardSkeleton key={i} />
            ))}
          </div>
        ) : hospitals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-16"
          >
            <div className="text-6xl mb-4">🏥</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Hospitals Found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search criteria
            </p>
            <Button onClick={handleClearFilters} variant="outline">
              Clear All Filters
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((hospital: any, index: number) => (
                <EnhancedHospitalCard key={hospital._id} hospital={hospital} index={index} />
              ))}
            </div>

            {/* Pagination Placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center items-center gap-2 mt-12"
            >
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-2">
                <Button variant="default" size="icon">1</Button>
                <Button variant="outline" size="icon">2</Button>
                <Button variant="outline" size="icon">3</Button>
              </div>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedHome;
