import { Response } from 'express';
import User from '../models/User';
import Doctor from '../models/Doctor';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Get all pending user requests (admin only)
export const getPendingUserRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pendingUsers = await User.find({
      approvalStatus: 'pending',
      role: { $in: ['hospital_staff', 'doctor'] }
    })
      .populate('hospitalId', 'name city')
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: pendingUsers,
      count: pendingUsers.length,
    });
  } catch (error: any) {
    console.error('Get pending user requests error:', error);
    throw new AppError('Failed to fetch pending requests', 500);
  }
};

// Get pending doctor requests for hospital manager
export const getPendingDoctorRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const hospitalId = req.user!.hospitalId;

    if (!hospitalId) {
      throw new AppError('Hospital not found for user', 404);
    }

    const pendingDoctors = await Doctor.find({
      approvalStatus: 'pending',
      hospitalId,
    })
      .populate('hospitalId', 'name city')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: pendingDoctors,
      count: pendingDoctors.length,
    });
  } catch (error: any) {
    console.error('Get pending doctor requests error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch pending doctor requests', 500);
  }
};

// Approve user account (admin only - for hospital_staff and doctor user accounts)
export const approveUserAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.approvalStatus === 'approved') {
      throw new AppError('User already approved', 400);
    }

    user.isApproved = true;
    user.approvalStatus = 'approved';
    user.approvedBy = req.user!._id as any;
    user.approvedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: `${user.role} account approved successfully`,
      data: user,
    });
  } catch (error: any) {
    console.error('Approve user account error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to approve user account', 500);
  }
};

// Reject user account (admin only)
export const rejectUserAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.approvalStatus === 'approved') {
      throw new AppError('Cannot reject approved user', 400);
    }

    user.isApproved = false;
    user.approvalStatus = 'rejected';
    user.approvedBy = req.user!._id as any;
    user.approvedAt = new Date();
    user.rejectionReason = reason || 'No reason provided';
    await user.save();

    res.json({
      success: true,
      message: `${user.role} account rejected`,
      data: user,
    });
  } catch (error: any) {
    console.error('Reject user account error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to reject user account', 500);
  }
};

// Approve doctor (hospital manager)
export const approveDoctor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { doctorId } = req.params;
    const hospitalId = req.user!.hospitalId;

    if (!hospitalId) {
      throw new AppError('Hospital not found for user', 404);
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    // Verify doctor belongs to manager's hospital
    if (doctor.hospitalId.toString() !== hospitalId.toString()) {
      throw new AppError('Not authorized to approve this doctor', 403);
    }

    if (doctor.approvalStatus === 'approved') {
      throw new AppError('Doctor already approved', 400);
    }

    doctor.isApproved = true;
    doctor.approvalStatus = 'approved';
    doctor.approvedBy = req.user!._id as any;
    doctor.approvedAt = new Date();
    await doctor.save();

    res.json({
      success: true,
      message: 'Doctor approved successfully',
      data: doctor,
    });
  } catch (error: any) {
    console.error('Approve doctor error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to approve doctor', 500);
  }
};

// Reject doctor (hospital manager)
export const rejectDoctor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { doctorId } = req.params;
    const { reason } = req.body;
    const hospitalId = req.user!.hospitalId;

    if (!hospitalId) {
      throw new AppError('Hospital not found for user', 404);
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    // Verify doctor belongs to manager's hospital
    if (doctor.hospitalId.toString() !== hospitalId.toString()) {
      throw new AppError('Not authorized to reject this doctor', 403);
    }

    if (doctor.approvalStatus === 'approved') {
      throw new AppError('Cannot reject approved doctor', 400);
    }

    doctor.isApproved = false;
    doctor.approvalStatus = 'rejected';
    doctor.approvedBy = req.user!._id as any;
    doctor.approvedAt = new Date();
    doctor.rejectionReason = reason || 'No reason provided';
    await doctor.save();

    res.json({
      success: true,
      message: 'Doctor rejected',
      data: doctor,
    });
  } catch (error: any) {
    console.error('Reject doctor error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to reject doctor', 500);
  }
};

// Get approval statistics (admin)
export const getApprovalStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [pendingUsers, approvedUsers, rejectedUsers, pendingDoctors, approvedDoctors] = await Promise.all([
      User.countDocuments({ approvalStatus: 'pending', role: { $in: ['hospital_staff', 'doctor'] } }),
      User.countDocuments({ approvalStatus: 'approved', role: { $in: ['hospital_staff', 'doctor'] } }),
      User.countDocuments({ approvalStatus: 'rejected', role: { $in: ['hospital_staff', 'doctor'] } }),
      Doctor.countDocuments({ approvalStatus: 'pending' }),
      Doctor.countDocuments({ approvalStatus: 'approved' }),
    ]);

    res.json({
      success: true,
      data: {
        users: {
          pending: pendingUsers,
          approved: approvedUsers,
          rejected: rejectedUsers,
        },
        doctors: {
          pending: pendingDoctors,
          approved: approvedDoctors,
        },
      },
    });
  } catch (error: any) {
    console.error('Get approval stats error:', error);
    throw new AppError('Failed to fetch approval statistics', 500);
  }
};
