import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toast = ({ message, type = 'success', onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: -50, x: '-50%' }}
        className="fixed top-6 left-1/2 z-[100] max-w-md w-full px-4"
      >
        <div
          className={`
            flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border
            ${
              type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }
          `}
        >
          <CheckCircle2 className={`h-6 w-6 flex-shrink-0 ${type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
          <p className="flex-1 font-medium text-sm">{message}</p>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg hover:bg-white/50 transition-colors ${
              type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
