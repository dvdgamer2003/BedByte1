import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface IPrescriptionItem {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  purpose: string;
  timestamp: Date;
  approvedByDoctor: boolean;
  doctorId?: mongoose.Types.ObjectId;
  doctorNotes?: string;
}

export interface IChatHistory extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId: string;
  messages: IMessage[];
  prescriptions: IPrescriptionItem[];
  symptoms: string[];
  diagnosis?: string;
  severity?: 'low' | 'medium' | 'high' | 'emergency';
  requiresDoctorReview: boolean;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  status: 'active' | 'completed' | 'reviewed';
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'bot'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const PrescriptionItemSchema = new Schema<IPrescriptionItem>({
  medicine: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  approvedByDoctor: {
    type: Boolean,
    default: false,
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  doctorNotes: String,
}, { _id: false });

const ChatHistorySchema = new Schema<IChatHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    messages: [MessageSchema],
    prescriptions: [PrescriptionItemSchema],
    symptoms: [String],
    diagnosis: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency'],
    },
    requiresDoctorReview: {
      type: Boolean,
      default: false,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    reviewedAt: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'reviewed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
ChatHistorySchema.index({ userId: 1, createdAt: -1 });
ChatHistorySchema.index({ sessionId: 1 });
ChatHistorySchema.index({ status: 1, requiresDoctorReview: 1 });

export default mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);
