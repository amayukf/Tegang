import express from 'express';
import { createReview, getProviderReviews } from '../controllers/review.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, restrictTo('customer'), createReview);

// This is also accessed via /api/providers/:id/reviews - mounted in provider routes
export { getProviderReviews };

export default router;
