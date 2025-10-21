import { useState, useEffect } from 'react';
import { Calendar, MapPin, Bed, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../utils/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId: string) => {
    try {
      await api.post(`/bookings/${bookingId}/confirm`);
      alert('Booking confirmed successfully!');
      fetchBookings();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to confirm booking');
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      alert('Booking cancelled successfully');
      fetchBookings();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'provisional':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'admitted':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'expired':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">You don't have any bookings yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {booking.hospitalId?.name || 'Hospital'}
                  </h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{booking.hospitalId?.city}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Patient Name</p>
                  <p className="font-medium">{booking.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Room Type</p>
                  <p className="font-medium">{booking.roomType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{booking.patientPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Booking Date</p>
                  <p className="font-medium">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {booking.bedId && (
                <div className="flex items-center text-gray-700 mb-4">
                  <Bed className="h-4 w-4 mr-2" />
                  <span>Bed Number: {booking.bedId.bedNumber}</span>
                </div>
              )}

              {booking.status === 'provisional' && booking.provisionalExpiry && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                  <div className="flex items-center text-yellow-800">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      Expires in:{' '}
                      {Math.max(
                        0,
                        Math.floor((new Date(booking.provisionalExpiry).getTime() - Date.now()) / 60000)
                      )}{' '}
                      minutes
                    </span>
                  </div>
                </div>
              )}

              {booking.status === 'provisional' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConfirm(booking._id)}
                    className="btn-primary flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="btn-secondary flex items-center text-red-600"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}

              {booking.status === 'confirmed' && (
                <button
                  onClick={() => handleCancel(booking._id)}
                  className="btn-secondary text-red-600"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
