import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from '../models/Doctor';
import Hospital from '../models/Hospital';

dotenv.config();

const doctorsData = [
  {
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@hospital.com',
    phone: '9876543210',
    specialization: 'Cardiology',
    qualification: 'MBBS, MD (Cardiology), DM',
    experience: 15,
    consultationFee: 1000,
    availability: [
      { day: 'Monday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Tuesday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
      { day: 'Wednesday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Thursday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
      { day: 'Friday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'] },
    ],
    rating: 4.8,
    totalReviews: 152,
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@hospital.com',
    phone: '9876543211',
    specialization: 'Pediatrics',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: 10,
    consultationFee: 800,
    availability: [
      { day: 'Monday', slots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Tuesday', slots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Wednesday', slots: ['10:00 AM', '11:00 AM', '12:00 PM'] },
      { day: 'Thursday', slots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Friday', slots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Saturday', slots: ['10:00 AM', '11:00 AM', '12:00 PM'] },
    ],
    rating: 4.9,
    totalReviews: 203,
  },
  {
    name: 'Dr. Amit Patel',
    email: 'amit.patel@hospital.com',
    phone: '9876543212',
    specialization: 'Orthopedics',
    qualification: 'MBBS, MS (Orthopedics)',
    experience: 12,
    consultationFee: 900,
    availability: [
      { day: 'Monday', slots: ['09:30 AM', '10:30 AM', '11:30 AM', '02:30 PM', '03:30 PM'] },
      { day: 'Tuesday', slots: ['09:30 AM', '10:30 AM', '11:30 AM', '02:30 PM', '03:30 PM'] },
      { day: 'Wednesday', slots: ['09:30 AM', '10:30 AM', '11:30 AM'] },
      { day: 'Thursday', slots: ['09:30 AM', '10:30 AM', '11:30 AM', '02:30 PM', '03:30 PM'] },
      { day: 'Friday', slots: ['09:30 AM', '10:30 AM', '11:30 AM', '02:30 PM', '03:30 PM'] },
    ],
    rating: 4.7,
    totalReviews: 98,
  },
  {
    name: 'Dr. Sunita Reddy',
    email: 'sunita.reddy@hospital.com',
    phone: '9876543213',
    specialization: 'Gynecology',
    qualification: 'MBBS, MS (OBG)',
    experience: 18,
    consultationFee: 1200,
    availability: [
      { day: 'Monday', slots: ['11:00 AM', '12:00 PM', '01:00 PM', '04:00 PM', '05:00 PM'] },
      { day: 'Tuesday', slots: ['11:00 AM', '12:00 PM', '01:00 PM', '04:00 PM', '05:00 PM'] },
      { day: 'Wednesday', slots: ['11:00 AM', '12:00 PM', '01:00 PM'] },
      { day: 'Thursday', slots: ['11:00 AM', '12:00 PM', '01:00 PM', '04:00 PM', '05:00 PM'] },
      { day: 'Friday', slots: ['11:00 AM', '12:00 PM', '01:00 PM', '04:00 PM', '05:00 PM'] },
      { day: 'Saturday', slots: ['11:00 AM', '12:00 PM', '01:00 PM'] },
    ],
    rating: 4.9,
    totalReviews: 175,
  },
  {
    name: 'Dr. Vikram Singh',
    email: 'vikram.singh@hospital.com',
    phone: '9876543214',
    specialization: 'Neurology',
    qualification: 'MBBS, MD, DM (Neurology)',
    experience: 20,
    consultationFee: 1500,
    availability: [
      { day: 'Monday', slots: ['10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM'] },
      { day: 'Tuesday', slots: ['10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM'] },
      { day: 'Wednesday', slots: ['10:00 AM', '11:00 AM'] },
      { day: 'Thursday', slots: ['10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM'] },
      { day: 'Friday', slots: ['10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM'] },
    ],
    rating: 4.9,
    totalReviews: 245,
  },
  {
    name: 'Dr. Anjali Mehta',
    email: 'anjali.mehta@hospital.com',
    phone: '9876543215',
    specialization: 'Dermatology',
    qualification: 'MBBS, MD (Dermatology)',
    experience: 8,
    consultationFee: 700,
    availability: [
      { day: 'Monday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'] },
      { day: 'Tuesday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Wednesday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Thursday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'] },
      { day: 'Friday', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'] },
      { day: 'Saturday', slots: ['09:00 AM', '10:00 AM', '11:00 AM'] },
    ],
    rating: 4.6,
    totalReviews: 87,
  },
  {
    name: 'Dr. Ramesh Gupta',
    email: 'ramesh.gupta@hospital.com',
    phone: '9876543216',
    specialization: 'General Medicine',
    qualification: 'MBBS, MD (Medicine)',
    experience: 25,
    consultationFee: 600,
    availability: [
      { day: 'Monday', slots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '05:00 PM', '06:00 PM'] },
      { day: 'Tuesday', slots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '05:00 PM', '06:00 PM'] },
      { day: 'Wednesday', slots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '05:00 PM', '06:00 PM'] },
      { day: 'Thursday', slots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '05:00 PM', '06:00 PM'] },
      { day: 'Friday', slots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '05:00 PM', '06:00 PM'] },
      { day: 'Saturday', slots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM'] },
    ],
    rating: 4.8,
    totalReviews: 320,
  },
  {
    name: 'Dr. Neha Kapoor',
    email: 'neha.kapoor@hospital.com',
    phone: '9876543217',
    specialization: 'ENT',
    qualification: 'MBBS, MS (ENT)',
    experience: 9,
    consultationFee: 750,
    availability: [
      { day: 'Monday', slots: ['10:30 AM', '11:30 AM', '12:30 PM', '03:30 PM', '04:30 PM'] },
      { day: 'Tuesday', slots: ['10:30 AM', '11:30 AM', '12:30 PM', '03:30 PM', '04:30 PM'] },
      { day: 'Wednesday', slots: ['10:30 AM', '11:30 AM', '12:30 PM'] },
      { day: 'Thursday', slots: ['10:30 AM', '11:30 AM', '12:30 PM', '03:30 PM', '04:30 PM'] },
      { day: 'Friday', slots: ['10:30 AM', '11:30 AM', '12:30 PM', '03:30 PM', '04:30 PM'] },
    ],
    rating: 4.7,
    totalReviews: 112,
  },
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('✅ MongoDB Connected');

    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    // Get all hospitals
    const hospitals = await Hospital.find();

    if (hospitals.length === 0) {
      console.error('❌ No hospitals found. Please run seed.ts first!');
      process.exit(1);
    }

    // Distribute doctors across hospitals
    const doctorsToCreate = doctorsData.map((doctor, index) => ({
      ...doctor,
      hospitalId: hospitals[index % hospitals.length]._id,
    }));

    const createdDoctors = await Doctor.insertMany(doctorsToCreate);
    console.log(`✅ Created ${createdDoctors.length} doctors`);

    // Show doctor distribution
    hospitals.forEach(hospital => {
      const hospitalDoctors = createdDoctors.filter(
        d => (d.hospitalId as any).toString() === (hospital._id as any).toString()
      );
      console.log(`   ${hospital.name}: ${hospitalDoctors.length} doctors`);
    });

    console.log('\n✅ Doctors seeded successfully!');
    console.log('\nSample Doctors:');
    createdDoctors.slice(0, 3).forEach(doctor => {
      console.log(`- Dr. ${doctor.name} (${doctor.specialization}) at ${doctor.hospitalId}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
    process.exit(1);
  }
};

seedDoctors();
