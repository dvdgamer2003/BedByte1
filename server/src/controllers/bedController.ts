import { Request, Response } from 'express';
import Bed from '../models/Bed';
import Hospital from '../models/Hospital';
import { AppError } from '../middleware/errorHandler';

export const updateBedStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isOccupied } = req.body;

    const bed = await Bed.findByIdAndUpdate(
      id,
      {
        isOccupied,
        ...(isOccupied === false && { patientId: null, bookingId: null }),
        lastUpdated: new Date(),
      },
      { new: true }
    );

    if (!bed) {
      throw new AppError('Bed not found', 404);
    }

    await Hospital.findByIdAndUpdate(bed.hospitalId, {
      lastUpdated: new Date(),
    });

    res.json({
      success: true,
      data: bed,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update bed status', 500);
  }
};

export const getBedsByHospital = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hospitalId } = req.params;
    const { roomType, isOccupied } = req.query;

    const query: any = { hospitalId };
    if (roomType) query.roomType = roomType;
    if (isOccupied !== undefined) query.isOccupied = isOccupied === 'true';

    const beds = await Bed.find(query)
      .populate('patientId', 'name phone')
      .populate('bookingId')
      .sort({ roomType: 1, bedNumber: 1 });

    res.json({
      success: true,
      data: beds,
    });
  } catch (error) {
    throw new AppError('Failed to fetch beds', 500);
  }
};

export const createBed = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hospitalId, roomType, bedNumber, floor, price } = req.body;

    const existingBed = await Bed.findOne({ hospitalId, bedNumber });
    if (existingBed) {
      throw new AppError('Bed number already exists', 400);
    }

    const bed = await Bed.create({
      hospitalId,
      roomType,
      bedNumber,
      floor,
      price,
    });

    res.status(201).json({
      success: true,
      data: bed,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to create bed', 500);
  }
};
