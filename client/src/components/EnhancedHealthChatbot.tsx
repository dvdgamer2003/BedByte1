import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User as UserIcon, 
  AlertCircle,
  Download,
  Pill,
  Clock,
  Sparkles,
  Flower2,
  Activity,
  Leaf
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import api from '../utils/api';

interface Message {
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface Prescription {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  purpose: string;
}

const EnhancedHealthChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [prescriptionType, setPrescriptionType] = useState<'allopathy' | 'homeopathy' | 'ayurveda'>('allopathy');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([
        {
          role: 'bot',
          text: `👋 Hello! I'm your AI Health Assistant powered by advanced medical knowledge. I can help you understand your symptoms and suggest ${prescriptionType === 'homeopathy' ? 'homeopathic' : prescriptionType === 'ayurveda' ? 'Ayurvedic & home' : 'allopathic'} remedies. How can I assist you today?`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await api.post('/chatbot/message', {
        message: `${inputMessage}. Please provide ${prescriptionType} medicine recommendations.`,
        sessionId,
        prescriptionType,
      });

      setSessionId(response.data.data.sessionId);

      const botMessage: Message = {
        role: 'bot',
        text: response.data.data.message,
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);

        if (response.data.data.prescriptions && response.data.data.prescriptions.length > 0) {
          setPrescriptions(response.data.data.prescriptions);
        }

        if (response.data.data.severity === 'emergency') {
          alert('⚠️ EMERGENCY: Please seek immediate medical attention!');
        }
      }, 1000);
    } catch (error: any) {
      setIsTyping(false);
      const errorMessage: Message = {
        role: 'bot',
        text: error.response?.data?.error || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleDownloadPrescription = async () => {
    if (!sessionId) {
      alert('No active session found');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_SERVER_URL}/chatbot/prescription/${sessionId}/pdf`;
      
      window.open(url + '?token=' + token, '_blank');
    } catch (error) {
      console.error('Failed to download prescription:', error);
      alert('Failed to download prescription. Please try again.');
    }
  };

  return (
    <>
      {/* Floating Chat Button - Positioned left of emergency button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-24 z-50"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            {/* Multiple layered glow effects for depth */}
            <motion.div 
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-full blur-xl opacity-70 animate-pulse" />
            
            {/* Rotating outer ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, rgba(139, 92, 246, 0.4) 50%, transparent 100%)',
              }}
            />
            
            {/* Button with 3D layered design */}
            <Button
              onClick={startChat}
              size="lg"
              className="relative h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 border-2 border-white/30"
              style={{
                boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.5), inset 0 2px 4px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* Rotating shine effect */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
              />
              
              {/* 3D Bot Icon with layers */}
              <div className="relative z-10">
                {/* Bot head shadow/base */}
                <div className="absolute inset-0 bg-white/10 rounded-lg blur-sm" />
                
                {/* Main bot icon structure */}
                <div className="relative">
                  {/* Bot antenna */}
                  <motion.div
                    animate={{ rotate: [-10, 10, -10] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white/80 rounded-full"
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50" />
                  </motion.div>
                  
                  {/* Bot head with 3D effect */}
                  <div className="relative bg-white/20 rounded-xl p-1.5 backdrop-blur-sm border border-white/30">
                    {/* Bot eyes */}
                    <div className="flex gap-1.5 mb-1">
                      <motion.div 
                        animate={{ scaleY: [1, 0.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                        className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                      />
                      <motion.div 
                        animate={{ scaleY: [1, 0.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, delay: 0.1 }}
                        className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                      />
                    </div>
                    
                    {/* Bot mouth/speaker */}
                    <div className="flex gap-0.5 justify-center">
                      <div className="w-0.5 h-1 bg-white/60 rounded-full" />
                      <div className="w-0.5 h-1.5 bg-white/60 rounded-full" />
                      <div className="w-0.5 h-1 bg-white/60 rounded-full" />
                    </div>
                  </div>
                  
                  {/* Bot message bubble */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -right-2 -bottom-1 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg"
                  >
                    <MessageCircle className="h-1.5 w-1.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </motion.div>
                </div>
              </div>
            </Button>

            {/* AI badge with sparkle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                scale: { delay: 0.5 },
                rotate: { duration: 4, repeat: Infinity }
              }}
              className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white"
            >
              <Sparkles className="h-3 w-3" />
            </motion.div>
            
            {/* Floating particles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [-20, -40, -20],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  delay: i * 1
                }}
                className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full"
                style={{ left: `${30 + i * 20}%` }}
              />
            ))}
          </motion.div>

          {/* Enhanced Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            whileHover={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none border border-white/20 backdrop-blur-sm"
          >
            <p className="text-sm font-bold text-white whitespace-nowrap flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Health Assistant
            </p>
            <p className="text-xs text-white/80">Powered by Gemini AI</p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gradient-to-br from-purple-600 to-blue-600 border-r border-b border-white/20" />
          </motion.div>
        </motion.div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-[440px] h-[650px]"
            style={{ filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))' }}
          >
            <Card className="h-full flex flex-col border-0 overflow-hidden backdrop-blur-xl bg-white/95">
              {/* Header with 3D effect */}
              <CardHeader className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white rounded-t-lg overflow-hidden">
                {/* Animated background */}
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                  className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-indigo-400/20"
                  style={{ backgroundSize: '200% 200%' }}
                />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* 3D Bot Avatar with Custom Design */}
                    <motion.div 
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/20"
                      style={{ transform: 'translateZ(20px)' }}
                    >
                      {/* Pulsing glow */}
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-white/20 rounded-2xl blur-lg"
                      />
                      
                      {/* Custom 3D Bot Icon */}
                      <div className="relative z-10">
                        {/* Bot antenna */}
                        <motion.div
                          animate={{ rotate: [-15, 15, -15] }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                          className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-white/90 rounded-full"
                        >
                          <motion.div 
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/70"
                          />
                        </motion.div>
                        
                        {/* Bot head */}
                        <div className="relative bg-white/30 rounded-xl p-2 backdrop-blur-sm border border-white/40 shadow-inner">
                          {/* Bot eyes */}
                          <div className="flex gap-2 mb-1.5">
                            <motion.div 
                              animate={{ scaleY: [1, 0.1, 1] }}
                              transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
                              className="w-2 h-2 bg-cyan-300 rounded-full shadow-lg shadow-cyan-300/60"
                            />
                            <motion.div 
                              animate={{ scaleY: [1, 0.1, 1] }}
                              transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, delay: 0.15 }}
                              className="w-2 h-2 bg-cyan-300 rounded-full shadow-lg shadow-cyan-300/60"
                            />
                          </div>
                          
                          {/* Bot mouth/speaker */}
                          <div className="flex gap-0.5 justify-center">
                            <motion.div 
                              animate={{ scaleY: [1, 1.5, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                              className="w-0.5 h-1.5 bg-white/70 rounded-full"
                            />
                            <motion.div 
                              animate={{ scaleY: [1, 1.8, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                              className="w-0.5 h-2 bg-white/70 rounded-full"
                            />
                            <motion.div 
                              animate={{ scaleY: [1, 1.5, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              className="w-0.5 h-1.5 bg-white/70 rounded-full"
                            />
                          </div>
                        </div>
                        
                        {/* Online indicator */}
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -right-1 -bottom-1 w-3.5 h-3.5 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full border-2 border-white shadow-lg"
                        />
                      </div>
                    </motion.div>
                    <div>
                      <CardTitle className="text-white text-lg font-bold drop-shadow-md">
                        AI Health Assistant
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="h-2 w-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                          />
                          <span className="text-xs text-blue-100">Online</span>
                        </div>
                        <span className="text-xs text-blue-100">•</span>
                        <span className="text-xs text-blue-100">AI-Powered</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 rounded-xl"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Prescription Type Selector */}
                <div className="relative mt-4 grid grid-cols-3 gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPrescriptionType('allopathy')}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      prescriptionType === 'allopathy'
                        ? 'bg-white text-purple-600 shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <Activity className="h-4 w-4" />
                      <span>Allopathy</span>
                    </div>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPrescriptionType('homeopathy')}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      prescriptionType === 'homeopathy'
                        ? 'bg-white text-purple-600 shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <Flower2 className="h-4 w-4" />
                      <span>Homeopathy</span>
                    </div>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPrescriptionType('ayurveda')}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      prescriptionType === 'ayurveda'
                        ? 'bg-white text-purple-600 shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <Leaf className="h-4 w-4" />
                      <span>Ayurveda</span>
                    </div>
                  </motion.button>
                </div>
              </CardHeader>

              {/* Disclaimer */}
              {showDisclaimer && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200/50"
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-amber-900 leading-relaxed">
                        This chatbot provides general medical guidance. Always consult a licensed doctor before taking any medication.
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDisclaimer(false)}
                      className="h-5 w-5 p-0 text-amber-600 hover:bg-amber-100 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`flex items-start gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {/* Avatar with 3D effect */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`h-10 w-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg relative ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                          : 'bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 text-white'
                      }`}
                      style={{ transform: 'translateZ(10px)' }}
                    >
                      {message.role === 'user' ? (
                        <UserIcon className="h-5 w-5" />
                      ) : (
                        // Custom 3D Bot Icon
                        <div className="relative">
                          {/* Bot antenna */}
                          <motion.div
                            animate={{ rotate: [-10, 10, -10] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-2 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-white/80 rounded-full"
                          >
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-300 rounded-full shadow-sm shadow-yellow-300/70" />
                          </motion.div>
                          
                          {/* Bot head */}
                          <div className="relative bg-white/20 rounded-lg p-1 backdrop-blur-sm border border-white/30">
                            {/* Bot eyes */}
                            <div className="flex gap-1 mb-0.5">
                              <motion.div 
                                animate={{ scaleY: [1, 0.1, 1] }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                                className="w-1 h-1 bg-cyan-300 rounded-full shadow-sm shadow-cyan-300/50"
                              />
                              <motion.div 
                                animate={{ scaleY: [1, 0.1, 1] }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, delay: 0.1 }}
                                className="w-1 h-1 bg-cyan-300 rounded-full shadow-sm shadow-cyan-300/50"
                              />
                            </div>
                            
                            {/* Bot mouth */}
                            <div className="flex gap-0.5 justify-center">
                              <div className="w-0.5 h-0.5 bg-white/60 rounded-full" />
                              <div className="w-0.5 h-1 bg-white/60 rounded-full" />
                              <div className="w-0.5 h-0.5 bg-white/60 rounded-full" />
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>

                    {/* Message bubble with 3D effect */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`flex-1 px-4 py-3 rounded-2xl backdrop-blur-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none shadow-xl'
                          : 'bg-white/80 text-gray-800 rounded-tl-none shadow-lg border border-gray-100'
                      }`}
                      style={{ transform: 'translateZ(5px)' }}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                      <p
                        className={`text-xs mt-1.5 flex items-center gap-1 ${
                          message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        {new Date(message.timestamp).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </motion.div>
                  </motion.div>
                ))}

                {/* Typing Indicator with 3D effect */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-lg relative">
                      {/* Custom 3D Bot Icon */}
                      <div className="relative">
                        {/* Bot antenna */}
                        <motion.div
                          animate={{ rotate: [-10, 10, -10] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute -top-2 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-white/80 rounded-full"
                        >
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-300 rounded-full shadow-sm shadow-yellow-300/70"
                          />
                        </motion.div>
                        
                        {/* Bot head */}
                        <div className="relative bg-white/20 rounded-lg p-1 backdrop-blur-sm border border-white/30">
                          {/* Bot eyes blinking */}
                          <div className="flex gap-1 mb-0.5">
                            <motion.div 
                              animate={{ scaleY: [1, 0.1, 1, 1, 0.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-1 h-1 bg-cyan-300 rounded-full shadow-sm shadow-cyan-300/50"
                            />
                            <motion.div 
                              animate={{ scaleY: [1, 0.1, 1, 1, 0.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: 0.05 }}
                              className="w-1 h-1 bg-cyan-300 rounded-full shadow-sm shadow-cyan-300/50"
                            />
                          </div>
                          
                          {/* Bot mouth animating */}
                          <div className="flex gap-0.5 justify-center">
                            <motion.div 
                              animate={{ scaleY: [1, 1.5, 1] }}
                              transition={{ duration: 0.4, repeat: Infinity }}
                              className="w-0.5 h-0.5 bg-white/60 rounded-full"
                            />
                            <motion.div 
                              animate={{ scaleY: [1, 1.8, 1] }}
                              transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
                              className="w-0.5 h-1 bg-white/60 rounded-full"
                            />
                            <motion.div 
                              animate={{ scaleY: [1, 1.5, 1] }}
                              transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }}
                              className="w-0.5 h-0.5 bg-white/60 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm px-5 py-4 rounded-2xl rounded-tl-none shadow-lg border border-gray-100">
                      <div className="flex gap-1.5">
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="h-2.5 w-2.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                          className="h-2.5 w-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                          className="h-2.5 w-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Prescriptions with enhanced 3D design */}
                {prescriptions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-5 rounded-2xl border border-green-200/50 shadow-xl overflow-hidden"
                    style={{ transform: 'translateZ(15px)' }}
                  >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200/30 rounded-full blur-2xl" />
                    
                    <div className="relative flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        >
                          <Pill className="h-6 w-6 text-green-600" />
                        </motion.div>
                        <h4 className="font-bold text-gray-900 text-lg">
                          {prescriptionType === 'homeopathy' ? 'Homeopathic' : prescriptionType === 'ayurveda' ? 'Ayurvedic & Home' : 'Allopathic'} Remedies
                        </h4>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDownloadPrescription}
                        className="text-xs bg-white/80 backdrop-blur-sm hover:bg-white shadow-md border-green-200"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                    </div>

                    <div className="relative space-y-3">
                      {prescriptions.map((prescription, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-all"
                        >
                          <p className="font-bold text-gray-900 text-base mb-2 flex items-center gap-2">
                            <span className="h-2 w-2 bg-green-500 rounded-full" />
                            {prescription.medicine}
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div className="flex items-start gap-1">
                              <span className="font-semibold text-gray-700">Dosage:</span>
                              <span>{prescription.dosage}</span>
                            </div>
                            <div className="flex items-start gap-1">
                              <span className="font-semibold text-gray-700">Frequency:</span>
                              <span>{prescription.frequency}</span>
                            </div>
                            <div className="flex items-start gap-1 col-span-2">
                              <span className="font-semibold text-gray-700">Duration:</span>
                              <span>{prescription.duration}</span>
                            </div>
                            <div className="flex items-start gap-1 col-span-2">
                              <span className="font-semibold text-gray-700">Purpose:</span>
                              <span className="text-gray-500">{prescription.purpose}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <Badge variant="outline" className="mt-4 bg-white/80 backdrop-blur-sm shadow-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending doctor review
                    </Badge>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input with 3D effect */}
              <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-200/50 backdrop-blur-sm">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Describe your symptoms..."
                    className="flex-1 rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 shadow-sm"
                    disabled={isTyping}
                  />
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                      onClick={handleSendMessage}
                      disabled={isTyping || !inputMessage.trim()}
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by Gemini AI • {prescriptionType === 'homeopathy' ? 'Homeopathy' : prescriptionType === 'ayurveda' ? 'Ayurveda' : 'Allopathy'} Mode
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedHealthChatbot;
