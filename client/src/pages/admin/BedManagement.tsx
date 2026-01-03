import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bed, Plus, Edit2, Trash2, Building2, Filter } from 'lucide-react';
import api from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import Toast from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';

interface BedType {
  _id: string;
  bedNumber: string;
  roomType: 'General' | 'ICU' | 'Private';
  floor: number;
  isOccupied: boolean;
  price: number;
  hospitalId: string;
}

const BedManagement = () => {
  const [beds, setBeds] = useState<BedType[]>([]);
  const [filteredBeds, setFilteredBeds] = useState<BedType[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState<BedType | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [formData, setFormData] = useState({
    bedNumber: '',
    roomType: 'General' as 'General' | 'ICU' | 'Private',
    floor: 1,
    price: 0,
    isOccupied: false,
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedHospital) {
      fetchBeds();
    }
  }, [selectedHospital]);

  useEffect(() => {
    filterBeds();
  }, [roomTypeFilter, statusFilter, beds]);

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

  const fetchBeds = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/beds/hospital/${selectedHospital}`);
      setBeds(response.data.data);
    } catch (error) {
      showToast('Failed to fetch beds', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterBeds = () => {
    let filtered = beds;

    if (roomTypeFilter) {
      filtered = filtered.filter(b => b.roomType === roomTypeFilter);
    }

    if (statusFilter) {
      const isOccupied = statusFilter === 'occupied';
      filtered = filtered.filter(b => b.isOccupied === isOccupied);
    }

    setFilteredBeds(filtered);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = () => {
    setFormData({
      bedNumber: '',
      roomType: 'General',
      floor: 1,
      price: 0,
      isOccupied: false,
    });
    setShowAddModal(true);
  };

  const handleEdit = (bed: BedType) => {
    setSelectedBed(bed);
    setFormData({
      bedNumber: bed.bedNumber,
      roomType: bed.roomType,
      floor: bed.floor,
      price: bed.price,
      isOccupied: bed.isOccupied,
    });
    setShowEditModal(true);
  };

  const handleDelete = (bed: BedType) => {
    setSelectedBed(bed);
    setShowDeleteModal(true);
  };

  const submitAdd = async () => {
    try {
      setLoading(true);
      await api.post('/beds', { ...formData, hospitalId: selectedHospital });
      showToast('Bed added successfully!', 'success');
      setShowAddModal(false);
      fetchBeds();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to add bed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const submitEdit = async () => {
    if (!selectedBed) return;
    
    try {
      setLoading(true);
      await api.put(`/beds/${selectedBed._id}`, formData);
      showToast('Bed updated successfully!', 'success');
      setShowEditModal(false);
      fetchBeds();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to update bed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedBed) return;
    
    try {
      setLoading(true);
      await api.delete(`/beds/${selectedBed._id}`);
      showToast('Bed deleted successfully!', 'success');
      setShowDeleteModal(false);
      fetchBeds();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to delete bed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const BedModal = ({ isEdit }: { isEdit?: boolean }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
      >
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Bed className="h-7 w-7" />
            {isEdit ? 'Edit Bed' : 'Add New Bed'}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bed Number *</label>
            <Input
              value={formData.bedNumber}
              onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
              placeholder="e.g., A-101"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
              <select
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value as any })}
                className="w-full h-10 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="General">General</option>
                <option value="ICU">ICU</option>
                <option value="Private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Floor *</label>
              <Input
                type="number"
                min="0"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹/day) *</label>
            <Input
              type="number"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              placeholder="0"
              required
            />
          </div>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isOccupied}
              onChange={(e) => setFormData({ ...formData, isOccupied: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Currently Occupied</span>
          </label>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <Button
            variant="outline"
            onClick={() => isEdit ? setShowEditModal(false) : setShowAddModal(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={isEdit ? submitEdit : submitAdd}
            disabled={loading || !formData.bedNumber}
            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Bed' : 'Add Bed'}
          </Button>
        </div>
      </motion.div>
    </div>
  );

  const stats = {
    total: beds.length,
    occupied: beds.filter(b => b.isOccupied).length,
    available: beds.filter(b => !b.isOccupied).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Bed"
        message={`Are you sure you want to delete bed "${selectedBed?.bedNumber}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {showAddModal && <BedModal />}
      {showEditModal && <BedModal isEdit />}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Bed className="h-10 w-10 text-blue-600" />
                Bed Management
              </h1>
              <p className="text-gray-600 text-lg">Manage hospital beds and availability</p>
            </div>
            <Button
              onClick={handleAdd}
              disabled={!selectedHospital}
              className="bg-gradient-to-r from-blue-600 to-green-600"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Bed
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6 border-0 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map(h => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={roomTypeFilter}
                  onChange={(e) => setRoomTypeFilter(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Room Types</option>
                  <option value="General">General</option>
                  <option value="ICU">ICU</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
              </select>
            </div>
          </Card>

          {/* Stats */}
          {selectedHospital && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <p className="text-blue-100 text-sm mb-1">Total Beds</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <p className="text-green-100 text-sm mb-1">Available</p>
                <p className="text-3xl font-bold">{stats.available}</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
                <p className="text-red-100 text-sm mb-1">Occupied</p>
                <p className="text-3xl font-bold">{stats.occupied}</p>
              </Card>
            </div>
          )}

          {/* Bed List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBeds.map((bed, index) => (
              <motion.div
                key={bed._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="p-4 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{bed.bedNumber}</h3>
                      <Badge variant="secondary" className="mt-1">{bed.roomType}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(bed)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(bed)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Floor: {bed.floor}</p>
                    <p>Price: ₹{bed.price}/day</p>
                    <Badge variant={bed.isOccupied ? 'destructive' : 'success'} className="mt-2">
                      {bed.isOccupied ? 'Occupied' : 'Available'}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {!selectedHospital && (
            <div className="text-center py-16">
              <Building2 className="h-20 w-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Please select a hospital</p>
            </div>
          )}

          {selectedHospital && filteredBeds.length === 0 && (
            <div className="text-center py-16">
              <Bed className="h-20 w-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No beds found</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BedManagement;
