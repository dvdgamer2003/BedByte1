import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function diagnoseGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env');
    process.exit(1);
  }

  console.log('🔍 Diagnosing Gemini API Configuration\n');
  console.log('🔑 API Key:', apiKey.substring(0, 20) + '...\n');

  // Test 1: List available models
  console.log('📋 Test 1: Listing available models...\n');
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    console.log('✅ API Key is VALID!\n');
    console.log('📦 Available Models:\n');
    
    if (response.data.models && response.data.models.length > 0) {
      response.data.models.forEach((model: any) => {
        console.log(`  ✓ ${model.name}`);
        if (model.supportedGenerationMethods) {
          console.log(`    Methods: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });
      
      // Find the first model that supports generateContent
      const workingModel = response.data.models.find((m: any) => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      if (workingModel) {
        console.log(`\n✅ RECOMMENDED MODEL: ${workingModel.name.replace('models/', '')}`);
      }
    } else {
      console.log('⚠️  No models available');
    }
  } catch (error: any) {
    console.error('❌ Failed to list models');
    console.error('Error:', error.response?.data || error.message);
    console.log('\n🔧 TROUBLESHOOTING STEPS:');
    console.log('1. Go to https://aistudio.google.com/app/apikey');
    console.log('2. Generate a new API key');
    console.log('3. Enable Generative Language API');
    console.log('4. Update your .env file with the new key\n');
  }

  process.exit(0);
}

diagnoseGemini().catch((error) => {
  console.error('❌ Diagnosis failed:', error.message);
  process.exit(1);
});
