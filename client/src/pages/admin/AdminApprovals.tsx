import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, User, Building2, Clock, Mail, Phone } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import api from '../../utils/api';

interface PendingUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  hospitalId?: {
    _id: string;
    name: string;
    city: string;
  };
  createdAt: string;
  approvalStatus: string;
}

const AdminApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/approvals/users/pending');
      setPendingUsers(response.data.data);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    if (!confirm('Are you sure you want to approve this user?')) return;

    try {
      await api.put(`/approvals/users/${userId}/approve`);
      alert('User approved successfully!');
      fetchPendingUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to approve user');
    }
  };

  const openRejectModal = (user: PendingUser) => {
    setSelectedUser(user);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      await api.put(`/approvals/users/${selectedUser._id}/reject`, {
        reason: rejectionReason,
      });
      alert('User rejected');
      setShowRejectModal(false);
      setRejectionReason('');
      fetchPendingUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to reject user');
    }
  };

  const stats = {
    hospitalStaff: pendingUsers.filter(u => u.role === 'hospital_staff').length,
    doctors: pendingUsers.filter(u => u.role === 'doctor').length,
    total: pendingUsers.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Account Approval Requests
          </h1>
          <p className="text-gray-600">Review and approve pending registrations</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Pending</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Clock className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm">Hospital Managers</p>
                  <p className="text-3xl font-bold">{stats.hospitalStaff}</p>
                </div>
                <Building2 className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Doctors</p>
                  <p className="text-3xl font-bold">{stats.doctors}</p>
                </div>
                <User className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : pendingUsers.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending approval requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map((user) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                            <Badge className="bg-orange-100 text-orange-800">
                              {user.role === 'hospital_staff' ? 'Hospital Manager' : 'Doctor'}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {user.phone}
                              </div>
                            )}
                            {user.hospitalId && (
                              <div className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {user.hospitalId.name} - {user.hospitalId.city}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApprove(user._id)}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => openRejectModal(user)}
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
      {showRejectModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4">Reject Registration</h3>
            <p className="text-gray-600 mb-4">
              You are rejecting <strong>{selectedUser.name}</strong>'s registration. Please provide a reason:
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

export default AdminApprovals;
