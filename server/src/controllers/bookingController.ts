import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Bed from '../models/Bed';
import Hospital from '../models/Hospital';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createProvisionalBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { hospitalId, roomType, patientName, patientPhone, patientAge, medicalCondition } = req.body;

    // Check bed availability
    const availableBed = await Bed.findOne({
      hospitalId,
      roomType,
      isOccupied: false,
    });

    if (!availableBed) {
      throw new AppError('No beds available for this room type', 400);
    }

    // Create provisional booking (expires in 15 minutes)
    const provisionalExpiry = new Date(Date.now() + 15 * 60 * 1000);

    const booking = await Booking.create({
      hospitalId,
      patientId: req.user!._id,
      roomType,
      status: 'provisional',
      patientName,
      patientPhone,
      patientAge,
      medicalCondition,
      provisionalExpiry,
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Provisional booking created. Please confirm within 15 minutes.',
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('Provisional booking creation error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      throw new AppError(`Validation failed: ${errors.join(', ')}`, 400);
    }
    
    throw new AppError(error.message || 'Failed to create provisional booking', 500);
  }
};

export const confirmBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (booking.status !== 'provisional') {
      throw new AppError('Booking is not in provisional state', 400);
    }

    if (booking.provisionalExpiry && booking.provisionalExpiry < new Date()) {
      booking.status = 'expired';
      await booking.save();
      throw new AppError('Booking has expired', 400);
    }

    // Find and allocate bed (no Redis locking)
    const bed = await Bed.findOneAndUpdate(
      {
        hospitalId: booking.hospitalId,
        roomType: booking.roomType,
        isOccupied: false,
      },
      {
        isOccupied: true,
        patientId: booking.patientId,
        bookingId: booking._id,
        lastUpdated: new Date(),
      },
      { new: true }
    );

    if (!bed) {
      throw new AppError('No beds available', 400);
    }

    booking.status = 'confirmed';
    booking.bedId = bed._id as any;
    await booking.save();

    // Update hospital lastUpdated
    await Hospital.findByIdAndUpdate(booking.hospitalId, {
      lastUpdated: new Date(),
    });

    res.json({
      success: true,
      data: booking,
      message: 'Booking confirmed successfully',
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('Booking confirmation error:', error);
    throw new AppError(error.message || 'Failed to confirm booking', 500);
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find({ patientId: req.user!._id })
      .populate('hospitalId', 'name city address')
      .populate('bedId', 'bedNumber roomType')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    console.error('Fetch bookings error:', error);
    throw new AppError(error.message || 'Failed to fetch bookings', 500);
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (booking.patientId.toString() !== req.user!._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    if (booking.status === 'admitted') {
      throw new AppError('Cannot cancel an admitted booking', 400);
    }

    booking.status = 'cancelled';
    await booking.save();

    if (booking.bedId) {
      await Bed.findByIdAndUpdate(booking.bedId, {
        isOccupied: false,
        patientId: null,
        bookingId: null,
        lastUpdated: new Date(),
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    console.error('Booking cancellation error:', error);
    throw new AppError(error.message || 'Failed to cancel booking', 500);
  }
};

// Admin: Get all bookings
export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, hospitalId } = req.query;
    const query: any = {};
    
    if (status) query.status = status;
    if (hospitalId) query.hospitalId = hospitalId;

    const bookings = await Booking.find(query)
      .populate('hospitalId', 'name city address phone')
      .populate('bedId', 'bedNumber roomType')
      .populate('patientId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
      count: bookings.length,
    });
  } catch (error: any) {
    console.error('Fetch all bookings error:', error);
    throw new AppError(error.message || 'Failed to fetch all bookings', 500);
  }
};
