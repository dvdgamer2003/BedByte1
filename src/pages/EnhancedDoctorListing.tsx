import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Stethoscope, Star, Award, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';

const EnhancedDoctorListing = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [hospitals, setHospitals] = useState<any[]>([]);

  const specializations = [
    'General Medicine',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'Dermatology',
    'ENT',
    'Ophthalmology',
    'Psychiatry',
    'Emergency Medicine',
  ];

  useEffect(() => {
    fetchHospitals();
    fetchDoctors();
  }, [selectedSpecialization, selectedHospital]);

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/hospitals');
      setHospitals(response.data.data);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedSpecialization) params.specialization = selectedSpecialization;
      if (selectedHospital) params.hospitalId = selectedHospital;
      if (searchQuery) params.search = searchQuery;

      const response = await api.get('/doctors', { params });
      setDoctors(response.data.data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDoctors();
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      searchQuery === '' ||
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Stethoscope className="h-10 w-10 text-blue-600" />
            Find a Doctor
          </h1>
          <p className="text-gray-600 text-lg">Book appointments with top specialists</p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search by doctor name or specialization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12"
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <Filter className="text-gray-600 h-5 w-5" />
                    <select
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                      className="flex-1 h-11 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">All Specializations</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedHospital}
                      onChange={(e) => setSelectedHospital(e.target.value)}
                      className="flex-1 h-11 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">All Hospitals</option>
                      {hospitals.map((hospital) => (
                        <option key={hospital._id} value={hospital._id}>
                          {hospital.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button type="submit" size="lg">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                {(selectedSpecialization || selectedHospital) && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {selectedSpecialization && (
                      <Badge variant="secondary">{selectedSpecialization}</Badge>
                    )}
                    {selectedHospital && (
                      <Badge variant="secondary">
                        {hospitals.find((h) => h._id === selectedHospital)?.name}
                      </Badge>
                    )}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Doctor Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <Card className="p-16 text-center border-0 shadow-lg">
            <Stethoscope className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Doctors Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters</p>
            <Button
              onClick={() => {
                setSelectedSpecialization('');
                setSelectedHospital('');
                setSearchQuery('');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all border-0 shadow-md h-full">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Stethoscope className="h-12 w-12 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                      <p className="text-blue-600 font-medium mb-2">{doctor.specialization}</p>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{doctor.rating}</span>
                        <span className="text-gray-500 text-sm">({doctor.totalReviews} reviews)</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-700">{doctor.qualification}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-700">{doctor.hospitalId?.name}</span>
                      </div>
                      <div className="text-center py-2">
                        <span className="text-2xl font-bold text-blue-600">₹{doctor.consultationFee}</span>
                        <span className="text-gray-600 text-sm"> / consultation</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => navigate(`/doctors/${doctor._id}`)}
                      className="w-full"
                    >
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDoctorListing;
