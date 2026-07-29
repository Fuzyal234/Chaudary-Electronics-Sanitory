'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  dark?: boolean;
  className?: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function SectionHeader({ badge, title, highlight, subtitle, align = 'center', dark, className }: SectionHeaderProps) {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease }}
      className={cn('flex flex-col gap-3', alignClass[align], className)}
    >
      {badge && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-secondary"
        >
          <span className="h-px w-8 bg-accent" />
          {badge}
          <span className="h-px w-8 bg-accent" />
        </motion.span>
      )}

      <h2 className={cn(
        'text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight',
        dark ? 'text-white' : 'text-primary'
      )}>
        {title}{' '}
        {highlight && (
          <span className="gradient-text">{highlight}</span>
        )}
      </h2>

      {subtitle && (
        <p className={cn(
          'text-base sm:text-lg max-w-2xl leading-relaxed',
          dark ? 'text-slate-300' : 'text-slate-500',
          align === 'center' && 'mx-auto'
        )}>
          {subtitle}
        </p>
      )}

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.25, ease }}
        className={cn(
          'flex gap-1 mt-1 origin-left',
          align === 'center' && 'justify-center origin-center',
          align === 'right' && 'justify-end origin-right'
        )}
      >
        <span className="h-1 w-12 rounded-full bg-secondary" />
        <span className="h-1 w-4 rounded-full bg-accent" />
        <span className="h-1 w-2 rounded-full bg-secondary/25" />
      </motion.div>
    </motion.div>
  );
}
