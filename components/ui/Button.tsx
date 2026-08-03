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
    // Squared, flat, decisive — a counter button, not a pillow.
    const base = 'inline-flex items-center justify-center gap-2 font-display font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer select-none rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed relative';

    const variants = {
      primary: "bg-secondary text-white hover:bg-secondary-dark shadow-[0_10px_24px_-12px_rgba(30,90,200,0.95)]",
      secondary: "bg-primary text-white hover:bg-primary-light shadow-[0_10px_24px_-12px_rgba(13,26,45,0.9)]",
      gold: "bg-accent text-white hover:bg-accent-dark shadow-[0_10px_24px_-12px_rgba(14,156,156,0.95)]",
      outline: "border-2 border-[var(--hair-strong)] text-primary dark:text-white hover:bg-primary hover:text-white hover:border-primary dark:hover:bg-white dark:hover:text-primary bg-transparent",
      ghost: "text-primary dark:text-slate-200 hover:bg-primary/8 dark:hover:bg-white/10 bg-transparent",
      danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizes = {
      sm: 'text-[13px] px-3.5 h-9',
      md: 'text-[14px] px-5 h-11',
      lg: 'text-[15px] px-7 h-12',
      xl: 'text-[16px] px-9 h-14',
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
