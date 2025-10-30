import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'avatar' | 'chart' | 'table' | 'button';
  count?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  count = 1,
  width,
  height,
  className = ''
}) => {
  const baseClasses = 'skeleton-enhanced rounded-lg';
  
  const variantClasses = {
    card: 'h-32 w-full',
    text: 'h-4 w-full',
    avatar: 'h-10 w-10 rounded-full',
    chart: 'h-64 w-full',
    table: 'h-8 w-full',
    button: 'h-10 w-24'
  };

  const SkeletonItem = ({ index }: { index: number }) => (
    <motion.div
      key={index}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1
      }}
    />
  );

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonItem key={index} index={index} />
      ))}
    </>
  );
};

export default LoadingSkeleton;

// Specialized skeleton components for common use cases
export const StatCardSkeleton: React.FC = () => (
  <div className="stat-card space-y-4">
    <div className="flex items-start justify-between">
      <LoadingSkeleton variant="avatar" />
      <LoadingSkeleton variant="text" width="60px" />
    </div>
    <div className="space-y-2">
      <LoadingSkeleton variant="text" width="80%" />
      <LoadingSkeleton variant="text" width="60%" />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="flex gap-4">
      {Array.from({ length: columns }, (_, i) => (
        <LoadingSkeleton key={`header-${i}`} variant="text" width={`${100 / columns}%`} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex gap-4">
        {Array.from({ length: columns }, (_, colIndex) => (
          <LoadingSkeleton 
            key={`cell-${rowIndex}-${colIndex}`} 
            variant="text" 
            width={`${100 / columns}%`}
          />
        ))}
      </div>
    ))}
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="space-y-4">
    <LoadingSkeleton variant="text" width="40%" />
    <LoadingSkeleton variant="chart" />
  </div>
);

export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: items }, (_, index) => (
      <div key={index} className="flex items-center gap-3">
        <LoadingSkeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton variant="text" width="70%" />
          <LoadingSkeleton variant="text" width="50%" />
        </div>
      </div>
    ))}
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      <LoadingSkeleton variant="avatar" width={64} height={64} />
      <div className="space-y-2">
        <LoadingSkeleton variant="text" width="120px" />
        <LoadingSkeleton variant="text" width="80px" />
      </div>
    </div>
    <LoadingSkeleton variant="text" width="100%" />
    <LoadingSkeleton variant="text" width="80%" />
  </div>
);
