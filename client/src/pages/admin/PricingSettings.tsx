import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Building2, Bed, Save, Edit2 } from 'lucide-react';
import api from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import Toast from '../../components/Toast';

const PricingSettings = () => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  const [pricing, setPricing] = useState({
    generalWardPrice: 0,
    icuPrice: 0,
    privateRoomPrice: 0,
    opdConsultationFee: 0,
    emergencyFee: 0,
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedHospital) {
      fetchPricing();
    }
  }, [selectedHospital]);

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/hospitals');
      setHospitals(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedHospital(response.data.data[0]._id);
      }
    } catch (error) {
      showToast('Failed to fetch hospitals', 'error');
    }
  };

  const fetchPricing = async () => {
    try {
      // In real implementation, fetch from backend
      // For now, using placeholder data
      setPricing({
        generalWardPrice: 1500,
        icuPrice: 5000,
        privateRoomPrice: 3000,
        opdConsultationFee: 500,
        emergencyFee: 2000,
      });
    } catch (error) {
      showToast('Failed to fetch pricing', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Update hospital pricing
      await api.put(`/hospitals/${selectedHospital}`, {
        pricing: pricing
      });
      
      // Update all beds for this hospital
      const bedsResponse = await api.get(`/beds/hospital/${selectedHospital}`);
      const beds = bedsResponse.data.data;
      
      // Update bed prices based on room type
      for (const bed of beds) {
        let newPrice = pricing.generalWardPrice;
        if (bed.roomType === 'ICU') newPrice = pricing.icuPrice;
        if (bed.roomType === 'Private') newPrice = pricing.privateRoomPrice;
        
        await api.put(`/beds/${bed._id}`, { price: newPrice });
      }
      
      showToast('Pricing updated successfully!', 'success');
      setEditMode(false);
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to update pricing', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectedHospitalData = hospitals.find(h => h._id === selectedHospital);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <DollarSign className="h-10 w-10 text-blue-600" />
                Pricing Settings
              </h1>
              <p className="text-gray-600 text-lg">Manage hospital and bed pricing</p>
            </div>
            {!editMode ? (
              <Button
                onClick={() => setEditMode(true)}
                variant="outline"
                size="lg"
              >
                <Edit2 className="h-5 w-5 mr-2" />
                Edit Pricing
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={() => setEditMode(false)}
                  variant="outline"
                  size="lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-green-600"
                  size="lg"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>

          {/* Hospital Selector */}
          <Card className="p-6 mb-6 border-0 shadow-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Hospital</label>
            <select
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="w-full md:max-w-md h-12 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
            >
              {hospitals.map(h => (
                <option key={h._id} value={h._id}>{h.name}</option>
              ))}
            </select>
            {selectedHospitalData && (
              <div className="mt-3 flex items-center gap-2 text-gray-600">
                <Building2 className="h-5 w-5" />
                <span>{selectedHospitalData.city}</span>
              </div>
            )}
          </Card>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* General Ward */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Bed className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">General Ward</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Price per day (₹)</label>
                  {editMode ? (
                    <Input
                      type="number"
                      min="0"
                      value={pricing.generalWardPrice}
                      onChange={(e) => setPricing({ ...pricing, generalWardPrice: parseFloat(e.target.value) })}
                      className="text-2xl font-bold"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-blue-600">₹{pricing.generalWardPrice.toLocaleString()}</p>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* ICU */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                    <Bed className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">ICU</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Price per day (₹)</label>
                  {editMode ? (
                    <Input
                      type="number"
                      min="0"
                      value={pricing.icuPrice}
                      onChange={(e) => setPricing({ ...pricing, icuPrice: parseFloat(e.target.value) })}
                      className="text-2xl font-bold"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-red-600">₹{pricing.icuPrice.toLocaleString()}</p>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Private Room */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <Bed className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Private Room</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Price per day (₹)</label>
                  {editMode ? (
                    <Input
                      type="number"
                      min="0"
                      value={pricing.privateRoomPrice}
                      onChange={(e) => setPricing({ ...pricing, privateRoomPrice: parseFloat(e.target.value) })}
                      className="text-2xl font-bold"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-green-600">₹{pricing.privateRoomPrice.toLocaleString()}</p>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* OPD Consultation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">OPD Consultation</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Fee per visit (₹)</label>
                  {editMode ? (
                    <Input
                      type="number"
                      min="0"
                      value={pricing.opdConsultationFee}
                      onChange={(e) => setPricing({ ...pricing, opdConsultationFee: parseFloat(e.target.value) })}
                      className="text-2xl font-bold"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-purple-600">₹{pricing.opdConsultationFee.toLocaleString()}</p>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Emergency Fee */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Emergency Fee</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Base fee (₹)</label>
                  {editMode ? (
                    <Input
                      type="number"
                      min="0"
                      value={pricing.emergencyFee}
                      onChange={(e) => setPricing({ ...pricing, emergencyFee: parseFloat(e.target.value) })}
                      className="text-2xl font-bold"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-orange-600">₹{pricing.emergencyFee.toLocaleString()}</p>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {editMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl"
            >
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Updating prices will automatically update all existing bed prices for this hospital based on their room type.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PricingSettings;
