import Review from '../models/Review.js';
import ProviderProfile from '../models/ProviderProfile.js';
import Job from '../models/Job.js';
import mongoose from 'mongoose';

// POST /api/reviews — customer submits review for completed job
export const createReview = async (req, res) => {
  try {
    const { jobId, providerId, rating, comment } = req.body;

    if (!jobId || !providerId) {
      return res.status(400).json({ message: 'jobId and providerId are required' });
    }
    const ratingNum = Number(rating);
    if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    if (!comment || typeof comment !== 'string' || comment.trim().length < 2) {
      return res.status(400).json({ message: 'Please add a short comment' });
    }
    if (!mongoose.isValidObjectId(jobId) || !mongoose.isValidObjectId(providerId)) {
      return res.status(400).json({ message: 'Invalid job or provider id' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.customerId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only review your own jobs' });
    }
    if (job.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed jobs' });
    }
    if (String(job.providerId) !== String(providerId)) {
      return res.status(400).json({ message: 'Provider does not match this job' });
    }

    const existing = await Review.findOne({ jobId });
    if (existing) return res.status(409).json({ message: 'You already reviewed this job' });

    const review = await Review.create({
      jobId,
      customerId: req.user._id,
      providerId,
      rating: ratingNum,
      comment: comment.trim(),
    });

    // Update provider's running average rating (providerId here is the user._id)
    const profile = await ProviderProfile.findOne({ userId: providerId });
    if (profile) {
      const count = (profile.ratingCount || 0) + 1;
      const current = profile.rating || 0;
      profile.rating = Math.round(((current * (count - 1)) + ratingNum) / count * 10) / 10;
      profile.ratingCount = count;
      await profile.save();
    }

    await review.populate('customerId', 'name');
    return res.status(201).json(review);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors).map(e => e.message).join(', ');
      return res.status(400).json({ message: msg });
    }
    return res.status(500).json({ message: 'Error creating review' });
  }
};

// GET /api/providers/:id/reviews — list reviews for a provider
// (:id here is the ProviderProfile document id)
export const getProviderReviews = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid provider id' });
    }
    // providerId on Review model references User, so we need profile.userId
    const profile = await ProviderProfile.findById(id);
    if (!profile) return res.json([]);

    const reviews = await Review.find({ providerId: profile.userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('customerId', 'name');
    return res.json(reviews || []);
  } catch (error) {
    return res.status(500).json({ message: 'Error loading reviews' });
  }
};
