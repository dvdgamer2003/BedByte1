import { useState, useEffect } from 'react';
import { Clock, Users, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import socketService from '../utils/socket';

const OPDQueue = () => {
  const [myStatus, setMyStatus] = useState<any>(null);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    department: 'General',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHospitals();
    fetchMyStatus();
    
    socketService.connect();

    return () => {
      if (myStatus?.hospitalId?._id) {
        socketService.leaveOPDQueue(myStatus.hospitalId._id);
      }
    };
  }, []);

  useEffect(() => {
    if (myStatus?.hospitalId?._id) {
      socketService.joinOPDQueue(myStatus.hospitalId._id);
      
      socketService.onQueueUpdate(() => {
        // Refresh status when queue updates
        fetchMyStatus();
      });

      return () => {
        socketService.offQueueUpdate();
      };
    }
  }, [myStatus?.hospitalId?._id]);

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/hospitals');
      setHospitals(response.data.data.filter((h: any) => h.opdAvailable));
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  const fetchMyStatus = async () => {
    try {
      const response = await api.get('/opd/my-status');
      setMyStatus(response.data.data);
    } catch (error) {
      console.error('Failed to fetch queue status:', error);
    }
  };

  const handleJoinQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/opd/join', {
        hospitalId: selectedHospital,
        ...formData,
      });
      alert('Successfully joined OPD queue!');
      fetchMyStatus();
      setFormData({ patientName: '', patientPhone: '', department: 'General' });
      setSelectedHospital('');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to join queue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">OPD Queue</h1>

      {myStatus && (
        <div className="card mb-6 bg-gradient-to-r from-primary-50 to-blue-50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Your Queue Status</h2>
              <p className="text-gray-600">{myStatus.hospitalId?.name}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              myStatus.status === 'waiting' 
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {myStatus.status.toUpperCase().replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Token Number</p>
              <p className="text-3xl font-bold text-primary-600">
                {myStatus.tokenNumber}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Position in Queue</p>
              <p className="text-3xl font-bold text-gray-800">
                {myStatus.position || '-'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Est. Wait Time</p>
              <p className="text-3xl font-bold text-gray-800">
                {myStatus.estimatedWaitTime || 0} min
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>
              Checked in at: {new Date(myStatus.checkedInAt).toLocaleTimeString()}
            </span>
          </div>

          {myStatus.status === 'in_consultation' && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded p-3">
              <div className="flex items-center text-green-800">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  Your consultation is in progress. Please proceed to the doctor.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {!myStatus && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Users className="h-6 w-6 mr-2 text-primary-600" />
            Join OPD Queue
          </h2>

          <form onSubmit={handleJoinQueue} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Hospital *
              </label>
              <select
                required
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="input-field"
              >
                <option value="">Choose a hospital</option>
                {hospitals.map((hospital) => (
                  <option key={hospital._id} value={hospital._id}>
                    {hospital.name} - {hospital.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.patientName}
                  onChange={(e) =>
                    setFormData({ ...formData, patientName: e.target.value })
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
                  value={formData.patientPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, patientPhone: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="input-field"
              >
                <option value="General">General</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Joining Queue...' : 'Join Queue'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default OPDQueue;
