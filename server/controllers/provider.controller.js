import ProviderProfile from '../models/ProviderProfile.js';
import User from '../models/User.js';

// GET /api/providers — list providers with filters
export const getProviders = async (req, res) => {
  try {
    const { category, availabilityStatus, sort } = req.query;
    const filter = {};

    if (category && category !== 'all') filter.category = category;
    if (availabilityStatus && availabilityStatus !== 'all') filter.availabilityStatus = availabilityStatus;

    let sortObj = {};
    if (sort === 'rating') sortObj = { rating: -1 };
    else if (sort === 'price') sortObj = { priceRangeMin: 1 };
    else sortObj = { availabilityStatus: 1 }; // available_now first

    const providers = await ProviderProfile.find(filter)
      .sort(sortObj)
      .populate('userId', 'name phone profileImage');

    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/providers/:id — single provider detail
export const getProviderById = async (req, res) => {
  try {
    const provider = await ProviderProfile.findById(req.params.id)
      .populate('userId', 'name phone profileImage');

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/providers/me — current provider profile & live metrics
export const getMyProfile = async (req, res) => {
  try {
    let profile = await ProviderProfile.findOne({ userId: req.user._id }).populate('userId', 'name phone profileImage');
    if (!profile) {
      profile = await ProviderProfile.create({
        userId: req.user._id,
        category: 'other',
        availabilityStatus: 'available_now',
        priceRangeMin: 0,
        priceRangeMax: 5000,
      });
      profile = await profile.populate('userId', 'name phone profileImage');
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/providers/me/availability — toggle availability
export const updateAvailability = async (req, res) => {
  try {
    const { availabilityStatus, availableDate } = req.body;

    const profile = await ProviderProfile.findOneAndUpdate(
      { userId: req.user._id },
      { availabilityStatus, availableDate },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/providers/me/profile — update provider profile
export const updateProfile = async (req, res) => {
  try {
    const { bio, priceRangeMin, priceRangeMax, category, profilePhotoUrl, workPhotos } = req.body;
    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (priceRangeMin !== undefined) updateData.priceRangeMin = priceRangeMin;
    if (priceRangeMax !== undefined) updateData.priceRangeMax = priceRangeMax;
    if (category !== undefined) updateData.category = category;
    if (profilePhotoUrl !== undefined) updateData.profilePhotoUrl = profilePhotoUrl;
    if (workPhotos !== undefined) updateData.workPhotos = workPhotos;

    const profile = await ProviderProfile.findOneAndUpdate(
      { userId: req.user._id },
      updateData,
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
