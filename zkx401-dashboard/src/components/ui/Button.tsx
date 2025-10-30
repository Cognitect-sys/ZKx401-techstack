import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  href?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  ariaLabel?: string;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    href,
    className = '',
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    ariaLabel,
    ...props
  }, ref) => {
    const baseClasses = `
      inline-flex items-center justify-center font-semibold rounded-xl
      transition-all duration-200 ease-out
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2 focus:ring-offset-bg-near-black
      relative overflow-hidden group
      ${fullWidth ? 'w-full' : ''}
    `;
    
    const variantClasses = {
      primary: `
        bg-gradient-to-r from-accent-cyan to-accent-cyan-dark text-black
        hover:from-accent-cyan-light hover:to-accent-cyan
        hover:shadow-glow-cyan-strong active:scale-[0.98]
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent
        before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500
      `,
      secondary: `
        bg-gradient-to-r from-accent-purple to-accent-purple-dark text-white
        hover:from-accent-purple-light hover:to-accent-purple
        hover:shadow-glow-purple-strong active:scale-[0.98]
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent
        before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500
      `,
      outline: `
        border-2 border-accent-cyan text-accent-cyan
        hover:bg-accent-cyan hover:text-black hover:shadow-glow-cyan
        active:scale-[0.98] bg-transparent
      `,
      ghost: `
        text-text-secondary hover:text-text-primary
        hover:bg-bg-hover active:scale-[0.98]
      `,
      destructive: `
        bg-gradient-to-r from-accent-red to-accent-red-dark text-white
        hover:from-accent-red-light hover:to-accent-red
        hover:shadow-glow-red active:scale-[0.98]
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent
        before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500
      `,
      success: `
        bg-gradient-to-r from-accent-green to-accent-green-dark text-black
        hover:from-accent-green-light hover:to-accent-green
        hover:shadow-glow-green-strong active:scale-[0.98]
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent
        before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500
      `,
    };
    
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm h-9 gap-2',
      md: 'px-6 py-3 text-base h-11 gap-2',
      lg: 'px-8 py-4 text-lg h-12 gap-3',
      xl: 'px-10 py-5 text-xl h-14 gap-3'
    };

    const isDisabled = disabled || loading;
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    const handleClick = () => {
      if (!isDisabled && onClick) {
        onClick();
      }
    };

    const content = (
      <>
        {loading && (
          <LoadingSpinner 
            size={size === 'sm' ? 'sm' : 'sm'} 
            variant="spinner" 
            color={variant === 'primary' || variant === 'success' ? 'white' : 'cyan'}
          />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children && (
          <span className={loading ? 'opacity-70' : ''}>
            {children}
          </span>
        )}
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </>
    );

    const buttonProps = {
      className: classes,
      onClick: handleClick,
      disabled: isDisabled,
      'aria-label': ariaLabel,
      'aria-disabled': isDisabled,
      ...props
    };

    if (href && !isDisabled) {
      return (
        <motion.a
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={href}
          {...buttonProps}
          whileHover={!isDisabled ? { 
            scale: 1.02,
            y: -1
          } : {}}
          whileTap={!isDisabled ? { 
            scale: 0.98,
            y: 0
          } : {}}
          transition={{ duration: 0.15 }}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref as React.RefObject<HTMLButtonElement>}
        {...buttonProps}
        whileHover={!isDisabled ? { 
          scale: 1.02,
          y: -1
        } : {}}
        whileTap={!isDisabled ? { 
          scale: 0.98,
          y: 0
        } : {}}
        transition={{ duration: 0.15 }}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;