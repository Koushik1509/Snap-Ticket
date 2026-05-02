const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@movie.com' });
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@movie.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Admin account seeded successfully!');
    } else {
      console.log('Admin already exists.');
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: 'user@movie.com' });
    if (!userExists) {
      await User.create({
        name: 'Regular User',
        email: 'user@movie.com',
        password: await bcrypt.hash('user123', salt),
        role: 'user',
      });
      console.log('✅ Regular User account seeded successfully!');
    } else {
      console.log('User already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
