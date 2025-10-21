import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stethoscope, Star, Award, MapPin, Phone, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';

const EnhancedDoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (selectedDate && doctor) {
      checkAvailability();
    }
  }, [selectedDate]);

  const fetchDoctor = async () => {
    try {
      const response = await api.get(`/doctors/${id}`);
      setDoctor(response.data.data);
    } catch (error) {
      console.error('Failed to fetch doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    setCheckingSlots(true);
    try {
      const response = await api.get('/doctors/availability', {
        params: { doctorId: id, date: selectedDate },
      });
      setAvailableSlots(response.data.data.slots || []);
    } catch (error) {
      console.error('Failed to check availability:', error);
    } finally {
      setCheckingSlots(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedSlot) {
      alert('Please select date and time slot');
      return;
    }

    setBookingLoading(true);
    try {
      await api.post('/appointments', {
        doctorId: id,
        hospitalId: doctor.hospitalId._id,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot,
        symptoms,
      });

      alert('Appointment booked successfully! Please complete the payment.');
      navigate('/my-appointments');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to book appointment');
    } finally {
      setBookingLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-48 mx-auto mb-8" />
            <Skeleton className="h-48 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Doctor Not Found</h3>
          <Button onClick={() => navigate('/doctors')}>Back to Doctors</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate('/doctors')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Doctors
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Profile */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-0 shadow-lg sticky top-8">
                <CardContent className="p-6 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="h-16 w-16 text-blue-600" />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{doctor.name}</h2>
                  <p className="text-blue-600 font-semibold mb-3">{doctor.specialization}</p>

                  <div className="flex items-center justify-center gap-1 mb-4">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{doctor.rating}</span>
                    <span className="text-gray-500">({doctor.totalReviews} reviews)</span>
                  </div>

                  <div className="space-y-3 text-left mb-6">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Award className="h-5 w-5 text-blue-600" />
                      <span className="text-sm">{doctor.qualification}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Stethoscope className="h-5 w-5 text-blue-600" />
                      <span className="text-sm">{doctor.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="text-sm">{doctor.hospitalId?.name}</span>
                    </div>
                    {doctor.hospitalId?.phone && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">{doctor.hospitalId.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Consultation Fee</p>
                    <p className="text-3xl font-bold text-blue-600">₹{doctor.consultationFee}</p>
                  </div>

                  {doctor.upcomingAppointments !== undefined && (
                    <p className="text-sm text-gray-600">
                      {doctor.upcomingAppointments} upcoming appointments
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    Book Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date *
                    </label>
                    <Input
                      type="date"
                      min={getMinDate()}
                      max={getMaxDate()}
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedSlot('');
                      }}
                      className="h-11"
                    />
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Time Slot *
                      </label>
                      {checkingSlots ? (
                        <div className="grid grid-cols-3 gap-3">
                          {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-12 rounded-lg" />
                          ))}
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No slots available for this date</p>
                          <p className="text-sm text-gray-500">Please select another date</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {availableSlots.map((slot) => (
                            <motion.button
                              key={slot}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedSlot(slot)}
                              className={`p-3 rounded-lg border-2 font-medium transition-all ${
                                selectedSlot === slot
                                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                            >
                              <Clock className="h-4 w-4 inline mr-2" />
                              {slot}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Symptoms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symptoms / Reason for Visit
                    </label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Describe your symptoms or reason for consultation..."
                    />
                  </div>

                  {/* Summary */}
                  {selectedDate && selectedSlot && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200"
                    >
                      <h4 className="font-semibold text-gray-900 mb-3">Appointment Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Doctor:</span>
                          <span className="font-semibold">{doctor.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-semibold">
                            {new Date(selectedDate).toLocaleDateString('en-IN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-semibold">{selectedSlot}</span>
                        </div>
                        <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
                          <span className="text-gray-600">Consultation Fee:</span>
                          <span className="font-bold text-blue-600 text-lg">
                            ₹{doctor.consultationFee}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <Button
                    onClick={handleBookAppointment}
                    disabled={!selectedDate || !selectedSlot || bookingLoading}
                    className="w-full h-12 text-base"
                  >
                    {bookingLoading ? 'Booking...' : 'Book Appointment & Pay'}
                  </Button>

                  <p className="text-xs text-center text-gray-600">
                    Payment required to confirm appointment
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDoctorProfile;
