import mongoose, { Document, Schema } from 'mongoose';

export interface IHospital extends Document {
  name: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  description?: string;
  facilities: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  location?: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  opdAvailable: boolean;
  emergencyAvailable: boolean;
  lastUpdated: Date;
  createdAt: Date;
}

const hospitalSchema = new Schema<IHospital>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
    },
    facilities: [{
      type: String,
    }],
    coordinates: {
      lat: Number,
      lng: Number,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        // default: 'Point', // Removed to prevent incomplete GeoJSON object creation
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere',
      },
    },
    opdAvailable: {
      type: Boolean,
      default: true,
    },
    emergencyAvailable: {
      type: Boolean,
      default: true,
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

// Index for geospatial queries
hospitalSchema.index({ location: '2dsphere' });
hospitalSchema.index({ city: 1 });

export default mongoose.model<IHospital>('Hospital', hospitalSchema);
