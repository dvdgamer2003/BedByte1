import { Router } from 'express';
import {
  getHospitals,
  getHospitalById,
  updateHospital,
  getAggregatedAvailability,
  createHospital,
  deleteHospital,
} from '../controllers/hospitalController';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getHospitals));
router.get('/aggregator/availability', asyncHandler(getAggregatedAvailability));
router.get('/:id', asyncHandler(getHospitalById));
router.put('/:id', authenticate, authorize('admin', 'hospital_staff'), asyncHandler(updateHospital));

// Admin routes
router.post('/', authenticate, authorize('admin'), asyncHandler(createHospital));
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(deleteHospital));

export default router;
