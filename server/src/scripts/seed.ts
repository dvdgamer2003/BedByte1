import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Hospital from '../models/Hospital';
import Bed from '../models/Bed';
import User from '../models/User';
import { connectDB } from '../config/db';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Hospital.deleteMany({});
    await Bed.deleteMany({});
    await User.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@getbeds.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
    });

    console.log('Created admin user');

    // Sample hospitals
    const hospitals = [
      {
        name: 'City General Hospital',
        city: 'Mumbai',
        address: '123 MG Road, Mumbai, Maharashtra 400001',
        phone: '022-12345678',
        email: 'info@citygeneralhospital.com',
        description: 'Multi-specialty hospital with 24/7 emergency services',
        facilities: ['Emergency', 'ICU', 'OPD', 'Laboratory', 'Pharmacy'],
        coordinates: { lat: 19.0760, lng: 72.8777 },
        location: {
          type: 'Point',
          coordinates: [72.8777, 19.0760], // [longitude, latitude]
        },
        opdAvailable: true,
        emergencyAvailable: true,
      },
      {
        name: 'Apollo Medical Center',
        city: 'Mumbai',
        address: '456 Andheri West, Mumbai, Maharashtra 400053',
        phone: '022-87654321',
        email: 'contact@apollomedical.com',
        description: 'Premium healthcare facility with advanced medical technology',
        facilities: ['ICU', 'Operation Theater', 'Radiology', 'Cardiology'],
        coordinates: { lat: 19.1136, lng: 72.8697 },
        location: {
          type: 'Point',
          coordinates: [72.8697, 19.1136],
        },
        opdAvailable: true,
        emergencyAvailable: true,
      },
      {
        name: 'Fortis Healthcare',
        city: 'Delhi',
        address: '789 Nehru Place, Delhi 110019',
        phone: '011-23456789',
        email: 'info@fortis.in',
        description: 'Leading chain hospital with specialized departments',
        facilities: ['Emergency', 'ICU', 'Maternity', 'Pediatrics'],
        coordinates: { lat: 28.5494, lng: 77.2500 },
        location: {
          type: 'Point',
          coordinates: [77.2500, 28.5494],
        },
        opdAvailable: true,
        emergencyAvailable: true,
      },
      {
        name: 'Max Super Specialty',
        city: 'Delhi',
        address: '321 Saket, Delhi 110017',
        phone: '011-98765432',
        email: 'contact@maxhospital.com',
        description: 'Super-specialty hospital with world-class infrastructure',
        facilities: ['Oncology', 'Neurology', 'Cardiology', 'Orthopedics'],
        coordinates: { lat: 28.5245, lng: 77.2066 },
        location: {
          type: 'Point',
          coordinates: [77.2066, 28.5245],
        },
        opdAvailable: true,
        emergencyAvailable: true,
      },
      {
        name: 'Manipal Hospital',
        city: 'Bangalore',
        address: '555 HAL Airport Road, Bangalore 560017',
        phone: '080-12345678',
        email: 'info@manipalhospital.com',
        description: 'Comprehensive healthcare with advanced treatment options',
        facilities: ['Emergency', 'ICU', 'Kidney Transplant', 'Liver Transplant'],
        coordinates: { lat: 12.9716, lng: 77.5946 },
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
        },
        opdAvailable: true,
        emergencyAvailable: true,
      },
      {
        name: 'Ruby Hall Clinic',
        city: 'Pune',
        address: '40 Sassoon Road, Pune, Maharashtra 411001',
        phone: '020-66455000',
        email: 'info@rubyhall.com',
        description: 'Premier multi-specialty hospital with state-of-the-art facilities',
        facilities: ['Emergency', 'ICU', 'Cardiology', 'Neurology', 'Orthopedics'],
        coordinates: { lat: 18.5204, lng: 73.8567 },
        location: {
          type: 'Point',
          coordinates: [73.8567, 18.5204],
        },
        opdAvailable: true,
        emergencyAvailable: true,
      },
      {
        name: 'Sahyadri Hospital',
        city: 'Pune',
        address: 'Plot 30-C, Erandwane, Pune, Maharashtra 411004',
        phone: '020-67206720',
        email: 'contact@sahyadrihospitals.com',
        description: 'Advanced tertiary care multi-specialty hospital',
        facilities: ['Emergency', 'ICU', 'Trauma Center', 'Cancer Care', 'Maternity'],
        coordinates: { lat: 18.5089, lng: 73.8350 },
        location: {
          type: 'Point',
          coordinates: [73.8350, 18.5089],
        },
        opdAvailable: true,
        emergencyAvailable: true,
      },
      {
        name: 'Deenanath Mangeshkar Hospital',
        city: 'Pune',
        address: 'Erandwane, Pune, Maharashtra 411004',
        phone: '020-66455000',
        email: 'info@dmhospital.org',
        description: 'Comprehensive healthcare with advanced medical technology',
        facilities: ['Emergency', 'ICU', 'OPD', 'Surgery', 'Radiology', 'Pharmacy'],
        coordinates: { lat: 18.5018, lng: 73.8345 },
        location: {
          type: 'Point',
          coordinates: [73.8345, 18.5018],
        },
        opdAvailable: true,
        emergencyAvailable: true,
      },
    ];

    const createdHospitals = await Hospital.insertMany(hospitals);
    console.log(`Created ${createdHospitals.length} hospitals`);

    // Create beds for each hospital
    const roomTypes = ['General', 'ICU', 'Private'];
    const bedsPerType = { General: 30, ICU: 10, Private: 15 };
    const pricePerType = { General: 2000, ICU: 5000, Private: 3500 };

    for (const hospital of createdHospitals) {
      const beds = [];

      for (const roomType of roomTypes) {
        const count = bedsPerType[roomType as keyof typeof bedsPerType];
        const price = pricePerType[roomType as keyof typeof pricePerType];

        for (let i = 1; i <= count; i++) {
          beds.push({
            hospitalId: hospital._id,
            roomType,
            bedNumber: `${roomType.substring(0, 1)}${i.toString().padStart(3, '0')}`,
            floor: Math.floor(i / 10) + 1,
            price,
            isOccupied: Math.random() > 0.7, // 30% occupied
          });
        }
      }

      await Bed.insertMany(beds);
      console.log(`Created ${beds.length} beds for ${hospital.name}`);
    }

    console.log('✅ Database seeded successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@getbeds.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
