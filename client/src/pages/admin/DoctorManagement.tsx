import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Calendar,
  DollarSign,
  Clock,
  Building2,
  Phone,
  Mail,
  Filter
} from 'lucide-react';
import api from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import Toast from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  hospitalId: {
    _id: string;
    name: string;
  };
  salary: number;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  availableFrom: string; // Time like "09:00"
  availableTo: string; // Time like "17:00"
  appointmentDate?: Date;
  isActive: boolean;
}

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    hospitalId: '',
    salary: 0,
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    availableFrom: '09:00',
    availableTo: '17:00',
    isActive: true,
  });

  useEffect(() => {
    fetchHospitals();
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, hospitalFilter, specializationFilter, doctors]);

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/hospitals');
      setHospitals(response.data.data);
    } catch (error) {
      showToast('Failed to fetch hospitals', 'error');
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors');
      setDoctors(response.data.data);
      
      // Extract unique specializations
      const unique = [...new Set(response.data.data.map((d: Doctor) => d.specialization))] as string[];
      setSpecializations(unique);
    } catch (error) {
      showToast('Failed to fetch doctors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (hospitalFilter) {
      filtered = filtered.filter(d => d.hospitalId._id === hospitalFilter);
    }

    if (specializationFilter) {
      filtered = filtered.filter(d => d.specialization === specializationFilter);
    }

    setFilteredDoctors(filtered);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      specialization: '',
      email: '',
      phone: '',
      hospitalId: hospitals[0]?._id || '',
      salary: 0,
      availability: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      },
      availableFrom: '09:00',
      availableTo: '17:00',
      isActive: true,
    });
    setShowAddModal(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      email: doctor.email,
      phone: doctor.phone,
      hospitalId: doctor.hospitalId._id,
      salary: doctor.salary,
      availability: doctor.availability,
      availableFrom: doctor.availableFrom,
      availableTo: doctor.availableTo,
      isActive: doctor.isActive,
    });
    setShowEditModal(true);
  };

  const handleDelete = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const submitAdd = async () => {
    try {
      setLoading(true);
      await api.post('/doctors', formData);
      showToast('Doctor added successfully!', 'success');
      setShowAddModal(false);
      fetchDoctors();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to add doctor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const submitEdit = async () => {
    if (!selectedDoctor) return;
    
    try {
      setLoading(true);
      await api.put(`/doctors/${selectedDoctor._id}`, formData);
      showToast('Doctor updated successfully!', 'success');
      setShowEditModal(false);
      fetchDoctors();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to update doctor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedDoctor) return;
    
    try {
      setLoading(true);
      await api.delete(`/doctors/${selectedDoctor._id}`);
      showToast('Doctor deleted successfully!', 'success');
      setShowDeleteModal(false);
      fetchDoctors();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to delete doctor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const DoctorModal = ({ isEdit }: { isEdit?: boolean }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8"
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Stethoscope className="h-7 w-7" />
            {isEdit ? 'Edit Doctor' : 'Add New Doctor'}
          </h2>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
              <Input
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="Cardiologist"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="doctor@hospital.com"
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

          {/* Hospital & Salary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hospital *</label>
              <select
                value={formData.hospitalId}
                onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
                className="w-full h-10 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {hospitals.map(h => (
                  <option key={h._id} value={h._id}>{h.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Salary (₹) *</label>
              <Input
                type="number"
                min="0"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) })}
                placeholder="50000"
                required
              />
            </div>
          </div>

          {/* Timing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available From *</label>
              <Input
                type="time"
                value={formData.availableFrom}
                onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available To *</label>
              <Input
                type="time"
                value={formData.availableTo}
                onChange={(e) => setFormData({ ...formData, availableTo: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Weekly Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Weekly Availability</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(formData.availability).map(day => (
                <label key={day} className="flex items-center space-x-2 cursor-pointer p-2 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={formData.availability[day as keyof typeof formData.availability]}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: { ...formData.availability, [day]: e.target.checked }
                    })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm capitalize">{day.slice(0, 3)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Active Status */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 text-green-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Currently Active</span>
          </label>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <Button
            variant="outline"
            onClick={() => isEdit ? setShowEditModal(false) : setShowAddModal(false)}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={isEdit ? submitEdit : submitAdd}
            disabled={loading || !formData.name || !formData.specialization || !formData.email}
            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Doctor' : 'Add Doctor'}
          </Button>
        </div>
      </motion.div>
    </div>
  );

  const getDaysAvailable = (availability: Doctor['availability']) => {
    return Object.entries(availability)
      .filter(([_, available]) => available)
      .map(([day]) => day.slice(0, 3))
      .join(', ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Doctor"
        message={`Are you sure you want to delete Dr. ${selectedDoctor?.name}? This will cancel all their appointments.`}
        confirmText="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {showAddModal && <DoctorModal />}
      {showEditModal && <DoctorModal isEdit />}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Stethoscope className="h-10 w-10 text-blue-600" />
                Doctor Management
              </h1>
              <p className="text-gray-600 text-lg">Manage doctors, salaries, and availability</p>
            </div>
            <Button
              onClick={handleAdd}
              className="bg-gradient-to-r from-blue-600 to-green-600"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Doctor
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6 border-0 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={hospitalFilter}
                  onChange={(e) => setHospitalFilter(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Hospitals</option>
                  {hospitals.map(h => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={specializationFilter}
                  onChange={(e) => setSpecializationFilter(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Specializations</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Doctor List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                      <Badge variant="secondary" className="mb-2">{doctor.specialization}</Badge>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {doctor.hospitalId.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doctor)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {doctor.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {doctor.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      ₹{(doctor.salary || 0).toLocaleString()}/month
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {doctor.availableFrom} - {doctor.availableTo}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {getDaysAvailable(doctor.availability)}
                    </p>
                  </div>

                  <Badge variant={doctor.isActive ? 'success' : 'destructive'}>
                    {doctor.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredDoctors.length === 0 && !loading && (
            <div className="text-center py-16">
              <Stethoscope className="h-20 w-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium text-lg">No doctors found</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorManagement;
