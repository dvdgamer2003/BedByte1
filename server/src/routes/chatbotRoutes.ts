import { Router } from 'express';
import {
  sendMessage,
  getChatHistory,
  getUserSessions,
  getChatsForReview,
  reviewPrescription,
  closeSession,
} from '../controllers/chatbotController';
import { generatePrescriptionPDF } from '../controllers/prescriptionPdfController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Patient routes
router.post('/message', sendMessage);
router.get('/history/:sessionId', getChatHistory);
router.get('/sessions', getUserSessions);
router.post('/session/:sessionId/close', closeSession);
router.get('/prescription/:sessionId/pdf', generatePrescriptionPDF);

// Doctor/Admin routes
router.get('/review', authorize('admin', 'hospital_staff'), getChatsForReview);
router.post(
  '/review/:sessionId',
  authorize('admin', 'hospital_staff'),
  reviewPrescription
);

export default router;
