import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const approveAdminAccounts = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/getbeds';
    
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Update all admin accounts to be approved
    const result = await User.updateMany(
      { role: 'admin' },
      { 
        $set: { 
          isApproved: true, 
          approvalStatus: 'approved',
          approvedAt: new Date()
        } 
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} admin account(s)`);
    
    // Also update all patient accounts to be approved (in case they were created before)
    const patientResult = await User.updateMany(
      { role: 'patient' },
      { 
        $set: { 
          isApproved: true, 
          approvalStatus: 'approved',
          approvedAt: new Date()
        } 
      }
    );
    
    console.log(`✅ Updated ${patientResult.modifiedCount} patient account(s)`);

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

approveAdminAccounts();
