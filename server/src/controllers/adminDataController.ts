import { Response } from 'express';
import User from '../models/User';
import Doctor from '../models/Doctor';
import Hospital from '../models/Hospital';
import Booking from '../models/Booking';
import Appointment from '../models/Appointment';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Get all users (all roles)
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find()
      .populate('hospitalId', 'name city')
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    throw new AppError('Failed to fetch users', 500);
  }
};

// Create a new user (any role)
export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, role, hospitalId } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'patient',
      hospitalId: hospitalId || undefined,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error: any) {
    console.error('Create user error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || 'Failed to create user', 500);
  }
};

// Update a user (any role)
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, hospitalId, isApproved, approvalStatus } = req.body;

    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if email is being changed and already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError('Email already registered', 400);
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    if (role) user.role = role;
    if (hospitalId !== undefined) user.hospitalId = hospitalId || undefined;
    if (isApproved !== undefined) user.isApproved = isApproved;
    if (approvalStatus) user.approvalStatus = approvalStatus;
    
    await user.save();

    const updatedUser = await User.findById(id).populate('hospitalId', 'name city').select('-password');

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update user', 500);
  }
};

// Delete a user (any role)
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Prevent deleting admin accounts for safety
    if (user.role === 'admin') {
      throw new AppError('Cannot delete admin accounts', 403);
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to delete user', 500);
  }
};

// Get all patients (users with role 'patient')
export const getAllPatients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patients = await User.find({ role: 'patient' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error: any) {
    console.error('Get patients error:', error);
    throw new AppError('Failed to fetch patients', 500);
  }
};

// Get all doctors
export const getAllDoctors = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctors = await Doctor.find()
      .populate('hospitalId', 'name city')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error: any) {
    console.error('Get doctors error:', error);
    throw new AppError('Failed to fetch doctors', 500);
  }
};

// Get all hospitals
export const getAllHospitals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const hospitals = await Hospital.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: hospitals.length,
      data: hospitals,
    });
  } catch (error: any) {
    console.error('Get hospitals error:', error);
    throw new AppError('Failed to fetch hospitals', 500);
  }
};

// Delete a patient
export const deletePatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const patient = await User.findOne({ _id: id, role: 'patient' });
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    // Delete associated bookings and appointments
    await Booking.deleteMany({ userId: id });
    await Appointment.deleteMany({ userId: id });

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Patient and associated data deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete patient error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to delete patient', 500);
  }
};

// Delete a doctor
export const deleteDoctor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    // Delete associated appointments
    await Appointment.deleteMany({ doctorId: id });

    await Doctor.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Doctor and associated appointments deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete doctor error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to delete doctor', 500);
  }
};

// Delete a hospital
export const deleteHospital = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const hospital = await Hospital.findById(id);
    if (!hospital) {
      throw new AppError('Hospital not found', 404);
    }

    // Delete associated doctors, bookings, and appointments
    await Doctor.deleteMany({ hospitalId: id });
    await Booking.deleteMany({ hospitalId: id });
    await Appointment.deleteMany({ hospitalId: id });

    await Hospital.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Hospital and all associated data deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete hospital error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to delete hospital', 500);
  }
};

// Create a new patient
export const createPatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const patient = await User.create({
      name,
      email,
      password,
      phone,
      role: 'patient',
    });

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: {
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        createdAt: patient.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Create patient error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || 'Failed to create patient', 500);
  }
};

// Update a patient
export const updatePatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const patient = await User.findOne({ _id: id, role: 'patient' });
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    // Check if email is being changed and already exists
    if (email && email !== patient.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError('Email already registered', 400);
      }
    }

    patient.name = name || patient.name;
    patient.email = email || patient.email;
    patient.phone = phone || patient.phone;
    await patient.save();

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: {
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        createdAt: patient.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Update patient error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update patient', 500);
  }
};

// Create a new doctor
export const createDoctor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      hospitalId,
      consultationFee,
      availability,
    } = req.body;

    // Check if email already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      throw new AppError('Email already registered', 400);
    }

    const doctor = await Doctor.create({
      name,
      email,
      phone,
      specialization,
      qualification,
      experience,
      hospitalId,
      consultationFee,
      availability: availability || [],
      isActive: true,
    });

    const populatedDoctor = await Doctor.findById(doctor._id).populate(
      'hospitalId',
      'name city'
    );

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: populatedDoctor,
    });
  } catch (error: any) {
    console.error('Create doctor error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || 'Failed to create doctor', 500);
  }
};

// Update a doctor
export const updateDoctor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if email is being changed and already exists
    if (updateData.email) {
      const existingDoctor = await Doctor.findOne({
        email: updateData.email,
        _id: { $ne: id },
      });
      if (existingDoctor) {
        throw new AppError('Email already registered', 400);
      }
    }

    const doctor = await Doctor.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('hospitalId', 'name city');

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    res.json({
      success: true,
      message: 'Doctor updated successfully',
      data: doctor,
    });
  } catch (error: any) {
    console.error('Update doctor error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update doctor', 500);
  }
};

// Create a new hospital
export const createHospital = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      city,
      address,
      phone,
      email,
      description,
      facilities,
      opdAvailable,
      emergencyAvailable,
      coordinates,
    } = req.body;

    const hospitalData: any = {
      name,
      city,
      address,
      phone,
      email,
      description,
      facilities: facilities || [],
      opdAvailable: opdAvailable !== undefined ? opdAvailable : true,
      emergencyAvailable: emergencyAvailable !== undefined ? emergencyAvailable : true,
    };

    // Add coordinates if provided
    if (coordinates && coordinates.lat && coordinates.lng) {
      hospitalData.coordinates = coordinates;
      hospitalData.location = {
        type: 'Point',
        coordinates: [coordinates.lng, coordinates.lat],
      };
    }

    const hospital = await Hospital.create(hospitalData);

    res.status(201).json({
      success: true,
      message: 'Hospital created successfully',
      data: hospital,
    });
  } catch (error: any) {
    console.error('Create hospital error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || 'Failed to create hospital', 500);
  }
};

// Update a hospital
export const updateHospital = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle coordinates update
    if (updateData.coordinates && updateData.coordinates.lat && updateData.coordinates.lng) {
      updateData.location = {
        type: 'Point',
        coordinates: [updateData.coordinates.lng, updateData.coordinates.lat],
      };
    }

    const hospital = await Hospital.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!hospital) {
      throw new AppError('Hospital not found', 404);
    }

    res.json({
      success: true,
      message: 'Hospital updated successfully',
      data: hospital,
    });
  } catch (error: any) {
    console.error('Update hospital error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update hospital', 500);
  }
};

// Get statistics
export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [patientsCount, doctorsCount, hospitalsCount] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      Doctor.countDocuments(),
      Hospital.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        patients: patientsCount,
        doctors: doctorsCount,
        hospitals: hospitalsCount,
      },
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    throw new AppError('Failed to fetch statistics', 500);
  }
};
