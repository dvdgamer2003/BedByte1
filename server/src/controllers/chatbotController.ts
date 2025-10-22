import { Response } from 'express';
import { randomUUID } from 'crypto';
import ChatHistory from '../models/ChatHistory';
import geminiService from '../services/geminiService';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Send message to chatbot
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, sessionId, symptoms, prescriptionType } = req.body;
    const userId = req.user!._id;

    if (!message || message.trim().length === 0) {
      throw new AppError('Message is required', 400);
    }

    // Find or create chat session
    let chatSession = await ChatHistory.findOne({
      userId,
      sessionId: sessionId || 'new',
    });

    const newSessionId = sessionId || randomUUID();

    if (!chatSession) {
      chatSession = await ChatHistory.create({
        userId,
        sessionId: newSessionId,
        messages: [],
        prescriptions: [],
        symptoms: symptoms || [],
        status: 'active',
      });
    }

    // Add user message
    chatSession.messages.push({
      role: 'user',
      text: message,
      timestamp: new Date(),
    });

    // Update symptoms if provided
    if (symptoms && Array.isArray(symptoms)) {
      chatSession.symptoms = [...new Set([...chatSession.symptoms, ...symptoms])];
    }

    // Analyze severity
    const severity = await geminiService.analyzeSeverity(chatSession.symptoms);
    chatSession.severity = severity;

    // Check if emergency
    if (severity === 'emergency') {
      const emergencyResponse =
        '🚨 **EMERGENCY ALERT**: Based on your symptoms, you need immediate medical attention. Please call emergency services (911/108) or visit the nearest emergency room immediately. Do not wait for online consultation.';

      chatSession.messages.push({
        role: 'bot',
        text: emergencyResponse,
        timestamp: new Date(),
      });

      chatSession.requiresDoctorReview = true;
      await chatSession.save();

      res.json({
        success: true,
        data: {
          sessionId: newSessionId,
          message: emergencyResponse,
          severity: 'emergency',
          requiresEmergency: true,
        },
      });
      return;
    }

    // Get AI response with fallback
    let aiResponse: string;
    try {
      aiResponse = await geminiService.generateMedicalAdvice(
        message,
        chatSession.symptoms,
        prescriptionType
      );
    } catch (aiError: any) {
      console.error('Gemini API error:', aiError);
      
      // Provide helpful fallback response
      aiResponse = `Thank you for sharing your symptoms. I'm having trouble connecting to our AI service at the moment.

**For immediate assistance:**
- 🏥 Visit the nearest hospital if symptoms are severe
- 📞 Call emergency services (911/108) for urgent medical attention
- 💊 For fever: Rest, stay hydrated, take paracetamol if needed
- 🌡️ Monitor your temperature regularly

**Please note:** This is not a substitute for professional medical advice. Consult a licensed doctor for proper diagnosis and treatment.

Would you like to:
1. Search for nearby hospitals?
2. Book an appointment with a doctor?
3. Try again later when our AI service is available?`;

      // Still track this interaction
      chatSession.messages.push({
        role: 'bot',
        text: aiResponse,
        timestamp: new Date(),
      });
      
      await chatSession.save();
      
      res.json({
        success: true,
        data: {
          sessionId: newSessionId,
          message: aiResponse,
          severity,
          isOffline: true,
          prescriptions: [],
          requiresDoctorReview: false,
        },
      });
      return;
    }

    // Add bot message
    chatSession.messages.push({
      role: 'bot',
      text: aiResponse,
      timestamp: new Date(),
    });

    // Extract and save prescriptions
    const extractedPrescriptions = geminiService.extractPrescriptions(aiResponse);
    if (extractedPrescriptions.length > 0) {
      extractedPrescriptions.forEach((prescription) => {
        chatSession!.prescriptions.push({
          ...prescription,
          timestamp: new Date(),
          approvedByDoctor: false,
        });
      });
      chatSession.requiresDoctorReview = true;
    }

    await chatSession.save();

    res.json({
      success: true,
      data: {
        sessionId: newSessionId,
        message: aiResponse,
        severity,
        prescriptions: extractedPrescriptions,
        requiresDoctorReview: chatSession.requiresDoctorReview,
      },
    });
  } catch (error: any) {
    console.error('Chatbot error:', error);
    console.error('Error details:', error.stack);
    
    if (error instanceof AppError) throw error;
    
    // Check for specific error types
    if (error.message?.includes('API key') || error.message?.includes('GOOGLE_API_KEY') || error.message?.includes('GEMINI_API_KEY')) {
      throw new AppError('AI service not configured. Please contact support.', 500);
    }
    
    if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new AppError('AI service temporarily unavailable. Please try again later.', 503);
    }
    
    if (error.message?.includes('timeout')) {
      throw new AppError('Request timeout. Please try again.', 504);
    }
    
    if (error.message?.includes('model') || error.message?.includes('not found')) {
      throw new AppError('AI model configuration error. Please contact support.', 500);
    }
    
    // Generic error with actual message
    const errorMessage = error.message || 'Failed to process your message. Please try again.';
    throw new AppError(errorMessage, 500);
  }
};

// Get chat history
export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const userId = req.user!._id;

    const chatSession = await ChatHistory.findOne({
      userId,
      sessionId,
    });

    if (!chatSession) {
      throw new AppError('Chat session not found', 404);
    }

    res.json({
      success: true,
      data: chatSession,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch chat history', 500);
  }
};

// Get all user sessions
export const getUserSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const sessions = await ChatHistory.find({ userId })
      .sort({ updatedAt: -1 })
      .select('sessionId symptoms severity status createdAt updatedAt requiresDoctorReview');

    res.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    throw new AppError('Failed to fetch sessions', 500);
  }
};

// Doctor: Get chats requiring review
export const getChatsForReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    const query: any = { requiresDoctorReview: true };
    if (status) query.status = status;

    const chats = await ChatHistory.find(query)
      .populate('userId', 'name email phone')
      .populate('reviewedBy', 'name specialization')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: chats,
    });
  } catch (error) {
    throw new AppError('Failed to fetch chats for review', 500);
  }
};

// Doctor: Review and approve prescription
export const reviewPrescription = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const { prescriptionIndex, approved, notes, updatedPrescription } = req.body;
    const doctorId = req.user!._id;

    const chatSession = await ChatHistory.findOne({ sessionId });

    if (!chatSession) {
      throw new AppError('Chat session not found', 404);
    }

    if (prescriptionIndex >= chatSession.prescriptions.length) {
      throw new AppError('Invalid prescription index', 400);
    }

    // Update prescription
    chatSession.prescriptions[prescriptionIndex].approvedByDoctor = approved;
    chatSession.prescriptions[prescriptionIndex].doctorId = doctorId as any;
    chatSession.prescriptions[prescriptionIndex].doctorNotes = notes;

    if (updatedPrescription) {
      Object.assign(chatSession.prescriptions[prescriptionIndex], updatedPrescription);
    }

    // Update review status
    chatSession.reviewedBy = doctorId as any;
    chatSession.reviewedAt = new Date();
    chatSession.status = 'reviewed';

    await chatSession.save();

    res.json({
      success: true,
      message: 'Prescription reviewed successfully',
      data: chatSession,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to review prescription', 500);
  }
};

// Close chat session
export const closeSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const userId = req.user!._id;

    const chatSession = await ChatHistory.findOneAndUpdate(
      { userId, sessionId },
      { status: 'completed' },
      { new: true }
    );

    if (!chatSession) {
      throw new AppError('Chat session not found', 404);
    }

    res.json({
      success: true,
      message: 'Session closed successfully',
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to close session', 500);
  }
};
