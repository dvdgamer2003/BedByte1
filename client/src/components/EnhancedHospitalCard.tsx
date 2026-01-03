import { Link } from 'react-router-dom';
import { MapPin, Phone, Bed, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

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

interface EnhancedHospitalCardProps {
  hospital: Hospital;
  index: number;
}

const EnhancedHospitalCard: React.FC<EnhancedHospitalCardProps> = ({ hospital, index }) => {
  const lastUpdated = new Date(hospital.lastUpdated);
  const minutesAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
  const isStale = minutesAgo > 60;
  const availabilityPercent = (hospital.availableBeds / hospital.totalBeds) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <Link to={`/hospital/${hospital._id}`}>
        <Card className="group relative overflow-hidden hover:border-blue-200 transition-all duration-300 h-full">
          {/* Top badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-500 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
              <Clock className="h-3 w-3" />
              <span className={isStale ? 'text-orange-600' : ''}>
                {minutesAgo < 1 ? 'Just now' : `${minutesAgo}m ago`}
              </span>
            </div>
          </div>

          {/* Hospital Name & Location */}
          <div className="p-6 pb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {hospital.name}
            </h3>
            <div className="flex items-start text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
              <span className="text-sm">{hospital.city}</span>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {hospital.opdAvailable && (
                <Badge variant="success" className="text-xs">
                  OPD Available
                </Badge>
              )}
              {hospital.emergencyAvailable && (
                <Badge variant="destructive" className="text-xs">
                  Emergency 24/7
                </Badge>
              )}
            </div>

            {/* Contact */}
            <div className="flex items-center text-gray-600 mb-4">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm">{hospital.phone}</span>
            </div>
          </div>

          {/* Bed Availability Section */}
          <div className="px-6 pb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="bg-blue-600 p-2 rounded-lg mr-3">
                    <Bed className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      Available Beds
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    </p>
                    <p className="text-3xl font-bold text-blue-600 leading-none">
                      {hospital.availableBeds}
                      <span className="text-base text-gray-500 font-normal"> / {hospital.totalBeds}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Availability Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Occupancy</span>
                  <span>{Math.round(100 - availabilityPercent)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      availabilityPercent > 50 
                        ? 'bg-gradient-to-r from-green-400 to-green-600' 
                        : availabilityPercent > 20
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                        : 'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${availabilityPercent}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/5 group-hover:to-indigo-600/5 transition-all duration-300 pointer-events-none rounded-xl" />
        </Card>
      </Link>
    </motion.div>
  );
};

export default EnhancedHospitalCard;
