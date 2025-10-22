import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Bed,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Heart,
  Activity
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

interface EmergencyBooking {
  _id: string;
  patientId: {
    _id: string;
    name: string;
    phone: string;
    email: string;
  };
  hospitalId?: {
    _id: string;
    name: string;
    city: string;
  };
  condition: string;
  severity: string;
  description: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed';
  bedNumber?: string;
  assignedTo?: string;
  createdAt: string;
  patientLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface BedStats {
  total: number;
  occupied: number;
  available: number;
}

const EmergencyManagement = () => {
  const { user } = useAuth();
  const [emergencies, setEmergencies] = useState<EmergencyBooking[]>([]);
  const [bedStats, setBedStats] = useState<BedStats>({ total: 0, occupied: 0, available: 0 });
  const [loading, setLoading] = useState(false);
  const [autoApprove, setAutoApprove] = useState(true);

  useEffect(() => {
    fetchEmergencies();
    fetchBedStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchEmergencies();
      fetchBedStats();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchEmergencies = async () => {
    try {
      const response = await api.get('/emergency-bookings');
      const allEmergencies = response.data.data;
      
      // Filter for hospital's emergencies and pending ones
      const pendingEmergencies = allEmergencies.filter(
        (e: EmergencyBooking) => 
          e.status === 'pending' && 
          (!e.hospitalId || e.hospitalId._id === user?.hospitalId)
      );
      
      setEmergencies(pendingEmergencies);
    } catch (error: any) {
      console.error('Failed to fetch emergencies:', error);
    }
  };

  const fetchBedStats = async () => {
    try {
      const response = await api.get('/beds');
      const beds = response.data.data;
      const total = beds.length;
      const occupied = beds.filter((b: any) => b.isOccupied).length;
      setBedStats({
        total,
        occupied,
        available: total - occupied
      });
    } catch (error: any) {
      console.error('Failed to fetch bed stats:', error);
    }
  };

  const handleQuickApprove = async (emergencyId: string) => {
    if (bedStats.available === 0) {
      alert('⚠️ No beds available! Cannot approve emergency booking.');
      return;
    }

    try {
      setLoading(true);
      
      // Update emergency status to confirmed
      await api.put(`/emergency-bookings/${emergencyId}`, {
        status: 'confirmed',
        hospitalId: user?.hospitalId
      });

      // Find and assign an available bed
      const bedsResponse = await api.get('/beds');
      const availableBed = bedsResponse.data.data.find((b: any) => !b.isOccupied);
      
      if (availableBed) {
        // Mark bed as occupied
        await api.put(`/beds/${availableBed._id}`, {
          isOccupied: true,
          patientName: emergencies.find(e => e._id === emergencyId)?.patientId.name
        });
      }

      // Refresh data
      await fetchEmergencies();
      await fetchBedStats();
      
      alert('✅ Emergency booking approved and bed assigned!');
    } catch (error: any) {
      console.error('Failed to approve emergency:', error);
      alert(error.response?.data?.error || 'Failed to approve emergency');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReject = async (emergencyId: string) => {
    const reason = prompt('Enter reason for rejection:');
    if (!reason) return;

    try {
      setLoading(true);
      await api.put(`/emergency-bookings/${emergencyId}`, {
        status: 'rejected',
        rejectionReason: reason
      });
      
      await fetchEmergencies();
      alert('Emergency booking rejected');
    } catch (error: any) {
      console.error('Failed to reject emergency:', error);
      alert(error.response?.data?.error || 'Failed to reject emergency');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'from-red-500 to-pink-500';
      case 'medium':
      case 'moderate':
        return 'from-orange-500 to-yellow-500';
      case 'low':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
                🚨 Emergency Management
              </h1>
              <p className="text-gray-600">Fast-track emergency bookings with auto-approval</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md">
                <input
                  type="checkbox"
                  checked={autoApprove}
                  onChange={(e) => setAutoApprove(e.target.checked)}
                  className="w-5 h-5 text-red-600"
                />
                <span className="text-sm font-medium text-gray-700">Auto-Approve When Beds Available</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bed Availability Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-6 shadow-xl"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4">
              <Bed className="h-32 w-32 text-white opacity-10" />
            </div>
            <div className="relative">
              <div className="text-white/80 text-sm font-medium mb-2">Total Beds</div>
              <div className="text-4xl font-bold text-white">{bedStats.total}</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${
              bedStats.available > 0 ? 'from-green-500 to-emerald-500' : 'from-red-500 to-pink-500'
            } p-6 shadow-xl`}
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4">
              <CheckCircle className="h-32 w-32 text-white opacity-10" />
            </div>
            <div className="relative">
              <div className="text-white/80 text-sm font-medium mb-2">Available Beds</div>
              <div className="text-4xl font-bold text-white">{bedStats.available}</div>
              <div className="text-sm text-white/70 mt-1">
                {bedStats.available > 0 ? '✅ Ready for emergencies' : '⚠️ No beds available'}
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-6 shadow-xl"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4">
              <Zap className="h-32 w-32 text-white opacity-10" />
            </div>
            <div className="relative">
              <div className="text-white/80 text-sm font-medium mb-2">Pending Emergencies</div>
              <div className="text-4xl font-bold text-white">{emergencies.length}</div>
              <div className="text-sm text-white/70 mt-1">Awaiting response</div>
            </div>
          </motion.div>
        </div>

        {/* Emergency Requests */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Incoming Emergency Requests</h2>
          
          <AnimatePresence mode="popLayout">
            {emergencies.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="p-12 text-center">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Emergencies</h3>
                  <p className="text-gray-600">All emergency requests have been processed</p>
                </Card>
              </motion.div>
            ) : (
              emergencies.map((emergency, index) => (
                <motion.div
                  key={emergency._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className={`h-2 bg-gradient-to-r ${getSeverityColor(emergency.severity)}`} />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-6">
                        {/* Patient Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <AlertTriangle className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{emergency.patientId.name}</h3>
                                <Badge className={`bg-gradient-to-r ${getSeverityColor(emergency.severity)} text-white border-0`}>
                                  {emergency.severity} Severity
                                </Badge>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {getTimeAgo(emergency.createdAt)}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Phone className="h-4 w-4" />
                                  <span className="text-sm">{emergency.patientId.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Activity className="h-4 w-4" />
                                  <span className="text-sm font-semibold text-red-600">{emergency.condition}</span>
                                </div>
                              </div>

                              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                <p className="text-sm font-medium text-gray-700 mb-1">Symptoms:</p>
                                <p className="text-sm text-gray-600">{emergency.description}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => handleQuickApprove(emergency._id)}
                            disabled={loading || bedStats.available === 0}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg"
                          >
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Approve & Assign Bed
                          </Button>
                          <Button
                            onClick={() => handleQuickReject(emergency._id)}
                            disabled={loading}
                            variant="outline"
                            className="border-2 border-red-500 text-red-600 hover:bg-red-50 font-semibold"
                          >
                            <XCircle className="mr-2 h-5 w-5" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EmergencyManagement;
