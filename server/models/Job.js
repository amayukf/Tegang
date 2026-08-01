import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  photoUrls: [{
    type: String
  }],
  location: {
    type: String,
    required: true,
    index: true
  },
  urgency: {
    type: String,
    enum: ['now', 'scheduled'],
    required: true
  },
  scheduledDate: {
    type: Date
  },
  budgetMin: {
    type: Number,
    required: true
  },
  budgetMax: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },
  agreedPrice: {
    type: Number
  }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
