import { motion } from 'framer-motion';
import { AlertCircle, Siren } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const FloatingEmergencyButton = () => {
  return (
    <Link to="/emergency-booking">
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50 group"
      >
        <motion.div
          whileHover={{ scale: 1.15, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          {/* Multiple glow layers for 3D effect */}
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-2xl"
          />
          <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-60" />
          
          {/* Rotating ring effect */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-red-300 opacity-50"
          />
          
          {/* Button with 3D styling */}
          <Button
            className="relative h-16 w-16 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-orange-600 hover:from-red-600 hover:via-red-700 hover:to-orange-700 shadow-2xl border-2 border-white/20"
            style={{ 
              transform: 'translateZ(20px)',
              boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.5), inset 0 2px 4px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <AlertCircle className="h-7 w-7 text-white drop-shadow-lg" />
            </motion.div>
          </Button>

          {/* Emergency indicator badge */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
          >
            <Siren className="h-3 w-3 text-white" />
          </motion.div>
        </motion.div>

        {/* Enhanced 3D Tooltip */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute -top-14 right-0 bg-gradient-to-r from-white to-red-50 px-4 py-2.5 rounded-xl shadow-2xl group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none border border-red-100"
          style={{ transform: 'translateZ(10px)' }}
        >
          <p className="text-sm font-bold text-red-600 flex items-center gap-2">
            <Siren className="h-4 w-4 animate-pulse" />
            Emergency Booking
          </p>
          <p className="text-xs text-gray-600 mt-0.5">24/7 Fast Response</p>
          <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-3 h-3 bg-gradient-to-br from-white to-red-50 border-r border-b border-red-100" />
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default FloatingEmergencyButton;
