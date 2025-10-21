import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hospital from './models/Hospital';

dotenv.config();

const updateHospitalLocations = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      console.error('❌ MONGO_URI not found in environment variables');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('📦 Updating hospital locations...');

    // Get all hospitals
    const hospitals = await Hospital.find();
    console.log(`Found ${hospitals.length} hospitals`);

    let updated = 0;

    for (const hospital of hospitals) {
      // If hospital has coordinates but no location field, create it
      if (hospital.coordinates && hospital.coordinates.lat && hospital.coordinates.lng) {
        if (!hospital.location || !hospital.location.coordinates) {
          hospital.location = {
            type: 'Point',
            coordinates: [hospital.coordinates.lng, hospital.coordinates.lat],
          };
          await hospital.save();
          updated++;
          console.log(`✅ Updated: ${hospital.name}`);
        }
      } else {
        // Add default Mumbai coordinates if missing
        const defaultCoords = {
          lat: 19.0760 + (Math.random() * 0.1 - 0.05), // Random near Mumbai
          lng: 72.8777 + (Math.random() * 0.1 - 0.05),
        };
        hospital.coordinates = defaultCoords;
        hospital.location = {
          type: 'Point',
          coordinates: [defaultCoords.lng, defaultCoords.lat],
        };
        await hospital.save();
        updated++;
        console.log(`✅ Added location to: ${hospital.name}`);
      }
    }

    console.log(`\n✨ Updated ${updated} hospitals with location data`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating hospitals:', error);
    process.exit(1);
  }
};

updateHospitalLocations();
