import { Router } from 'express';
import {
  bookAppointment,
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

// Patient routes
router.post('/', bookAppointment);
router.get('/my', getMyAppointments);
router.get('/:id', getAppointmentById);
router.delete('/:id', cancelAppointment);

// Doctor/Admin routes
router.get('/doctor/:doctorId', authorize('admin', 'hospital_staff'), getDoctorAppointments);
router.put('/:id', authorize('admin', 'hospital_staff'), updateAppointment);

// Admin routes
router.get('/all', authorize('admin', 'hospital_staff'), getAllAppointments);
router.get('/stats/all', authorize('admin'), getAppointmentStats);

export default router;
