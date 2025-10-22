import { useState, useEffect } from 'react';
import { AlertCircle, Bed, MapPin, Phone, Activity, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';

const EnhancedMyEmergencies = () => {
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const fetchEmergencies = async () => {
    try {
      const response = await api.get('/emergency-booking/my');
      setEmergencies(response.data.data);
    } catch (error) {
      console.error('Failed to fetch emergencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-600';
      case 'high':
        return 'bg-orange-600';
      case 'medium':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'assigned':
        return 'default';
      case 'admitted':
        return 'success';
      case 'treated':
        return 'success';
      case 'discharged':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-10 w-10 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">My Emergency Bookings</h1>
          </div>
          <p className="text-gray-600 text-lg">Track your emergency bed admissions</p>
        </motion.div>

        {emergencies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-16 text-center border-0 shadow-lg">
              <AlertCircle className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Emergency Bookings</h3>
              <p className="text-gray-600 mb-6">You have no emergency bed bookings</p>
              <Button onClick={() => (window.location.href = '/emergency-booking')}>
                Create Emergency Booking
              </Button>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {emergencies.map((emergency, index) => (
              <motion.div
                key={emergency._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-2 border-red-200 shadow-lg">
                  {/* Header */}
                  <div className={`p-6 ${
                    emergency.priority === 'critical' ? 'bg-red-100' :
                    emergency.priority === 'high' ? 'bg-orange-100' : 'bg-yellow-100'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-full shadow-sm">
                          <AlertCircle className={`h-8 w-8 ${
                            emergency.priority === 'critical' ? 'text-red-600' :
                            emergency.priority === 'high' ? 'text-orange-600' : 'text-yellow-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {emergency.emergencyType}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getPriorityColor(emergency.priority)}>
                              {emergency.priority.toUpperCase()} PRIORITY
                            </Badge>
                            <Badge variant={getStatusColor(emergency.status)}>
                              {emergency.status.toUpperCase().replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Created: {new Date(emergency.createdAt).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Hospital & Bed Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          Hospital Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="font-semibold text-gray-900">
                            {emergency.hospitalId?.name}
                          </p>
                          <p className="text-gray-600">{emergency.hospitalId?.address}</p>
                          <div className="flex items-center gap-2 text-blue-600">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${emergency.hospitalId?.phone}`} className="hover:underline">
                              {emergency.hospitalId?.phone}
                            </a>
                          </div>
                        </div>
                      </div>

                      {emergency.assignedBedId && (
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Bed className="h-5 w-5 text-green-600" />
                            Assigned Bed
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-2xl font-bold text-green-600">
                              {emergency.assignedBedId.bedNumber}
                            </p>
                            <p className="text-gray-700">
                              Room Type: <span className="font-semibold">{emergency.assignedBedId.roomType}</span>
                            </p>
                            <p className="text-gray-700">
                              Floor: <span className="font-semibold">{emergency.assignedBedId.floor}</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Symptoms */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Symptoms</h4>
                      <p className="text-gray-700">{emergency.symptoms}</p>
                    </div>

                    {/* Vital Signs */}
                    {emergency.vitalSigns && Object.keys(emergency.vitalSigns).length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {emergency.vitalSigns.bloodPressure && (
                          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                            <Heart className="h-5 w-5 text-red-600 mb-1" />
                            <p className="text-xs text-gray-600">Blood Pressure</p>
                            <p className="font-bold text-red-700">{emergency.vitalSigns.bloodPressure}</p>
                          </div>
                        )}
                        {emergency.vitalSigns.heartRate && (
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <Activity className="h-5 w-5 text-blue-600 mb-1" />
                            <p className="text-xs text-gray-600">Heart Rate</p>
                            <p className="font-bold text-blue-700">{emergency.vitalSigns.heartRate} bpm</p>
                          </div>
                        )}
                        {emergency.vitalSigns.temperature && (
                          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                            <p className="text-xs text-gray-600">Temperature</p>
                            <p className="font-bold text-orange-700">{emergency.vitalSigns.temperature}°F</p>
                          </div>
                        )}
                        {emergency.vitalSigns.oxygenLevel && (
                          <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                            <p className="text-xs text-gray-600">Oxygen Level</p>
                            <p className="font-bold text-cyan-700">{emergency.vitalSigns.oxygenLevel}%</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {emergency.notes && (
                      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Staff Notes</h4>
                        <p className="text-gray-700">{emergency.notes}</p>
                      </div>
                    )}

                    {/* Response Time */}
                    {emergency.responseTime !== undefined && emergency.responseTime !== null && (
                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                          Response Time: <span className="font-bold text-green-600">
                            {emergency.responseTime === 0 ? 'Immediate' : `${emergency.responseTime} minutes`}
                          </span>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedMyEmergencies;
