import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Activity, Heart, Thermometer, Wind, User, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const EnhancedEmergencyBooking = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    hospitalId: '',
    roomType: 'ICU',
    priority: 'critical',
    emergencyType: 'Cardiac Arrest',
    symptoms: '',
    patientName: '',
    patientPhone: '',
    patientAge: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      oxygenLevel: '',
    },
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (formData.hospitalId) {
      checkAvailability();
    }
  }, [formData.hospitalId]);

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/hospitals');
      setHospitals(response.data.data);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  const checkAvailability = async () => {
    try {
      const response = await api.get('/emergency-booking/availability', {
        params: { hospitalId: formData.hospitalId },
      });
      setAvailabilityData(response.data.data);
    } catch (error) {
      console.error('Failed to check availability:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/emergency-booking', formData);
      alert(response.data.message);
      navigate('/my-bookings');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create emergency booking');
    } finally {
      setLoading(false);
    }
  };

  const emergencyTypes = [
    'Cardiac Arrest',
    'Stroke',
    'Severe Trauma',
    'Respiratory Distress',
    'Severe Bleeding',
    'Poisoning',
    'Burns',
    'Seizures',
    'Other Emergency',
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-700';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-700';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-10 w-10 text-red-600 animate-pulse" />
            <h1 className="text-4xl font-bold text-gray-900">Emergency Booking</h1>
          </div>
          <p className="text-gray-600 text-lg">Fast-track bed allocation for critical patients</p>
        </motion.div>

        {/* Priority Level Alert */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-2">Emergency Priority System</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-600">Critical</Badge>
                      <span className="text-red-800">Life-threatening - Immediate attention</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-orange-600">High</Badge>
                      <span className="text-orange-800">Serious condition - Urgent care</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-600">Medium</Badge>
                      <span className="text-yellow-800">Urgent care needed</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hospital & Priority */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Hospital & Priority</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Hospital *
                    </label>
                    <select
                      required
                      value={formData.hospitalId}
                      onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
                      className="w-full h-11 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    >
                      <option value="">Choose hospital...</option>
                      {hospitals.map((hospital) => (
                        <option key={hospital._id} value={hospital._id}>
                          {hospital.name} - {hospital.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {availabilityData && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`p-4 rounded-xl border-2 ${
                        availabilityData.hasAvailability
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <p className="font-semibold mb-2">
                        {availabilityData.hasAvailability
                          ? `✅ ${availabilityData.totalAvailable} beds available`
                          : '❌ No beds currently available'}
                      </p>
                      {availabilityData.byRoomType?.map((room: any) => (
                        <p key={room._id} className="text-sm text-gray-700">
                          {room._id}: {room.count} available
                        </p>
                      ))}
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Type *
                      </label>
                      <select
                        required
                        value={formData.roomType}
                        onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                        className="w-full h-11 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="General">General</option>
                        <option value="ICU">ICU</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority Level *
                      </label>
                      <select
                        required
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className={`w-full h-11 px-4 border-2 rounded-xl focus:ring-2 focus:ring-red-500 ${getPriorityColor(
                          formData.priority
                        )}`}
                      >
                        <option value="critical">🔴 Critical</option>
                        <option value="high">🟠 High</option>
                        <option value="medium">🟡 Medium</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Type *
                    </label>
                    <select
                      required
                      value={formData.emergencyType}
                      onChange={(e) => setFormData({ ...formData, emergencyType: e.target.value })}
                      className="w-full h-11 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {emergencyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Information */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patient Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          required
                          value={formData.patientName}
                          onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
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
                          required
                          type="tel"
                          value={formData.patientPhone}
                          onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                          className="pl-12"
                          placeholder="10-digit number"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <Input
                      type="number"
                      value={formData.patientAge}
                      onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                      placeholder="Patient age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symptoms & Condition *
                    </label>
                    <textarea
                      required
                      value={formData.symptoms}
                      onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={4}
                      placeholder="Describe the symptoms and medical condition..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Vital Signs */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-6 w-6 text-red-600" />
                    Vital Signs (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Heart className="inline h-4 w-4 mr-1 text-red-500" />
                        Blood Pressure
                      </label>
                      <Input
                        value={formData.vitalSigns.bloodPressure}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vitalSigns: { ...formData.vitalSigns, bloodPressure: e.target.value },
                          })
                        }
                        placeholder="120/80"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Activity className="inline h-4 w-4 mr-1 text-blue-500" />
                        Heart Rate (bpm)
                      </label>
                      <Input
                        type="number"
                        value={formData.vitalSigns.heartRate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vitalSigns: { ...formData.vitalSigns, heartRate: e.target.value },
                          })
                        }
                        placeholder="72"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Thermometer className="inline h-4 w-4 mr-1 text-orange-500" />
                        Temperature (°F)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.vitalSigns.temperature}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vitalSigns: { ...formData.vitalSigns, temperature: e.target.value },
                          })
                        }
                        placeholder="98.6"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Wind className="inline h-4 w-4 mr-1 text-cyan-500" />
                        Oxygen Level (%)
                      </label>
                      <Input
                        type="number"
                        value={formData.vitalSigns.oxygenLevel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vitalSigns: { ...formData.vitalSigns, oxygenLevel: e.target.value },
                          })
                        }
                        placeholder="98"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
                  <CardHeader>
                    <CardTitle className="text-red-900">Emergency Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Priority</p>
                      <Badge className={`text-base ${
                        formData.priority === 'critical' ? 'bg-red-600' :
                        formData.priority === 'high' ? 'bg-orange-600' : 'bg-yellow-600'
                      }`}>
                        {formData.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Emergency Type</p>
                      <p className="font-semibold text-gray-900">{formData.emergencyType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Room Type</p>
                      <p className="font-semibold text-gray-900">{formData.roomType}</p>
                    </div>

                    <div className="pt-4 border-t border-red-200">
                      <p className="text-xs text-gray-600 mb-2">
                        ⚡ This booking will be processed immediately
                      </p>
                      <p className="text-xs text-gray-600">
                        🏥 Bed will be assigned automatically based on availability
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  disabled={loading || !formData.hospitalId || !availabilityData?.hasAvailability}
                  className="w-full h-14 text-lg bg-red-600 hover:bg-red-700"
                >
                  {loading ? 'Creating Emergency Booking...' : '🚨 Emergency Book Now'}
                </Button>

                <p className="text-xs text-center text-gray-600">
                  By submitting, you confirm this is a genuine emergency requiring immediate attention
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedEmergencyBooking;
