import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  FileText,
  Phone,
  Mail,
  Activity,
  Building2,
  Stethoscope,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import api from '../../utils/api';

interface Appointment {
  _id: string;
  patientId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  doctorId: {
    _id: string;
    name: string;
    specialization: string;
  };
  hospitalId: {
    _id: string;
    name: string;
  };
  appointmentDate: string;
  appointmentTime: string;
  timeSlot: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  symptoms: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  consultationFee: number;
}

const HospitalManagerDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, statusFilter, dateFilter, doctorFilter, appointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Fetch all appointments - backend will filter by hospital staff's hospital
      const response = await api.get('/appointments');
      setAppointments(response.data.data);
    } catch (error: any) {
      console.error('Failed to fetch appointments:', error);
      alert(error.response?.data?.error || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.patientId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctorId.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(apt =>
        apt.appointmentDate.startsWith(dateFilter)
      );
    }

    if (doctorFilter) {
      filtered = filtered.filter(apt => apt.doctorId._id === doctorFilter);
    }

    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      setLoading(true);
      await api.put(`/appointments/${appointmentId}`, { status: newStatus });
      alert('Appointment status updated successfully!');
      fetchAppointments();
      setShowDetailModal(false);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      'no-show': 'bg-gray-100 text-gray-800',
    };
    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const stats = {
    total: appointments.length,
    today: appointments.filter(a => 
      a.appointmentDate === new Date().toISOString().split('T')[0] && 
      a.status === 'scheduled'
    ).length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  // Get unique doctors for filter
  const uniqueDoctors = Array.from(
    new Map(appointments.map(apt => [apt.doctorId._id, apt.doctorId])).values()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-10 w-10 text-cyan-600" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Hospital Manager Dashboard
                </h1>
              </div>
              <p className="text-gray-600">Manage hospital appointments and operations</p>
            </div>
            <div className="flex gap-2">
              <Link to="/hospital/approvals">
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
                  <Users className="h-4 w-4" />
                  Doctor Approvals
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm">Total Appointments</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Calendar className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">Today's Appointments</p>
                  <p className="text-3xl font-bold">{stats.today}</p>
                </div>
                <Clock className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Scheduled</p>
                  <p className="text-3xl font-bold">{stats.scheduled}</p>
                </div>
                <Activity className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Completed</p>
                  <p className="text-3xl font-bold">{stats.completed}</p>
                </div>
                <CheckCircle className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search patient or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Doctors</option>
                  {uniqueDoctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>

              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No appointments found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <motion.div
                    key={appointment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                          {appointment.patientId.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-gray-900">
                              {appointment.patientId.name}
                            </h3>
                            <span className="text-gray-400">→</span>
                            <p className="text-sm text-cyan-600 font-semibold flex items-center gap-1">
                              <Stethoscope className="h-4 w-4" />
                              Dr. {appointment.doctorId.name}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">{appointment.doctorId.specialization}</p>
                          <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(appointment.appointmentDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {appointment.appointmentTime || appointment.timeSlot}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {appointment.patientId.phone}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(appointment.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDetailModal(appointment)}
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8"
          >
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Appointment Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:bg-white/20"
                >
                  <XCircle className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient & Doctor Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-cyan-600 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Patient Information
                  </h3>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg font-semibold">{selectedAppointment.patientId.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-base flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {selectedAppointment.patientId.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-base flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedAppointment.patientId.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-blue-600 flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Doctor Information
                  </h3>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg font-semibold">Dr. {selectedAppointment.doctorId.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Specialization</label>
                    <p className="text-base">{selectedAppointment.doctorId.specialization}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Consultation Fee</label>
                    <p className="text-lg font-semibold text-green-600">₹{selectedAppointment.consultationFee}</p>
                  </div>
                </div>
              </div>

              <hr />

              {/* Appointment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Appointment Date</label>
                  <p className="text-lg font-semibold">
                    {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Time</label>
                  <p className="text-lg font-semibold">
                    {selectedAppointment.appointmentTime || selectedAppointment.timeSlot}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedAppointment.status)}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Symptoms</label>
                  <p className="text-base">{selectedAppointment.symptoms}</p>
                </div>
              </div>

              {/* Consultation Details (if available) */}
              {(selectedAppointment.diagnosis || selectedAppointment.prescription || selectedAppointment.notes) && (
                <>
                  <hr />
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">Consultation Details</h3>
                    {selectedAppointment.diagnosis && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Diagnosis</label>
                        <p className="text-base">{selectedAppointment.diagnosis}</p>
                      </div>
                    )}
                    {selectedAppointment.prescription && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Prescription</label>
                        <p className="text-base whitespace-pre-wrap">{selectedAppointment.prescription}</p>
                      </div>
                    )}
                    {selectedAppointment.notes && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Notes</label>
                        <p className="text-base">{selectedAppointment.notes}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Action Buttons */}
              {selectedAppointment.status === 'scheduled' && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleStatusUpdate(selectedAppointment._id, 'completed')}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                    disabled={loading}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Completed
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedAppointment._id, 'cancelled')}
                    variant="destructive"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HospitalManagerDashboard;
