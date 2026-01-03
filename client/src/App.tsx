import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ModernNavbar from './components/ModernNavbar'
import EnhancedHealthChatbot from './components/EnhancedHealthChatbot'
import ModernHome from './pages/ModernHome'
import EnhancedHome from './pages/EnhancedHome'
import EnhancedHospitalDetail from './pages/EnhancedHospitalDetail'
import EnhancedLogin from './pages/EnhancedLogin'
import EnhancedRegister from './pages/EnhancedRegister'
import UserProfile from './pages/UserProfile'
import EnhancedMyBookings from './pages/EnhancedMyBookings'
import EnhancedOPDQueue from './pages/EnhancedOPDQueue'
import EnhancedAdminDashboard from './pages/EnhancedAdminDashboard'
import EnhancedAdminBookings from './pages/EnhancedAdminBookings'
import HospitalManagement from './pages/admin/HospitalManagement'
import BedManagement from './pages/admin/BedManagement'
import DoctorManagement from './pages/admin/DoctorManagement'
import PricingSettings from './pages/admin/PricingSettings'
import AppointmentManagement from './pages/admin/AppointmentManagement'
import PrescriptionReview from './pages/admin/PrescriptionReview'
import AdminData from './pages/admin/AdminData'
import AdminApprovals from './pages/admin/AdminApprovals'
import RoleBasedRegister from './pages/RoleBasedRegister'
import HospitalApprovals from './pages/hospital/HospitalApprovals'
import EmergencyManagement from './pages/hospital/EmergencyManagement'
import EnhancedEmergencyBooking from './pages/EnhancedEmergencyBooking'
import EnhancedDoctorListing from './pages/EnhancedDoctorListing'
import EnhancedDoctorProfile from './pages/EnhancedDoctorProfile'
import EnhancedMyAppointments from './pages/EnhancedMyAppointments'
import EnhancedMyEmergencies from './pages/EnhancedMyEmergencies'
import NearbyLocations from './pages/NearbyLocations'
import Appointments from './pages/Appointments'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import HospitalManagerDashboard from './pages/hospital/HospitalManagerDashboard'
import ServiceDetail from './pages/ServiceDetail'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <ModernNavbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<ModernHome />} />
            <Route path="/hospitals" element={<EnhancedHome />} />
            <Route path="/service/:service" element={<ServiceDetail />} />
            <Route path="/login" element={<EnhancedLogin />} />
            <Route path="/register" element={<RoleBasedRegister />} />
            <Route path="/register-old" element={<EnhancedRegister />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route path="/hospital/:id" element={<EnhancedHospitalDetail />} />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <EnhancedMyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/opd-queue"
              element={
                <ProtectedRoute>
                  <EnhancedOPDQueue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <EnhancedAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute roles={['admin', 'hospital_staff']}>
                  <EnhancedAdminBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/hospitals"
              element={
                <ProtectedRoute roles={['admin']}>
                  <HospitalManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/beds"
              element={
                <ProtectedRoute roles={['admin', 'hospital_staff']}>
                  <BedManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute roles={['admin']}>
                  <DoctorManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pricing"
              element={
                <ProtectedRoute roles={['admin']}>
                  <PricingSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute roles={['admin', 'hospital_staff']}>
                  <AppointmentManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/prescriptions"
              element={
                <ProtectedRoute roles={['admin', 'hospital_staff']}>
                  <PrescriptionReview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approvals"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminApprovals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/dashboard"
              element={
                <ProtectedRoute roles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospital/dashboard"
              element={
                <ProtectedRoute roles={['hospital_staff']}>
                  <HospitalManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospital/approvals"
              element={
                <ProtectedRoute roles={['hospital_staff']}>
                  <HospitalApprovals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospital/emergency"
              element={
                <ProtectedRoute roles={['hospital_staff']}>
                  <EmergencyManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/emergency-booking"
              element={
                <ProtectedRoute>
                  <EnhancedEmergencyBooking />
                </ProtectedRoute>
              }
            />
            <Route path="/doctors" element={<EnhancedDoctorListing />} />
            <Route
              path="/doctors/:id"
              element={
                <ProtectedRoute>
                  <EnhancedDoctorProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-appointments"
              element={
                <ProtectedRoute>
                  <EnhancedMyAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-emergencies"
              element={
                <ProtectedRoute>
                  <EnhancedMyEmergencies />
                </ProtectedRoute>
              }
            />
            <Route path="/nearby" element={<NearbyLocations />} />
            <Route path="/appointments" element={<Appointments />} />
          </Routes>
        </main>
        <EnhancedHealthChatbot />
      </div>
    </AuthProvider>
  )
}

export default App
