import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const seedAdmin = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      console.error('❌ MONGO_URI not found in environment variables');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Username: ${existingAdmin.username}`);
      console.log(`🔑 Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@getbeds.com',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      phone: '+911234567890',
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('\n📊 Admin User Details:');
    console.log('═══════════════════════════════════════');
    console.log(`👤 Name: ${admin.name}`);
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Username: ${admin.username}`);
    console.log(`🔒 Password: admin123`);
    console.log(`🎭 Role: ${admin.role}`);
    console.log('═══════════════════════════════════════');
    console.log('\n🎉 You can now login with:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n   OR');
    console.log('   Email: admin@getbeds.com');
    console.log('   Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
