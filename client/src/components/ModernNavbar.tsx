import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, LogOut, User, Calendar, Activity, Stethoscope, MapPin,
  Home, ChevronDown, Menu, X, LayoutDashboard, Users, Settings, BookOpen,
  Shield, Zap
} from 'lucide-react';

const ModernNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const DropdownMenu = ({ children }: { children: React.ReactNode; onClose?: () => void }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-full right-0 mt-0 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
    >
      <div className="p-2">{children}</div>
    </motion.div>
  );

  const DropdownItem = ({ to, icon: Icon, title, desc, color }: any) => (
    <Link to={to} onClick={() => setActiveDropdown(null)}>
      <motion.div
        whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
        className="flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer"
      >
        <div className={`p-2 rounded-lg bg-${color}-100`}>
          <Icon className={`h-4 w-4 text-${color}-600`} />
        </div>
        <div>
          <div className="font-semibold text-gray-900 text-sm">{title}</div>
          <div className="text-xs text-gray-500">{desc}</div>
        </div>
      </motion.div>
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img 
                src="/logo.svg" 
                alt="BedByte+" 
                className="w-12 h-12 rounded-full shadow-lg ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all"
              />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-[#a87b7b] tracking-tight">
                BedByte<span className="text-[#e67e22]">+</span>
              </h1>
              <p className="text-[10px] font-medium text-gray-600 -mt-1">Smart Healthcare Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <NavLink to="/" icon={Home} label="Home" isActive={isActive('/')} />
                <NavLink to="/hospitals" icon={Building2} label="Hospitals" isActive={isActive('/hospitals')} />
                <NavLink to="/doctors" icon={Stethoscope} label="Doctors" isActive={isActive('/doctors')} />
                
                {/* Services Dropdown */}
                <div className="relative" onMouseEnter={() => setActiveDropdown('services')} onMouseLeave={() => setActiveDropdown(null)}>
                  <button className="flex items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all text-gray-700">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm font-medium">Services</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === 'services' && (
                      <DropdownMenu>
                        <DropdownItem to="/emergency-booking" icon={Zap} title="Emergency" desc="24/7 urgent care" color="red" />
                        <DropdownItem to="/nearby" icon={MapPin} title="Nearby Care" desc="Find doctors near you" color="blue" />
                        <DropdownItem to="/opd-queue" icon={Users} title="OPD Queue" desc="Check wait times" color="green" />
                      </DropdownMenu>
                    )}
                  </AnimatePresence>
                </div>

                {/* My Space Dropdown */}
                <div className="relative" onMouseEnter={() => setActiveDropdown('myspace')} onMouseLeave={() => setActiveDropdown(null)}>
                  <button className="flex items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all text-gray-700">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">My Space</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'myspace' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === 'myspace' && (
                      <DropdownMenu>
                        <DropdownItem to="/my-bookings" icon={BookOpen} title="My Bookings" desc="View all bookings" color="purple" />
                        <DropdownItem to="/my-appointments" icon={Calendar} title="Appointments" desc="Scheduled visits" color="blue" />
                        <DropdownItem to="/profile" icon={User} title="Profile" desc="Account settings" color="green" />
                      </DropdownMenu>
                    )}
                  </AnimatePresence>
                </div>

                {/* Role-based Dashboards */}
                {user?.role === 'admin' && (
                  <div className="relative" onMouseEnter={() => setActiveDropdown('admin')} onMouseLeave={() => setActiveDropdown(null)}>
                    <button className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 text-red-700 hover:from-red-100 hover:to-pink-100 transition-all">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-semibold">Admin</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'admin' ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === 'admin' && (
                        <DropdownMenu>
                          <DropdownItem to="/admin" icon={LayoutDashboard} title="Dashboard" desc="Admin panel" color="indigo" />
                          <DropdownItem to="/admin/hospitals" icon={Building2} title="Hospitals" desc="Manage hospitals" color="purple" />
                          <DropdownItem to="/admin/data" icon={Users} title="User Data" desc="Manage users" color="blue" />
                          <DropdownItem to="/admin/approvals" icon={Settings} title="Approvals" desc="User requests" color="orange" />
                        </DropdownMenu>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {user?.role === 'hospital_staff' && (
                  <div className="relative" onMouseEnter={() => setActiveDropdown('hospital')} onMouseLeave={() => setActiveDropdown(null)}>
                    <button className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 hover:from-cyan-100 hover:to-blue-100 transition-all">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm font-semibold">Hospital</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'hospital' ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === 'hospital' && (
                        <DropdownMenu>
                          <DropdownItem to="/hospital/dashboard" icon={LayoutDashboard} title="Dashboard" desc="Hospital panel" color="cyan" />
                          <DropdownItem to="/hospital/emergency" icon={Zap} title="Emergency" desc="Fast-track requests" color="red" />
                          <DropdownItem to="/hospital/approvals" icon={Users} title="Approvals" desc="Approve doctors" color="teal" />
                        </DropdownMenu>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {user?.role === 'doctor' && (
                  <NavLink to="/doctor/dashboard" icon={Stethoscope} label="Dashboard" isActive={isActive('/doctor/dashboard')} highlight="green" />
                )}

                {/* User Menu */}
                <div className="relative ml-3" onMouseEnter={() => setActiveDropdown('user')} onMouseLeave={() => setActiveDropdown(null)}>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all">
                    <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate">{user?.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'user' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === 'user' && (
                      <DropdownMenu>
                        <DropdownItem to="/profile" icon={User} title="My Profile" desc="Account settings" color="blue" />
                        <div onClick={handleLogout}>
                          <motion.div
                            whileHover={{ x: 4, backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                            className="flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer"
                          >
                            <div className="p-2 rounded-lg bg-red-100">
                              <LogOut className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">Logout</div>
                              <div className="text-xs text-gray-500">Sign out of account</div>
                            </div>
                          </motion.div>
                        </div>
                      </DropdownMenu>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg transition-all">
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <MobileNavLink to="/" icon={Home} label="Home" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink to="/hospitals" icon={Building2} label="Hospitals" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink to="/doctors" icon={Stethoscope} label="Doctors" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink to="/emergency-booking" icon={Zap} label="Emergency" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink to="/my-bookings" icon={BookOpen} label="My Bookings" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink to="/profile" icon={User} label="Profile" onClick={() => setMobileMenuOpen(false)} />
                  {user?.role === 'admin' && <MobileNavLink to="/admin" icon={Shield} label="Admin Dashboard" onClick={() => setMobileMenuOpen(false)} />}
                  {user?.role === 'hospital_staff' && (
                    <>
                      <MobileNavLink to="/hospital/dashboard" icon={Building2} label="Hospital Dashboard" onClick={() => setMobileMenuOpen(false)} />
                      <MobileNavLink to="/hospital/emergency" icon={Zap} label="Emergency Management" onClick={() => setMobileMenuOpen(false)} />
                    </>
                  )}
                  {user?.role === 'doctor' && <MobileNavLink to="/doctor/dashboard" icon={Stethoscope} label="Doctor Dashboard" onClick={() => setMobileMenuOpen(false)} />}
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600">
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink to="/login" icon={User} label="Login" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavLink to="/register" icon={User} label="Sign Up" onClick={() => setMobileMenuOpen(false)} />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ to, icon: Icon, label, isActive, highlight }: any) => (
  <Link to={to}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
        isActive 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
          : highlight 
          ? `bg-${highlight}-50 text-${highlight}-700 hover:bg-${highlight}-100`
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
    </motion.div>
  </Link>
);

const MobileNavLink = ({ to, icon: Icon, label, onClick }: any) => (
  <Link to={to} onClick={onClick}>
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors">
      <Icon className="h-5 w-5 text-gray-600" />
      <span className="font-medium text-gray-900">{label}</span>
    </div>
  </Link>
);

export default ModernNavbar;
