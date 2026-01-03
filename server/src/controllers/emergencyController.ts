import { Request, Response } from 'express';
import EmergencyBooking from '../models/EmergencyBooking';
import Booking from '../models/Booking';
import Bed from '../models/Bed';
import Hospital from '../models/Hospital';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Create emergency booking
export const createEmergencyBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      hospitalId,
      roomType,
      priority,
      emergencyType,
      symptoms,
      vitalSigns,
      patientName,
      patientPhone,
      patientAge,
    } = req.body;

    // Find available bed with emergency priority
    const availableBed = await Bed.findOne({
      hospitalId,
      roomType,
      isOccupied: false,
    }).sort({ bedNumber: 1 });

    if (!availableBed) {
      throw new AppError('No beds available for emergency admission', 503);
    }

    // Create regular booking first
    const booking = await Booking.create({
      hospitalId,
      patientId: req.user!._id,
      roomType,
      status: 'confirmed', // Emergency bookings are auto-confirmed
      patientName,
      patientPhone,
      patientAge,
      medicalCondition: `EMERGENCY: ${emergencyType} - ${symptoms}`,
    });

    // Allocate bed immediately
    availableBed.isOccupied = true;
    availableBed.patientId = req.user!._id;
    availableBed.bookingId = booking._id;
    availableBed.lastUpdated = new Date();
    await availableBed.save();

    booking.status = 'admitted';
    booking.bedId = availableBed._id as any;
    await booking.save();

    // Create emergency booking record
    const emergencyBooking = await EmergencyBooking.create({
      bookingId: booking._id,
      patientId: req.user!._id,
      hospitalId,
      priority,
      emergencyType,
      symptoms,
      vitalSigns,
      status: 'admitted',
      assignedBedId: availableBed._id,
      responseTime: 0, // Immediate response
    });

    // Update hospital lastUpdated
    await Hospital.findByIdAndUpdate(hospitalId, {
      lastUpdated: new Date(),
    });

    const populatedEmergency = await EmergencyBooking.findById(emergencyBooking._id)
      .populate('hospitalId', 'name city address phone')
      .populate('assignedBedId', 'bedNumber roomType floor');

    res.status(201).json({
      success: true,
      data: populatedEmergency,
      message: 'Emergency booking created and bed assigned immediately',
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to create emergency booking', 500);
  }
};

// Get emergency bookings (with priority sorting)
export const getEmergencyBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hospitalId, status, priority } = req.query;
    const query: any = {};

    if (hospitalId) query.hospitalId = hospitalId;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const emergencyBookings = await EmergencyBooking.find(query)
      .populate('patientId', 'name email phone')
      .populate('hospitalId', 'name city address phone')
      .populate('assignedBedId', 'bedNumber roomType floor')
      .sort({ priority: -1, createdAt: 1 }); // Critical first, then by time

    res.json({
      success: true,
      data: emergencyBookings,
      count: emergencyBookings.length,
    });
  } catch (error) {
    throw new AppError('Failed to fetch emergency bookings', 500);
  }
};

// Get user's emergency bookings
export const getMyEmergencyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const emergencyBookings = await EmergencyBooking.find({ patientId: req.user!._id })
      .populate('hospitalId', 'name city address phone')
      .populate('assignedBedId', 'bedNumber roomType')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: emergencyBookings,
    });
  } catch (error) {
    throw new AppError('Failed to fetch emergency bookings', 500);
  }
};

// Get emergency booking by ID
export const getEmergencyBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const emergencyBooking = await EmergencyBooking.findById(id)
      .populate('patientId', 'name email phone')
      .populate('hospitalId', 'name city address phone email')
      .populate('assignedBedId', 'bedNumber roomType floor')
      .populate('bookingId');

    if (!emergencyBooking) {
      throw new AppError('Emergency booking not found', 404);
    }

    res.json({
      success: true,
      data: emergencyBooking,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch emergency booking', 500);
  }
};

// Update emergency booking status
export const updateEmergencyStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const emergencyBooking = await EmergencyBooking.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true }
    );

    if (!emergencyBooking) {
      throw new AppError('Emergency booking not found', 404);
    }

    // If discharged, free the bed
    if (status === 'discharged' && emergencyBooking.assignedBedId) {
      await Bed.findByIdAndUpdate(emergencyBooking.assignedBedId, {
        isOccupied: false,
        patientId: null,
        bookingId: null,
        lastUpdated: new Date(),
      });
    }

    res.json({
      success: true,
      data: emergencyBooking,
      message: 'Emergency booking status updated',
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update emergency booking', 500);
  }
};

// Get emergency statistics
export const getEmergencyStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hospitalId } = req.query;
    const matchQuery: any = {};
    if (hospitalId) matchQuery.hospitalId = hospitalId;

    const stats = await EmergencyBooking.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            priority: '$priority',
            status: '$status',
          },
          count: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' },
        },
      },
    ]);

    const total = await EmergencyBooking.countDocuments(matchQuery);
    const critical = await EmergencyBooking.countDocuments({
      ...matchQuery,
      priority: 'critical',
      status: { $in: ['pending', 'assigned', 'admitted'] },
    });

    res.json({
      success: true,
      data: {
        total,
        activeCritical: critical,
        breakdown: stats,
      },
    });
  } catch (error) {
    throw new AppError('Failed to fetch emergency statistics', 500);
  }
};

// Check emergency bed availability
export const checkEmergencyAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hospitalId } = req.query;

    if (!hospitalId) {
      throw new AppError('Hospital ID is required', 400);
    }

    // Get available beds for emergency (all room types)
    const availableBeds = await Bed.aggregate([
      {
        $match: {
          hospitalId: hospitalId,
          isOccupied: false,
        },
      },
      {
        $group: {
          _id: '$roomType',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = availableBeds.reduce((sum, bed) => sum + bed.count, 0);

    res.json({
      success: true,
      data: {
        hasAvailability: total > 0,
        totalAvailable: total,
        byRoomType: availableBeds,
      },
    });
  } catch (error) {
    throw new AppError('Failed to check emergency availability', 500);
  }
};
