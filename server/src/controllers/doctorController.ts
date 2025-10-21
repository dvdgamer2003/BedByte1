import { Request, Response } from 'express';
import Doctor from '../models/Doctor';
import Appointment from '../models/Appointment';
import { AppError } from '../middleware/errorHandler';

// Get all doctors with filters
export const getDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hospitalId, specialization, search } = req.query;
    const query: any = { isActive: true };

    if (hospitalId) query.hospitalId = hospitalId;
    if (specialization) query.specialization = specialization;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ];
    }

    const doctors = await Doctor.find(query)
      .populate('hospitalId', 'name city address phone')
      .sort({ rating: -1, name: 1 });

    res.json({
      success: true,
      data: doctors,
      count: doctors.length,
    });
  } catch (error) {
    throw new AppError('Failed to fetch doctors', 500);
  }
};

// Get doctor by ID
export const getDoctorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id).populate('hospitalId', 'name city address phone email');

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    // Get upcoming appointments count
    const upcomingAppointments = await Appointment.countDocuments({
      doctorId: id,
      appointmentDate: { $gte: new Date() },
      status: 'scheduled',
    });

    res.json({
      success: true,
      data: {
        ...doctor.toObject(),
        upcomingAppointments,
      },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch doctor details', 500);
  }
};

// Check doctor availability
export const checkAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      throw new AppError('Doctor ID and date are required', 400);
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    const appointmentDate = new Date(date as string);
    const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Get doctor's availability for the day
    const dayAvailability = doctor.availability.find(a => a.day === dayName);

    if (!dayAvailability) {
      return res.json({
        success: true,
        data: {
          available: false,
          slots: [],
          message: 'Doctor is not available on this day',
        },
      });
    }

    // Get booked slots for the date
    const bookedAppointments = await Appointment.find({
      doctorId,
      appointmentDate: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999)),
      },
      status: { $in: ['scheduled', 'completed'] },
    }).select('appointmentTime');

    const bookedSlots = bookedAppointments.map(a => a.appointmentTime);
    const availableSlots = dayAvailability.slots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      success: true,
      data: {
        available: availableSlots.length > 0,
        slots: availableSlots,
        totalSlots: dayAvailability.slots.length,
        bookedSlots: bookedSlots.length,
      },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to check availability', 500);
  }
};

// Admin: Create Doctor
export const createDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctor = await Doctor.create(req.body);

    res.status(201).json({
      success: true,
      data: doctor,
      message: 'Doctor created successfully',
    });
  } catch (error) {
    throw new AppError('Failed to create doctor', 500);
  }
};

// Admin: Update Doctor
export const updateDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    res.json({
      success: true,
      data: doctor,
      message: 'Doctor updated successfully',
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update doctor', 500);
  }
};

// Admin: Delete Doctor
export const deleteDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Soft delete - mark as inactive
    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    res.json({
      success: true,
      message: 'Doctor deactivated successfully',
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to delete doctor', 500);
  }
};
