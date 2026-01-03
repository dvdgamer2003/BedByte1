import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key';
  return jwt.sign({ userId }, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string,
  } as SignOptions);
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, phone, hospitalId } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'patient',
      phone,
      hospitalId: hospitalId || undefined,
    });

    // Check if user needs approval (hospital_staff and doctor need approval, not patients or admins)
    const needsApproval = (user.role === 'hospital_staff' || user.role === 'doctor') && !user.isApproved;

    if (needsApproval) {
      // Don't generate token for unapproved users
      res.status(201).json({
        success: true,
        message: `Registration successful! Your ${user.role} account is pending approval. You will be notified once approved.`,
        needsApproval: true,
        approvalStatus: user.approvalStatus,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          approvalStatus: user.approvalStatus,
        },
      });
    } else {
      // Auto-approved (patients)
      const token = generateToken((user._id as any).toString());
      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Registration failed', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email OR username
    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: email.toLowerCase() }
      ]
    });
    
    if (!user) {
      throw new AppError('Incorrect credentials. Please check your username/email and password.', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Incorrect credentials. Please check your username/email and password.', 401);
    }

    // Check approval status
    if (!user.isApproved) {
      if (user.approvalStatus === 'pending') {
        throw new AppError('Your account is pending approval. Please wait for admin approval.', 403);
      } else if (user.approvalStatus === 'rejected') {
        throw new AppError(`Your account has been rejected. Reason: ${user.rejectionReason || 'Contact admin for details.'}`, 403);
      }
    }

    const token = generateToken((user._id as any).toString());

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        hospitalId: user.hospitalId,
      },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Login failed', 500);
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    const decoded = jwt.verify(token, secret) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to get user', 500);
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    const decoded = jwt.verify(token, secret) as { userId: string };
    
    const { name, email, phone } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: decoded.userId } });
      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update profile', 500);
  }
};
