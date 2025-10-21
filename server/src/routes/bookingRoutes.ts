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

router.post('/provisional', createProvisionalBooking);
router.post('/:id/confirm', confirmBooking);
router.get('/my-bookings', getMyBookings);
router.post('/:id/cancel', cancelBooking);

// Admin routes
router.get('/all', authorize('admin', 'hospital_staff'), getAllBookings);

export default router;
