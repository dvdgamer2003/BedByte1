import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicine {
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  quantity?: number;
}

export interface IMedicalStore extends Document {
  name: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  ownerName?: string;
  licenseNumber?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  medicines: IMedicine[];
  is24x7: boolean;
  homeDelivery: boolean;
  rating?: number;
  lastUpdated: Date;
  createdAt: Date;
}

const medicineSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: [
      'Pain Relief',
      'Antibiotics',
      'Vitamins',
      'Cold & Flu',
      'Diabetes',
      'Blood Pressure',
      'Heart',
      'Stomach',
      'Skin Care',
      'First Aid',
      'Other',
    ],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

const medicalStoreSchema = new Schema<IMedicalStore>(
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
    ownerName: {
      type: String,
      trim: true,
    },
    licenseNumber: {
      type: String,
      trim: true,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        index: '2dsphere',
      },
    },
    medicines: [medicineSchema],
    is24x7: {
      type: Boolean,
      default: false,
    },
    homeDelivery: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
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

// Index for geospatial queries
medicalStoreSchema.index({ location: '2dsphere' });
medicalStoreSchema.index({ city: 1 });
medicalStoreSchema.index({ 'medicines.name': 'text' });

export default mongoose.model<IMedicalStore>('MedicalStore', medicalStoreSchema);
