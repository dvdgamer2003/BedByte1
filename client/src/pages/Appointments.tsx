import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  Star,
  ArrowRight,
  User,
  Stethoscope,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Toast from '../components/Toast';

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviewCount: number;
  profileImage?: string;
  hospital: {
    _id: string;
    name: string;
    location: string;
  };
  consultationFee: number;
  availability: {
    days: string[];
    timeSlots: string[];
  };
  bio?: string;
  qualifications: string[];
}

interface Hospital {
  _id: string;
  name: string;
  location: string;
  rating: number;
}

const Appointments = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedHospital, setSelectedHospital] = useState('all');
  const [bookingModal, setBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingForm, setBookingForm] = useState({
    appointmentDate: '',
    appointmentTime: '',
    symptoms: '',
    notes: ''
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const specializations = [
    'all', 'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology',
    'Gynecology', 'Pediatrics', 'Dentistry', 'Ophthalmology', 'ENT'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [doctorsRes, hospitalsRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/hospitals')
      ]);
      setDoctors(doctorsRes.data.data || []);
      setHospitals(hospitalsRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setToast({ message: 'Failed to load doctors and hospitals', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doctor.hospital?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesSpecialization = selectedSpecialization === 'all' ||
                                 doctor.specialization === selectedSpecialization;

    const matchesHospital = selectedHospital === 'all' ||
                           doctor.hospital?._id === selectedHospital;

    return matchesSearch && matchesSpecialization && matchesHospital;
  });

  const handleBookAppointment = (doctor: Doctor) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSelectedDoctor(doctor);
    setBookingModal(true);
  };

  const submitBooking = async () => {
    if (!selectedDoctor) return;

    try {
      const bookingData = {
        doctorId: selectedDoctor._id,
        hospitalId: selectedDoctor.hospital?._id,
        ...bookingForm
      };

      await api.post('/appointments', bookingData);

      setToast({ message: 'Appointment booked successfully!', type: 'success' });
      setBookingModal(false);
      setBookingForm({
        appointmentDate: '',
        appointmentTime: '',
        symptoms: '',
        notes: ''
      });
      setSelectedDoctor(null);
    } catch (error: any) {
      setToast({
        message: error.response?.data?.error || 'Failed to book appointment',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-16 bg-gray-300 rounded w-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Book Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Appointment</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with top doctors and book appointments instantly
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Specialization Filter */}
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white"
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>
                  {spec === 'all' ? 'All Specializations' : spec}
                </option>
              ))}
            </select>

            {/* Hospital Filter */}
            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white"
            >
              <option value="all">All Hospitals</option>
              {hospitals.map(hospital => (
                <option key={hospital._id} value={hospital._id}>
                  {hospital.name}
                </option>
              ))}
            </select>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Link to="/emergency-booking">
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Emergency
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-gray-600">
            Found <span className="font-semibold text-blue-600">{filteredDoctors.length}</span> doctors
          </p>
        </motion.div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <Stethoscope className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Doctors Found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialization('all');
                setSelectedHospital('all');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50 pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                          {doctor.name}
                        </CardTitle>
                        <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{doctor.rating || 0}</span>
                            <span className="text-sm text-gray-500">({doctor.reviewCount || 0})</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {doctor.experience || 0} yrs exp
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Hospital Info */}
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{doctor.hospital?.name || 'Hospital not specified'}</span>
                      </div>

                      {/* Availability */}
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>
                          {doctor.availability?.days?.slice(0, 3).join(', ') || 'Not available'}
                          {doctor.availability?.days?.length > 3 && '...'}
                        </span>
                      </div>

                      {/* Fee */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Consultation Fee</span>
                        <span className="text-2xl font-bold text-green-600">₹{doctor.consultationFee || 0}</span>
                      </div>

                      {/* Qualifications */}
                      {doctor.qualifications && doctor.qualifications.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Qualifications</p>
                          <div className="flex flex-wrap gap-1">
                            {doctor.qualifications.slice(0, 2).map((qual, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {qual}
                              </Badge>
                            ))}
                            {doctor.qualifications.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{doctor.qualifications.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => handleBookAppointment(doctor)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Now
                        </Button>
                        <Link to={`/doctors/${doctor._id}`}>
                          <Button variant="outline" className="px-4">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Booking Modal */}
        {bookingModal && selectedDoctor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>

              {/* Doctor Info */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedDoctor.name}</h3>
                    <p className="text-blue-600">{selectedDoctor.specialization}</p>
                    <p className="text-sm text-gray-600">{selectedDoctor.hospital?.name || 'Hospital not specified'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Date</label>
                  <Input
                    type="date"
                    value={bookingForm.appointmentDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, appointmentDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Time</label>
                  <select
                    value={bookingForm.appointmentTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, appointmentTime: e.target.value })}
                    className="w-full p-3 border rounded-lg bg-white"
                  >
                    <option value="">Select time slot</option>
                    {selectedDoctor?.availability?.timeSlots?.map((slot: string) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    )) || []}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Symptoms/Reason for Visit</label>
                  <textarea
                    value={bookingForm.symptoms}
                    onChange={(e) => setBookingForm({ ...bookingForm, symptoms: e.target.value })}
                    className="w-full p-3 border rounded-lg resize-none"
                    rows={3}
                    placeholder="Describe your symptoms or reason for visit..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    className="w-full p-3 border rounded-lg resize-none"
                    rows={2}
                    placeholder="Any additional information..."
                  />
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Consultation Fee</span>
                    <span className="text-2xl font-bold text-blue-600">₹{selectedDoctor.consultationFee || 0}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Payment will be collected after appointment confirmation
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={submitBooking}
                    disabled={!bookingForm.appointmentDate || !bookingForm.appointmentTime || !bookingForm.symptoms}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setBookingModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Appointments;
