import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  className = '',
  disabled = false
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-250 ease-out disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-accent-cyan text-black hover:bg-accent-cyan/90 hover:shadow-glow-cyan active:scale-[0.98]',
    secondary: 'border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-black hover:shadow-glow-cyan',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm h-10',
    md: 'px-6 py-3 text-base h-12',
    lg: 'px-8 py-4 text-lg h-14'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      className={classes}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default Button;