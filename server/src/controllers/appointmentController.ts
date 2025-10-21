import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import Doctor from '../models/Doctor';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Book appointment
export const bookAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      doctorId,
      hospitalId,
      appointmentDate,
      appointmentTime,
      type,
      symptoms,
    } = req.body;

    // Verify doctor exists and is active
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      throw new AppError('Doctor not found or inactive', 404);
    }

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['scheduled', 'completed'] },
    });

    if (existingAppointment) {
      throw new AppError('This time slot is already booked', 400);
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId: req.user!._id,
      doctorId,
      hospitalId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      type: type || 'consultation',
      symptoms,
      consultationFee: doctor.consultationFee,
      paymentStatus: 'pending',
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctorId', 'name specialization consultationFee')
      .populate('hospitalId', 'name city address phone');

    res.status(201).json({
      success: true,
      data: populatedAppointment,
      message: 'Appointment booked successfully. Please complete the payment.',
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to book appointment', 500);
  }
};

// Get user's appointments
export const getMyAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const query: any = { patientId: req.user!._id };

    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'name specialization profileImage rating')
      .populate('hospitalId', 'name city address phone')
      .sort({ appointmentDate: -1, appointmentTime: -1 });

    res.json({
      success: true,
      data: appointments,
      count: appointments.length,
    });
  } catch (error) {
    throw new AppError('Failed to fetch appointments', 500);
  }
};

// Get appointment by ID
export const getAppointmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate('doctorId', 'name specialization qualification experience profileImage rating')
      .populate('hospitalId', 'name city address phone email')
      .populate('patientId', 'name email phone');

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    // Check if user owns this appointment
    const patientId = typeof appointment.patientId === 'object' && '_id' in appointment.patientId 
      ? (appointment.patientId as any)._id 
      : appointment.patientId;
    if ((patientId as any).toString() !== String(req.user!._id)) {
      throw new AppError('Not authorized', 403);
    }

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch appointment', 500);
  }
};

// Cancel appointment
export const cancelAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    if ((appointment.patientId as any).toString() !== String(req.user!._id)) {
      throw new AppError('Not authorized', 403);
    }

    if (appointment.status === 'completed') {
      throw new AppError('Cannot cancel completed appointment', 400);
    }

    if (appointment.status === 'cancelled') {
      throw new AppError('Appointment already cancelled', 400);
    }

    // Check if appointment is within 24 hours
    const appointmentDateTime = new Date(appointment.appointmentDate);
    const now = new Date();
    const hoursDiff = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      throw new AppError('Cannot cancel appointment within 24 hours', 400);
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to cancel appointment', 500);
  }
};

// Admin/Doctor: Get appointments by doctor
export const getDoctorAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { doctorId } = req.params;
    const { date, status } = req.query;

    const query: any = { doctorId };

    if (status) query.status = status;
    if (date) {
      const selectedDate = new Date(date as string);
      query.appointmentDate = {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999)),
      };
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email phone')
      .populate('hospitalId', 'name')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.json({
      success: true,
      data: appointments,
      count: appointments.length,
    });
  } catch (error) {
    throw new AppError('Failed to fetch doctor appointments', 500);
  }
};

// Admin/Doctor: Update appointment (add diagnosis, prescription)
export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { diagnosis, prescription, notes, status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        diagnosis,
        prescription,
        notes,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    res.json({
      success: true,
      data: appointment,
      message: 'Appointment updated successfully',
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update appointment', 500);
  }
};

// Admin: Get all appointments
export const getAllAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, hospitalId, doctorId } = req.query;
    
    const query: any = {};
    if (status) query.status = status;
    if (hospitalId) query.hospitalId = hospitalId;
    if (doctorId) query.doctorId = doctorId;

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name specialization consultationFee')
      .populate('hospitalId', 'name city address phone email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    throw new AppError('Failed to fetch appointments', 500);
  }
};

// Get appointment statistics
export const getAppointmentStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hospitalId, doctorId, startDate, endDate } = req.query;

    const matchQuery: any = {};
    if (hospitalId) matchQuery.hospitalId = hospitalId;
    if (doctorId) matchQuery.doctorId = doctorId;
    if (startDate && endDate) {
      matchQuery.appointmentDate = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const stats = await Appointment.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalFees: { $sum: '$consultationFee' },
        },
      },
    ]);

    const total = await Appointment.countDocuments(matchQuery);

    res.json({
      success: true,
      data: {
        total,
        byStatus: stats,
      },
    });
  } catch (error) {
    throw new AppError('Failed to fetch appointment statistics', 500);
  }
};
