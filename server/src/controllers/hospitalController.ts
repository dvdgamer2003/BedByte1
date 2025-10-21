import { Request, Response } from 'express';
import Hospital from '../models/Hospital';
import Bed from '../models/Bed';
import { AppError } from '../middleware/errorHandler';

export const getHospitals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { city, roomType, search } = req.query;

    const query: any = {};
    if (city) query.city = city;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const hospitals = await Hospital.find(query).sort({ name: 1 });

    // Get bed availability for each hospital
    const hospitalsWithAvailability = await Promise.all(
      hospitals.map(async (hospital) => {
        try {
          const bedQuery: any = { hospitalId: hospital._id, isOccupied: false };
          if (roomType) bedQuery.roomType = roomType;

          const availableBeds = await Bed.countDocuments(bedQuery);
          const totalBeds = await Bed.countDocuments({ hospitalId: hospital._id });

          return {
            ...hospital.toObject(),
            availableBeds,
            totalBeds,
            lastUpdated: hospital.lastUpdated,
          };
        } catch (bedError) {
          console.error(`Error fetching beds for hospital ${hospital._id}:`, bedError);
          // Return hospital with default bed values on error
          return {
            ...hospital.toObject(),
            availableBeds: 0,
            totalBeds: 0,
            lastUpdated: hospital.lastUpdated,
          };
        }
      })
    );

    res.json({
      success: true,
      data: hospitalsWithAvailability,
    });
  } catch (error: any) {
    console.error('Error fetching hospitals:', error);
    throw new AppError(error.message || 'Failed to fetch hospitals', 500);
  }
};

export const getHospitalById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const hospital = await Hospital.findById(id);
    if (!hospital) {
      throw new AppError('Hospital not found', 404);
    }

    // Get detailed bed availability by room type
    const bedsByRoomType = await Bed.aggregate([
      { $match: { hospitalId: hospital._id } },
      {
        $group: {
          _id: '$roomType',
          total: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ['$isOccupied', false] }, 1, 0] },
          },
          price: { $first: '$price' },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        ...hospital.toObject(),
        bedAvailability: bedsByRoomType,
        lastUpdated: hospital.lastUpdated,
      },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch hospital details', 500);
  }
};

export const updateHospital = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const hospital = await Hospital.findByIdAndUpdate(
      id,
      { ...updates, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );

    if (!hospital) {
      throw new AppError('Hospital not found', 404);
    }

    res.json({
      success: true,
      data: hospital,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update hospital', 500);
  }
};

export const getAggregatedAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { city } = req.query;

    const query: any = {};
    if (city) query.city = city;

    const hospitals = await Hospital.find(query);

    const availability = await Promise.all(
      hospitals.map(async (hospital) => {
        const availableBeds = await Bed.countDocuments({
          hospitalId: hospital._id,
          isOccupied: false,
        });

        const totalBeds = await Bed.countDocuments({ hospitalId: hospital._id });

        return {
          hospitalId: hospital._id,
          hospitalName: hospital.name,
          city: hospital.city,
          availableBeds,
          totalBeds,
          lastUpdated: hospital.lastUpdated,
          opdAvailable: hospital.opdAvailable,
          emergencyAvailable: hospital.emergencyAvailable,
        };
      })
    );

    res.json({
      success: true,
      data: availability,
      timestamp: new Date(),
    });
  } catch (error) {
    throw new AppError('Failed to fetch aggregated availability', 500);
  }
};

// Admin: Create Hospital
export const createHospital = async (req: Request, res: Response): Promise<void> => {
  try {
    const hospital = await Hospital.create(req.body);

    res.status(201).json({
      success: true,
      data: hospital,
      message: 'Hospital created successfully',
    });
  } catch (error) {
    throw new AppError('Failed to create hospital', 500);
  }
};

// Admin: Delete Hospital
export const deleteHospital = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Delete all beds associated with this hospital
    await Bed.deleteMany({ hospitalId: id });

    const hospital = await Hospital.findByIdAndDelete(id);
    
    if (!hospital) {
      throw new AppError('Hospital not found', 404);
    }

    res.json({
      success: true,
      message: 'Hospital and associated beds deleted successfully',
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to delete hospital', 500);
  }
};
