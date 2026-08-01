import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import ProviderProfile from './models/ProviderProfile.js';
import Job from './models/Job.js';
import Review from './models/Review.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await ProviderProfile.deleteMany({});
    await Job.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    const passwordHash = await bcrypt.hash('password123', 10);

    // ===== Customers =====
    const customers = await User.insertMany([
      { name: 'Sara Mulugeta', phone: '0911234567', passwordHash, role: 'customer' },
      { name: 'Kebede Alemu', phone: '0922345678', passwordHash, role: 'customer' },
      { name: 'Hana Tesfaye', phone: '0933456789', passwordHash, role: 'customer' },
      { name: 'Dawit Bekele', phone: '0944567890', passwordHash, role: 'customer' },
      { name: 'Meron Tadesse', phone: '0955678901', passwordHash, role: 'customer' },
    ]);
    console.log('Created 5 customers');

    // ===== Providers =====
    const providerUsers = await User.insertMany([
      { name: 'Abebe Girma', phone: '0912111111', passwordHash, role: 'provider' },
      { name: 'Tigist Bekele', phone: '0912222222', passwordHash, role: 'provider' },
      { name: 'Dawit Tadesse', phone: '0912333333', passwordHash, role: 'provider' },
      { name: 'Samuel Tesfaye', phone: '0912444444', passwordHash, role: 'provider' },
      { name: 'Hiwot Mengistu', phone: '0912555555', passwordHash, role: 'provider' },
      { name: 'Yohannes Haile', phone: '0912666666', passwordHash, role: 'provider' },
      { name: 'Lidya Assefa', phone: '0912777777', passwordHash, role: 'provider' },
      { name: 'Biruk Solomon', phone: '0912888888', passwordHash, role: 'provider' },
      { name: 'Fasika Wondimu', phone: '0912999999', passwordHash, role: 'provider' },
      { name: 'Rahel Gebremedhin', phone: '0913111111', passwordHash, role: 'provider' },
    ]);

    const providerProfiles = await ProviderProfile.insertMany([
      { userId: providerUsers[0]._id, category: 'plumbing',     location: 'Bole',          bio: 'Licensed master plumber with 9 years across Addis Ababa. Pipe installation, leak repair, water heater servicing. Background-checked and fully insured.', priceRangeMin: 350,  priceRangeMax: 800,  availabilityStatus: 'available_now', rating: 4.9, ratingCount: 134 },
      { userId: providerUsers[1]._id, category: 'cleaning',     location: 'Sarbet',         bio: 'Professional cleaning specialist. Deep cleaning, move-out cleaning, and commercial spaces. Eco-friendly products.', priceRangeMin: 200,  priceRangeMax: 450,  availabilityStatus: 'available_now', rating: 4.8, ratingCount: 217 },
      { userId: providerUsers[2]._id, category: 'electrical',   location: 'Kazanchis',      bio: 'Certified electrician with expertise in wiring, panel upgrades, and safety inspections. 7 years serving Addis Ababa.', priceRangeMin: 500,  priceRangeMax: 1200, availabilityStatus: 'scheduled',     rating: 4.7, ratingCount: 89 },
      { userId: providerUsers[3]._id, category: 'construction', location: 'CMC',           bio: 'General contractor specializing in residential builds, renovations, and finishing. Quality work guaranteed.', priceRangeMin: 800,  priceRangeMax: 2000, availabilityStatus: 'available_now', rating: 4.9, ratingCount: 43 },
      { userId: providerUsers[4]._id, category: 'plumbing',     location: 'Piassa',        bio: 'Residential plumber handling pipe repair, leak detection, and water heater installation. Quick and reliable.', priceRangeMin: 280,  priceRangeMax: 650,  availabilityStatus: 'available_now', rating: 4.5, ratingCount: 28 },
      { userId: providerUsers[5]._id, category: 'painting',     location: 'Bole',          bio: 'Professional painter with 6 years. Interior and exterior painting, textures, and waterproofing.', priceRangeMin: 300,  priceRangeMax: 700,  availabilityStatus: 'available_now', rating: 4.6, ratingCount: 56 },
      { userId: providerUsers[6]._id, category: 'cleaning',     location: 'Mekanissa',     bio: 'Detail-oriented cleaning professional. Homes, offices, and post-construction cleanup.', priceRangeMin: 150,  priceRangeMax: 400,  availabilityStatus: 'busy',          rating: 4.4, ratingCount: 92 },
      { userId: providerUsers[7]._id, category: 'electrical',   location: 'Meskel Flower', bio: 'Experienced electrician for installations, repairs, and generator maintenance.', priceRangeMin: 450,  priceRangeMax: 1000, availabilityStatus: 'available_now', rating: 4.8, ratingCount: 67 },
      { userId: providerUsers[8]._id, category: 'construction', location: 'Lebu',          bio: 'Building contractor for foundations, tiling, roofing, and renovation work across the city.', priceRangeMin: 1000, priceRangeMax: 3000, availabilityStatus: 'scheduled',     rating: 4.3, ratingCount: 31 },
      { userId: providerUsers[9]._id, category: 'painting',     location: 'Gerji',         bio: 'Interior decorator and painter. Modern finishes, wallpaper, and artistic designs.', priceRangeMin: 400,  priceRangeMax: 900,  availabilityStatus: 'available_now', rating: 4.7, ratingCount: 45 },
    ]);
    console.log('Created 10 providers with profiles');

    // ===== Jobs =====
    const jobs = await Job.insertMany([
      { customerId: customers[0]._id, providerId: providerUsers[0]._id, category: 'plumbing', description: 'Leaking pipe under kitchen sink', location: 'Bole', urgency: 'now', budgetMin: 300, budgetMax: 600, status: 'completed', agreedPrice: 450 },
      { customerId: customers[1]._id, providerId: providerUsers[2]._id, category: 'electrical', description: 'Install 4 ceiling light fixtures', location: 'Sarbet', urgency: 'scheduled', budgetMin: 800, budgetMax: 1500, status: 'accepted', agreedPrice: 1000 },
      { customerId: customers[2]._id, providerId: providerUsers[5]._id, category: 'painting', description: 'Paint full 3-bedroom apartment', location: 'Kazanchis', urgency: 'scheduled', budgetMin: 2000, budgetMax: 4500, status: 'in_progress', agreedPrice: 3200 },
      { customerId: customers[3]._id, providerId: providerUsers[1]._id, category: 'cleaning', description: 'Deep clean 2-bedroom apartment after renovation', location: 'CMC', urgency: 'now', budgetMin: 500, budgetMax: 1000, status: 'completed', agreedPrice: 700 },
      { customerId: customers[4]._id, category: 'plumbing', description: 'Fix water heater — not heating properly', location: 'Piassa', urgency: 'now', budgetMin: 400, budgetMax: 800, status: 'pending' },
      { customerId: customers[0]._id, category: 'construction', description: 'Build a small garden wall, 4m long', location: 'Bole', urgency: 'scheduled', budgetMin: 3000, budgetMax: 6000, status: 'pending' },
      { customerId: customers[1]._id, providerId: providerUsers[0]._id, category: 'plumbing', description: 'Replace bathroom faucet and pipes', location: 'Kazanchis', urgency: 'now', budgetMin: 200, budgetMax: 500, status: 'quoted', agreedPrice: 350 },
      { customerId: customers[2]._id, providerId: providerUsers[3]._id, category: 'construction', description: 'Tile 20sqm living room floor', location: 'Sarbet', urgency: 'scheduled', budgetMin: 4000, budgetMax: 8000, status: 'completed', agreedPrice: 5500 },
    ]);
    console.log('Created 8 jobs');

    // ===== Reviews =====
    await Review.insertMany([
      { jobId: jobs[0]._id, customerId: customers[0]._id, providerId: providerUsers[0]._id, rating: 5, comment: 'Abebe was fantastic! Fixed the leak in under an hour. Very professional and clean work. Highly recommended!' },
      { jobId: jobs[3]._id, customerId: customers[3]._id, providerId: providerUsers[1]._id, rating: 5, comment: 'Tigist and her team did an amazing job. The apartment looks brand new after the deep clean. Will definitely call again.' },
      { jobId: jobs[7]._id, customerId: customers[2]._id, providerId: providerUsers[3]._id, rating: 4, comment: 'Samuel did great tiling work. Took a bit longer than expected but the quality is excellent. Fair price too.' },
    ]);
    console.log('Created 5 reviews');

    console.log('\n✅ Seed complete! You can now log in with:');
    console.log('   Customer: phone 0911234567, password: password123');
    console.log('   Provider: phone 0912111111, password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
