import mongoose, { Document, Schema } from 'mongoose';

export type BookingStatus = 'provisional' | 'confirmed' | 'admitted' | 'cancelled' | 'expired';

export interface IBooking extends Document {
  hospitalId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  bedId?: mongoose.Types.ObjectId;
  roomType: string;
  status: BookingStatus;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  medicalCondition?: string;
  provisionalExpiry?: Date;
  admittedAt?: Date;
  dischargedAt?: Date;
  totalAmount?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bedId: {
      type: Schema.Types.ObjectId,
      ref: 'Bed',
    },
    roomType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['provisional', 'confirmed', 'admitted', 'cancelled', 'expired'],
      default: 'provisional',
    },
    patientName: {
      type: String,
      required: true,
    },
    patientPhone: {
      type: String,
      required: true,
    },
    patientAge: {
      type: Number,
    },
    medicalCondition: {
      type: String,
    },
    provisionalExpiry: {
      type: Date,
    },
    admittedAt: {
      type: Date,
    },
    dischargedAt: {
      type: Date,
    },
    totalAmount: {
      type: Number,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ hospitalId: 1, status: 1 });
bookingSchema.index({ patientId: 1, status: 1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);
