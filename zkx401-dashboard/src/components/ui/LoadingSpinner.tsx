import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'cyan' | 'green' | 'purple' | 'white';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'cyan',
  variant = 'spinner',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    cyan: 'text-accent-cyan',
    green: 'text-accent-green',
    purple: 'text-accent-purple',
    white: 'text-white'
  };

  const baseClasses = `${sizeClasses[size]} ${colorClasses[color]} ${className}`;

  const SpinnerVariant = () => (
    <motion.div
      className={`${baseClasses} border-2 border-current border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );

  const DotsVariant = () => (
    <div className="flex gap-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`w-2 h-2 rounded-full bg-current`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );

  const PulseVariant = () => (
    <motion.div
      className={`${baseClasses} bg-current rounded-full`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );

  const BarsVariant = () => (
    <div className="flex items-end gap-1">
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className={`w-1 bg-current rounded-full`}
          animate={{
            height: [8, 16, 8]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut'
          }}
          style={{ height: '16px' }}
        />
      ))}
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'dots':
        return <DotsVariant />;
      case 'pulse':
        return <PulseVariant />;
      case 'bars':
        return <BarsVariant />;
      default:
        return <SpinnerVariant />;
    }
  };

  return renderVariant();
};

// Specialized loading components
export const PageLoader: React.FC<{ message?: string }> = ({ 
  message = 'Loading...' 
}) => (
  <div className="fixed inset-0 bg-bg-near-black/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" variant="spinner" />
      <motion.p
        className="text-text-secondary text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
    </div>
  </div>
);

export const InlineLoader: React.FC<{ message?: string }> = ({ 
  message 
}) => (
  <div className="flex items-center gap-3 text-text-secondary">
    <LoadingSpinner size="sm" variant="pulse" />
    {message && (
      <motion.span
        className="text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {message}
      </motion.span>
    )}
  </div>
);

export const ButtonLoader: React.FC = () => (
  <LoadingSpinner size="sm" variant="spinner" />
);

export const CardLoader: React.FC<{ showTitle?: boolean }> = ({ showTitle = true }) => (
  <div className="bg-bg-elevated rounded-xl p-6 border border-gray-700 space-y-4">
    {showTitle && (
      <div className="flex items-center justify-between">
        <motion.div 
          className="h-5 bg-gray-600 rounded w-32"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <LoadingSpinner size="sm" variant="pulse" />
      </div>
    )}
    <div className="space-y-3">
      <motion.div 
        className="h-8 bg-gray-600 rounded w-3/4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div 
        className="h-4 bg-gray-700 rounded w-full"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
      />
      <motion.div 
        className="h-4 bg-gray-700 rounded w-2/3"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
      />
    </div>
  </div>
);

export default LoadingSpinner;
