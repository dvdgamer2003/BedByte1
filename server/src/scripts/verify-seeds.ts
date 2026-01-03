import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Doctor from '../models/Doctor';
import MedicalStore from '../models/MedicalStore';
import Hospital from '../models/Hospital';

dotenv.config();

const verify = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('✅ MongoDB Connected');

    const users = await User.countDocuments();
    const doctors = await Doctor.countDocuments();
    const medicals = await MedicalStore.countDocuments();
    const hospitals = await Hospital.countDocuments();

    console.log('--- Database Counts ---');
    console.log(`Users (Admin/etc): ${users}`);
    console.log(`Doctors: ${doctors}`);
    console.log(`Medical Stores: ${medicals}`);
    console.log(`Hospitals: ${hospitals}`);
    console.log('-----------------------');

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

verify();
