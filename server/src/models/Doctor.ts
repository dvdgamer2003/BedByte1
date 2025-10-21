import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience: number;
  hospitalId: mongoose.Types.ObjectId;
  consultationFee: number;
  availability: {
    day: string;
    slots: string[];
  }[];
  profileImage?: string;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  isApproved: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
      enum: [
        'General Medicine',
        'Cardiology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'Gynecology',
        'Dermatology',
        'ENT',
        'Ophthalmology',
        'Psychiatry',
        'Emergency Medicine',
      ],
    },
    qualification: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
    availability: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        slots: [String],
      },
    ],
    profileImage: String,
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDoctor>('Doctor', DoctorSchema);
