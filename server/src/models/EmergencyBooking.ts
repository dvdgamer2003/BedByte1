import mongoose, { Document, Schema } from 'mongoose';

export interface IEmergencyBooking extends Document {
  bookingId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  hospitalId: mongoose.Types.ObjectId;
  priority: 'critical' | 'high' | 'medium';
  emergencyType: string;
  symptoms: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    oxygenLevel?: number;
  };
  status: 'pending' | 'assigned' | 'admitted' | 'treated' | 'discharged';
  assignedBedId?: mongoose.Types.ObjectId;
  responseTime?: number; // in minutes
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmergencyBookingSchema = new Schema<IEmergencyBooking>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium'],
      required: true,
    },
    emergencyType: {
      type: String,
      required: true,
      enum: [
        'Cardiac Arrest',
        'Stroke',
        'Severe Trauma',
        'Respiratory Distress',
        'Severe Bleeding',
        'Poisoning',
        'Burns',
        'Seizures',
        'Other Emergency',
      ],
    },
    symptoms: {
      type: String,
      required: true,
    },
    vitalSigns: {
      bloodPressure: String,
      heartRate: Number,
      temperature: Number,
      oxygenLevel: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'admitted', 'treated', 'discharged'],
      default: 'pending',
    },
    assignedBedId: {
      type: Schema.Types.ObjectId,
      ref: 'Bed',
    },
    responseTime: Number,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Index for priority queuing
EmergencyBookingSchema.index({ priority: -1, createdAt: 1 });
EmergencyBookingSchema.index({ hospitalId: 1, status: 1 });

export default mongoose.model<IEmergencyBooking>('EmergencyBooking', EmergencyBookingSchema);
