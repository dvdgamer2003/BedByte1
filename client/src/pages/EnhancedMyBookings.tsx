import { useState, useEffect } from 'react';
import { Calendar, MapPin, Bed, Clock, CheckCircle, XCircle, AlertCircle, User, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';

const EnhancedMyBookings = () => {
  const [bedBookings, setBedBookings] = useState<any[]>([]);
  const [doctorAppointments, setDoctorAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const [bedBookingsRes, appointmentsRes] = await Promise.all([
        api.get('/bookings/my-bookings'),
        api.get('/appointments/my').catch(() => ({ data: { data: [] } }))
      ]);
      setBedBookings(bedBookingsRes.data.data || []);
      setDoctorAppointments(appointmentsRes.data.data || []);
    } catch (error: any) {
      console.error('Failed to fetch bookings:', error);
      setError(error.response?.data?.error || error.message || 'Failed to load bookings. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId: string) => {
    try {
      await api.post(`/bookings/${bookingId}/confirm`);
      alert('Booking confirmed successfully!');
      fetchBookings();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to confirm booking');
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      alert('Booking cancelled successfully');
      fetchBookings();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'provisional':
        return 'warning';
      case 'confirmed':
        return 'default';
      case 'admitted':
        return 'success';
      case 'cancelled':
        return 'destructive';
      case 'expired':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'provisional':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Bookings</h1>
          <Card className="p-16 text-center border-0 shadow-lg">
            <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Bookings</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={fetchBookings}>Try Again</Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Go Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600 text-lg">Manage your hospital bed reservations</p>
        </motion.div>

        {bedBookings.length === 0 && doctorAppointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-16 text-center border-0 shadow-lg">
              <Calendar className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't made any bookings or appointments yet
              </p>
              <Button onClick={() => window.location.href = '/'}>
                Browse Hospitals
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Doctor Appointments */}
            {doctorAppointments.map((appointment: any, index: number) => (
              <motion.div
                key={`appointment-${appointment._id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all border-0 shadow-md">
                  <div className="flex items-start justify-between p-6 bg-gradient-to-r from-green-50/50 to-blue-50/50">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Stethoscope className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Dr. {appointment.doctorId?.name || 'Doctor'}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{appointment.hospitalId?.name || 'Hospital'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {appointment.status?.toUpperCase() || 'SCHEDULED'}
                          </Badge>
                          <Badge variant="secondary">
                            {appointment.doctorId?.specialization || 'General'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Appointment ID</p>
                      <p className="font-mono text-xs text-gray-700">{appointment._id?.slice(-8) || 'N/A'}</p>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Appointment Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(appointment.appointmentDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Time</p>
                        <p className="font-semibold text-gray-900">
                          {appointment.appointmentTime || 'TBD'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Fee</p>
                        <p className="font-semibold text-gray-900">
                          ₹{appointment.doctorId?.consultationFee || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Booked On</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(appointment.createdAt || Date.now()).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {appointment.symptoms && (
                      <div className="flex items-start text-gray-700 bg-gray-50 px-4 py-3 rounded-xl mb-6">
                        <User className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Symptoms: </span>
                          <span>{appointment.symptoms}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Bed Bookings */}
            {bedBookings.map((booking: any, index: number) => (
              <motion.div
                key={`bed-${booking._id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (doctorAppointments.length + index) * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all border-0 shadow-md">
                  <div className="flex items-start justify-between p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Bed className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {booking.hospitalId?.name || 'Hospital'}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{booking.hospitalId?.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(booking.status)} className="flex items-center gap-1">
                            {getStatusIcon(booking.status)}
                            {booking.status.toUpperCase()}
                          </Badge>
                          {booking.roomType && (
                            <Badge variant="secondary">
                              {booking.roomType} Room
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Booking ID</p>
                      <p className="font-mono text-xs text-gray-700">{booking._id.slice(-8)}</p>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Patient Name</p>
                        <p className="font-semibold text-gray-900">{booking.patientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Contact</p>
                        <p className="font-semibold text-gray-900">{booking.patientPhone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Booking Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Time</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(booking.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {booking.bedId && (
                      <div className="flex items-center text-gray-700 bg-gray-50 px-4 py-3 rounded-xl mb-6">
                        <Bed className="h-5 w-5 mr-3 text-blue-600" />
                        <span className="font-medium">Bed Number: {booking.bedId.bedNumber}</span>
                      </div>
                    )}

                    {booking.status === 'provisional' && booking.provisionalExpiry && (
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-yellow-900 mb-1">Action Required</p>
                            <p className="text-sm text-yellow-800">
                              Expires in:{' '}
                              <span className="font-bold">
                                {Math.max(
                                  0,
                                  Math.floor((new Date(booking.provisionalExpiry).getTime() - Date.now()) / 60000)
                                )}{' '}
                                minutes
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {booking.status === 'provisional' && (
                        <>
                          <Button
                            onClick={() => handleConfirm(booking._id)}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Confirm Booking
                          </Button>
                          <Button
                            onClick={() => handleCancel(booking._id)}
                            variant="outline"
                            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4" />
                            Cancel
                          </Button>
                        </>
                      )}

                      {booking.status === 'confirmed' && (
                        <Button
                          onClick={() => handleCancel(booking._id)}
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Cancel Booking
                        </Button>
                      )}

                      {(booking.status === 'cancelled' || booking.status === 'expired') && (
                        <Button
                          variant="outline"
                          onClick={() => window.location.href = `/hospital/${booking.hospitalId?._id}`}
                        >
                          Book Again
                        </Button>
                      )}
                    </div>
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

export default EnhancedMyBookings;
