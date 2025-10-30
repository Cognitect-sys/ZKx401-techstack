import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
  format = 'number'
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        if (val >= 1000000) {
          return `${(val / 1000000).toFixed(1)}M`;
        } else if (val >= 1000) {
          return `${(val / 1000).toFixed(1)}K`;
        }
        return val.toLocaleString();
    }
  };

  useEffect(() => {
    const duration = 1000; // 1 second
    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOutCubic;
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

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
    if (!change) return null;
    if (changeType === 'positive') return '↗';
    if (changeType === 'negative') return '↘';
    return '→';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div className="p-2 rounded-lg bg-accent-cyan/10 text-accent-cyan">
            {icon}
          </div>
        )}
        {showLiveIndicator && (
          <div className="flex items-center gap-2">
            <div className="live-indicator" />
            <span className="text-xs text-text-tertiary">LIVE</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-text-secondary font-medium">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-stat font-bold text-text-primary font-mono">
            {prefix}{formatValue(displayValue)}{suffix}
          </h3>
          {change && (
            <div className={`flex items-center gap-1 text-xs font-medium ${getChangeColor()}`}>
              <span>{getChangeIcon()}</span>
              <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;