import Job from '../models/Job.js';
import ProviderProfile from '../models/ProviderProfile.js';

const VALID_TRANSITIONS = {
  pending: ['quoted', 'cancelled'],
  quoted: ['accepted', 'cancelled'],
  accepted: ['in_progress', 'cancelled'],
  in_progress: ['completed'],
  completed: [],
  cancelled: []
};

const isValidTransition = (from, to) => VALID_TRANSITIONS[from]?.includes(to);

const isParticipant = (job, user) => {
  return job.customerId.equals(user._id) ||
    (job.providerId && job.providerId.equals(user._id));
};

export const createJob = async (req, res) => {
  try {
    const { providerId, category, description, photoUrls, location, urgency, scheduledDate, budgetMin, budgetMax } = req.body;

    if (!category || !description || !location || !urgency || budgetMin == null || budgetMax == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (Number(budgetMin) < 0 || Number(budgetMax) < Number(budgetMin)) {
      return res.status(400).json({ message: 'Invalid budget range' });
    }

    const job = await Job.create({
      customerId: req.user._id,
      providerId: providerId || undefined,
      category,
      description,
      photoUrls: photoUrls || [],
      location,
      urgency,
      scheduledDate: urgency === 'scheduled' ? scheduledDate : undefined,
      budgetMin: Number(budgetMin),
      budgetMax: Number(budgetMax),
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ customerId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('providerId', 'name phone');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getIncomingJobs = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Provider profile not found' });

    const jobs = await Job.find({
      $or: [
        { providerId: req.user._id },
        { providerId: null, category: profile.category }
      ],
      status: { $in: ['pending', 'quoted'] }
    })
      .sort({ createdAt: -1 })
      .populate('customerId', 'name phone');

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('customerId', 'name phone')
      .populate('providerId', 'name phone');

    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!isParticipant(job, req.user)) {
      return res.status(403).json({ message: 'Not authorized to view this job' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const quoteJob = async (req, res) => {
  try {
    const { agreedPrice } = req.body;
    const price = Number(agreedPrice);
    if (!price || price <= 0) {
      return res.status(400).json({ message: 'Valid quote price is required' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.status !== 'pending') {
      return res.status(400).json({ message: `Cannot quote a job in ${job.status} state` });
    }

    job.agreedPrice = price;
    job.providerId = req.user._id;
    job.status = 'quoted';
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!job.customerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the customer can accept this quote' });
    }
    if (job.status !== 'quoted') {
      return res.status(400).json({ message: `Cannot accept a job in ${job.status} state` });
    }

    job.status = 'accepted';
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!isParticipant(job, req.user)) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    if (!isValidTransition(job.status, status)) {
      return res.status(400).json({
        message: `Invalid transition from ${job.status} to ${status}`
      });
    }

    // Provider may only advance accepted -> in_progress -> completed
    // Customer may only cancel
    if (req.user.role === 'provider') {
      if (!['in_progress', 'completed'].includes(status)) {
        return res.status(403).json({ message: 'Provider cannot set this status' });
      }
      if (job.providerId && !job.providerId.equals(req.user._id)) {
        return res.status(403).json({ message: 'Not assigned to this job' });
      }
    }
    if (req.user.role === 'customer' && status !== 'cancelled') {
      return res.status(403).json({ message: 'Customer may only cancel a job' });
    }

    job.status = status;
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
