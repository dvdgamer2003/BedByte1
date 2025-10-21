import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  appointmentId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  paymentMethod: 'razorpay' | 'card' | 'upi' | 'netbanking' | 'wallet';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  transactionId?: string;
  description: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'card', 'upi', 'netbanking', 'wallet'],
      default: 'razorpay',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    transactionId: String,
    description: {
      type: String,
      required: true,
    },
    metadata: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
PaymentSchema.index({ userId: 1, createdAt: -1 });
PaymentSchema.index({ razorpayOrderId: 1 });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
