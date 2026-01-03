import { Link } from 'react-router-dom';
import { MapPin, Phone, Bed, Clock } from 'lucide-react';

interface Hospital {
  _id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  availableBeds: number;
  totalBeds: number;
  lastUpdated: string;
  opdAvailable: boolean;
  emergencyAvailable: boolean;
}

interface HospitalCardProps {
  hospital: Hospital;
}

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital }) => {
  const lastUpdated = new Date(hospital.lastUpdated);
  const minutesAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
  const isStale = minutesAgo > 60;

  return (
    <Link to={`/hospital/${hospital._id}`}>
      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{hospital.name}</h3>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{hospital.city}</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            {hospital.opdAvailable && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                OPD Available
              </span>
            )}
            {hospital.emergencyAvailable && (
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                Emergency 24/7
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <Phone className="h-4 w-4 mr-2" />
          <span className="text-sm">{hospital.phone}</span>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Bed className="h-5 w-5 mr-2 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Available Beds</p>
                <p className="text-2xl font-bold text-primary-600">
                  {hospital.availableBeds} / {hospital.totalBeds}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  {minutesAgo < 1 ? 'Just now' : `${minutesAgo}m ago`}
                </span>
              </div>
              {isStale && (
                <span className="text-xs text-orange-600">May be stale</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HospitalCard;
