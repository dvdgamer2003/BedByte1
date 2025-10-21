import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  LogOut, 
  User, 
  Calendar, 
  Activity, 
  AlertCircle, 
  Stethoscope, 
  MapPin,
  Home,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Users,
  Settings,
  BookOpen
} from 'lucide-react';
import { Button } from './ui/button';

const ProfessionalNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity" />
              <Building2 className="h-8 w-8 text-blue-600 relative z-10" />
            </motion.div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                GetBeds<span className="text-green-600">+</span>
              </span>
              <div className="flex items-center space-x-1 text-[10px] text-gray-500">
                <Activity className="h-2.5 w-2.5 text-green-500 animate-pulse" />
                <span>Live Monitoring</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                {/* Home */}
                <Link to="/">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      isActive('/') 
                        ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-600 font-medium shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </motion.div>
                </Link>

                {/* Hospitals */}
                <Link to="/hospitals">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      isActive('/hospitals') 
                        ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-600 font-medium shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Hospitals</span>
                  </motion.div>
                </Link>

                {/* Services Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ y: -2 }}
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
                  >
                    <Activity className="h-4 w-4" />
                    <span>Services</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                  
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-hidden"
                        onMouseLeave={() => setServicesOpen(false)}
                      >
                        <Link to="/emergency-booking" onClick={() => setServicesOpen(false)}>
                          <motion.div 
                            whileHover={{ x: 5, backgroundColor: 'rgba(239, 246, 255, 0.6)' }}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-red-600 transition-colors"
                          >
                            <AlertCircle className="h-4 w-4" />
                            <div>
                              <div className="font-medium text-sm">Emergency</div>
                              <div className="text-xs text-gray-500">Urgent care booking</div>
                            </div>
                          </motion.div>
                        </Link>
                        <Link to="/nearby" onClick={() => setServicesOpen(false)}>
                          <motion.div 
                            whileHover={{ x: 5, backgroundColor: 'rgba(239, 246, 255, 0.6)' }}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 transition-colors"
                          >
                            <MapPin className="h-4 w-4" />
                            <div>
                              <div className="font-medium text-sm">Nearby Doctors</div>
                              <div className="text-xs text-gray-500">Find doctors near you</div>
                            </div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Book Appointment */}
                <Link to="/appointments">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      isActive('/appointments') 
                        ? 'bg-gradient-to-r from-green-50 to-blue-50 text-green-600 font-medium shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Book Appointment</span>
                  </motion.div>
                </Link>

                {/* Appointments */}

                {/* Bookings */}
                <Link to="/my-bookings">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      isActive('/my-bookings') 
                        ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-600 font-medium shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Bookings</span>
                  </motion.div>
                </Link>

                {/* OPD */}
                <Link to="/opd-queue">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      isActive('/opd-queue') 
                        ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-600 font-medium shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Stethoscope className="h-4 w-4" />
                    <span>OPD</span>
                  </motion.div>
                </Link>

                {/* Admin Dropdown */}
                {(user?.role === 'admin' || user?.role === 'hospital_staff') && (
                  <div className="relative">
                    <motion.button
                      whileHover={{ y: -2 }}
                      onClick={() => setAdminOpen(!adminOpen)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Admin</span>
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${adminOpen ? 'rotate-180' : ''}`} />
                    </motion.button>
                    
                    <AnimatePresence>
                      {adminOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-hidden"
                          onMouseLeave={() => setAdminOpen(false)}
                        >
                          <Link to="/admin" onClick={() => setAdminOpen(false)}>
                            <motion.div 
                              whileHover={{ x: 5, backgroundColor: 'rgba(239, 246, 255, 0.6)' }}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 transition-colors"
                            >
                              <LayoutDashboard className="h-4 w-4" />
                              <div>
                                <div className="font-medium text-sm">Dashboard</div>
                                <div className="text-xs text-gray-500">Overview & stats</div>
                              </div>
                            </motion.div>
                          </Link>
                          {user?.role === 'admin' && (
                            <Link to="/admin/hospitals" onClick={() => setAdminOpen(false)}>
                              <motion.div 
                                whileHover={{ x: 5, backgroundColor: 'rgba(239, 246, 255, 0.6)' }}
                                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 transition-colors"
                              >
                                <Users className="h-4 w-4" />
                                <div>
                                  <div className="font-medium text-sm">Manage Hospitals</div>
                                  <div className="text-xs text-gray-500">Admin only</div>
                                </div>
                              </motion.div>
                            </Link>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* User Profile & Logout */}
                <Link to="/profile">
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl ml-2 cursor-pointer hover:from-blue-100 hover:to-green-100 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  </motion.div>
                </Link>
                
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="default" className="rounded-xl">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${
                        isActive('/') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Home className="h-5 w-5" />
                      <span className="font-medium">Home</span>
                    </motion.div>
                  </Link>
                  
                  <Link to="/hospitals" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${
                        isActive('/hospitals') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Building2 className="h-5 w-5" />
                      <span className="font-medium">Hospitals</span>
                    </motion.div>
                  </Link>
                  
                  <div className="border-t border-gray-100 my-2 pt-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Services</div>
                    <Link to="/emergency-booking" onClick={() => setMobileMenuOpen(false)}>
                      <motion.div whileTap={{ scale: 0.98 }} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span>Emergency</span>
                      </motion.div>
                    </Link>
                    <Link to="/nearby" onClick={() => setMobileMenuOpen(false)}>
                      <motion.div whileTap={{ scale: 0.98 }} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50">
                        <MapPin className="h-5 w-5" />
                        <span>Nearby Doctors</span>
                      </motion.div>
                    </Link>
                  </div>
                  
                  <Link to="/appointments" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div whileTap={{ scale: 0.98 }} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <span>Book Appointment</span>
                    </motion.div>
                  </Link>
                  
                  <Link to="/my-appointments" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div whileTap={{ scale: 0.98 }} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50">
                      <Calendar className="h-5 w-5" />
                      <span>My Appointments</span>
                    </motion.div>
                  </Link>
                  
                  <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div whileTap={{ scale: 0.98 }} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50">
                      <BookOpen className="h-5 w-5" />
                      <span>Bookings</span>
                    </motion.div>
                  </Link>
                  
                  <Link to="/opd-queue" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div whileTap={{ scale: 0.98 }} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50">
                      <Stethoscope className="h-5 w-5" />
                      <span>OPD Queue</span>
                    </motion.div>
                  </Link>
                  
                  {(user?.role === 'admin' || user?.role === 'hospital_staff') && (
                    <div className="border-t border-gray-100 my-2 pt-2">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</div>
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <motion.div whileTap={{ scale: 0.98 }} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50">
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Dashboard</span>
                        </motion.div>
                      </Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin/hospitals" onClick={() => setMobileMenuOpen(false)}>
                          <motion.div whileTap={{ scale: 0.98 }} className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50">
                            <Users className="h-5 w-5" />
                            <span>Manage Hospitals</span>
                          </motion.div>
                        </Link>
                      )}
                    </div>
                  )}
                  
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <motion.div 
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-between px-4 py-3 bg-blue-50 rounded-xl mb-2 hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user?.name}</div>
                            <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                    <motion.button
                      onClick={handleLogout}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 bg-red-50 rounded-xl font-medium"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-xl">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 rounded-xl">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default ProfessionalNavbar;
