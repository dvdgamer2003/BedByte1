import { Router } from 'express';
import { updateBedStatus, getBedsByHospital, createBed } from '../controllers/bedController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/hospital/:hospitalId', getBedsByHospital);
router.post('/', authenticate, authorize('admin', 'hospital_staff'), createBed);
router.put('/:id', authenticate, authorize('admin', 'hospital_staff'), updateBedStatus);

export default router;
