import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, Bed, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import socketService from '../utils/socket';
import { useAuth } from '../contexts/AuthContext';

const HospitalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hospital, setHospital] = useState<any>(null);
  const [bedAvailability, setBedAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    roomType: '',
    patientName: '',
    patientPhone: '',
    patientAge: '',
    medicalCondition: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchHospital();
    socketService.connect();
    socketService.joinHospital(id!);

    socketService.onBedUpdate((data) => {
      if (data.hospitalId === id) {
        setBedAvailability(data.bedAvailability);
      }
    });

    return () => {
      socketService.leaveHospital(id!);
      socketService.offBedUpdate();
    };
  }, [id]);

  const fetchHospital = async () => {
    try {
      const response = await api.get(`/hospitals/${id}`);
      setHospital(response.data.data);
      setBedAvailability(response.data.data.bedAvailability);
    } catch (error) {
      console.error('Failed to fetch hospital:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await api.post('/bookings/provisional', {
        hospitalId: id,
        ...bookingData,
      });
      alert(response.data.message);
      navigate('/my-bookings');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!hospital) {
    return <div className="card text-center">Hospital not found</div>;
  }

  const lastUpdated = new Date(hospital.lastUpdated);
  const minutesAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
  const isStale = minutesAgo > 60;

  return (
    <div>
      <div className="card mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{hospital.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 text-gray-600 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium">{hospital.address}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Phone className="h-5 w-5 text-gray-600 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{hospital.phone}</p>
            </div>
          </div>
        </div>

        {hospital.description && (
          <p className="text-gray-700 mb-4">{hospital.description}</p>
        )}

        <div className="flex flex-wrap gap-2">
          {hospital.facilities?.map((facility: string) => (
            <span
              key={facility}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {facility}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>
            Last updated: {minutesAgo < 1 ? 'Just now' : `${minutesAgo} minutes ago`}
          </span>
          {isStale && (
            <span className="text-orange-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              Data may be stale
            </span>
          )}
        </div>
      </div>

      {/* Bed Availability */}
      <div className="card mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Bed className="h-6 w-6 mr-2 text-primary-600" />
          Bed Availability
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bedAvailability.map((room: any) => (
            <div
              key={room._id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-lg mb-2">{room._id}</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-3xl font-bold text-primary-600">
                    {room.available}
                  </p>
                  <p className="text-sm text-gray-600">
                    of {room.total} available
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-bold">₹{room.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Book a Bed</h2>
        <form onSubmit={handleBooking} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type *
              </label>
              <select
                required
                value={bookingData.roomType}
                onChange={(e) =>
                  setBookingData({ ...bookingData, roomType: e.target.value })
                }
                className="input-field"
              >
                <option value="">Select Room Type</option>
                {bedAvailability.map((room: any) => (
                  <option key={room._id} value={room._id}>
                    {room._id} (₹{room.price})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name *
              </label>
              <input
                type="text"
                required
                value={bookingData.patientName}
                onChange={(e) =>
                  setBookingData({ ...bookingData, patientName: e.target.value })
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={bookingData.patientPhone}
                onChange={(e) =>
                  setBookingData({ ...bookingData, patientPhone: e.target.value })
                }
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={bookingData.patientAge}
                onChange={(e) =>
                  setBookingData({ ...bookingData, patientAge: e.target.value })
                }
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical Condition
            </label>
            <textarea
              value={bookingData.medicalCondition}
              onChange={(e) =>
                setBookingData({ ...bookingData, medicalCondition: e.target.value })
              }
              className="input-field"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={bookingLoading}
            className="btn-primary disabled:opacity-50"
          >
            {bookingLoading ? 'Creating Booking...' : 'Create Provisional Booking'}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            * You will have 15 minutes to confirm your booking
          </p>
        </form>
      </div>
    </div>
  );
};

export default HospitalDetail;
