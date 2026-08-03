'use client';

import { useEffect, useState, useId } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * The Chaudhry lockup.
 *
 * The mark is a "C" drawn as an open ring — a pipe collar seen end-on — closed
 * by a teal droplet where the two trades meet. It draws itself once on load,
 * then a light sweeps across the tile on a slow loop.
 *
 * The three trades in the tagline take it in turns to light up, so the strap
 * line says what the shop does instead of just sitting there.
 */

const TRADES = ['Sanitary', 'Electric', 'Hardware'] as const;
const WORDMARK = 'CHAUDHRY'.split('');
const ease = [0.22, 1, 0.36, 1] as const;

interface LogoProps {
  /** 'light' for light backgrounds (navbar), 'dark' for navy bands (footer). */
  tone?: 'light' | 'dark';
  href?: string;
  className?: string;
  /** Hide the wordmark below a breakpoint. */
  compact?: boolean;
}

function Mark({ tone, reduced }: { tone: 'light' | 'dark'; reduced: boolean }) {
  const uid = useId().replace(/:/g, '');
  const gradId = `logo-grad-${uid}`;
  const sweepId = `logo-sweep-${uid}`;
  const clipId = `logo-clip-${uid}`;

  return (
    <motion.svg
      viewBox="0 0 44 44"
      width={44}
      height={44}
      role="img"
      aria-label="Chaudhry"
      className="flex-shrink-0 drop-shadow-[0_6px_14px_rgba(13,26,45,0.35)]"
      whileHover={reduced ? undefined : { rotate: -7, scale: 1.07 }}
      transition={{ type: 'spring', stiffness: 380, damping: 17 }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          {tone === 'light' ? (
            <>
              <stop offset="0%" stopColor="#1B2E4A" />
              <stop offset="55%" stopColor="#0D1A2D" />
              <stop offset="100%" stopColor="#14324F" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#DCE6F2" />
            </>
          )}
        </linearGradient>

        <linearGradient id={sweepId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity={tone === 'light' ? 0.5 : 0.85} />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        <clipPath id={clipId}>
          <rect x="0" y="0" width="44" height="44" rx="13" />
        </clipPath>
      </defs>

      {/* Tile */}
      <rect x="0" y="0" width="44" height="44" rx="13" fill={`url(#${gradId})`} />

      {/* The C — an open collar, drawn once on load */}
      <motion.path
        d="M30.5 14.2a10.6 10.6 0 1 0 0 15.6"
        fill="none"
        stroke={tone === 'light' ? '#FFFFFF' : '#0D1A2D'}
        strokeWidth="4.4"
        strokeLinecap="round"
        initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
        animate={reduced ? undefined : { pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease, delay: 0.15 }}
      />

      {/* The droplet closing the gap — where the trades meet */}
      <motion.circle
        cx="31.6"
        cy="22"
        r="3.1"
        fill="#22BDBD"
        initial={reduced ? undefined : { scale: 0, opacity: 0 }}
        animate={reduced ? undefined : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease, delay: 1.05 }}
        style={{ transformOrigin: '31.6px 22px' }}
      />

      {/* Light sweeping across the tile, on the same cadence as the wordmark */}
      {!reduced && (
        <g clipPath={`url(#${clipId})`}>
          <motion.rect
            x="-30"
            y="-14"
            width="26"
            height="72"
            fill={`url(#${sweepId})`}
            transform="rotate(18 0 0)"
            animate={{ x: [-30, 60] }}
            transition={{ duration: 1.1, ease: 'easeInOut', repeat: Infinity, repeatDelay: 5.4, delay: 1.6 }}
          />
        </g>
      )}
    </motion.svg>
  );
}

export default function Logo({ tone = 'light', href = '/', className, compact }: LogoProps) {
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);

  // Each trade takes a turn. Stops entirely when motion is reduced.
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setActive((i) => (i + 1) % TRADES.length), 2300);
    return () => clearInterval(t);
  }, [reduced]);

  return (
    <Link
      href={href}
      aria-label="Chaudhry Sanitary, Electric and Hardware — home"
      className={cn('group flex items-center gap-3 flex-shrink-0', className)}
    >
      <Mark tone={tone} reduced={reduced} />

      <div className={cn(compact && 'hidden sm:block')}>
        {/* Wordmark — letters set themselves, then a current runs through */}
        <div
          className={cn(
            'wordmark font-display font-extrabold text-[17px] lg:text-[19px] leading-none tracking-[-0.035em] flex',
            tone === 'dark' && 'wordmark-on-dark'
          )}
        >
          {WORDMARK.map((letter, i) => (
            <motion.span
              key={`${letter}-${i}`}
              initial={reduced ? undefined : { opacity: 0, y: 9 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + 0.045 * i, duration: 0.4, ease }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Trades — one lights up at a time */}
        <div className="flex items-center gap-[6px] mt-[7px]">
          {TRADES.map((trade, i) => (
            <span key={trade} className="flex items-center gap-[6px]">
              {i > 0 && (
                <span
                  className={cn(
                    'w-[3px] h-[3px] rounded-full',
                    tone === 'dark' ? 'bg-white/35' : 'bg-steel/40'
                  )}
                />
              )}
              <span
                className={cn(
                  't-eyebrow text-[9.5px] transition-colors duration-500',
                  i === active
                    ? tone === 'dark'
                      ? 'text-accent-light'
                      : 'text-accent'
                    : tone === 'dark'
                      ? 'text-white/60'
                      : 'text-steel'
                )}
              >
                {trade}
              </span>
            </span>
          ))}
        </div>

        {/* Underline that draws on hover */}
        <span
          className={cn(
            'block h-[2px] mt-1.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out rounded-full',
            tone === 'dark' ? 'bg-accent-light' : 'bg-secondary'
          )}
        />
      </div>
    </Link>
  );
}
