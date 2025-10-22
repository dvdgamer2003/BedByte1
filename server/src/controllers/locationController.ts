import { Request, Response } from 'express';
import Hospital from '../models/Hospital';
import MedicalStore from '../models/MedicalStore';
import Bed from '../models/Bed';
import { AppError } from '../middleware/errorHandler';

// Get nearby hospitals
export const getNearbyHospitals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, radius = 10 } = req.query; // radius in kilometers (default 10km)

    // Validate required parameters
    if (!latitude || !longitude) {
      throw new AppError('Latitude and longitude are required', 400);
    }

    // Parse and validate latitude
    const lat = parseFloat(latitude as string);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      throw new AppError('Invalid latitude. Must be between -90 and 90', 400);
    }

    // Parse and validate longitude
    const lng = parseFloat(longitude as string);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      throw new AppError('Invalid longitude. Must be between -180 and 180', 400);
    }

    // Parse and validate radius (convert km to meters for MongoDB)
    const radiusKm = parseFloat(radius as string);
    if (isNaN(radiusKm) || radiusKm <= 0 || radiusKm > 100) {
      throw new AppError('Invalid radius. Must be between 0 and 100 kilometers', 400);
    }
    const radiusMeters = radiusKm * 1000;

    // Find hospitals near the user location using geospatial query
    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat], // [longitude, latitude]
          },
          $maxDistance: radiusMeters,
        },
      },
    }).limit(50);

    // Get bed availability for each hospital
    const hospitalsWithBeds = await Promise.all(
      hospitals.map(async (hospital) => {
        try {
          const beds = await Bed.countDocuments({
            hospitalId: hospital._id,
            isOccupied: false,
          });

          const totalBeds = await Bed.countDocuments({
            hospitalId: hospital._id,
          });

          // Calculate distance
          const hospitalLng = hospital.location?.coordinates[0] || 0;
          const hospitalLat = hospital.location?.coordinates[1] || 0;
          const distance = calculateDistance(lat, lng, hospitalLat, hospitalLng);

          return {
            _id: hospital._id,
            name: hospital.name,
            city: hospital.city,
            address: hospital.address,
            phone: hospital.phone,
            email: hospital.email,
            coordinates: hospital.coordinates || {
              lat: hospitalLat,
              lng: hospitalLng,
            },
            location: hospital.location,
            opdAvailable: hospital.opdAvailable,
            emergencyAvailable: hospital.emergencyAvailable,
            availableBeds: beds,
            totalBeds: totalBeds,
            distance: Math.round(distance * 10) / 10, // Round to 1 decimal
            lastUpdated: hospital.lastUpdated,
          };
        } catch (bedError) {
          console.error(`Error fetching beds for hospital ${hospital._id}:`, bedError);
          // Return hospital with default values on error
          const hospitalLng = hospital.location?.coordinates[0] || 0;
          const hospitalLat = hospital.location?.coordinates[1] || 0;
          const distance = calculateDistance(lat, lng, hospitalLat, hospitalLng);
          
          return {
            _id: hospital._id,
            name: hospital.name,
            city: hospital.city,
            address: hospital.address,
            phone: hospital.phone,
            email: hospital.email,
            coordinates: hospital.coordinates || {
              lat: hospitalLat,
              lng: hospitalLng,
            },
            location: hospital.location,
            opdAvailable: hospital.opdAvailable,
            emergencyAvailable: hospital.emergencyAvailable,
            availableBeds: 0,
            totalBeds: 0,
            distance: Math.round(distance * 10) / 10,
            lastUpdated: hospital.lastUpdated,
          };
        }
      })
    );

    // Handle empty results
    if (hospitalsWithBeds.length === 0) {
      res.json({
        success: true,
        data: [],
        count: 0,
        message: `No hospitals found within ${radiusKm}km radius. Try increasing the search radius.`,
        userLocation: { latitude: lat, longitude: lng },
        searchRadius: `${radiusKm}km`,
      });
      return;
    }

    res.json({
      success: true,
      data: hospitalsWithBeds,
      count: hospitalsWithBeds.length,
      userLocation: { latitude: lat, longitude: lng },
      searchRadius: `${radiusKm}km`,
    });
  } catch (error: any) {
    console.error('Error fetching nearby hospitals:', error);
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || 'Failed to fetch nearby hospitals', 500);
  }
};

// Get nearby medical stores
export const getNearbyMedicalStores = async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, radius = 10, medicine } = req.query; // radius in kilometers (default 10km)

    // Validate required parameters
    if (!latitude || !longitude) {
      throw new AppError('Latitude and longitude are required', 400);
    }

    // Parse and validate latitude
    const lat = parseFloat(latitude as string);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      throw new AppError('Invalid latitude. Must be between -90 and 90', 400);
    }

    // Parse and validate longitude
    const lng = parseFloat(longitude as string);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      throw new AppError('Invalid longitude. Must be between -180 and 180', 400);
    }

    // Parse and validate radius (convert km to meters for MongoDB)
    const radiusKm = parseFloat(radius as string);
    if (isNaN(radiusKm) || radiusKm <= 0 || radiusKm > 100) {
      throw new AppError('Invalid radius. Must be between 0 and 100 kilometers', 400);
    }
    const radiusMeters = radiusKm * 1000;

    // Build query
    const query: any = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat], // [longitude, latitude]
          },
          $maxDistance: radiusMeters,
        },
      },
    };

    // Filter by medicine if provided
    if (medicine) {
      query['medicines.name'] = { $regex: medicine, $options: 'i' };
      query['medicines.inStock'] = true;
    }

    // Find medical stores near the user location
    const stores = await MedicalStore.find(query).limit(50);

    // Add distance and filter medicines if search query
    const storesWithDistance = stores.map((store) => {
      const storeLng = store.location?.coordinates[0] || 0;
      const storeLat = store.location?.coordinates[1] || 0;
      const storeDistance = calculateDistance(lat, lng, storeLat, storeLng);

      // Filter medicines if search query provided
      let filteredMedicines = store.medicines;
      if (medicine) {
        filteredMedicines = store.medicines.filter(
          (med) =>
            med.name.toLowerCase().includes((medicine as string).toLowerCase()) &&
            med.inStock
        );
      }

      return {
        _id: store._id,
        name: store.name,
        city: store.city,
        address: store.address,
        phone: store.phone,
        email: store.email,
        ownerName: store.ownerName,
        coordinates: store.coordinates || {
          lat: storeLat,
          lng: storeLng,
        },
        location: store.location,
        is24x7: store.is24x7,
        homeDelivery: store.homeDelivery,
        rating: store.rating,
        medicines: filteredMedicines,
        availableMedicines: filteredMedicines.length,
        distance: Math.round(storeDistance * 10) / 10, // Round to 1 decimal
        lastUpdated: store.lastUpdated,
      };
    });

    // Handle empty results
    if (storesWithDistance.length === 0) {
      const message = medicine
        ? `No medical stores found with "${medicine}" within ${radiusKm}km radius. Try increasing the search radius or searching for different medicine.`
        : `No medical stores found within ${radiusKm}km radius. Try increasing the search radius.`;
      
      res.json({
        success: true,
        data: [],
        count: 0,
        message,
        userLocation: { latitude: lat, longitude: lng },
        searchRadius: `${radiusKm}km`,
        searchQuery: medicine || null,
      });
      return;
    }

    res.json({
      success: true,
      data: storesWithDistance,
      count: storesWithDistance.length,
      userLocation: { latitude: lat, longitude: lng },
      searchRadius: `${radiusKm}km`,
      searchQuery: medicine || null,
    });
  } catch (error: any) {
    console.error('Error fetching nearby medical stores:', error);
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || 'Failed to fetch nearby medical stores', 500);
  }
};

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
}

// Get medical store by ID
export const getMedicalStoreById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const store = await MedicalStore.findById(id);

    if (!store) {
      throw new AppError('Medical store not found', 404);
    }

    res.json({
      success: true,
      data: store,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch medical store', 500);
  }
};

// Admin: Create medical store
export const createMedicalStore = async (req: Request, res: Response): Promise<void> => {
  try {
    const storeData = req.body;

    // Convert coordinates to GeoJSON location if provided
    if (storeData.coordinates?.lat && storeData.coordinates?.lng) {
      storeData.location = {
        type: 'Point',
        coordinates: [storeData.coordinates.lng, storeData.coordinates.lat],
      };
    }

    const store = await MedicalStore.create(storeData);

    res.status(201).json({
      success: true,
      data: store,
      message: 'Medical store created successfully',
    });
  } catch (error) {
    throw new AppError('Failed to create medical store', 500);
  }
};

// Admin: Update medical store
export const updateMedicalStore = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Update GeoJSON location if coordinates changed
    if (updateData.coordinates?.lat && updateData.coordinates?.lng) {
      updateData.location = {
        type: 'Point',
        coordinates: [updateData.coordinates.lng, updateData.coordinates.lat],
      };
    }

    updateData.lastUpdated = new Date();

    const store = await MedicalStore.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!store) {
      throw new AppError('Medical store not found', 404);
    }

    res.json({
      success: true,
      data: store,
      message: 'Medical store updated successfully',
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update medical store', 500);
  }
};

// Admin: Delete medical store
export const deleteMedicalStore = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const store = await MedicalStore.findByIdAndDelete(id);

    if (!store) {
      throw new AppError('Medical store not found', 404);
    }

    res.json({
      success: true,
      message: 'Medical store deleted successfully',
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to delete medical store', 500);
  }
};
