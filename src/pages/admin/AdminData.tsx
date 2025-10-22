import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Stethoscope, 
  Building2, 
  Trash2, 
  Search, 
  AlertTriangle,
  UserX,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Plus,
  Edit,
  X,
  Save,
  UserCog,
  Shield
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import api from '../../utils/api';

interface UserAccount {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  hospitalId?: {
    _id?: string;
    name: string;
    city: string;
  };
  isApproved?: boolean;
  approvalStatus?: string;
  createdAt: string;
}

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification?: string;
  experience?: number;
  hospitalId: {
    _id?: string;
    name: string;
    city: string;
  };
  consultationFee: number;
  isActive: boolean;
}

interface Hospital {
  _id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  opdAvailable: boolean;
  emergencyAvailable: boolean;
}

type TabType = 'users' | 'patients' | 'doctors' | 'hospitals';

const AdminData = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: TabType;
    id: string;
    name: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [allHospitals, setAllHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    fetchData();
    if (activeTab === 'doctors' || activeTab === 'users') {
      fetchAllHospitals();
    }
  }, [activeTab]);

  const fetchAllHospitals = async () => {
    try {
      const response = await api.get('/admin-data/hospitals');
      setAllHospitals(response.data.data);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const response = await api.get('/admin-data/users');
        setUsers(response.data.data);
      } else if (activeTab === 'patients') {
        const response = await api.get('/admin-data/patients');
        setPatients(response.data.data);
      } else if (activeTab === 'doctors') {
        const response = await api.get('/admin-data/doctors');
        setDoctors(response.data.data);
      } else {
        const response = await api.get('/admin-data/hospitals');
        setHospitals(response.data.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      alert(error.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await api.delete(`/admin-data/${deleteConfirm.type}/${deleteConfirm.id}`);
      alert(`${deleteConfirm.type.slice(0, -1)} deleted successfully`);
      setDeleteConfirm(null);
      fetchData();
    } catch (error: any) {
      console.error('Failed to delete:', error);
      alert(error.response?.data?.error || 'Failed to delete');
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData({});
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setModalMode('edit');
    setEditingId(item._id);
    setFormData({...item});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modalMode === 'create') {
        await api.post(`/admin-data/${activeTab}`, formData);
        alert(`${activeTab.slice(0, -1)} created successfully`);
      } else {
        await api.put(`/admin-data/${activeTab}/${editingId}`, formData);
        alert(`${activeTab.slice(0, -1)} updated successfully`);
      }
      closeModal();
      fetchData();
    } catch (error: any) {
      console.error('Failed to save:', error);
      alert(error.response?.data?.error || 'Failed to save');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHospitals = hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Admin Data Management
          </h1>
          <p className="text-gray-600">Manage all patients, doctors, and hospitals</p>
        </motion.div>

        {/* Tabs and Create Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4 mb-6"
        >
          <div className="flex gap-4">
            <Button
              onClick={() => {
                setActiveTab('users');
                setSearchTerm('');
              }}
              className={`flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UserCog className="h-5 w-5" />
              All Users ({users.length})
            </Button>
            <Button
              onClick={() => {
                setActiveTab('patients');
                setSearchTerm('');
              }}
              className={`flex items-center gap-2 ${
                activeTab === 'patients'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5" />
              Patients ({patients.length})
            </Button>
            <Button
              onClick={() => {
                setActiveTab('doctors');
                setSearchTerm('');
              }}
              className={`flex items-center gap-2 ${
                activeTab === 'doctors'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Stethoscope className="h-5 w-5" />
              Doctors ({doctors.length})
            </Button>
            <Button
              onClick={() => {
                setActiveTab('hospitals');
                setSearchTerm('');
              }}
              className={`flex items-center gap-2 ${
                activeTab === 'hospitals'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Building2 className="h-5 w-5" />
              Hospitals ({hospitals.length})
            </Button>
          </div>
          <Button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
          >
            <Plus className="h-5 w-5" />
            Create New
          </Button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6 text-lg"
            />
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Users Table */}
              {activeTab === 'users' && (
                <div className="grid gap-4">
                  {filteredUsers.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No users found</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredUsers.map((user) => (
                      <motion.div
                        key={user._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                                  user.role === 'admin' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                                  user.role === 'hospital_staff' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
                                  user.role === 'doctor' ? 'bg-gradient-to-r from-green-500 to-teal-500' :
                                  'bg-gradient-to-r from-purple-500 to-indigo-500'
                                }`}>
                                  {user.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-gray-900">
                                      {user.name}
                                    </h3>
                                    <Badge className={
                                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                      user.role === 'hospital_staff' ? 'bg-cyan-100 text-cyan-800' :
                                      user.role === 'doctor' ? 'bg-green-100 text-green-800' :
                                      'bg-purple-100 text-purple-800'
                                    }>
                                      {user.role === 'hospital_staff' ? 'Hospital Manager' : user.role.toUpperCase()}
                                    </Badge>
                                    {user.role !== 'patient' && user.role !== 'admin' && (
                                      <Badge className={
                                        user.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                        user.approvalStatus === 'pending' ? 'bg-orange-100 text-orange-800' :
                                        'bg-red-100 text-red-800'
                                      }>
                                        {user.approvalStatus}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-3 mt-1">
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                      <Mail className="h-4 w-4" />
                                      {user.email}
                                    </div>
                                    {user.phone && (
                                      <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Phone className="h-4 w-4" />
                                        {user.phone}
                                      </div>
                                    )}
                                    {user.hospitalId && (
                                      <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Building2 className="h-4 w-4" />
                                        {user.hospitalId.name} - {user.hospitalId.city}
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                      <Calendar className="h-4 w-4" />
                                      {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {user.role === 'admin' ? (
                                  <Badge className="flex items-center gap-1 bg-red-100 text-red-800">
                                    <Shield className="h-3 w-3" />
                                    Protected
                                  </Badge>
                                ) : (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openEditModal(user)}
                                      className="flex items-center gap-2"
                                    >
                                      <Edit className="h-4 w-4" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() =>
                                        setDeleteConfirm({
                                          type: 'users',
                                          id: user._id,
                                          name: user.name,
                                        })
                                      }
                                      className="flex items-center gap-2"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {/* Patients Table */}
              {activeTab === 'patients' && (
                <div className="grid gap-4">
                  {filteredPatients.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No patients found</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredPatients.map((patient) => (
                      <motion.div
                        key={patient._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                  {patient.name.charAt(0)}
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900">
                                    {patient.name}
                                  </h3>
                                  <div className="flex flex-wrap gap-3 mt-1">
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                      <Mail className="h-4 w-4" />
                                      {patient.email}
                                    </div>
                                    {patient.phone && (
                                      <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Phone className="h-4 w-4" />
                                        {patient.phone}
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                      <Calendar className="h-4 w-4" />
                                      {new Date(patient.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditModal(patient)}
                                  className="flex items-center gap-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    setDeleteConfirm({
                                      type: 'patients',
                                      id: patient._id,
                                      name: patient.name,
                                    })
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {/* Doctors Table */}
              {activeTab === 'doctors' && (
                <div className="grid gap-4">
                  {filteredDoctors.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <UserX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No doctors found</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredDoctors.map((doctor) => (
                      <motion.div
                        key={doctor._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                                  {doctor.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-gray-900">
                                      {doctor.name}
                                    </h3>
                                    <Badge
                                      variant={doctor.isActive ? 'default' : 'secondary'}
                                    >
                                      {doctor.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </div>
                                  <p className="text-sm font-semibold text-purple-600 mt-1">
                                    {doctor.specialization}
                                  </p>
                                  <div className="flex flex-wrap gap-3 mt-1">
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                      <Mail className="h-4 w-4" />
                                      {doctor.email}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                      <Phone className="h-4 w-4" />
                                      {doctor.phone}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                      <Building2 className="h-4 w-4" />
                                      {doctor.hospitalId?.name} - {doctor.hospitalId?.city}
                                    </div>
                                    <div className="text-sm font-semibold text-green-600">
                                      ₹{doctor.consultationFee}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditModal(doctor)}
                                  className="flex items-center gap-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    setDeleteConfirm({
                                      type: 'doctors',
                                      id: doctor._id,
                                      name: doctor.name,
                                    })
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {/* Hospitals Table */}
              {activeTab === 'hospitals' && (
                <div className="grid gap-4">
                  {filteredHospitals.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No hospitals found</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredHospitals.map((hospital) => (
                      <motion.div
                        key={hospital._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                                  <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900">
                                    {hospital.name}
                                  </h3>
                                  <div className="flex flex-wrap gap-3 mt-1">
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                      <MapPin className="h-4 w-4" />
                                      {hospital.city}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                      <Phone className="h-4 w-4" />
                                      {hospital.phone}
                                    </div>
                                    {hospital.email && (
                                      <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        {hospital.email}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-2 mt-2">
                                    <Badge
                                      variant={
                                        hospital.opdAvailable ? 'default' : 'secondary'
                                      }
                                    >
                                      {hospital.opdAvailable ? 'OPD Available' : 'No OPD'}
                                    </Badge>
                                    <Badge
                                      variant={
                                        hospital.emergencyAvailable
                                          ? 'destructive'
                                          : 'secondary'
                                      }
                                    >
                                      {hospital.emergencyAvailable
                                        ? 'Emergency Available'
                                        : 'No Emergency'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditModal(hospital)}
                                  className="flex items-center gap-2"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    setDeleteConfirm({
                                      type: 'hospitals',
                                      id: hospital._id,
                                      name: hospital.name,
                                    })
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl my-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {modalMode === 'create' ? 'Create New' : 'Edit'} {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
                </h3>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Form */}
                {activeTab === 'users' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <Input
                          required
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <Input
                          required
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role *
                        </label>
                        <select
                          required
                          value={formData.role || 'patient'}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="patient">Patient</option>
                          <option value="hospital_staff">Hospital Manager</option>
                          <option value="doctor">Doctor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <Input
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Phone number"
                        />
                      </div>
                    </div>
                    {modalMode === 'create' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password *
                        </label>
                        <Input
                          required
                          type="password"
                          value={formData.password || ''}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Password (min 6 characters)"
                          minLength={6}
                        />
                      </div>
                    )}
                    {(formData.role === 'hospital_staff' || formData.role === 'doctor') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hospital {formData.role === 'hospital_staff' || formData.role === 'doctor' ? '*' : ''}
                        </label>
                        <select
                          required={formData.role === 'hospital_staff' || formData.role === 'doctor'}
                          value={formData.hospitalId?._id || formData.hospitalId || ''}
                          onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select hospital...</option>
                          {allHospitals.map((hospital) => (
                            <option key={hospital._id} value={hospital._id}>
                              {hospital.name} - {hospital.city}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {modalMode === 'edit' && formData.role !== 'patient' && formData.role !== 'admin' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Approval Status
                          </label>
                          <select
                            value={formData.approvalStatus || 'pending'}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              approvalStatus: e.target.value,
                              isApproved: e.target.value === 'approved'
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <Badge className={
                            formData.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                            formData.approvalStatus === 'pending' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {formData.approvalStatus || 'pending'}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Patient Form */}
                {activeTab === 'patients' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <Input
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Patient name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <Input
                        required
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                    {modalMode === 'create' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password *
                        </label>
                        <Input
                          required
                          type="password"
                          value={formData.password || ''}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Password (min 6 characters)"
                          minLength={6}
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <Input
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Phone number"
                      />
                    </div>
                  </>
                )}

                {/* Doctor Form */}
                {activeTab === 'doctors' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <Input
                          required
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Doctor name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <Input
                          required
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone *
                        </label>
                        <Input
                          required
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Specialization *
                        </label>
                        <select
                          required
                          value={formData.specialization || ''}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select...</option>
                          <option value="General Medicine">General Medicine</option>
                          <option value="Cardiology">Cardiology</option>
                          <option value="Neurology">Neurology</option>
                          <option value="Orthopedics">Orthopedics</option>
                          <option value="Pediatrics">Pediatrics</option>
                          <option value="Gynecology">Gynecology</option>
                          <option value="Dermatology">Dermatology</option>
                          <option value="ENT">ENT</option>
                          <option value="Ophthalmology">Ophthalmology</option>
                          <option value="Psychiatry">Psychiatry</option>
                          <option value="Emergency Medicine">Emergency Medicine</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Qualification *
                        </label>
                        <Input
                          required
                          value={formData.qualification || ''}
                          onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                          placeholder="MBBS, MD"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Experience (years) *
                        </label>
                        <Input
                          required
                          type="number"
                          min="0"
                          value={formData.experience || ''}
                          onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                          placeholder="5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Consultation Fee *
                        </label>
                        <Input
                          required
                          type="number"
                          min="0"
                          value={formData.consultationFee || ''}
                          onChange={(e) => setFormData({ ...formData, consultationFee: parseInt(e.target.value) })}
                          placeholder="500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hospital *
                      </label>
                      <select
                        required
                        value={formData.hospitalId?._id || formData.hospitalId || ''}
                        onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Hospital...</option>
                        {allHospitals.map((h) => (
                          <option key={h._id} value={h._id}>
                            {h.name} - {h.city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Hospital Form */}
                {activeTab === 'hospitals' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hospital Name *
                      </label>
                      <Input
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Hospital name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <Input
                          required
                          value={formData.city || ''}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone *
                        </label>
                        <Input
                          required
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Phone number"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <Input
                        required
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Full address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Hospital description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.opdAvailable !== false}
                          onChange={(e) => setFormData({ ...formData, opdAvailable: e.target.checked })}
                          className="h-4 w-4"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          OPD Available
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.emergencyAvailable !== false}
                          onChange={(e) => setFormData({ ...formData, emergencyAvailable: e.target.checked })}
                          className="h-4 w-4"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          Emergency Available
                        </label>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    {modalMode === 'create' ? 'Create' : 'Update'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Confirm Delete</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
                {deleteConfirm.type === 'hospitals' &&
                  ' This will also delete all associated doctors and bookings.'}
                {deleteConfirm.type === 'doctors' &&
                  ' This will also delete all associated appointments.'}
                {deleteConfirm.type === 'patients' &&
                  ' This will also delete all associated bookings and appointments.'}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex-1 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminData;
