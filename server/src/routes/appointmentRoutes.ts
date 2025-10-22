import { Router } from 'express';
import {
  bookAppointment,
  getAppointments,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  getDoctorAppointments,
  updateAppointment,
  getAppointmentStats,
  getAllAppointments,
} from '../controllers/appointmentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Admin routes - must be before other routes to avoid conflicts
router.get('/all', authorize('admin', 'hospital_staff'), getAllAppointments);
router.get('/stats/all', authorize('admin'), getAppointmentStats);
router.get('/doctor/:doctorId', authorize('admin', 'hospital_staff'), getDoctorAppointments);
router.put('/:id', authorize('admin', 'hospital_staff'), updateAppointment);

// Root GET - smart handler (admin gets all, users get their own)
router.get('/', getAppointments);

// Patient routes
router.post('/', bookAppointment);
router.get('/my', getMyAppointments);
router.get('/:id', getAppointmentById);
router.delete('/:id', cancelAppointment);

export default router;
