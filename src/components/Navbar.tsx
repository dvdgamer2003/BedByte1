import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, LogOut, User, Calendar, Activity, AlertCircle, Stethoscope, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Building2 className="h-8 w-8 text-blue-600" />
            </motion.div>
            <div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">GetBeds<span className="text-blue-600">+</span></span>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Activity className="h-3 w-3 text-green-500 animate-pulse" />
                <span>Live</span>
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/nearby"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive('/nearby') 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  <span>Nearby</span>
                </Link>
                <Link
                  to="/doctors"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive('/doctors') 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Stethoscope className="h-4 w-4" />
                  <span>Doctors</span>
                </Link>
                <Link
                  to="/emergency-booking"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive('/emergency-booking') 
                      ? 'bg-red-50 text-red-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>Emergency</span>
                </Link>
                <Link
                  to="/my-appointments"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive('/my-appointments') 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Appointments</span>
                </Link>
                <Link
                  to="/my-bookings"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive('/my-bookings') 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>Bookings</span>
                </Link>
                <Link
                  to="/opd-queue"
                  className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                    isActive('/opd-queue') 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  OPD
                </Link>
                {(user?.role === 'admin' || user?.role === 'hospital_staff') && (
                  <Link
                    to="/admin"
                    className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                      isActive('/admin') 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="default">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="default">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
