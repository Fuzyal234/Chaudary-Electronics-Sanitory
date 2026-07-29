'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Package, Award, MapPin, TrendingUp, Star } from 'lucide-react';

const stats = [
  { icon: Users, value: 10000, suffix: '+', label: 'Happy Customers', description: 'Trusted by homeowners & contractors' },
  { icon: Package, value: 850, suffix: '+', label: 'Products', description: 'Across 18+ categories' },
  { icon: Award, value: 13, suffix: '+', label: 'Premium Brands', description: 'Local and international brands' },
  { icon: MapPin, value: 20, suffix: '+', label: 'Years Experience', description: 'Serving since 2003' },
  { icon: TrendingUp, value: 50000, suffix: '+', label: 'Orders Delivered', description: 'Across Punjab and nationwide' },
  { icon: Star, value: 4.9, suffix: '/5', label: 'Customer Rating', description: 'Average satisfaction score', decimal: true },
];

function CountUp({ target, suffix, decimal }: { target: number; suffix: string; decimal?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
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
      {decimal ? count.toFixed(1) : Math.floor(count).toLocaleString('en-PK')}{suffix}
    </span>
  );
}

export default function StoreStats() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-primary">

      <div className="relative max-w-screen-2xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 text-accent text-xs font-bold tracking-[0.2em] uppercase mb-4">
            <span className="h-px w-8 bg-accent" /> Our Numbers <span className="h-px w-8 bg-accent" />
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white">
            Trusted by Thousands <br />
            <span className="text-accent">Across Pakistan</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex flex-col items-center text-center p-8 glass hover:bg-white/15 transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <stat.icon size={22} className="text-accent" />
              </div>
              <div className="font-heading text-3xl lg:text-4xl font-black text-white mb-1">
                <CountUp target={stat.value} suffix={stat.suffix} decimal={stat.decimal} />
              </div>
              <div className="font-semibold text-white text-sm mb-1">{stat.label}</div>
              <div className="text-slate-400 text-xs">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
