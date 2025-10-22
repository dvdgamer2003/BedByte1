import { useState, useEffect } from 'react';
import { Clock, Users, CheckCircle, Building2, Phone, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import socketService from '../utils/socket';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const EnhancedOPDQueue = () => {
  const [myStatus, setMyStatus] = useState<any>(null);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    department: 'General',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHospitals();
    fetchMyStatus();
    
    socketService.connect();

    return () => {
      if (myStatus?.hospitalId?._id) {
        socketService.leaveOPDQueue(myStatus.hospitalId._id);
      }
    };
  }, []);

  useEffect(() => {
    if (myStatus?.hospitalId?._id) {
      socketService.joinOPDQueue(myStatus.hospitalId._id);
      
      socketService.onQueueUpdate(() => {
        fetchMyStatus();
      });

      return () => {
        socketService.offQueueUpdate();
      };
    }
  }, [myStatus?.hospitalId?._id]);

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/hospitals');
      setHospitals(response.data.data.filter((h: any) => h.opdAvailable));
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  const fetchMyStatus = async () => {
    try {
      const response = await api.get('/opd/my-status');
      setMyStatus(response.data.data);
    } catch (error) {
      console.error('Failed to fetch queue status:', error);
    }
  };

  const handleJoinQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/opd/join', {
        hospitalId: selectedHospital,
        ...formData,
      });
      alert('Successfully joined OPD queue!');
      fetchMyStatus();
      setFormData({ patientName: '', patientPhone: '', department: 'General' });
      setSelectedHospital('');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to join queue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">OPD Queue</h1>
          <p className="text-gray-600 text-lg">Real-time outpatient department queue management</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {myStatus && (
            <motion.div
              key="status"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8"
            >
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                
                <CardContent className="relative p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Your Queue Status</h2>
                      <div className="flex items-center gap-2 text-blue-100">
                        <Building2 className="h-5 w-5" />
                        <span className="text-lg">{myStatus.hospitalId?.name}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={myStatus.status === 'waiting' ? 'warning' : 'success'}
                      className="text-base px-4 py-2"
                    >
                      {myStatus.status.toUpperCase().replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30"
                    >
                      <p className="text-blue-100 mb-2 text-sm font-medium">Token Number</p>
                      <p className="text-5xl font-bold">
                        {myStatus.tokenNumber}
                      </p>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30"
                    >
                      <p className="text-blue-100 mb-2 text-sm font-medium">Position in Queue</p>
                      <p className="text-5xl font-bold">
                        {myStatus.position || '—'}
                      </p>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30"
                    >
                      <p className="text-blue-100 mb-2 text-sm font-medium">Est. Wait Time</p>
                      <p className="text-5xl font-bold">
                        {myStatus.estimatedWaitTime || 0}
                        <span className="text-2xl ml-2">min</span>
                      </p>
                    </motion.div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-blue-100">
                    <Clock className="h-5 w-5" />
                    <span>
                      Checked in at: {new Date(myStatus.checkedInAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {myStatus.status === 'in_consultation' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6" />
                        <span className="font-semibold text-lg">
                          Your consultation is in progress. Please proceed to the doctor.
                        </span>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!myStatus && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Users className="h-7 w-7 mr-3 text-blue-600" />
                    Join OPD Queue
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleJoinQueue} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Hospital *
                      </label>
                      <select
                        required
                        value={selectedHospital}
                        onChange={(e) => setSelectedHospital(e.target.value)}
                        className="w-full h-11 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Choose a hospital</option>
                        {hospitals.map((hospital) => (
                          <option key={hospital._id} value={hospital._id}>
                            {hospital.name} - {hospital.city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Patient Name *
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            type="text"
                            required
                            value={formData.patientName}
                            onChange={(e) =>
                              setFormData({ ...formData, patientName: e.target.value })
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
                            value={formData.patientPhone}
                            onChange={(e) =>
                              setFormData({ ...formData, patientPhone: e.target.value })
                            }
                            className="pl-12"
                            placeholder="10-digit number"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({ ...formData, department: e.target.value })
                        }
                        className="w-full h-11 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="General">General</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Pediatrics">Pediatrics</option>
                      </select>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      size="lg"
                      className="w-full md:w-auto px-8"
                    >
                      {loading ? 'Joining Queue...' : 'Join Queue'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedOPDQueue;
