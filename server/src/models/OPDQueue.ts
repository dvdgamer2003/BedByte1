import mongoose, { Document, Schema } from 'mongoose';

export type QueueStatus = 'waiting' | 'in_consultation' | 'completed' | 'cancelled';

export interface IOPDQueue extends Document {
  hospitalId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  patientName: string;
  patientPhone: string;
  tokenNumber: number;
  department?: string;
  status: QueueStatus;
  priority?: number;
  estimatedWaitTime?: number;
  checkedInAt: Date;
  consultationStartedAt?: Date;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
}

const opdQueueSchema = new Schema<IOPDQueue>(
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
    patientName: {
      type: String,
      required: true,
    },
    patientPhone: {
      type: String,
      required: true,
    },
    tokenNumber: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      default: 'General',
    },
    status: {
      type: String,
      enum: ['waiting', 'in_consultation', 'completed', 'cancelled'],
      default: 'waiting',
    },
    priority: {
      type: Number,
      default: 0,
    },
    estimatedWaitTime: {
      type: Number,
    },
    checkedInAt: {
      type: Date,
      default: Date.now,
    },
    consultationStartedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

opdQueueSchema.index({ hospitalId: 1, status: 1, tokenNumber: 1 });

export default mongoose.model<IOPDQueue>('OPDQueue', opdQueueSchema);
