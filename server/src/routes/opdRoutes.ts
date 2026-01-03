import { Router } from 'express';
import {
  joinQueue,
  getQueueStatus,
  advanceQueue,
  getMyQueueStatus,
} from '../controllers/opdController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/join', authenticate, joinQueue);
router.get('/status/:hospitalId', getQueueStatus);
router.get('/my-status', authenticate, getMyQueueStatus);
router.post('/advance/:hospitalId', authenticate, authorize('admin', 'hospital_staff'), advanceQueue);

export default router;
