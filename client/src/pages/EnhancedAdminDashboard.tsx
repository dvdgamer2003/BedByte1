import { useState, useEffect } from 'react';
import { Bed, Users, ArrowRight, Building2, Activity, Calendar as CalendarIcon, Building, Stethoscope, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const EnhancedAdminDashboard = () => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [beds, setBeds] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalBeds: 0, occupied: 0, available: 0 });

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedHospital) {
      fetchBeds();
      fetchQueue();
    }
  }, [selectedHospital]);

  useEffect(() => {
    if (beds.length > 0) {
      const total = beds.length;
      const occupied = beds.filter(b => b.isOccupied).length;
      setStats({ totalBeds: total, occupied, available: total - occupied });
    }
  }, [beds]);

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/hospitals');
      setHospitals(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedHospital(response.data.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  const fetchBeds = async () => {
    try {
      const response = await api.get(`/beds/hospital/${selectedHospital}`);
      setBeds(response.data.data);
    } catch (error) {
      console.error('Failed to fetch beds:', error);
    }
  };

  const fetchQueue = async () => {
    try {
      const response = await api.get(`/opd/status/${selectedHospital}`);
      setQueue(response.data.data.queue || []);
    } catch (error) {
      console.error('Failed to fetch queue:', error);
    }
  };

  const handleBedStatusChange = async (bedId: string, isOccupied: boolean) => {
    try {
      await api.put(`/beds/${bedId}`, { isOccupied });
      fetchBeds();
      alert('Bed status updated successfully');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update bed status');
    }
  };

  const handleAdvanceQueue = async () => {
    if (!window.confirm('Are you sure you want to advance the queue?')) return;

    try {
      setLoading(true);
      await api.post(`/opd/advance/${selectedHospital}`);
      fetchQueue();
      alert('Queue advanced successfully');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to advance queue');
    } finally {
      setLoading(false);
    }
  };

  const selectedHospitalData = hospitals.find(h => h._id === selectedHospital);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Activity className="h-10 w-10 text-blue-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Manage hospital beds and OPD queue</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/hospitals">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Hospitals
                </Button>
              </Link>
              <Link to="/admin/beds">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  Beds
                </Button>
              </Link>
              <Link to="/admin/doctors">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Doctors
                </Button>
              </Link>
              <Link to="/admin/pricing">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Pricing
                </Button>
              </Link>
              <Link to="/admin/appointments">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Appointments
                </Button>
              </Link>
              <Link to="/admin/bookings">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Bookings
                </Button>
              </Link>
              <Link to="/admin/data">
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <Users className="h-4 w-4" />
                  Admin Data
                </Button>
              </Link>
              <Link to="/admin/approvals">
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
                  <Users className="h-4 w-4" />
                  Approvals
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Hospital Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Hospital
              </label>
              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="w-full md:max-w-md h-12 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              >
                {hospitals.map((hospital) => (
                  <option key={hospital._id} value={hospital._id}>
                    {hospital.name} - {hospital.city}
                  </option>
                ))}
              </select>
              {selectedHospitalData && (
                <div className="mt-4 flex items-center gap-2 text-gray-600">
                  <Building2 className="h-5 w-5" />
                  <span>{selectedHospitalData.address}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        {selectedHospital && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <p className="text-blue-100 mb-2">Total Beds</p>
                <p className="text-5xl font-bold">{stats.totalBeds}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="p-6">
                <p className="text-red-100 mb-2">Occupied</p>
                <p className="text-5xl font-bold">{stats.occupied}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <p className="text-green-100 mb-2">Available</p>
                <p className="text-5xl font-bold">{stats.available}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bed Management */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Bed className="h-7 w-7 mr-3 text-blue-600" />
                  Bed Management
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {beds.map((bed, index) => (
                    <motion.div
                      key={bed._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="flex items-center justify-between p-4 border-2 rounded-xl hover:bg-gray-50 transition-all hover:border-blue-200"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-lg text-gray-900">{bed.bedNumber}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {bed.roomType}
                          </Badge>
                          <span className="text-sm text-gray-600">Floor {bed.floor}</span>
                        </div>
                        {bed.patientId && (
                          <p className="text-sm text-gray-500 mt-1">
                            Patient: {bed.patientId.name}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => handleBedStatusChange(bed._id, !bed.isOccupied)}
                        variant={bed.isOccupied ? "destructive" : "default"}
                        className="ml-4"
                      >
                        {bed.isOccupied ? 'Mark Free' : 'Mark Occupied'}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* OPD Queue Management */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center text-2xl">
                  <Users className="h-7 w-7 mr-3 text-blue-600" />
                  OPD Queue
                </CardTitle>
                <Button
                  onClick={handleAdvanceQueue}
                  disabled={loading || queue.length === 0}
                  className="flex items-center gap-2"
                >
                  Advance Queue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>

              <CardContent>
                {queue.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">No patients in queue</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {queue.map((entry, index) => (
                      <motion.div
                        key={entry._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          entry.status === 'in_consultation'
                            ? 'bg-green-50 border-green-300 shadow-md'
                            : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-xl font-bold text-xl">
                              #{entry.tokenNumber}
                            </div>
                            <div>
                              <p className="font-bold text-lg text-gray-900">{entry.patientName}</p>
                              <p className="text-sm text-gray-600 mb-1">
                                Department: {entry.department}
                              </p>
                              <p className="text-sm text-gray-500">
                                Phone: {entry.patientPhone}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={entry.status === 'in_consultation' ? 'success' : 'warning'}
                            className="text-xs px-3 py-1"
                          >
                            {entry.status === 'in_consultation' 
                              ? 'IN PROGRESS' 
                              : `Position: ${index + 1}`
                            }
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
};

export default EnhancedAdminDashboard;
