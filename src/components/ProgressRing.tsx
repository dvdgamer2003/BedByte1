import { motion } from 'framer-motion';

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  gradientId: string;
}

const ProgressRing = ({ 
  value, 
  max = 100, 
  size = 100, 
  strokeWidth = 8,
  color,
  gradientId 
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (value / max) * 100;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl font-bold"
          style={{ color }}
        >
          {value}%
        </motion.span>
      </div>
    </div>
  );
};

export default ProgressRing;
