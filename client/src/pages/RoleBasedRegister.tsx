import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Building2, Stethoscope, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import api from '../utils/api';

type RoleType = 'patient' | 'hospital_staff' | 'doctor';

const RoleBasedRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    hospitalId: '',
    // Doctor specific
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
  });

  useEffect(() => {
    if (selectedRole === 'hospital_staff' || selectedRole === 'doctor') {
      fetchHospitals();
    }
  }, [selectedRole]);

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/hospitals');
      setHospitals(response.data.data);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      setLoading(true);
      const registrationData: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: selectedRole,
      };

      if (selectedRole !== 'patient') {
        registrationData.hospitalId = formData.hospitalId;
      }

      const response = await api.post('/auth/register', registrationData);

      if (response.data.needsApproval) {
        setSuccessMessage(response.data.message);
        setRegistrationSuccess(true);
      } else {
        // Patient - auto login
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full"
        >
          <Card className="shadow-2xl">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="h-20 w-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
              >
                <CheckCircle className="h-12 w-12 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Registration Successful!</h2>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <Button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join our healthcare platform</p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <div className="h-1 w-16 bg-gray-300">
              <div className={`h-full ${step >= 2 ? 'bg-purple-600' : ''} transition-all`} />
            </div>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Patient Card */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card
                  onClick={() => handleRoleSelect('patient')}
                  className="cursor-pointer hover:shadow-2xl transition-all border-2 hover:border-purple-400"
                >
                  <CardContent className="p-8 text-center">
                    <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Patient</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Book appointments and manage your health
                    </p>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                      Register as Patient
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Hospital Manager Card */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card
                  onClick={() => handleRoleSelect('hospital_staff')}
                  className="cursor-pointer hover:shadow-2xl transition-all border-2 hover:border-cyan-400"
                >
                  <CardContent className="p-8 text-center">
                    <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Building2 className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Hospital Manager</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Manage hospital operations
                    </p>
                    <div className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full mb-4">
                      Requires Admin Approval
                    </div>
                    <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600">
                      Register as Manager
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Doctor Card */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card
                  onClick={() => handleRoleSelect('doctor')}
                  className="cursor-pointer hover:shadow-2xl transition-all border-2 hover:border-green-400"
                >
                  <CardContent className="p-8 text-center">
                    <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                      <Stethoscope className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Doctor</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Provide medical consultations
                    </p>
                    <div className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full mb-4">
                      Requires Hospital Approval
                    </div>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600">
                      Register as Doctor
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {step === 2 && selectedRole && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="max-w-2xl mx-auto shadow-2xl">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <Button
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="mb-4"
                    >
                      ← Back to Role Selection
                    </Button>
                    <h2 className="text-2xl font-bold mb-2">
                      {selectedRole === 'patient' && 'Patient Registration'}
                      {selectedRole === 'hospital_staff' && 'Hospital Manager Registration'}
                      {selectedRole === 'doctor' && 'Doctor Registration'}
                    </h2>
                    <p className="text-gray-600">Fill in your details to create an account</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name *</label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <Input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Password *</label>
                        <Input
                          required
                          type="password"
                          minLength={6}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Min 6 characters"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Confirm Password *</label>
                        <Input
                          required
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="Confirm password"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 1234567890"
                      />
                    </div>

                    {/* Hospital Selection for Staff and Doctors */}
                    {(selectedRole === 'hospital_staff' || selectedRole === 'doctor') && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Select Hospital *</label>
                        <select
                          required
                          value={formData.hospitalId}
                          onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Choose a hospital...</option>
                          {hospitals.map((hospital) => (
                            <option key={hospital._id} value={hospital._id}>
                              {hospital.name} - {hospital.city}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      >
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </div>
                  </form>

                  <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <a href="/login" className="text-purple-600 hover:underline">
                      Login here
                    </a>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RoleBasedRegister;
