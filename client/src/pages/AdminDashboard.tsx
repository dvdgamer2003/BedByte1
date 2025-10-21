import { useState, useEffect } from 'react';
import { Bed, Users, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [beds, setBeds] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedHospital) {
      fetchBeds();
      fetchQueue();
    }
  }, [selectedHospital]);

  const fetchHospitals = async () => {
    try {
      const response = await api.get('/hospitals');
      setHospitals(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedHospital(response.data.data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  const fetchBeds = async () => {
    try {
      const response = await api.get(`/beds/hospital/${selectedHospital}`);
      setBeds(response.data.data);
    } catch (error) {
      console.error('Failed to fetch beds:', error);
    }
  };

  const fetchQueue = async () => {
    try {
      const response = await api.get(`/opd/status/${selectedHospital}`);
      setQueue(response.data.data.queue || []);
    } catch (error) {
      console.error('Failed to fetch queue:', error);
    }
  };

  const handleBedStatusChange = async (bedId: string, isOccupied: boolean) => {
    try {
      await api.put(`/beds/${bedId}`, { isOccupied });
      fetchBeds();
      alert('Bed status updated successfully');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update bed status');
    }
  };

  const handleAdvanceQueue = async () => {
    if (!window.confirm('Are you sure you want to advance the queue?')) return;

    try {
      setLoading(true);
      await api.post(`/opd/advance/${selectedHospital}`);
      fetchQueue();
      alert('Queue advanced successfully');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to advance queue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="card mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Hospital
        </label>
        <select
          value={selectedHospital}
          onChange={(e) => setSelectedHospital(e.target.value)}
          className="input-field max-w-md"
        >
          {hospitals.map((hospital) => (
            <option key={hospital._id} value={hospital._id}>
              {hospital.name} - {hospital.city}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bed Management */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Bed className="h-6 w-6 mr-2 text-primary-600" />
            Bed Management
          </h2>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {beds.map((bed) => (
              <div
                key={bed._id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="font-medium">{bed.bedNumber}</p>
                  <p className="text-sm text-gray-600">
                    {bed.roomType} - Floor {bed.floor}
                  </p>
                  {bed.patientId && (
                    <p className="text-sm text-gray-500">
                      Patient: {bed.patientId.name}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleBedStatusChange(bed._id, !bed.isOccupied)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    bed.isOccupied
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {bed.isOccupied ? 'Mark Free' : 'Mark Occupied'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* OPD Queue Management */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Users className="h-6 w-6 mr-2 text-primary-600" />
              OPD Queue
            </h2>
            <button
              onClick={handleAdvanceQueue}
              disabled={loading || queue.length === 0}
              className="btn-primary flex items-center disabled:opacity-50"
            >
              Advance Queue
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>

          {queue.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No patients in queue</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {queue.map((entry, index) => (
                <div
                  key={entry._id}
                  className={`p-3 border rounded-lg ${
                    entry.status === 'in_consultation'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">#{entry.tokenNumber}</span>
                        <span className="text-gray-600">{entry.patientName}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Department: {entry.department}
                      </p>
                      <p className="text-sm text-gray-500">
                        Phone: {entry.patientPhone}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        entry.status === 'in_consultation'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {entry.status === 'in_consultation' ? 'IN PROGRESS' : `Position: ${index + 1}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
