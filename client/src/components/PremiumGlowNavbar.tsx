import { useState, useRef } from 'react';
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
  BookOpen,
  Phone,
  Heart,
  FileText,
  Shield
} from 'lucide-react';

const PremiumGlowNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  
  // Marker animation
  const [markerStyle, setMarkerStyle] = useState({ left: 0, width: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // Update marker position
  const updateMarker = (element: HTMLElement | null, index: number) => {
    if (element) {
      setMarkerStyle({
        left: element.offsetLeft,
        width: element.offsetWidth
      });
      setActiveIndex(index);
    }
  };

  // Get glow color based on index
  const getGlowColor = (index: number) => {
    const colors = [
      { bg: '#5da6ff', shadow: '0 0 15px #5da6ff, 0 0 30px #5da6ff, 0 0 40px #5da6ff' }, // Blue
      { bg: '#10b981', shadow: '0 0 15px #10b981, 0 0 30px #10b981, 0 0 40px #10b981' }, // Green
      { bg: '#f59e0b', shadow: '0 0 15px #f59e0b, 0 0 30px #f59e0b, 0 0 40px #f59e0b' }, // Orange
      { bg: '#ef4444', shadow: '0 0 15px #ef4444, 0 0 30px #ef4444, 0 0 40px #ef4444' }, // Red
      { bg: '#8b5cf6', shadow: '0 0 15px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6' }, // Purple
      { bg: '#ec4899', shadow: '0 0 15px #ec4899, 0 0 30px #ec4899, 0 0 40px #ec4899' }, // Pink
    ];
    return colors[index % colors.length];
  };

  const navItems = isAuthenticated ? [
    { path: '/', icon: Home, label: 'Home', dropdown: false },
    { path: '/hospitals', icon: Building2, label: 'Hospitals', dropdown: false },
    { path: 'services', icon: Activity, label: 'Services', dropdown: true },
    { path: 'bookings', icon: BookOpen, label: 'My Space', dropdown: true },
    { path: '/appointments', icon: Calendar, label: 'Book Now', dropdown: false },
    { path: 'support', icon: Heart, label: 'Support', dropdown: true },
  ] : [];

  return (
    <>
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {/* Gradient top line */}
        <motion.div 
          className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{ backgroundSize: '200% 100%' }}
        />

        {/* Main nav container */}
        <div className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-2xl shadow-2xl">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo with premium glow */}
              <Link to="/" className="flex items-center space-x-3 group relative z-50">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {/* Multi-layer glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur-md opacity-40" />
                  <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-3 rounded-2xl shadow-2xl">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                </motion.div>
                <div>
                  <motion.span 
                    className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                    whileHover={{ scale: 1.02 }}
                  >
                    GetBeds<span className="text-green-400">+</span>
                  </motion.span>
                  <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-medium">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Activity className="h-3 w-3 text-green-400" />
                    </motion.div>
                    <span>24/7 Live</span>
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation with Glowing Marker */}
              {isAuthenticated && (
                <div ref={navRef} className="hidden lg:flex items-center relative">
                  {/* Animated marker */}
                  <motion.div
                    className="absolute bottom-0 h-1 rounded-full transition-all duration-500 ease-out"
                    style={{
                      left: markerStyle.left,
                      width: markerStyle.width,
                      backgroundColor: getGlowColor(activeIndex).bg,
                      boxShadow: getGlowColor(activeIndex).shadow,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />

                  {/* Glowing indicator above */}
                  <motion.div
                    className="absolute -top-3 h-10 w-12 rounded-lg transition-all duration-500 ease-out"
                    style={{
                      left: markerStyle.left + markerStyle.width / 2 - 24,
                      backgroundColor: getGlowColor(activeIndex).bg,
                      boxShadow: getGlowColor(activeIndex).shadow,
                      opacity: 0.8,
                    }}
                  />

                  <ul className="flex items-center space-x-1">
                    {navItems.map((item, index) => (
                      <li key={item.path} className="relative">
                        {item.dropdown ? (
                          <div className="relative">
                            <motion.button
                              onClick={() => {
                                if (item.label === 'Services') setServicesOpen(!servicesOpen);
                                if (item.label === 'My Space') setBookingsOpen(!bookingsOpen);
                                if (item.label === 'Support') setSupportOpen(!supportOpen);
                              }}
                              onMouseEnter={(e) => updateMarker(e.currentTarget, index)}
                              whileHover={{ y: -2 }}
                              className="relative flex items-center space-x-2 px-6 py-3 text-white/70 hover:text-white transition-all backdrop-blur-sm group"
                            >
                              <item.icon className="h-5 w-5 transition-opacity group-hover:opacity-100 opacity-60" />
                              <span className="font-medium">{item.label}</span>
                              <ChevronDown className={`h-4 w-4 transition-transform ${
                                (item.label === 'Services' && servicesOpen) || 
                                (item.label === 'My Space' && bookingsOpen) ||
                                (item.label === 'Support' && supportOpen) ? 'rotate-180' : ''
                              }`} />
                            </motion.button>

                            {/* Dropdown menus */}
                            <AnimatePresence>
                              {item.label === 'Services' && servicesOpen && (
                                <DropdownMenu onClose={() => setServicesOpen(false)}>
                                  <DropdownItem to="/emergency-booking" icon={AlertCircle} title="Emergency" desc="Urgent care 24/7" color="red" />
                                  <DropdownItem to="/nearby" icon={MapPin} title="Nearby" desc="Find doctors near you" color="blue" />
                                  <DropdownItem to="/opd-queue" icon={Stethoscope} title="OPD Queue" desc="Check wait times" color="green" />
                                </DropdownMenu>
                              )}
                              
                              {item.label === 'My Space' && bookingsOpen && (
                                <DropdownMenu onClose={() => setBookingsOpen(false)}>
                                  <DropdownItem to="/my-bookings" icon={BookOpen} title="My Bookings" desc="View all bookings" color="purple" />
                                  <DropdownItem to="/my-appointments" icon={Calendar} title="Appointments" desc="Scheduled visits" color="blue" />
                                  <DropdownItem to="/profile" icon={User} title="Profile" desc="Account settings" color="green" />
                                </DropdownMenu>
                              )}

                              {item.label === 'Support' && supportOpen && (
                                <DropdownMenu onClose={() => setSupportOpen(false)}>
                                  <DropdownItem to="/contact" icon={Phone} title="Contact Us" desc="24/7 helpline" color="orange" />
                                  <DropdownItem to="/resources" icon={FileText} title="Resources" desc="Guides & FAQs" color="blue" />
                                  <DropdownItem to="/privacy" icon={Shield} title="Privacy" desc="Terms & policies" color="purple" />
                                </DropdownMenu>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link to={item.path}>
                            <motion.div
                              onMouseEnter={(e) => updateMarker(e.currentTarget, index)}
                              whileHover={{ y: -2 }}
                              className={`relative flex items-center space-x-2 px-6 py-3 backdrop-blur-sm transition-all group ${
                                isActive(item.path)
                                  ? 'text-white'
                                  : 'text-white/70 hover:text-white'
                              }`}
                            >
                              <item.icon className={`h-5 w-5 transition-opacity ${
                                isActive(item.path) ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                              }`} />
                              <span className="font-medium">{item.label}</span>
                            </motion.div>
                          </Link>
                        )}
                      </li>
                    ))}

                    {/* Admin/Hospital Manager dropdown */}
                    {user?.role === 'admin' && (
                      <li className="relative ml-2">
                        <motion.button
                          onClick={() => setAdminOpen(!adminOpen)}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
                        >
                          <Shield className="h-5 w-5 text-white" />
                          <span className="text-sm font-medium text-white">Admin</span>
                        </motion.button>

                        <AnimatePresence>
                          {adminOpen && (
                            <DropdownMenu onClose={() => setAdminOpen(false)}>
                              <DropdownItem to="/admin" icon={LayoutDashboard} title="Dashboard" desc="Admin panel" color="indigo" />
                              <DropdownItem to="/admin/hospitals" icon={Building2} title="Hospitals" desc="Manage hospitals" color="purple" />
                              <DropdownItem to="/admin/data" icon={Users} title="Admin Data" desc="Manage users" color="blue" />
                              <DropdownItem to="/admin/approvals" icon={Settings} title="Approvals" desc="User approvals" color="orange" />
                            </DropdownMenu>
                          )}
                        </AnimatePresence>
                      </li>
                    )}
                    
                    {user?.role === 'hospital_staff' && (
                      <li className="relative ml-2">
                        <motion.button
                          onClick={() => setAdminOpen(!adminOpen)}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
                        >
                          <Building2 className="h-5 w-5 text-white" />
                          <span className="text-sm font-medium text-white">Manage Hospital</span>
                        </motion.button>

                        <AnimatePresence>
                          {adminOpen && (
                            <DropdownMenu onClose={() => setAdminOpen(false)}>
                              <DropdownItem to="/hospital/dashboard" icon={LayoutDashboard} title="Dashboard" desc="Hospital panel" color="cyan" />
                              <DropdownItem to="/hospital/approvals" icon={Users} title="Approvals" desc="Approve doctors" color="teal" />
                            </DropdownMenu>
                          )}
                        </AnimatePresence>
                      </li>
                    )}

                    {user?.role === 'doctor' && (
                      <li className="relative ml-2">
                        <motion.button
                          onClick={() => setAdminOpen(!adminOpen)}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
                        >
                          <Stethoscope className="h-5 w-5 text-white" />
                          <span className="text-sm font-medium text-white">Doctor</span>
                        </motion.button>

                        <AnimatePresence>
                          {adminOpen && (
                            <DropdownMenu onClose={() => setAdminOpen(false)}>
                              <DropdownItem to="/doctor/dashboard" icon={LayoutDashboard} title="Dashboard" desc="My appointments" color="green" />
                            </DropdownMenu>
                          )}
                        </AnimatePresence>
                      </li>
                    )}

                    {/* User profile */}
                    <li className="ml-4">
                      <Link to="/profile">
                        <motion.div 
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all"
                        >
                          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-white max-w-[100px] truncate">{user?.name}</span>
                        </motion.div>
                      </Link>
                    </li>

                    {/* Logout */}
                    <li>
                      <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all ml-2"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Logout</span>
                      </motion.button>
                    </li>
                  </ul>
                </div>
              )}

              {/* Auth buttons for non-authenticated */}
              {!isAuthenticated && (
                <div className="hidden lg:flex items-center space-x-3">
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 text-white font-medium hover:bg-white/10 rounded-xl backdrop-blur-sm transition-all"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2, boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-xl"
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile glow line */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30" />
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 backdrop-blur-2xl shadow-2xl lg:hidden z-50 overflow-y-auto"
            style={{ top: '81px' }}
          >
            <div className="p-6 space-y-4">
              {isAuthenticated ? (
                <>
                  <MobileNavItem to="/" icon={Home} label="Home" onClick={() => setMobileMenuOpen(false)} />
                  <MobileNavItem to="/hospitals" icon={Building2} label="Hospitals" onClick={() => setMobileMenuOpen(false)} />
                  
                  <div className="border-t border-white/10 pt-4">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Services</div>
                    <MobileNavItem to="/emergency-booking" icon={AlertCircle} label="Emergency" onClick={() => setMobileMenuOpen(false)} color="red" />
                    <MobileNavItem to="/nearby" icon={MapPin} label="Nearby Doctors" onClick={() => setMobileMenuOpen(false)} />
                    <MobileNavItem to="/opd-queue" icon={Stethoscope} label="OPD Queue" onClick={() => setMobileMenuOpen(false)} />
                  </div>
                  
                  <div className="border-t border-white/10 pt-4">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">My Space</div>
                    <MobileNavItem to="/appointments" icon={Calendar} label="Book Appointment" onClick={() => setMobileMenuOpen(false)} color="green" />
                    <MobileNavItem to="/my-appointments" icon={Calendar} label="My Appointments" onClick={() => setMobileMenuOpen(false)} />
                    <MobileNavItem to="/my-bookings" icon={BookOpen} label="My Bookings" onClick={() => setMobileMenuOpen(false)} />
                  </div>

                  {(user?.role === 'admin' || user?.role === 'hospital_staff') && (
                    <div className="border-t border-white/10 pt-4">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Admin</div>
                      <MobileNavItem to="/admin" icon={LayoutDashboard} label="Dashboard" onClick={() => setMobileMenuOpen(false)} />
                      {user?.role === 'admin' && (
                        <MobileNavItem to="/admin/hospitals" icon={Users} label="Manage Hospitals" onClick={() => setMobileMenuOpen(false)} />
                      )}
                    </div>
                  )}

                  <div className="border-t border-white/10 pt-4">
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <motion.div 
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center space-x-4 px-4 py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl mb-3 border border-white/10"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{user?.name}</div>
                          <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
                        </div>
                      </motion.div>
                    </Link>
                    <motion.button
                      onClick={handleLogout}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl font-semibold transition-all"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transition-all"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-xl"
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Dropdown Menu Component
const DropdownMenu = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    className="absolute top-full mt-3 left-0 w-72 bg-slate-900/95 backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
    onMouseLeave={onClose}
  >
    <div className="p-2">
      {children}
    </div>
  </motion.div>
);

// Dropdown Item Component
const DropdownItem = ({ to, icon: Icon, title, desc, color = 'blue' }: any) => {
  const colorMap: any = {
    blue: 'from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-400',
    green: 'from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 text-green-400',
    red: 'from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-400',
    purple: 'from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 text-purple-400',
    orange: 'from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 text-orange-400',
    indigo: 'from-indigo-500/20 to-indigo-600/20 hover:from-indigo-500/30 hover:to-indigo-600/30 text-indigo-400',
  };

  return (
    <Link to={to}>
      <motion.div 
        whileHover={{ x: 5 }}
        className={`flex items-start space-x-3 px-4 py-3.5 rounded-xl transition-all bg-gradient-to-r ${colorMap[color]}`}
      >
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white text-sm">{title}</div>
          <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
        </div>
      </motion.div>
    </Link>
  );
};

// Mobile Nav Item Component
const MobileNavItem = ({ to, icon: Icon, label, onClick, color = 'blue' }: any) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} onClick={onClick}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
          isActive 
            ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white' 
            : 'text-gray-300 hover:bg-white/5'
        }`}
      >
        <Icon className={`h-5 w-5 ${color === 'red' ? 'text-red-400' : color === 'green' ? 'text-green-400' : ''}`} />
        <span className="font-medium">{label}</span>
      </motion.div>
    </Link>
  );
};

export default PremiumGlowNavbar;
