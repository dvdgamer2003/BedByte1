import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  _id: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  hospitalId: mongoose.Types.ObjectId;
  appointmentDate: Date;
  appointmentTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: 'consultation' | 'follow-up' | 'emergency';
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  consultationFee: number;
  paymentId?: mongoose.Types.ObjectId;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    type: {
      type: String,
      enum: ['consultation', 'follow-up', 'emergency'],
      default: 'consultation',
    },
    symptoms: String,
    diagnosis: String,
    prescription: String,
    notes: String,
    consultationFee: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
AppointmentSchema.index({ patientId: 1, appointmentDate: -1 });
AppointmentSchema.index({ doctorId: 1, appointmentDate: 1 });

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
