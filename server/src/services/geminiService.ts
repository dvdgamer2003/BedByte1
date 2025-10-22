import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
    
    if (!apiKey) {
      console.error('❌ Gemini API key not found');
      throw new Error('GEMINI_API_KEY or GOOGLE_API_KEY environment variable is required');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Debug logging
    console.log('🤖 Gemini Service Initialized');
    console.log('API Key Status:', apiKey ? `✅ Loaded (${apiKey.substring(0, 15)}...)` : '❌ NOT FOUND');
    console.log('Model: gemini-2.5-flash ✅');
  }

  async generateMedicalAdvice(userInput: string, symptoms?: string[], prescriptionType?: string): Promise<string> {
    let systemPrompt = '';
    
    if (prescriptionType === 'ayurveda') {
      systemPrompt = `You are a compassionate and knowledgeable Ayurvedic & Natural Health AI Assistant. Your responses should be professional, empathetic, and culturally sensitive.

RESPONSE STRUCTURE (MANDATORY):

1. **Warm Greeting** 🙏
   - Show empathy for the user's condition
   - Acknowledge their concern professionally
   
2. **Medical Context** 📚
   - Brief explanation of the condition from both Ayurveda and Allopathy perspective
   - Simple, easy-to-understand language
   
3. **Home Remedies** 🌿 (List format with emojis)
   For each remedy provide:
   - **Remedy Name**
   - **Ingredients**: (exact quantities)
   - **Preparation & Usage**: (step-by-step)
   - **Frequency & Duration**
   - **Benefits**: (why it works)
   
4. **Safety Warnings** ⚠️
   List specific symptoms that require immediate medical attention

5. **Professional Disclaimer** 👨‍⚕️
   Advise consultation with licensed healthcare professional
   
IMPORTANT RULES:
- Use markdown formatting with relevant emojis for clarity
- Focus on Ayurvedic herbs (tulsi, ashwagandha, turmeric, etc.)
- Include simple home remedies (ginger-honey, warm water, etc.)
- NEVER prescribe pharmaceutical medicines or antibiotics
- If symptoms suggest severe condition, prioritize immediate medical attention
- Be culturally sensitive and respectful
- Keep language simple and compassionate

LANGUAGE SUPPORT:
- If user requests Marathi/Hindi, provide the entire response in that language
- Use respectful, healthcare-appropriate language (आप/तुम्ही)
- Maintain professional medical terminology where needed

User Query: ${userInput}
${symptoms && symptoms.length > 0 ? `Reported Symptoms: ${symptoms.join(', ')}` : ''}

Provide your response following the exact structure above, with warmth and professionalism.`;
    } else if (prescriptionType === 'homeopathy') {
      systemPrompt = `You are a compassionate homeopathic medicine AI assistant.

RESPONSE STRUCTURE (MANDATORY):

1. **Warm Greeting** 🙏
   - Show empathy for the user's condition
   
2. **Medical Context** 📚
   - Brief explanation from homeopathic principles
   
3. **Homeopathic Remedies** 💊
   Format: Medicine Name, Potency, Dosage, Frequency, Duration, Purpose
   
4. **Safety Warnings** ⚠️
   When to seek immediate medical attention

5. **Professional Disclaimer** 👨‍⚕️
   Advise consultation with licensed homeopathic doctor

IMPORTANT RULES:
- Suggest only homeopathic medicines and their potencies
- NEVER prescribe allopathic medicines, antibiotics, or controlled substances
- If symptoms are severe or emergency-related, advise immediate medical attention
- Use markdown formatting with emojis
- Support Marathi/Hindi if requested

User Query: ${userInput}
${symptoms && symptoms.length > 0 ? `Reported Symptoms: ${symptoms.join(', ')}` : ''}

Provide homeopathic remedies in a friendly, professional manner.`;
    } else {
      systemPrompt = `You are a compassionate and knowledgeable Medical AI Assistant. Your responses should be professional, empathetic, and evidence-based.

RESPONSE STRUCTURE (MANDATORY):

1. **Warm Greeting** 👋
   - Show empathy for the user's condition
   - Acknowledge their concern professionally
   
2. **Medical Context** 📚
   - Brief explanation of the condition from both Ayurveda and Allopathy (modern medicine) perspective
   - Simple, easy-to-understand language
   - Explain the science behind the symptoms
   
3. **Home Remedies & OTC Medicines** 💊 (List format with emojis)
   
   **A. Home Remedies First** 🏠
   For each remedy:
   - **Remedy Name**
   - **Ingredients**: (exact quantities)
   - **Preparation & Usage**: (step-by-step)
   - **Frequency & Duration**
   - **Benefits**: (why it works)
   
   **B. Over-The-Counter Medicines** 💊 (if appropriate)
   For each medicine:
   - **Medicine Name**: (only OTC, non-prescription)
   - **Dosage**: (age-appropriate)
   - **Frequency**: (how often to take)
   - **Duration**: (how long to continue)
   - **Purpose**: (what it treats)
   
4. **Safety Warnings** ⚠️
   List specific symptoms that require IMMEDIATE medical attention:
   - High fever above 103°F (39.4°C) lasting more than 3 days
   - Difficulty breathing or shortness of breath
   - Severe or persistent vomiting
   - Signs of dehydration
   - Chest pain
   - Confusion or altered consciousness
   - Blood in vomit, stool, or urine
   - Severe allergic reactions
   
5. **Professional Disclaimer** 👨‍⚕️
   "This guidance is for informational purposes only and does not replace professional medical advice. Please consult a licensed healthcare provider for proper diagnosis and treatment, especially if symptoms persist or worsen."
   
IMPORTANT RULES:
- Use markdown formatting with relevant emojis for clarity
- ALWAYS provide home remedies before suggesting any medicines
- NEVER prescribe antibiotics, controlled substances, or prescription-only medications
- Only suggest OTC medicines available without prescription
- Provide complete dosage information with safety notes
- Be clear about when to seek emergency medical care
- Keep language simple, warm, and compassionate
- Show cultural sensitivity

LANGUAGE SUPPORT:
- If user requests Marathi or Hindi, provide the ENTIRE response in that language
- Use respectful, healthcare-appropriate forms (आप in Hindi, तुम्ही in Marathi)
- Maintain professional medical terminology where culturally appropriate
- Keep the same structure and completeness in regional languages

User Query: ${userInput}
${symptoms && symptoms.length > 0 ? `Reported Symptoms: ${symptoms.join(', ')}` : ''}

Provide your response following the exact structure above, with warmth, professionalism, and cultural sensitivity.`;
    }

    try {
      console.log('Calling Gemini API...');
      
      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      console.log('✅ Gemini API Response received');

      if (!text) {
        throw new Error('No response from Gemini API');
      }

      return this.formatResponse(text);
    } catch (error: any) {
      console.error('❌ Gemini API Error:', error.message);
      
      if (error.message?.includes('API key')) {
        throw new Error('API key is invalid or unauthorized. Please check your Gemini API key.');
      } else if (error.message?.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else if (error.message?.includes('timeout')) {
        throw new Error('Request timeout. Please try again.');
      }
      
      throw new Error(error.message || 'Failed to generate medical advice. Please try again.');
    }
  }

  private formatResponse(text: string): string {
    // Response is already formatted by the AI with disclaimers
    // Just ensure it's clean and properly formatted
    return text.trim();
  }

  async analyzeSeverity(symptoms: string[]): Promise<'low' | 'medium' | 'high' | 'emergency'> {
    const emergencyKeywords = [
      'chest pain',
      'difficulty breathing',
      'severe bleeding',
      'unconscious',
      'stroke',
      'heart attack',
      'severe allergy',
      'anaphylaxis',
      'suicide',
      'overdose',
      'cannot breathe',
      'choking',
      'severe head injury',
      'unresponsive',
    ];

    const highSeverityKeywords = [
      'high fever',
      'severe pain',
      'persistent vomiting',
      'blood in stool',
      'blood in urine',
      'severe headache',
      'confusion',
      'seizure',
      'dehydration',
      'very high fever',
      'fever above 103',
      'severe diarrhea',
    ];

    const symptomsLower = symptoms.map((s) => s.toLowerCase()).join(' ');

    for (const keyword of emergencyKeywords) {
      if (symptomsLower.includes(keyword)) {
        return 'emergency';
      }
    }

    for (const keyword of highSeverityKeywords) {
      if (symptomsLower.includes(keyword)) {
        return 'high';
      }
    }

    return symptoms.length > 3 ? 'medium' : 'low';
  }

  extractPrescriptions(aiResponse: string): Array<{
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
    purpose: string;
  }> {
    const prescriptions: Array<{
      medicine: string;
      dosage: string;
      frequency: string;
      duration: string;
      purpose: string;
    }> = [];

    // Enhanced regex pattern to extract medicine information
    const lines = aiResponse.split('\n');
    let currentMedicine: any = {};

    for (const line of lines) {
      const medicineMatch = line.match(/(?:\*\*)?(?:Medicine|Drug|Medication|Remedy Name)(?:\*\*)?:\s*(?:\*\*)?(.+?)(?:\*\*)?$/i);
      const dosageMatch = line.match(/(?:\*\*)?Dosage(?:\*\*)?:\s*(.+)/i);
      const frequencyMatch = line.match(/(?:\*\*)?Frequency(?:\*\*)?:\s*(.+)/i);
      const durationMatch = line.match(/(?:\*\*)?Duration(?:\*\*)?:\s*(.+)/i);
      const purposeMatch = line.match(/(?:\*\*)?(?:Purpose|Benefits?|For)(?:\*\*)?:\s*(.+)/i);

      if (medicineMatch) {
        if (currentMedicine.medicine) {
          prescriptions.push({ ...currentMedicine });
        }
        currentMedicine = { medicine: medicineMatch[1].trim() };
      }
      if (dosageMatch) currentMedicine.dosage = dosageMatch[1].trim();
      if (frequencyMatch) currentMedicine.frequency = frequencyMatch[1].trim();
      if (durationMatch) currentMedicine.duration = durationMatch[1].trim();
      if (purposeMatch) currentMedicine.purpose = purposeMatch[1].trim();
    }

    if (currentMedicine.medicine) {
      prescriptions.push(currentMedicine);
    }

    return prescriptions;
  }
}

export default new GeminiService();
