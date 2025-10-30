import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  prefix?: string;
  suffix?: string;
  showLiveIndicator?: boolean;
  icon?: React.ReactNode;
  format?: 'number' | 'currency' | 'percentage';
  description?: string;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  prefix = '',
  suffix = '',
  showLiveIndicator = false,
  icon,
  format = 'number',
  description,
  loading = false,
  className = '',
  onClick,
  ariaLabel
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [previousValue, setPreviousValue] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        if (val >= 1000000000) {
          return `${(val / 1000000000).toFixed(1)}B`;
        } else if (val >= 1000000) {
          return `${(val / 1000000).toFixed(1)}M`;
        } else if (val >= 1000) {
          return `${(val / 1000).toFixed(1)}K`;
        }
        return val.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
  };

  // Animate number counting when value changes
  useEffect(() => {
    if (isInView && !loading) {
      const duration = 1200; // 1.2 seconds
      const startTime = Date.now();
      const startValue = displayValue;
      const endValue = value;

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Enhanced easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (endValue - startValue) * easeOutCubic;
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [value, isInView, loading]);

  // Track value changes for trend indicators
  useEffect(() => {
    if (value !== previousValue && previousValue !== 0) {
      setPreviousValue(value);
    } else if (previousValue === 0) {
      setPreviousValue(value);
    }
  }, [value, previousValue]);

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-accent-green';
      case 'negative':
        return 'text-accent-red';
      default:
        return 'text-text-tertiary';
    }
  };

  const getChangeIcon = () => {
    if (!change) return <Minus className="w-3 h-3" />;
    if (changeType === 'positive') return <TrendingUp className="w-3 h-3" />;
    if (changeType === 'negative') return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (!change) return 'bg-text-tertiary';
    if (changeType === 'positive') return 'bg-accent-green';
    if (changeType === 'negative') return 'bg-accent-red';
    return 'bg-text-tertiary';
  };

  if (loading) {
    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`stat-card ${className}`}
        role="status"
        aria-label={`Loading ${title}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-gray-700 animate-pulse h-10 w-10" />
          <div className="h-4 w-12 bg-gray-700 animate-pulse rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-gray-700 animate-pulse rounded" />
          <div className="h-8 w-1/2 bg-gray-700 animate-pulse rounded" />
        </div>
      </motion.div>
    );
  }

  const CardWrapper = onClick ? motion.div : 'div';
  const cardProps = onClick ? {
    whileHover: { y: -4 },
    whileTap: { scale: 0.98 },
    onClick,
    className: `cursor-pointer ${className}`,
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }
  } : { className };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="stat-card group"
      role="article"
      aria-label={ariaLabel || `${title}: ${formatValue(displayValue)}`}
    >
      <CardWrapper {...cardProps}>
        <div className="flex items-start justify-between mb-4">
          {icon && (
            <motion.div 
              className="p-2.5 rounded-lg bg-accent-cyan/10 text-accent-cyan group-hover:bg-accent-cyan/20 transition-colors"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.div>
          )}
          <div className="flex items-center gap-2">
            {showLiveIndicator && (
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="live-indicator" />
                <span className="text-xs text-text-tertiary font-medium">LIVE</span>
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-text-secondary font-medium leading-tight">
            {title}
          </p>
          
          <div className="flex items-baseline gap-3">
            <motion.h3 
              className="text-stat-lg font-bold text-text-primary font-mono tracking-tight"
              key={displayValue}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {prefix}{formatValue(displayValue)}{suffix}
            </motion.h3>
            
            {change && (
              <motion.div 
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${getChangeColor()} bg-opacity-10`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${getTrendColor()}`} />
                <span>{getChangeIcon()}</span>
                <span>{Math.abs(change).toFixed(1)}%</span>
              </motion.div>
            )}
          </div>

          {description && (
            <p className="text-xs text-text-tertiary leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </CardWrapper>
    </motion.div>
  );
};

export default StatCard;