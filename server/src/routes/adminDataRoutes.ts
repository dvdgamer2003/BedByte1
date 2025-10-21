import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllPatients,
  getAllDoctors,
  getAllHospitals,
  createPatient,
  updatePatient,
  deletePatient,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  createHospital,
  updateHospital,
  deleteHospital,
  getAdminStats,
} from '../controllers/adminDataController';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Get all data
router.get('/users', getAllUsers);
router.get('/patients', getAllPatients);
router.get('/doctors', getAllDoctors);
router.get('/hospitals', getAllHospitals);
router.get('/stats', getAdminStats);

// Create operations
router.post('/users', createUser);
router.post('/patients', createPatient);
router.post('/doctors', createDoctor);
router.post('/hospitals', createHospital);

// Update operations
router.put('/users/:id', updateUser);
router.put('/patients/:id', updatePatient);
router.put('/doctors/:id', updateDoctor);
router.put('/hospitals/:id', updateHospital);

// Delete operations
router.delete('/users/:id', deleteUser);
router.delete('/patients/:id', deletePatient);
router.delete('/doctors/:id', deleteDoctor);
router.delete('/hospitals/:id', deleteHospital);

export default router;
