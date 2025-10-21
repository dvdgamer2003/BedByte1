import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    
    if (!apiKey) {
      console.error('❌ Gemini API key not found');
      throw new Error('GEMINI_API_KEY environment variable is required');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Debug logging
    console.log('🤖 Gemini Service Initialized');
    console.log('API Key Status:', apiKey ? `✅ Loaded (${apiKey.substring(0, 15)}...)` : '❌ NOT FOUND');
    console.log('Model: gemini-2.5-flash (Latest & Fastest) ✅');
  }

  async generateMedicalAdvice(userInput: string, symptoms?: string[], prescriptionType?: string): Promise<string> {
    let systemPrompt = '';
    
    if (prescriptionType === 'ayurveda') {
      systemPrompt = `You are a helpful Ayurvedic and natural health AI assistant. Provide Ayurvedic remedies and home remedies ONLY.

IMPORTANT RULES:
- Focus on Ayurvedic herbs, spices, and natural ingredients
- Suggest simple home remedies using kitchen ingredients (turmeric, ginger, honey, etc.)
- Include traditional Ayurvedic practices (like warm water therapy, oil pulling, etc.)
- NEVER prescribe modern pharmaceutical medicines or antibiotics
- Always include a disclaimer to consult an Ayurvedic practitioner or doctor
- If symptoms are severe or emergency-related, advise immediate medical attention
- Be clear, concise, and empathetic
- Format remedies in a structured way with: Remedy Name, Ingredients, Dosage/Usage, Frequency, Duration, Purpose

User Query: ${userInput}
${symptoms && symptoms.length > 0 ? `Reported Symptoms: ${symptoms.join(', ')}` : ''}

Provide Ayurvedic and home remedies in a friendly, professional manner.`;
    } else if (prescriptionType === 'homeopathy') {
      systemPrompt = `You are a helpful homeopathic medicine AI assistant. Provide homeopathic remedies ONLY.

IMPORTANT RULES:
- Suggest only homeopathic medicines and their potencies
- NEVER prescribe allopathic medicines, antibiotics, or controlled substances
- Always include a disclaimer to consult a licensed homeopathic doctor
- If symptoms are severe or emergency-related, advise immediate medical attention
- Be clear, concise, and empathetic
- Format medicine suggestions in a structured way with: Medicine Name, Potency, Dosage, Frequency, Duration, Purpose

User Query: ${userInput}
${symptoms && symptoms.length > 0 ? `Reported Symptoms: ${symptoms.join(', ')}` : ''}

Provide homeopathic remedies in a friendly, professional manner.`;
    } else {
      systemPrompt = `You are a helpful medical AI assistant. Provide general health guidance and suggest over-the-counter medicines ONLY. 

IMPORTANT RULES:
- NEVER prescribe antibiotics, controlled substances, or prescription-only medications
- Always include a disclaimer to consult a licensed doctor
- If symptoms are severe or emergency-related, advise immediate medical attention
- Provide dosage information for OTC medicines only
- Be clear, concise, and empathetic
- Format medicine suggestions in a structured way with: Medicine Name, Dosage, Frequency, Duration, Purpose

User Query: ${userInput}
${symptoms && symptoms.length > 0 ? `Reported Symptoms: ${symptoms.join(', ')}` : ''}

Provide your response in a friendly, professional manner.`;
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
    // Add disclaimer if not present
    const disclaimer = '\n\n⚠️ **Important Disclaimer**: This is general medical guidance only. Always consult a licensed healthcare professional before taking any medication or treatment.';
    
    if (!text.toLowerCase().includes('disclaimer') && !text.toLowerCase().includes('consult')) {
      return text + disclaimer;
    }
    
    return text;
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

    // Simple regex pattern to extract medicine information
    // This is a basic implementation - can be enhanced with better NLP
    const lines = aiResponse.split('\n');
    let currentMedicine: any = {};

    for (const line of lines) {
      const medicineMatch = line.match(/(?:Medicine|Drug|Medication):\s*(.+)/i);
      const dosageMatch = line.match(/Dosage:\s*(.+)/i);
      const frequencyMatch = line.match(/Frequency:\s*(.+)/i);
      const durationMatch = line.match(/Duration:\s*(.+)/i);
      const purposeMatch = line.match(/(?:Purpose|For):\s*(.+)/i);

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
