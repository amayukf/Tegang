import User from '../models/User.js';
import ProviderProfile from '../models/ProviderProfile.js';
import Job from '../models/Job.js';

export const getPublicStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const verifiedProviders = await ProviderProfile.countDocuments({ verificationStatus: 'verified' });
    const completedJobs = await Job.countDocuments({ status: 'completed' });
    
    // Average response time simulation (could be calculated in reality)
    const avgResponseTime = '<15 min';
    
    // Average rating simulation
    const avgRatingAgg = await ProviderProfile.aggregate([
      { $match: { verificationStatus: 'verified' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const avgRating = avgRatingAgg[0]?.avgRating ? avgRatingAgg[0].avgRating.toFixed(1) : '4.8';

    // Provider count by category
    const categoryCounts = await ProviderProfile.aggregate([
      { $match: { verificationStatus: 'verified' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const categoriesMap = {};
    categoryCounts.forEach(c => {
      const catName = c._id ? (c._id.charAt(0).toUpperCase() + c._id.slice(1)) : 'general';
      categoriesMap[catName.toLowerCase()] = c.count;
    });

    res.json({
      customers: totalCustomers,
      providers: verifiedProviders,
      jobs: completedJobs,
      response_time: avgResponseTime,
      rating: avgRating,
      categories: categoriesMap
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};
