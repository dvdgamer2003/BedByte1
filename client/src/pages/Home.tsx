import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import api from '../utils/api';
import HospitalCard from '../components/HospitalCard';

const Home = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');

  const cities = ['Mumbai', 'Delhi', 'Bangalore'];
  const roomTypes = ['General', 'ICU', 'Private'];

  useEffect(() => {
    fetchHospitals();
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Find Hospital Beds Near You
        </h1>
        <p className="text-gray-600">
          Real-time bed availability and OPD queue management
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search hospitals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>

          <div className="flex gap-4 items-center">
            <Filter className="text-gray-600 h-5 w-5" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="input-field"
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
              className="input-field"
            >
              <option value="">All Room Types</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                setSelectedCity('');
                setSelectedRoomType('');
                setSearchQuery('');
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </form>
      </div>

      {/* Hospital List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading hospitals...</p>
        </div>
      ) : hospitals.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-gray-600">No hospitals found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital: any) => (
            <HospitalCard key={hospital._id} hospital={hospital} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
