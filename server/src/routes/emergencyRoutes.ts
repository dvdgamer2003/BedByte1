import { Router } from 'express';
import {
  createEmergencyBooking,
  getEmergencyBookings,
  getMyEmergencyBookings,
  getEmergencyBookingById,
  updateEmergencyStatus,
  getEmergencyStats,
  checkEmergencyAvailability,
} from '../controllers/emergencyController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public route
router.get('/availability', checkEmergencyAvailability);

router.use(authenticate);

// Patient routes
router.post('/', createEmergencyBooking);
router.get('/my', getMyEmergencyBookings);
router.get('/:id', getEmergencyBookingById);

// Admin/Staff routes
router.get('/', authorize('admin', 'hospital_staff'), getEmergencyBookings);
router.put('/:id', authorize('admin', 'hospital_staff'), updateEmergencyStatus);
router.get('/stats/all', authorize('admin'), getEmergencyStats);

export default router;
