// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import { initializeSocket } from './sockets';

// Import routes
import authRoutes from './routes/authRoutes';
import hospitalRoutes from './routes/hospitalRoutes';
import bookingRoutes from './routes/bookingRoutes';
import opdRoutes from './routes/opdRoutes';
import bedRoutes from './routes/bedRoutes';
import doctorRoutes from './routes/doctorRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import emergencyRoutes from './routes/emergencyRoutes';
import paymentRoutes from './routes/paymentRoutes';
import locationRoutes from './routes/locationRoutes';
import chatbotRoutes from './routes/chatbotRoutes';
import adminDataRoutes from './routes/adminDataRoutes';
import approvalRoutes from './routes/approvalRoutes';

const app: Express = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
const io = initializeSocket(httpServer);

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:62376', 'http://127.0.0.1:62376'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Make io accessible in controllers
app.set('io', io);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/opd', opdRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/emergency-booking', emergencyRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/admin-data', adminDataRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api', locationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📡 Socket.io initialized`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process - keep server running
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('🚨 Uncaught Exception:', error);
  // Don't exit the process - keep server running
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

startServer();

export { app, io };
