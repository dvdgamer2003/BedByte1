import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MedicalStore from './models/MedicalStore';

dotenv.config();

const medicalStores = [
  {
    name: 'Apollo Pharmacy',
    city: 'Mumbai',
    address: 'Andheri West, Link Road, Mumbai',
    phone: '9876543210',
    email: 'apollo.andheri@pharmacy.com',
    ownerName: 'Rajesh Kumar',
    licenseNumber: 'MH-MED-2023-001',
    coordinates: { lat: 19.1136, lng: 72.8697 },
    location: { type: 'Point', coordinates: [72.8697, 19.1136] },
    medicines: [
      { name: 'Paracetamol 500mg', category: 'Pain Relief', price: 25, inStock: true, quantity: 500 },
      { name: 'Ibuprofen 400mg', category: 'Pain Relief', price: 35, inStock: true, quantity: 300 },
      { name: 'Amoxicillin 500mg', category: 'Antibiotics', price: 120, inStock: true, quantity: 150 },
      { name: 'Vitamin C 1000mg', category: 'Vitamins', price: 180, inStock: true, quantity: 200 },
      { name: 'Cetirizine 10mg', category: 'Cold & Flu', price: 45, inStock: true, quantity: 400 },
      { name: 'Metformin 500mg', category: 'Diabetes', price: 85, inStock: true, quantity: 250 },
      { name: 'Band-Aid Pack', category: 'First Aid', price: 60, inStock: true, quantity: 100 },
    ],
    is24x7: true,
    homeDelivery: true,
    rating: 4.5,
  },
  {
    name: 'MedPlus Pharmacy',
    city: 'Mumbai',
    address: 'Bandra East, Mumbai',
    phone: '9876543211',
    email: 'medplus.bandra@pharmacy.com',
    ownerName: 'Priya Sharma',
    licenseNumber: 'MH-MED-2023-002',
    coordinates: { lat: 19.0596, lng: 72.8656 },
    location: { type: 'Point', coordinates: [72.8656, 19.0596] },
    medicines: [
      { name: 'Aspirin 75mg', category: 'Heart', price: 40, inStock: true, quantity: 300 },
      { name: 'Crocin Advance', category: 'Pain Relief', price: 30, inStock: true, quantity: 450 },
      { name: 'Azithromycin 500mg', category: 'Antibiotics', price: 150, inStock: true, quantity: 120 },
      { name: 'Vitamin D3', category: 'Vitamins', price: 220, inStock: true, quantity: 180 },
      { name: 'Dolo 650mg', category: 'Pain Relief', price: 28, inStock: true, quantity: 600 },
      { name: 'Atorvastatin 10mg', category: 'Heart', price: 95, inStock: true, quantity: 200 },
      { name: 'Antiseptic Cream', category: 'First Aid', price: 75, inStock: true, quantity: 150 },
    ],
    is24x7: true,
    homeDelivery: true,
    rating: 4.3,
  },
  {
    name: 'Wellness Forever',
    city: 'Mumbai',
    address: 'Powai, Hiranandani Gardens, Mumbai',
    phone: '9876543212',
    email: 'wellness.powai@pharmacy.com',
    ownerName: 'Amit Patel',
    licenseNumber: 'MH-MED-2023-003',
    coordinates: { lat: 19.1197, lng: 72.9067 },
    location: { type: 'Point', coordinates: [72.9067, 19.1197] },
    medicines: [
      { name: 'Paracetamol 650mg', category: 'Pain Relief', price: 32, inStock: true, quantity: 400 },
      { name: 'Ciprofloxacin 500mg', category: 'Antibiotics', price: 135, inStock: true, quantity: 180 },
      { name: 'Multivitamin Tablets', category: 'Vitamins', price: 250, inStock: true, quantity: 220 },
      { name: 'Omeprazole 20mg', category: 'Stomach', price: 65, inStock: true, quantity: 300 },
      { name: 'Loratadine 10mg', category: 'Cold & Flu', price: 55, inStock: true, quantity: 350 },
      { name: 'Amlodipine 5mg', category: 'Blood Pressure', price: 78, inStock: true, quantity: 280 },
      { name: 'Betadine Solution', category: 'First Aid', price: 90, inStock: true, quantity: 120 },
    ],
    is24x7: false,
    homeDelivery: true,
    rating: 4.6,
  },
  {
    name: 'Netmeds Pharmacy',
    city: 'Mumbai',
    address: 'Malad West, Mumbai',
    phone: '9876543213',
    email: 'netmeds.malad@pharmacy.com',
    ownerName: 'Sneha Reddy',
    licenseNumber: 'MH-MED-2023-004',
    coordinates: { lat: 19.1865, lng: 72.8393 },
    location: { type: 'Point', coordinates: [72.8393, 19.1865] },
    medicines: [
      { name: 'Paracetamol Syrup', category: 'Pain Relief', price: 45, inStock: true, quantity: 250 },
      { name: 'Amoxiclav 625mg', category: 'Antibiotics', price: 165, inStock: true, quantity: 140 },
      { name: 'Calcium + Vitamin D', category: 'Vitamins', price: 195, inStock: true, quantity: 190 },
      { name: 'Pantoprazole 40mg', category: 'Stomach', price: 70, inStock: true, quantity: 320 },
      { name: 'Montelukast 10mg', category: 'Cold & Flu', price: 88, inStock: true, quantity: 200 },
      { name: 'Glimepiride 2mg', category: 'Diabetes', price: 92, inStock: true, quantity: 240 },
      { name: 'Cotton Bandage Roll', category: 'First Aid', price: 45, inStock: true, quantity: 180 },
    ],
    is24x7: false,
    homeDelivery: true,
    rating: 4.4,
  },
  {
    name: '24/7 MedCare',
    city: 'Mumbai',
    address: 'Kurla West, LBS Marg, Mumbai',
    phone: '9876543214',
    email: 'medcare.kurla@pharmacy.com',
    ownerName: 'Vikram Singh',
    licenseNumber: 'MH-MED-2023-005',
    coordinates: { lat: 19.0728, lng: 72.8826 },
    location: { type: 'Point', coordinates: [72.8826, 19.0728] },
    medicines: [
      { name: 'Disprin', category: 'Pain Relief', price: 22, inStock: true, quantity: 500 },
      { name: 'Augmentin 625mg', category: 'Antibiotics', price: 175, inStock: true, quantity: 160 },
      { name: 'Vitamin B Complex', category: 'Vitamins', price: 145, inStock: true, quantity: 210 },
      { name: 'Domperidone 10mg', category: 'Stomach', price: 58, inStock: true, quantity: 290 },
      { name: 'Levocetrizine 5mg', category: 'Cold & Flu', price: 48, inStock: true, quantity: 380 },
      { name: 'Telmisartan 40mg', category: 'Blood Pressure', price: 105, inStock: true, quantity: 220 },
      { name: 'Dettol Antiseptic', category: 'First Aid', price: 110, inStock: true, quantity: 140 },
    ],
    is24x7: true,
    homeDelivery: true,
    rating: 4.7,
  },
  {
    name: 'HealthBuddy Pharmacy',
    city: 'Mumbai',
    address: 'Dadar West, Mumbai',
    phone: '9876543215',
    email: 'healthbuddy.dadar@pharmacy.com',
    ownerName: 'Meera Iyer',
    licenseNumber: 'MH-MED-2023-006',
    coordinates: { lat: 19.0176, lng: 72.8433 },
    location: { type: 'Point', coordinates: [72.8433, 19.0176] },
    medicines: [
      { name: 'Combiflam', category: 'Pain Relief', price: 38, inStock: true, quantity: 420 },
      { name: 'Cefixime 200mg', category: 'Antibiotics', price: 145, inStock: true, quantity: 170 },
      { name: 'Omega-3 Capsules', category: 'Vitamins', price: 285, inStock: true, quantity: 150 },
      { name: 'Ranitidine 150mg', category: 'Stomach', price: 52, inStock: true, quantity: 310 },
      { name: 'Sinarest Tablet', category: 'Cold & Flu', price: 42, inStock: true, quantity: 400 },
      { name: 'Insulin Glargine', category: 'Diabetes', price: 850, inStock: true, quantity: 45 },
      { name: 'Savlon Antiseptic', category: 'First Aid', price: 95, inStock: true, quantity: 160 },
    ],
    is24x7: false,
    homeDelivery: false,
    rating: 4.2,
  },
  {
    name: 'PharmEasy Store',
    city: 'Mumbai',
    address: 'Goregaon East, Mumbai',
    phone: '9876543216',
    email: 'pharmeasy.goregaon@pharmacy.com',
    ownerName: 'Anil Deshmukh',
    licenseNumber: 'MH-MED-2023-007',
    coordinates: { lat: 19.1653, lng: 72.8797 },
    location: { type: 'Point', coordinates: [72.8797, 19.1653] },
    medicines: [
      { name: 'Brufen 400mg', category: 'Pain Relief', price: 42, inStock: true, quantity: 360 },
      { name: 'Doxycycline 100mg', category: 'Antibiotics', price: 125, inStock: true, quantity: 190 },
      { name: 'Iron + Folic Acid', category: 'Vitamins', price: 165, inStock: true, quantity: 230 },
      { name: 'Digene Tablet', category: 'Stomach', price: 35, inStock: true, quantity: 450 },
      { name: 'Vicks Action 500', category: 'Cold & Flu', price: 50, inStock: true, quantity: 340 },
      { name: 'Lisinopril 10mg', category: 'Blood Pressure', price: 98, inStock: true, quantity: 260 },
      { name: 'Thermometer Digital', category: 'First Aid', price: 250, inStock: true, quantity: 80 },
    ],
    is24x7: false,
    homeDelivery: true,
    rating: 4.5,
  },
  {
    name: 'CareWell Pharmacy',
    city: 'Mumbai',
    address: 'Chembur East, Mumbai',
    phone: '9876543217',
    email: 'carewell.chembur@pharmacy.com',
    ownerName: 'Pooja Gupta',
    licenseNumber: 'MH-MED-2023-008',
    coordinates: { lat: 19.0622, lng: 72.8992 },
    location: { type: 'Point', coordinates: [72.8992, 19.0622] },
    medicines: [
      { name: 'Saridon', category: 'Pain Relief', price: 26, inStock: true, quantity: 480 },
      { name: 'Erythromycin 500mg', category: 'Antibiotics', price: 138, inStock: true, quantity: 155 },
      { name: 'Vitamin E Capsules', category: 'Vitamins', price: 210, inStock: true, quantity: 175 },
      { name: 'Gelusil Syrup', category: 'Stomach', price: 68, inStock: true, quantity: 280 },
      { name: 'D-Cold Total', category: 'Cold & Flu', price: 46, inStock: true, quantity: 390 },
      { name: 'Gliclazide 80mg', category: 'Diabetes', price: 88, inStock: true, quantity: 230 },
      { name: 'Moov Pain Relief Cream', category: 'Pain Relief', price: 125, inStock: true, quantity: 200 },
    ],
    is24x7: true,
    homeDelivery: true,
    rating: 4.6,
  },
];

const seedMedicalStores = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      console.error('❌ MONGO_URI not found in environment variables');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing medical stores
    console.log('🗑️  Clearing existing medical stores...');
    await MedicalStore.deleteMany({});
    console.log('✅ Cleared existing medical stores');

    // Insert new medical stores
    console.log('📦 Seeding medical stores...');
    await MedicalStore.insertMany(medicalStores);
    console.log(`✅ Successfully seeded ${medicalStores.length} medical stores`);

    // Display summary
    console.log('\n📊 Medical Stores Summary:');
    medicalStores.forEach((store, index) => {
      console.log(`${index + 1}. ${store.name} - ${store.city}`);
      console.log(`   📍 Location: ${store.address}`);
      console.log(`   💊 Medicines: ${store.medicines.length}`);
      console.log(`   🕐 24x7: ${store.is24x7 ? 'Yes' : 'No'}`);
      console.log(`   🚚 Home Delivery: ${store.homeDelivery ? 'Yes' : 'No'}`);
      console.log('');
    });

    console.log('✨ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding medical stores:', error);
    process.exit(1);
  }
};

seedMedicalStores();
