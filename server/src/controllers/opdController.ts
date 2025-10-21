import { Request, Response } from 'express';
import OPDQueue from '../models/OPDQueue';
import Hospital from '../models/Hospital';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const joinQueue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { hospitalId, patientName, patientPhone, department } = req.body;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital || !hospital.opdAvailable) {
      throw new AppError('OPD not available at this hospital', 400);
    }

    // Get next token number
    const lastToken = await OPDQueue.findOne({ hospitalId })
      .sort({ tokenNumber: -1 })
      .limit(1);

    const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

    // Estimate wait time (10 minutes per person in queue)
    const queueLength = await OPDQueue.countDocuments({
      hospitalId,
      status: { $in: ['waiting', 'in_consultation'] },
    });
    const estimatedWaitTime = queueLength * 10;

    const queueEntry = await OPDQueue.create({
      hospitalId,
      patientId: req.user!._id,
      patientName,
      patientPhone,
      tokenNumber,
      department: department || 'General',
      estimatedWaitTime,
    });

    res.status(201).json({
      success: true,
      data: queueEntry,
      message: `Token ${tokenNumber} issued. Estimated wait: ${estimatedWaitTime} minutes`,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to join queue', 500);
  }
};

export const getQueueStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hospitalId } = req.params;

    const queue = await OPDQueue.find({
      hospitalId,
      status: { $in: ['waiting', 'in_consultation'] },
    })
      .sort({ tokenNumber: 1 })
      .select('-patientId');

    const currentToken = await OPDQueue.findOne({
      hospitalId,
      status: 'in_consultation',
    });

    res.json({
      success: true,
      data: {
        queue,
        currentToken: currentToken?.tokenNumber || null,
        queueLength: queue.length,
      },
    });
  } catch (error) {
    throw new AppError('Failed to fetch queue status', 500);
  }
};

export const advanceQueue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { hospitalId } = req.params;

    // Mark current consultation as completed
    await OPDQueue.updateMany(
      { hospitalId, status: 'in_consultation' },
      { status: 'completed', completedAt: new Date() }
    );

    // Get next patient
    const nextPatient = await OPDQueue.findOne({
      hospitalId,
      status: 'waiting',
    }).sort({ tokenNumber: 1 });

    if (nextPatient) {
      nextPatient.status = 'in_consultation';
      nextPatient.consultationStartedAt = new Date();
      await nextPatient.save();

      res.json({
        success: true,
        data: nextPatient,
        message: `Token ${nextPatient.tokenNumber} is now being consulted`,
      });
    } else {
      res.json({
        success: true,
        message: 'No more patients in queue',
      });
    }
  } catch (error) {
    throw new AppError('Failed to advance queue', 500);
  }
};

export const getMyQueueStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const queueEntry = await OPDQueue.findOne({
      patientId: req.user!._id,
      status: { $in: ['waiting', 'in_consultation'] },
    })
      .populate('hospitalId', 'name city')
      .sort({ createdAt: -1 });

    if (!queueEntry) {
      res.json({
        success: true,
        data: null,
        message: 'Not in any queue',
      });
      return;
    }

    const position = await OPDQueue.countDocuments({
      hospitalId: queueEntry.hospitalId,
      tokenNumber: { $lt: queueEntry.tokenNumber },
      status: { $in: ['waiting', 'in_consultation'] },
    });

    res.json({
      success: true,
      data: {
        ...queueEntry.toObject(),
        position: position + 1,
      },
    });
  } catch (error) {
    throw new AppError('Failed to fetch queue status', 500);
  }
};
