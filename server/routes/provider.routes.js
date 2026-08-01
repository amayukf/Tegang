import express from 'express';
import { getProviders, getProviderById, getMyProfile, updateAvailability, updateProfile } from '../controllers/provider.controller.js';
import { getProviderReviews } from '../controllers/review.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/me', protect, restrictTo('provider'), getMyProfile);
router.get('/', getProviders);
router.get('/:id', getProviderById);
router.get('/:id/reviews', getProviderReviews);
router.patch('/me/availability', protect, restrictTo('provider'), updateAvailability);
router.patch('/me/profile', protect, restrictTo('provider'), updateProfile);

export default router;
