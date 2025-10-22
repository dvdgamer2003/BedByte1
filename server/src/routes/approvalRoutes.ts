import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import {
  getPendingUserRequests,
  getPendingDoctorRequests,
  approveUserAccount,
  rejectUserAccount,
  approveDoctor,
  rejectDoctor,
  getApprovalStats,
} from '../controllers/approvalController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Admin routes - manage user account requests
router.get('/users/pending', requireAdmin, getPendingUserRequests);
router.put('/users/:userId/approve', requireAdmin, approveUserAccount);
router.put('/users/:userId/reject', requireAdmin, rejectUserAccount);
router.get('/stats', requireAdmin, getApprovalStats);

// Hospital manager routes - manage doctor requests (requires hospital_staff role)
router.get('/doctors/pending', getPendingDoctorRequests);
router.put('/doctors/:doctorId/approve', approveDoctor);
router.put('/doctors/:doctorId/reject', rejectDoctor);

export default router;
