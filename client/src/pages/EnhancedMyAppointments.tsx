import { useState, useEffect } from 'react';
import { Calendar, Stethoscope, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';

const EnhancedMyAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/my');
      setAppointments(response.data.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await api.delete(`/appointments/${appointmentId}`);
      alert('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to cancel appointment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'default';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      case 'no-show':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return apt.status === 'scheduled';
    if (filter === 'past') return apt.status === 'completed';
    if (filter === 'cancelled') return apt.status === 'cancelled';
    return true;
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600 text-lg">Manage your doctor appointments</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {['all', 'upcoming', 'past', 'cancelled'].map((tab) => (
              <Button
                key={tab}
                onClick={() => setFilter(tab)}
                variant={filter === tab ? 'default' : 'outline'}
                className="capitalize"
              >
                {tab === 'all' ? 'All Appointments' : tab}
              </Button>
            ))}
          </div>
        </motion.div>

        {filteredAppointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-16 text-center border-0 shadow-lg">
              <Calendar className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Appointments Found</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all'
                  ? "You haven't booked any appointments yet"
                  : `No ${filter} appointments`}
              </p>
              <Button onClick={() => (window.location.href = '/doctors')}>
                Book Appointment
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all border-0 shadow-md">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <Stethoscope className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {appointment.doctorId?.name}
                          </h3>
                          <p className="text-blue-600 font-medium mb-2">
                            {appointment.doctorId?.specialization}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getStatusColor(appointment.status)} className="flex items-center gap-1">
                              {getStatusIcon(appointment.status)}
                              {appointment.status.toUpperCase()}
                            </Badge>
                            <Badge variant={getPaymentStatusColor(appointment.paymentStatus)}>
                              Payment: {appointment.paymentStatus.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">₹{appointment.consultationFee}</p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(appointment.appointmentDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Time</p>
                          <p className="font-semibold text-gray-900">{appointment.appointmentTime}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Hospital</p>
                          <p className="font-semibold text-gray-900">{appointment.hospitalId?.name}</p>
                        </div>
                      </div>
                    </div>

                    {appointment.symptoms && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Symptoms</p>
                        <p className="text-gray-600">{appointment.symptoms}</p>
                      </div>
                    )}

                    {appointment.diagnosis && (
                      <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
                        <p className="text-sm font-semibold text-green-900 mb-1">Diagnosis</p>
                        <p className="text-green-800">{appointment.diagnosis}</p>
                      </div>
                    )}

                    {appointment.prescription && (
                      <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
                        <p className="text-sm font-semibold text-blue-900 mb-1">Prescription</p>
                        <p className="text-blue-800">{appointment.prescription}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {appointment.status === 'scheduled' && (
                        <>
                          {appointment.paymentStatus === 'pending' && (
                            <Button className="bg-green-600 hover:bg-green-700">
                              Complete Payment
                            </Button>
                          )}
                          <Button
                            onClick={() => handleCancel(appointment._id)}
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Cancel Appointment
                          </Button>
                        </>
                      )}

                      {appointment.status === 'completed' && (
                        <Button variant="outline">
                          Download Receipt
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

export default EnhancedMyAppointments;
