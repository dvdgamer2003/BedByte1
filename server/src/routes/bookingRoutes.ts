import { Router } from 'express';
import {
  createProvisionalBooking,
  confirmBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
} from '../controllers/bookingController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Admin routes - must be before other routes
router.get('/', authorize('admin', 'hospital_staff'), getAllBookings);
router.get('/all', authorize('admin', 'hospital_staff'), getAllBookings);

// User routes
router.post('/provisional', createProvisionalBooking);
router.post('/:id/confirm', confirmBooking);
router.get('/my-bookings', getMyBookings);
router.post('/:id/cancel', cancelBooking);

export default router;
