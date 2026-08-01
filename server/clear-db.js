import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import ProviderProfile from './models/ProviderProfile.js';
import Job from './models/Job.js';
import Review from './models/Review.js';

dotenv.config();

const clearDb = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected! Purging all data for production launch...');

    const uDeleted = await User.deleteMany({});
    const pDeleted = await ProviderProfile.deleteMany({});
    const jDeleted = await Job.deleteMany({});
    const rDeleted = await Review.deleteMany({});

    console.log(`CLEARED: ${uDeleted.deletedCount} Users, ${pDeleted.deletedCount} Profiles, ${jDeleted.deletedCount} Jobs, ${rDeleted.deletedCount} Reviews`);
    console.log('✅ Database is completely clean and ready for real users.');
    
    process.exit(0);
  } catch (err) {
    console.error('Error clearing database:', err);
    process.exit(1);
  }
};

clearDb();
