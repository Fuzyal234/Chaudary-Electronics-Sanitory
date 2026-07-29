'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  glow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, iconPosition = 'left', fullWidth, glow, className, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 cursor-pointer select-none rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden';

    const variants = {
      primary: 'bg-secondary text-white hover:bg-secondary-dark focus-visible:ring-secondary shadow-lg hover:shadow-xl hover:shadow-secondary/30',
      secondary: 'bg-primary text-white hover:bg-primary-light focus-visible:ring-primary shadow-lg hover:shadow-xl',
      gold: 'bg-accent text-white hover:bg-accent-dark focus-visible:ring-accent shadow-md hover:shadow-lg font-bold',
      outline: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white focus-visible:ring-secondary bg-transparent',
      ghost: 'text-primary hover:bg-primary/10 focus-visible:ring-primary bg-transparent',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-lg',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 h-8',
      md: 'text-sm px-5 py-2.5 h-10',
      lg: 'text-base px-7 py-3 h-12',
      xl: 'text-lg px-9 py-4 h-14',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          glow && variant === 'primary' && 'btn-glow',
          glow && variant === 'gold' && 'btn-gold-glow',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {/* Shimmer effect */}
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
