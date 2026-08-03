'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  /** Kept for call-site compatibility; no longer rendered. */
  index?: string;
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  dark?: boolean;
  className?: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function SectionHeader({
  badge,
  title,
  highlight,
  subtitle,
  align = 'center',
  dark,
  className,
}: SectionHeaderProps) {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease }}
      className={cn('flex flex-col', alignClass[align], className)}
    >
      {badge && (
        <span
          className={cn(
            't-eyebrow inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full mb-5',
            dark
              ? 'bg-white/8 text-accent-light border border-white/20'
              : 'bg-accent/8 text-accent border border-accent/15'
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {badge}
        </span>
      )}

      <h2
        className={cn(
          't-plate text-[2rem] sm:text-[2.4rem] lg:text-[2.9rem] max-w-3xl',
          dark ? 'text-white' : 'text-primary dark:text-white'
        )}
      >
        {title}
        {highlight && (
          <>
            {' '}
            <span className="gradient-text">{highlight}</span>
          </>
        )}
      </h2>

      {subtitle && (
        <p
          className={cn(
            'mt-4 text-[15px] max-w-xl leading-relaxed',
            dark ? 'text-white/75' : 'text-steel dark:text-slate-400',
            align === 'center' && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
