import express from 'express';
import { createJob, getMyJobs, getIncomingJobs, getJobById, quoteJob, acceptJob, updateJobStatus } from '../controllers/job.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, restrictTo('customer'), createJob);
router.get('/mine', protect, restrictTo('customer'), getMyJobs);
router.get('/incoming', protect, restrictTo('provider'), getIncomingJobs);
router.get('/:id', protect, getJobById);
router.patch('/:id/quote', protect, restrictTo('provider'), quoteJob);
router.patch('/:id/accept', protect, restrictTo('customer'), acceptJob);
router.patch('/:id/status', protect, updateJobStatus);

export default router;
