'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionHeader from '@/components/ui/SectionHeader';

/** The record. Six figures, no icons — the numbers are the argument. */
const stats = [
  { value: 10000, suffix: '+', label: 'Customers served', note: 'Homeowners, plumbers and contractors' },
  { value: 850,   suffix: '+', label: 'Products stocked', note: 'Across 18 departments' },
  { value: 13,    suffix: '',  label: 'Brands carried', note: 'Master, Sonex, Schneider, Philips and more' },
  { value: 22,    suffix: '',  label: 'Years at the counter', note: 'Trading in Lahore since 2003' },
  { value: 50000, suffix: '+', label: 'Orders delivered', note: 'Punjab and nationwide' },
  { value: 4.9,   suffix: '/5', label: 'Customer rating', note: 'Average across verified orders', decimal: true },
];

function CountUp({ target, suffix, decimal }: { target: number; suffix: string; decimal?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const steps = 50;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {decimal ? count.toFixed(1) : Math.floor(count).toLocaleString('en-PK')}
      <span className="text-accent-light">{suffix}</span>
    </span>
  );
}

export default function StoreStats() {
  return (
    <section className="relative py-14 sm:py-20 lg:py-24 field-dark text-white overflow-hidden">
      <div className="absolute inset-0 dotfield opacity-35 pointer-events-none" />

      <div className="relative max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-10">
        <SectionHeader
          badge="The record"
          title="Twenty-two years of the same"
          highlight="shopfront."
          subtitle="Numbers a supplier can be judged on, kept up to date."
          align="center"
          dark
          className="mb-14"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="card-dark p-7 lg:p-8"
            >
              <div className="t-figure text-[2.4rem] lg:text-[3rem] leading-none text-white">
                <CountUp target={stat.value} suffix={stat.suffix} decimal={stat.decimal} />
              </div>
              <div className="font-display font-semibold text-[15px] text-white mt-4">{stat.label}</div>
              <div className="text-[13px] text-white/70 mt-1.5 leading-relaxed">{stat.note}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
