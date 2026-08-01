import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getAdminStats,
  getAdminProviders,
  updateProviderStatus,
  getAdminJobs,
  updateJobStatus,
  getAdminCustomers,
  getSecurityLogs
} from '../controllers/admin.controller.js';

const router = express.Router();

// Protected Admin Routes
router.get('/stats', protect, getAdminStats);
router.get('/providers', protect, getAdminProviders);
router.patch('/providers/:id/status', protect, updateProviderStatus);
router.get('/jobs', protect, getAdminJobs);
router.patch('/jobs/:id/status', protect, updateJobStatus);
router.get('/customers', protect, getAdminCustomers);
router.get('/security-logs', protect, getSecurityLogs);

export default router;
