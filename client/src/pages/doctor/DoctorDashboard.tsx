import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  FileText,
  Phone,
  Mail,
  Activity
} from 'lucide-react';
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

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState({
    diagnosis: '',
    prescription: '',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, statusFilter, dateFilter, appointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Fetch all appointments - backend will filter by logged-in doctor
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
        apt.patientId.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string, notes?: any) => {
    try {
      setLoading(true);
      await api.put(`/appointments/${appointmentId}`, {
        status: newStatus,
        ...notes
      });
      alert('Appointment updated successfully!');
      fetchAppointments();
      setShowDetailModal(false);
      setConsultationNotes({ diagnosis: '', prescription: '', notes: '' });
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setConsultationNotes({
      diagnosis: appointment.diagnosis || '',
      prescription: appointment.prescription || '',
      notes: appointment.notes || ''
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Doctor Dashboard
          </h1>
          <p className="text-gray-600">Manage your appointments and patient consultations</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Appointments</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Calendar className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Today's Appointments</p>
                  <p className="text-3xl font-bold">{stats.today}</p>
                </div>
                <Clock className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Scheduled</p>
                  <p className="text-3xl font-bold">{stats.scheduled}</p>
                </div>
                <Activity className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Completed</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {appointment.patientId.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {appointment.patientId.name}
                          </h3>
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
                          {appointment.symptoms && (
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Symptoms:</strong> {appointment.symptoms}
                            </p>
                          )}
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
                          View Details
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
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
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
              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Patient Name</label>
                  <p className="text-lg font-semibold">{selectedAppointment.patientId.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {selectedAppointment.patientId.phone}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {selectedAppointment.patientId.email}
                  </p>
                </div>
              </div>

              <hr />

              {/* Appointment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
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
                  <label className="text-sm font-medium text-gray-500">Symptoms</label>
                  <p className="text-base">{selectedAppointment.symptoms}</p>
                </div>
              </div>

              <hr />

              {/* Consultation Notes Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Consultation Notes</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diagnosis
                  </label>
                  <textarea
                    value={consultationNotes.diagnosis}
                    onChange={(e) => setConsultationNotes({ ...consultationNotes, diagnosis: e.target.value })}
                    placeholder="Enter diagnosis..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    disabled={selectedAppointment.status === 'completed'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prescription
                  </label>
                  <textarea
                    value={consultationNotes.prescription}
                    onChange={(e) => setConsultationNotes({ ...consultationNotes, prescription: e.target.value })}
                    placeholder="Enter prescription details..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={4}
                    disabled={selectedAppointment.status === 'completed'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    value={consultationNotes.notes}
                    onChange={(e) => setConsultationNotes({ ...consultationNotes, notes: e.target.value })}
                    placeholder="Any additional notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    disabled={selectedAppointment.status === 'completed'}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {selectedAppointment.status === 'scheduled' && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleStatusUpdate(selectedAppointment._id, 'completed', consultationNotes)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                    disabled={loading}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedAppointment._id, 'no-show')}
                    variant="outline"
                    disabled={loading}
                  >
                    No Show
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

export default DoctorDashboard;
