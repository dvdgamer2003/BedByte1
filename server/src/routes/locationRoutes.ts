import { Router } from 'express';
import {
  getNearbyHospitals,
  getNearbyMedicalStores,
  getMedicalStoreById,
  createMedicalStore,
  updateMedicalStore,
  deleteMedicalStore,
} from '../controllers/locationController';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Public routes
router.get('/hospitals/nearby', asyncHandler(getNearbyHospitals));
router.get('/medicals/nearby', asyncHandler(getNearbyMedicalStores));
router.get('/medicals/:id', asyncHandler(getMedicalStoreById));

// Admin routes
router.post('/medicals', authenticate, authorize('admin'), asyncHandler(createMedicalStore));
router.put('/medicals/:id', authenticate, authorize('admin', 'hospital_staff'), asyncHandler(updateMedicalStore));
router.delete('/medicals/:id', authenticate, authorize('admin'), asyncHandler(deleteMedicalStore));

export default router;
