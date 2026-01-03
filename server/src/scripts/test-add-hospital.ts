import axios from 'axios';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock environment
process.env.GEMINI_API_KEY = "mock_key";

const testAddHospital = async () => {
    // Check index.ts for actual prefix, assuming /api based on previous file views
    const baseUrl = 'http://localhost:5000/api';

    try {
        // 1. Login as Admin
        console.log('🔑 Logging in as admin...');
        const loginResponse = await axios.post(`${baseUrl}/auth/login`, {
            email: 'admin@getbeds.com',
            password: 'admin123'
        });

        const token = loginResponse.data.token;
        console.log('✅ Login successful, token received.');

        // 2. Add Hospital
        console.log('\n🏥 Adding hospital...');
        const hospitalData = {
            name: "Test Hospital No Email " + Date.now(),
            city: "Mumbai",
            address: "123 Debug Lane",
            phone: "+919999999999",
            email: "", // Empty email as per frontend optional field
            opdAvailable: true,
            emergencyAvailable: true
            // Intentionally omitting location to test auto-generation
        };

        const response = await axios.post(`${baseUrl}/hospitals`, hospitalData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('✅ Success:', response.data);

    } catch (error: any) {
        if (error.response) {
            console.error('❌ API Error:', error.response.status, error.response.data);
        } else {
            console.error('❌ Network/Script Error:', error.message);
        }
    }
};

testAddHospital();
