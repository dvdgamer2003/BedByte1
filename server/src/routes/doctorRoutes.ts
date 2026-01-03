import { Router } from 'express';
import {
  getDoctors,
  getDoctorById,
  checkAvailability,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctorController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getDoctors);
router.get('/availability', checkAvailability);
router.get('/:id', getDoctorById);

// Admin routes
router.post('/', authenticate, authorize('admin'), createDoctor);
router.put('/:id', authenticate, authorize('admin', 'hospital_staff'), updateDoctor);
router.delete('/:id', authenticate, authorize('admin'), deleteDoctor);

export default router;
