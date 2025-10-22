import { Request, Response } from 'express';
import Payment from '../models/Payment';
import Booking from '../models/Booking';
import Appointment from '../models/Appointment';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  createRefund,
} from '../services/razorpayService';

// Create payment order
export const createPaymentOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookingId, appointmentId, amount, description } = req.body;

    if (!bookingId && !appointmentId) {
      throw new AppError('Either bookingId or appointmentId is required', 400);
    }

    // Verify booking or appointment exists
    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }
      if (booking.patientId.toString() !== req.user!._id.toString()) {
        throw new AppError('Not authorized', 403);
      }
    }

    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        throw new AppError('Appointment not found', 404);
      }
      if (appointment.patientId.toString() !== req.user!._id.toString()) {
        throw new AppError('Not authorized', 403);
      }
    }

    // Create Razorpay order
    const receiptId = `${bookingId || appointmentId}_${Date.now()}`;
    const razorpayOrder = await createRazorpayOrder({
      amount: Math.round(amount * 100), // Convert to paise
      receipt: receiptId,
      notes: {
        bookingId,
        appointmentId,
        userId: req.user!._id.toString(),
      },
    });

    // Create payment record
    const payment = await Payment.create({
      userId: req.user!._id,
      bookingId,
      appointmentId,
      amount,
      razorpayOrderId: razorpayOrder.orderId,
      description,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      data: {
        paymentId: payment._id,
        orderId: razorpayOrder.orderId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      },
      message: 'Payment order created successfully',
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('Payment order creation error:', error);
    throw new AppError(error.message || 'Failed to create payment order', 500);
  }
};

// Verify payment
export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      paymentId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    // Find payment record
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new AppError('Payment record not found', 404);
    }

    if (payment.userId.toString() !== req.user!._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      payment.status = 'failed';
      await payment.save();
      throw new AppError('Payment verification failed', 400);
    }

    // Update payment record
    payment.status = 'success';
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.transactionId = razorpayPaymentId;
    await payment.save();

    // Update booking or appointment payment status
    if (payment.bookingId) {
      await Booking.findByIdAndUpdate(payment.bookingId, {
        paymentStatus: 'paid',
      });
    }

    if (payment.appointmentId) {
      await Appointment.findByIdAndUpdate(payment.appointmentId, {
        paymentId: payment._id,
        paymentStatus: 'paid',
      });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: payment,
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('Payment verification error:', error);
    throw new AppError(error.message || 'Payment verification failed', 500);
  }
};

// Get user's payment history
export const getMyPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const query: any = { userId: req.user!._id };

    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('bookingId', 'hospitalId roomType patientName createdAt')
      .populate('appointmentId', 'doctorId appointmentDate appointmentTime')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: payments,
      count: payments.length,
    });
  } catch (error: any) {
    console.error('Fetch my payments error:', error);
    throw new AppError(error.message || 'Failed to fetch payments', 500);
  }
};

// Get payment by ID
export const getPaymentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate('bookingId')
      .populate('appointmentId');

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    if (payment.userId.toString() !== req.user!._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('Fetch payment error:', error);
    throw new AppError(error.message || 'Failed to fetch payment', 500);
  }
};

// Request refund
export const requestRefund = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findById(id);

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    if (payment.userId.toString() !== req.user!._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    if (payment.status === 'refunded') {
      throw new AppError('Payment already refunded', 400);
    }

    if (payment.status !== 'success') {
      throw new AppError('Only successful payments can be refunded', 400);
    }

    // Create refund with Razorpay
    const refund = await createRefund(payment.razorpayPaymentId!);

    // Update payment status
    payment.status = 'refunded';
    payment.metadata = {
      ...payment.metadata,
      refundId: refund.refundId,
      refundReason: reason,
      refundedAt: new Date(),
    };
    await payment.save();

    // Update booking/appointment status
    if (payment.bookingId) {
      await Booking.findByIdAndUpdate(payment.bookingId, {
        status: 'cancelled',
        paymentStatus: 'refunded',
      });
    }

    if (payment.appointmentId) {
      await Appointment.findByIdAndUpdate(payment.appointmentId, {
        status: 'cancelled',
        paymentStatus: 'refunded',
      });
    }

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundId: refund.refundId,
        amount: refund.amount,
      },
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('Refund processing error:', error);
    throw new AppError(error.message || 'Failed to process refund', 500);
  }
};

// Admin: Get all payments
export const getAllPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, startDate, endDate } = req.query;
    const query: any = {};

    if (status) query.status = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const payments = await Payment.find(query)
      .populate('userId', 'name email phone')
      .populate('bookingId', 'hospitalId roomType')
      .populate('appointmentId', 'doctorId appointmentDate')
      .sort({ createdAt: -1 });

    const totalAmount = payments
      .filter(p => p.status === 'success')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      success: true,
      data: payments,
      count: payments.length,
      totalAmount,
    });
  } catch (error: any) {
    console.error('Fetch all payments error:', error);
    throw new AppError(error.message || 'Failed to fetch payments', 500);
  }
};

// Get payment statistics
export const getPaymentStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const matchQuery: any = {};

    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const stats = await Payment.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const total = await Payment.countDocuments(matchQuery);

    res.json({
      success: true,
      data: {
        total,
        byStatus: stats,
      },
    });
  } catch (error: any) {
    console.error('Payment statistics error:', error);
    throw new AppError(error.message || 'Failed to fetch payment statistics', 500);
  }
};
