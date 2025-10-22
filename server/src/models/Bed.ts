import mongoose, { Document, Schema } from 'mongoose';

export type RoomType = 'General' | 'ICU' | 'Private';

export interface IBed extends Document {
  _id: mongoose.Types.ObjectId;
  hospitalId: mongoose.Types.ObjectId;
  roomType: RoomType;
  bedNumber: string;
  floor?: number;
  isOccupied: boolean;
  patientId?: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  price: number;
  lastUpdated: Date;
  createdAt: Date;
}

const bedSchema = new Schema<IBed>(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    roomType: {
      type: String,
      enum: ['General', 'ICU', 'Private'],
      required: true,
    },
    bedNumber: {
      type: String,
      required: true,
    },
    floor: {
      type: Number,
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
bedSchema.index({ hospitalId: 1, roomType: 1, isOccupied: 1 });

export default mongoose.model<IBed>('Bed', bedSchema);
