import { useState, useEffect } from 'react';
import { Calendar, MapPin, Bed, User as UserIcon, Phone, Mail, Filter, Search, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';

const EnhancedAdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterHospital, setFilterHospital] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHospitals();
    fetchBookings();
  }, [filterStatus, filterHospital]);

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/hospitals');
      setHospitals(response.data.data);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterStatus) params.status = filterStatus;
      if (filterHospital) params.hospitalId = filterHospital;

      const [bookingsResponse, appointmentsResponse] = await Promise.all([
        api.get('/bookings/all', { params }),
        api.get('/appointments/all', { params })
      ]);

      const bedBookings = bookingsResponse.data.data.map((booking: any) => ({ ...booking, type: 'bed' }));
      const doctorAppointments = appointmentsResponse.data.data.map((appointment: any) => ({ ...appointment, type: 'appointment' }));

      setBookings(bedBookings);
      setAppointments(doctorAppointments);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
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

  const filteredBookings = [...bookings, ...appointments].filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const patientName = item.type === 'bed' ? item.patientName : item.patientId?.name;
    const patientPhone = item.type === 'bed' ? item.patientPhone : item.patientId?.phone;
    const hospitalName = item.hospitalId?.name?.toLowerCase().includes(searchLower);
    return (
      patientName?.toLowerCase().includes(searchLower) ||
      patientPhone?.includes(searchTerm) ||
      hospitalName
    );
  });

  const stats = {
    total: bookings.length + appointments.length,
    provisional: bookings.filter(b => b.status === 'provisional').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    admitted: bookings.filter(b => b.status === 'admitted').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Bookings</h1>
          <p className="text-gray-600 text-lg">Manage all hospital bed reservations</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <p className="text-blue-100 mb-2">Total Bookings</p>
              <p className="text-5xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <p className="text-yellow-100 mb-2">Provisional</p>
              <p className="text-5xl font-bold">{stats.provisional}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <p className="text-indigo-100 mb-2">Confirmed</p>
              <p className="text-5xl font-bold">{stats.confirmed}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <p className="text-green-100 mb-2">Admitted</p>
              <p className="text-5xl font-bold">{stats.admitted}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search by patient name, phone, or hospital..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-600 h-5 w-5" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-11 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">All Statuses</option>
                    <option value="provisional">Provisional</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="admitted">Admitted</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                  </select>
                  <select
                    value={filterHospital}
                    onChange={(e) => setFilterHospital(e.target.value)}
                    className="h-11 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">All Hospitals</option>
                    {hospitals.map((hospital) => (
                      <option key={hospital._id} value={hospital._id}>
                        {hospital.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card className="p-16 text-center border-0 shadow-lg">
            <Calendar className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No Bookings Found</h3>
            <p className="text-gray-500">There are no bookings matching your current filters.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {item.type === 'bed' ? (
                  <Card className="overflow-hidden hover:shadow-lg transition-all border-0 shadow-md">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                              <Bed className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {item.hospitalId?.name || 'Unknown Hospital'}
                              </h3>
                              <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                                <span>{item.hospitalId?.city}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={getStatusColor(item.status)}>
                                  {item.status.toUpperCase()}
                                </Badge>
                                {item.roomType && (
                                  <Badge variant="secondary">{item.roomType} Room</Badge>
                                )}
                                {item.bedId && (
                                  <Badge variant="outline">Bed: {item.bedId.bedNumber}</Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Patient Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                              <UserIcon className="h-5 w-5 text-gray-600" />
                              <div>
                                <p className="text-sm text-gray-600">Patient</p>
                                <p className="font-semibold text-gray-900">{item.patientName}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="h-5 w-5 text-gray-600" />
                              <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="font-semibold text-gray-900">{item.patientPhone}</p>
                              </div>
                            </div>
                            {item.patientId?.email && (
                              <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-gray-600" />
                                <div>
                                  <p className="text-sm text-gray-600">Email</p>
                                  <p className="font-semibold text-gray-900">{item.patientId.email}</p>
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-gray-600" />
                              <div>
                                <p className="text-sm text-gray-600">Booking Date</p>
                                <p className="font-semibold text-gray-900">
                                  {new Date(item.createdAt).toLocaleString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>

                          {item.medicalCondition && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                              <p className="text-sm font-semibold text-gray-700 mb-1">Medical Condition</p>
                              <p className="text-gray-600">{item.medicalCondition}</p>
                            </div>
                          )}
                        </div>

                        {/* Right Section - Contact Hospital */}
                        <div className="lg:w-64">
                          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                            <CardHeader>
                              <CardTitle className="text-sm">Hospital Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-blue-600" />
                                <a href={`tel:${item.hospitalId?.phone}`} className="text-blue-600 hover:underline">
                                  {item.hospitalId?.phone}
                                </a>
                              </div>
                              {item.hospitalId?.email && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-4 w-4 text-blue-600" />
                                  <a href={`mailto:${item.hospitalId?.email}`} className="text-blue-600 hover:underline">
                                    {item.hospitalId?.email}
                                  </a>
                                </div>
                              )}
                              <p className="text-xs text-gray-600 mt-2">{item.hospitalId?.address}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="overflow-hidden hover:shadow-lg transition-all border-0 shadow-md">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                              <Stethoscope className="h-8 w-8 text-green-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Dr. {item.doctorId?.name}
                              </h3>
                              <p className="text-blue-600 font-medium mb-2">{item.doctorId?.specialization}</p>
                              <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                                <span>{item.hospitalId?.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                  {item.status?.toUpperCase() || 'SCHEDULED'}
                                </Badge>
                                <Badge variant="outline">Appointment</Badge>
                              </div>
                            </div>
                          </div>

                          {/* Patient Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                              <UserIcon className="h-5 w-5 text-gray-600" />
                              <div>
                                <p className="text-sm text-gray-600">Patient</p>
                                <p className="font-semibold text-gray-900">{item.patientId?.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="h-5 w-5 text-gray-600" />
                              <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="font-semibold text-gray-900">{item.patientId?.phone}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-gray-600" />
                              <div>
                                <p className="text-sm text-gray-600">Appointment Date</p>
                                <p className="font-semibold text-gray-900">
                                  {new Date(item.appointmentDate).toLocaleDateString('en-IN')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-gray-600" />
                              <div>
                                <p className="text-sm text-gray-600">Time Slot</p>
                                <p className="font-semibold text-gray-900">{item.timeSlot}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAdminBookings;
