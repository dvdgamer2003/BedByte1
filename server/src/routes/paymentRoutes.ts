import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  getMyPayments,
  getPaymentById,
  requestRefund,
  getAllPayments,
  getPaymentStats,
} from '../controllers/paymentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Patient routes
router.post('/order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/my', getMyPayments);
router.get('/:id', getPaymentById);
router.post('/:id/refund', requestRefund);

// Admin routes
router.get('/all/list', authorize('admin'), getAllPayments);
router.get('/stats/all', authorize('admin'), getPaymentStats);

export default router;
