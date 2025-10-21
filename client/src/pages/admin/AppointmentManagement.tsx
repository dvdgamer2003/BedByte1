import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Download, Eye, CheckCircle, XCircle } from 'lucide-react';
import api from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import Toast from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';

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
  timeSlot: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  createdAt: string;
}

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchHospitals();
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, hospitalFilter, statusFilter, dateFilter, appointments]);

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/hospitals');
      setHospitals(response.data.data);
    } catch (error) {
      showToast('Failed to fetch hospitals', 'error');
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/appointments');
      setAppointments(response.data.data);
    } catch (error) {
      showToast('Failed to fetch appointments', 'error');
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

    if (hospitalFilter) {
      filtered = filtered.filter(apt => apt.hospitalId._id === hospitalFilter);
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

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      setLoading(true);
      await api.put(`/appointments/${appointmentId}`, { status: newStatus });
      showToast(`Appointment ${newStatus} successfully!`, 'success');
      fetchAppointments();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to update status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedAppointment) return;
    await handleStatusChange(selectedAppointment._id, 'cancelled');
    setShowCancelModal(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      scheduled: 'default',
      completed: 'success',
      cancelled: 'destructive',
      'no-show': 'secondary',
    };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  const DetailModal = () => {
    if (!selectedAppointment) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
        >
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-t-2xl">
            <h2 className="text-2xl font-bold">Appointment Details</h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Patient</label>
                <p className="text-lg font-semibold">{selectedAppointment.patientId.name}</p>
                <p className="text-sm text-gray-600">{selectedAppointment.patientId.email}</p>
                <p className="text-sm text-gray-600">{selectedAppointment.patientId.phone}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Doctor</label>
                <p className="text-lg font-semibold">{selectedAppointment.doctorId.name}</p>
                <p className="text-sm text-gray-600">{selectedAppointment.doctorId.specialization}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Hospital</label>
              <p className="text-lg font-semibold">{selectedAppointment.hospitalId.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Date</label>
                <p className="text-lg font-semibold">
                  {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Time</label>
                <p className="text-lg font-semibold">{selectedAppointment.timeSlot}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">{getStatusBadge(selectedAppointment.status)}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Reason for Visit</label>
              <p className="text-gray-900">{selectedAppointment.reason}</p>
            </div>

            {selectedAppointment.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-gray-900">{selectedAppointment.notes}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-500">Booked On</label>
              <p className="text-gray-900">
                {new Date(selectedAppointment.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-6 pt-0">
            {selectedAppointment.status === 'scheduled' && (
              <>
                <Button
                  onClick={() => handleStatusChange(selectedAppointment._id, 'completed')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Completed
                </Button>
                <Button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowCancelModal(true);
                  }}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={() => setShowDetailModal(false)}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <ConfirmModal
        isOpen={showCancelModal}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmText="Cancel Appointment"
        variant="danger"
        onConfirm={handleCancel}
        onCancel={() => setShowCancelModal(false)}
      />

      {showDetailModal && <DetailModal />}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Calendar className="h-10 w-10 text-blue-600" />
                Appointment Management
              </h1>
              <p className="text-gray-600 text-lg">View and manage all appointments</p>
            </div>
            <Button variant="outline" size="lg">
              <Download className="h-5 w-5 mr-2" />
              Export
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <p className="text-blue-100 text-sm">Total</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
              <p className="text-yellow-100 text-sm">Scheduled</p>
              <p className="text-3xl font-bold">{stats.scheduled}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <p className="text-green-100 text-sm">Completed</p>
              <p className="text-3xl font-bold">{stats.completed}</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
              <p className="text-red-100 text-sm">Cancelled</p>
              <p className="text-3xl font-bold">{stats.cancelled}</p>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6 border-0 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search patient or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={hospitalFilter}
                onChange={(e) => setHospitalFilter(e.target.value)}
                className="h-10 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Hospitals</option>
                {hospitals.map(h => (
                  <option key={h._id} value={h._id}>{h.name}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>

              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </Card>

          {/* Appointments Table */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hospital</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((apt) => (
                    <tr key={apt._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{apt.patientId.name}</p>
                          <p className="text-sm text-gray-500">{apt.patientId.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{apt.doctorId.name}</p>
                          <p className="text-sm text-gray-500">{apt.doctorId.specialization}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{apt.hospitalId.name}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(apt.appointmentDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">{apt.timeSlot}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(apt.status)}</td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setShowDetailModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {filteredAppointments.length === 0 && !loading && (
            <div className="text-center py-16">
              <Calendar className="h-20 w-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No appointments found</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AppointmentManagement;
