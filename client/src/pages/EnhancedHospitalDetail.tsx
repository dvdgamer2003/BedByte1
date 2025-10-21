import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, Bed, AlertCircle, Building2, Calendar, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import socketService from '../utils/socket';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';

const EnhancedHospitalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hospital, setHospital] = useState<any>(null);
  const [bedAvailability, setBedAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    roomType: '',
    patientName: '',
    patientPhone: '',
    patientAge: '',
    medicalCondition: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchHospital();
    const socket = socketService.connect();
    socketService.joinHospital(id!);

    socketService.onBedUpdate((data) => {
      if (data.hospitalId === id) {
        setBedAvailability(data.bedAvailability);
      }
    });

    return () => {
      socketService.leaveHospital(id!);
      socketService.offBedUpdate();
    };
  }, [id]);

  const fetchHospital = async () => {
    try {
      const response = await api.get(`/hospitals/${id}`);
      setHospital(response.data.data);
      setBedAvailability(response.data.data.bedAvailability);
    } catch (error) {
      console.error('Failed to fetch hospital:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await api.post('/bookings/provisional', {
        hospitalId: id,
        ...bookingData,
      });
      alert(response.data.message);
      navigate('/my-bookings');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Hospital Not Found</h3>
          <Button onClick={() => navigate('/')} className="mt-4">
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  const lastUpdated = new Date(hospital.lastUpdated);
  const minutesAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
  const isStale = minutesAgo > 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            ← Back
          </Button>
          <Card className="p-8 border-0 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-blue-100 rounded-xl">
                  <Building2 className="h-12 w-12 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{hospital.name}</h1>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="text-lg">{hospital.city}</span>
                  </div>
                  <p className="text-gray-600">{hospital.address}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200">
                  <Clock className="h-4 w-4" />
                  <span className={isStale ? 'text-orange-600' : ''}>
                    Updated {minutesAgo < 1 ? 'just now' : `${minutesAgo}m ago`}
                  </span>
                </div>
                {isStale && (
                  <div className="flex items-center gap-1 text-orange-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Data may be stale</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                <Phone className="h-5 w-5 mr-2" />
                <span className="font-medium">{hospital.phone}</span>
              </div>
              {hospital.email && (
                <div className="text-gray-600">
                  {hospital.email}
                </div>
              )}
            </div>

            {hospital.description && (
              <p className="text-gray-700 mt-6 text-lg">{hospital.description}</p>
            )}

            <div className="flex flex-wrap gap-2 mt-6">
              {hospital.facilities?.map((facility: string) => (
                <Badge key={facility} variant="secondary">
                  {facility}
                </Badge>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Bed Availability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <CardHeader className="px-0">
            <CardTitle className="flex items-center text-2xl">
              <Bed className="h-7 w-7 mr-3 text-blue-600" />
              Live Bed Availability
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bedAvailability.map((room: any, index: number) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">{room._id}</h3>
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <p className="text-5xl font-bold text-blue-600 leading-none">
                          {room.available}
                        </p>
                        <p className="text-gray-600 mt-1">
                          of {room.total} available
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Price per day</p>
                        <p className="text-2xl font-bold text-gray-900">₹{room.price}</p>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          (room.available / room.total) > 0.5 
                            ? 'bg-gradient-to-r from-green-400 to-green-600' 
                            : (room.available / room.total) > 0.2
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                            : 'bg-gradient-to-r from-red-400 to-red-600'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(room.available / room.total) * 100}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Calendar className="h-7 w-7 mr-3 text-blue-600" />
                Book a Bed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBooking} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Type *
                    </label>
                    <select
                      required
                      value={bookingData.roomType}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, roomType: e.target.value })
                      }
                      className="w-full h-11 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Room Type</option>
                      {bedAvailability.map((room: any) => (
                        <option key={room._id} value={room._id}>
                          {room._id} - ₹{room.price}/day ({room.available} available)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="text"
                        required
                        value={bookingData.patientName}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, patientName: e.target.value })
                        }
                        className="pl-12"
                        placeholder="Full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="tel"
                        required
                        value={bookingData.patientPhone}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, patientPhone: e.target.value })
                        }
                        className="pl-12"
                        placeholder="10-digit number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <Input
                      type="number"
                      value={bookingData.patientAge}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, patientAge: e.target.value })
                      }
                      placeholder="Patient age"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Condition / Notes
                  </label>
                  <textarea
                    value={bookingData.medicalCondition}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, medicalCondition: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={4}
                    placeholder="Describe the medical condition or any special requirements..."
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Provisional Booking</p>
                    <p>You will have 15 minutes to confirm your booking after creation.</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={bookingLoading}
                  size="lg"
                  className="w-full md:w-auto px-8"
                >
                  {bookingLoading ? 'Creating Booking...' : 'Create Provisional Booking'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedHospitalDetail;
