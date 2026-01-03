import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Stethoscope, Clock, Mail, Phone, Award } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import api from '../../utils/api';

interface PendingDoctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  hospitalId: {
    _id: string;
    name: string;
    city: string;
  };
  createdAt: string;
  approvalStatus: string;
}

const HospitalApprovals = () => {
  const [pendingDoctors, setPendingDoctors] = useState<PendingDoctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<PendingDoctor | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/approvals/doctors/pending');
      setPendingDoctors(response.data.data);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to fetch pending doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (doctorId: string) => {
    if (!confirm('Are you sure you want to approve this doctor?')) return;

    try {
      await api.put(`/approvals/doctors/${doctorId}/approve`);
      alert('Doctor approved successfully!');
      fetchPendingDoctors();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to approve doctor');
    }
  };

  const openRejectModal = (doctor: PendingDoctor) => {
    setSelectedDoctor(doctor);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!selectedDoctor) return;
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      await api.put(`/approvals/doctors/${selectedDoctor._id}/reject`, {
        reason: rejectionReason,
      });
      alert('Doctor application rejected');
      setShowRejectModal(false);
      setRejectionReason('');
      fetchPendingDoctors();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to reject doctor');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Doctor Approval Requests
          </h1>
          <p className="text-gray-600">Review and approve doctor registrations for your hospital</p>
        </motion.div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm">Pending Requests</p>
                  <p className="text-3xl font-bold">{pendingDoctors.length}</p>
                </div>
                <Clock className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">Specializations</p>
                  <p className="text-3xl font-bold">
                    {new Set(pendingDoctors.map(d => d.specialization)).size}
                  </p>
                </div>
                <Stethoscope className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Avg Experience</p>
                  <p className="text-3xl font-bold">
                    {pendingDoctors.length > 0
                      ? Math.round(
                          pendingDoctors.reduce((sum, d) => sum + d.experience, 0) / pendingDoctors.length
                        )
                      : 0}{' '}
                    yrs
                  </p>
                </div>
                <Award className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Doctors List */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Doctor Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
              </div>
            ) : pendingDoctors.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending doctor applications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingDoctors.map((doctor) => (
                  <motion.div
                    key={doctor._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                          <Stethoscope className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">Dr. {doctor.name}</h3>
                            <Badge className="bg-cyan-100 text-cyan-800">
                              {doctor.specialization}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {doctor.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {doctor.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              {doctor.qualification}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {doctor.experience} years experience
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-4">
                            <span className="text-sm font-semibold text-green-600">
                              Consultation Fee: ₹{doctor.consultationFee}
                            </span>
                            <span className="text-xs text-gray-500">
                              Applied: {new Date(doctor.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApprove(doctor._id)}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => openRejectModal(doctor)}
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
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

      {/* Reject Modal */}
      {showRejectModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4">Reject Doctor Application</h3>
            <p className="text-gray-600 mb-4">
              You are rejecting <strong>Dr. {selectedDoctor.name}</strong>'s application. Please provide a reason:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              rows={4}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                className="flex-1"
              >
                Confirm Rejection
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HospitalApprovals;
