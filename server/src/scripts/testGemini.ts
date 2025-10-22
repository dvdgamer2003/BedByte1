import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env');
    process.exit(1);
  }

  console.log('🔑 API Key:', apiKey.substring(0, 20) + '...');
  console.log('\n📋 Testing Gemini API...\n');

  const genAI = new GoogleGenerativeAI(apiKey);

  // Test different model names
  const modelsToTest = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.0-pro',
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`\n🧪 Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent('Hello, respond with just "OK"');
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ ${modelName} - WORKS!`);
      console.log(`   Response: ${text.substring(0, 50)}...`);
    } catch (error: any) {
      console.log(`❌ ${modelName} - FAILED`);
      console.log(`   Error: ${error.message.substring(0, 100)}...`);
    }
  }

  console.log('\n✅ Test completed!\n');
  process.exit(0);
}

testGemini().catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
