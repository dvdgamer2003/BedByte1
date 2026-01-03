import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MedicalStore from '../models/MedicalStore';

dotenv.config();

const medicalStoresData = [
    {
        name: 'Apollo Pharmacy',
        city: 'Mumbai',
        address: 'Shop No 1, Ground Floor, Plot No 12, Sector 5, Kharghar',
        phone: '022-27745678',
        email: 'apollo.navimumbai@gmail.com',
        ownerName: 'Apollo Group',
        licenseNumber: 'MH-MZ2-123456',
        coordinates: { lat: 19.0330, lng: 73.0297 },
        location: {
            type: 'Point',
            coordinates: [73.0297, 19.0330] // lng, lat
        },
        is24x7: true,
        homeDelivery: true,
        rating: 4.5,
        medicines: [
            { name: 'Paracetamol', category: 'Pain Relief', price: 20, inStock: true, quantity: 100 },
            { name: 'Cetirizine', category: 'Cold & Flu', price: 35, inStock: true, quantity: 50 },
            { name: 'Amoxicillin', category: 'Antibiotics', price: 85, inStock: true, quantity: 30 }
        ]
    },
    {
        name: 'Wellness Forever',
        city: 'Mumbai',
        address: 'Shop 4-5, Sunshine building, near Station, Andheri West',
        phone: '022-26612345',
        email: 'wellness.andheri@gmail.com',
        ownerName: 'Wellness Forever Medicare',
        licenseNumber: 'MH-MZ2-654321',
        coordinates: { lat: 19.1136, lng: 72.8697 },
        location: {
            type: 'Point',
            coordinates: [72.8697, 19.1136]
        },
        is24x7: true,
        homeDelivery: true,
        rating: 4.8,
        medicines: [
            { name: 'Aspirin', category: 'Heart', price: 15, inStock: true, quantity: 200 },
            { name: 'Metformin', category: 'Diabetes', price: 60, inStock: true, quantity: 150 },
            { name: 'Digene', category: 'Stomach', price: 110, inStock: true, quantity: 40 }
        ]
    },
    {
        name: 'Noble Plus Pharmacy',
        city: 'Mumbai',
        address: 'Opposite Juhu Beach, Juhu Tara Road',
        phone: '022-26123456',
        email: 'noble.juhu@gmail.com',
        ownerName: 'Noble Chemists',
        licenseNumber: 'MH-MZ2-987654',
        coordinates: { lat: 19.0988, lng: 72.8250 },
        location: {
            type: 'Point',
            coordinates: [72.8250, 19.0988]
        },
        is24x7: false,
        homeDelivery: true,
        rating: 4.2,
        medicines: [
            { name: 'Vitamin C', category: 'Vitamins', price: 50, inStock: true, quantity: 300 },
            { name: 'Bandage', category: 'First Aid', price: 100, inStock: true, quantity: 100 },
            { name: 'Dolo 650', category: 'Pain Relief', price: 30, inStock: true, quantity: 500 }
        ]
    },
    {
        name: 'Sahyadri Chemist',
        city: 'Pune',
        address: 'Deccan Gymkhana, Pune',
        phone: '020-25678901',
        email: 'sahyadri.pune@gmail.com',
        ownerName: 'Sahyadri Group',
        licenseNumber: 'MH-PZ1-456789',
        coordinates: { lat: 18.5167, lng: 73.8562 },
        location: {
            type: 'Point',
            coordinates: [73.8562, 18.5167]
        },
        is24x7: true,
        homeDelivery: false,
        rating: 4.6,
        medicines: [
            { name: 'Cough Syrup', category: 'Cold & Flu', price: 120, inStock: true, quantity: 80 },
            { name: 'Thermometer', category: 'First Aid', price: 250, inStock: true, quantity: 20 },
            { name: 'ORS', category: 'Other', price: 20, inStock: true, quantity: 1000 }
        ]
    }
];

const seedMedicalStores = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('✅ MongoDB Connected');

        // Clear existing stores
        await MedicalStore.deleteMany({});
        console.log('Cleared existing medical stores');

        // Insert new stores
        const createdStores = await MedicalStore.insertMany(medicalStoresData);
        console.log(`✅ Created ${createdStores.length} medical stores`);

        console.log('\nSample Medical Stores:');
        createdStores.forEach(store => {
            console.log(`- ${store.name} (${store.city})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding medical stores:', error);
        process.exit(1);
    }
};

seedMedicalStores();
