import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Search,
  MapPin,
  Phone,
  Mail,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import api from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import Toast from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';

interface Hospital {
  _id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  opdAvailable: boolean;
  emergencyAvailable: boolean;
  availableBeds?: number;
  totalBeds?: number;
}

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [cities, setCities] = useState<string[]>([]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  // Toast states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form state
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

  useEffect(() => {
    filterHospitals();
  }, [searchTerm, cityFilter, hospitals]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/hospitals');
      setHospitals(response.data.data);

      // Extract unique cities
      const uniqueCities = [...new Set(response.data.data.map((h: Hospital) => h.city))] as string[];
      setCities(uniqueCities);
    } catch (error) {
      showToast('Failed to fetch hospitals', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterHospitals = () => {
    let filtered = hospitals;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // City filter
    if (cityFilter) {
      filtered = filtered.filter(h => h.city === cityFilter);
    }

    setFilteredHospitals(filtered);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      city: '',
      address: '',
      phone: '',
      email: '',
      opdAvailable: true,
      emergencyAvailable: true,
    });
    setShowAddModal(true);
  };

  const handleEdit = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setFormData({
      name: hospital.name,
      city: hospital.city,
      address: hospital.address,
      phone: hospital.phone,
      email: hospital.email || '',
      opdAvailable: hospital.opdAvailable,
      emergencyAvailable: hospital.emergencyAvailable,
    });
    setShowEditModal(true);
  };

  const handleDelete = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setShowDeleteModal(true);
  };

  const submitAdd = async () => {
    try {
      setLoading(true);
      await api.post('/hospitals', formData);
      showToast('Hospital added successfully!', 'success');
      setShowAddModal(false);
      fetchHospitals();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to add hospital', 'error');
    } finally {
      setLoading(false);
    }
  };

  const submitEdit = async () => {
    if (!selectedHospital) return;

    try {
      setLoading(true);
      await api.put(`/hospitals/${selectedHospital._id}`, formData);
      showToast('Hospital updated successfully!', 'success');
      setShowEditModal(false);
      fetchHospitals();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to update hospital', 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedHospital) return;

    try {
      setLoading(true);
      await api.delete(`/hospitals/${selectedHospital._id}`);
      showToast('Hospital deleted successfully!', 'success');
      setShowDeleteModal(false);
      fetchHospitals();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to delete hospital', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Hospital"
        message={`Are you sure you want to delete "${selectedHospital?.name}"? This action cannot be undone and will remove all associated beds and bookings.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {showAddModal && (
        <HospitalModal
          formData={formData}
          setFormData={setFormData}
          onClose={() => setShowAddModal(false)}
          onSubmit={submitAdd}
          loading={loading}
        />
      )}

      {showEditModal && (
        <HospitalModal
          isEdit
          formData={formData}
          setFormData={setFormData}
          onClose={() => setShowEditModal(false)}
          onSubmit={submitEdit}
          loading={loading}
        />
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Building2 className="h-10 w-10 text-blue-600" />
                Hospital Management
              </h1>
              <p className="text-gray-600 text-lg">Manage hospitals, beds, and facilities</p>
            </div>
            <Button
              onClick={handleAdd}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg"
              size="lg"
              disabled={loading}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Hospital
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-4 border-0 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search hospitals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Hospital List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital, index) => (
            <motion.div
              key={hospital._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{hospital.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {hospital.city}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(hospital)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(hospital)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {hospital.phone}
                  </p>
                  {hospital.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {hospital.email}
                    </p>
                  )}
                  <p className="text-xs mt-2">{hospital.address}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  {hospital.opdAvailable && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      OPD
                    </span>
                  )}
                  {hospital.emergencyAvailable && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      Emergency
                    </span>
                  )}
                </div>

                {hospital.totalBeds !== undefined && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Beds:</span>
                      <span className="font-semibold">
                        {hospital.availableBeds}/{hospital.totalBeds} available
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredHospitals.length === 0 && !loading && (
          <div className="text-center py-16">
            <Building2 className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium text-lg">No hospitals found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or add a new hospital</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface HospitalModalProps {
  isEdit?: boolean;
  formData: any;
  setFormData: (data: any) => void;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
}

const HospitalModal = ({ isEdit, formData, setFormData, onClose, onSubmit, loading }: HospitalModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-t-2xl">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Building2 className="h-7 w-7" />
          {isEdit ? 'Edit Hospital' : 'Add New Hospital'}
        </h2>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name *</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter hospital name"
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
            <Input
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="City"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 XXXXXXXXXX"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Full address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="hospital@example.com"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.opdAvailable}
              onChange={(e) => setFormData({ ...formData, opdAvailable: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">OPD Available</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.emergencyAvailable}
              onChange={(e) => setFormData({ ...formData, emergencyAvailable: e.target.checked })}
              className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-700">Emergency Available</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 p-6 pt-0">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={loading || !formData.name || !formData.city || !formData.address || !formData.phone}
          className="flex-1 bg-gradient-to-r from-blue-600 to-green-600"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Hospital' : 'Add Hospital'}
        </Button>
      </div>
    </motion.div>
  </div>
);

export default HospitalManagement;
