import { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, Edit, MapPin, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const EnhancedHospitalManagement = () => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    opdAvailable: true,
    emergencyAvailable: true,
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/hospitals');
      setHospitals(response.data.data);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/hospitals', formData);
      alert('Hospital created successfully!');
      setShowCreateForm(false);
      setFormData({
        name: '',
        city: '',
        address: '',
        phone: '',
        email: '',
        opdAvailable: true,
        emergencyAvailable: true,
      });
      fetchHospitals();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create hospital');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This will also delete all associated beds.`)) {
      return;
    }

    try {
      await api.delete(`/hospitals/${id}`);
      alert('Hospital deleted successfully!');
      fetchHospitals();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete hospital');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Building2 className="h-10 w-10 text-blue-600" />
              Hospital Management
            </h1>
            <p className="text-gray-600 text-lg">Create, view, and manage hospitals</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            size="lg"
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Hospital
          </Button>
        </motion.div>

        {/* Create Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Create New Hospital</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreate} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hospital Name *
                        </label>
                        <Input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="City General Hospital"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <select
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full h-11 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select City</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Bangalore">Bangalore</option>
                          <option value="Chennai">Chennai</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Pune">Pune</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <Input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="123 Main Street, Area Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <Input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="9876543210"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="hospital@example.com"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.opdAvailable}
                          onChange={(e) => setFormData({ ...formData, opdAvailable: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">OPD Available</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.emergencyAvailable}
                          onChange={(e) => setFormData({ ...formData, emergencyAvailable: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Emergency 24/7</span>
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <Button type="submit" disabled={loading} size="lg">
                        {loading ? 'Creating...' : 'Create Hospital'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateForm(false)}
                        size="lg"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hospitals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hospitals.map((hospital, index) => (
            <motion.div
              key={hospital._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-all border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Building2 className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{hospital.name}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{hospital.city}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {hospital.opdAvailable && (
                            <Badge variant="success" className="text-xs">OPD Available</Badge>
                          )}
                          {hospital.emergencyAvailable && (
                            <Badge variant="destructive" className="text-xs">Emergency 24/7</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{hospital.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${hospital.phone}`} className="text-blue-600 hover:underline">
                        {hospital.phone}
                      </a>
                    </div>
                    {hospital.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${hospital.email}`} className="text-blue-600 hover:underline">
                          {hospital.email}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{hospital.availableBeds || 0}</p>
                        <p className="text-xs text-gray-600">Available Beds</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{hospital.totalBeds || 0}</p>
                        <p className="text-xs text-gray-600">Total Beds</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.location.href = `/hospital/${hospital._id}`}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(hospital._id, hospital.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedHospitalManagement;
