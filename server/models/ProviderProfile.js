import mongoose from 'mongoose';

const providerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['plumbing', 'electrical', 'construction', 'painting', 'cleaning', 'other'],
    required: true,
    index: true
  },
  location: {
    type: String,
    trim: true,
    index: true
  },
  bio: {
    type: String,
    trim: true
  },
  priceRangeMin: {
    type: Number,
    required: true,
    min: 0
  },
  priceRangeMax: {
    type: Number,
    required: true,
    min: 0
  },
  availabilityStatus: {
    type: String,
    enum: ['available_now', 'busy', 'scheduled'],
    default: 'busy',
    index: true
  },
  availableDate: {
    type: Date
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0,
    min: 0
  },
  profilePhotoUrl: {
    type: String
  },
  workPhotos: [{
    type: String
  }],
  verificationStatus: {
    type: String,
    enum: ['verified', 'pending', 'suspended'],
    default: 'pending',
    index: true
  }
}, { timestamps: true });

export default mongoose.model('ProviderProfile', providerProfileSchema);
