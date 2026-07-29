'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Bath, Lightbulb, Droplets, Pipette, ToggleRight, Hammer, ShieldCheck, Wrench, Flame } from 'lucide-react';
import { categories } from '@/data/categories';

const iconMap: Record<string, React.ReactNode> = {
  sanitary:      <Bath size={24} />,
  electric:      <Zap size={24} />,
  lighting:      <Lightbulb size={24} />,
  bathroom:      <Droplets size={24} />,
  pipes:         <Pipette size={24} />,
  switches:      <ToggleRight size={24} />,
  'water-pumps': <Wrench size={24} />,
  'water-tanks': <Wrench size={24} />,
  geysers:       <Flame size={24} />,
  hardware:      <Hammer size={24} />,
  tools:         <Hammer size={24} />,
  safety:        <ShieldCheck size={24} />,
};

const colorMap: Record<string, { from: string; to: string; glow: string }> = {
  sanitary:      { from: '#3b82f6', to: '#1d4ed8', glow: '#3b82f620' },
  electric:      { from: '#f59e0b', to: '#d97706', glow: '#f59e0b20' },
  lighting:      { from: '#8b5cf6', to: '#7c3aed', glow: '#8b5cf620' },
  bathroom:      { from: '#06b6d4', to: '#0891b2', glow: '#06b6d420' },
  pipes:         { from: '#10b981', to: '#059669', glow: '#10b98120' },
  switches:      { from: '#f97316', to: '#ea580c', glow: '#f9731620' },
  'water-pumps': { from: '#0ea5e9', to: '#0284c7', glow: '#0ea5e920' },
  'water-tanks': { from: '#14b8a6', to: '#0f766e', glow: '#14b8a620' },
  geysers:       { from: '#ef4444', to: '#dc2626', glow: '#ef444420' },
  hardware:      { from: '#6b7280', to: '#4b5563', glow: '#6b728020' },
  tools:         { from: '#78716c', to: '#57534e', glow: '#78716c20' },
  safety:        { from: '#22c55e', to: '#16a34a', glow: '#22c55e20' },
};

const defaultColor = { from: '#3b82f6', to: '#1d4ed8', glow: '#3b82f620' };
const featured = categories.slice(0, 8);

export default function FeaturedCategories() {
  return (
    <section className="py-20 lg:py-24 bg-white dark:bg-dark-bg">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-secondary mb-3">Shop by Category</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
            Everything You <span className="text-secondary">Need</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-lg mx-auto text-sm">
            From luxury sanitary ware to industrial-grade electrical components — all in one place.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {featured.map((cat, i) => {
            const color = colorMap[cat.slug] ?? defaultColor;
            const icon = iconMap[cat.slug] ?? <Wrench size={24} />;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/categories/${cat.slug}`} className="group block">
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="relative rounded-2xl bg-white dark:bg-dark-card border border-slate-100 dark:border-white/10 p-5 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Background glow on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                      style={{ background: `radial-gradient(circle at 30% 30%, ${color.glow}, transparent 70%)` }}
                    />

                    {/* Icon */}
                    <div
                      className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
                    >
                      {icon}
                    </div>

                    {/* Text */}
                    <h3 className="relative font-semibold text-slate-800 dark:text-white text-sm leading-tight mb-1 group-hover:text-secondary dark:group-hover:text-accent transition-colors">
                      {cat.name}
                    </h3>
                    <p className="relative text-xs text-slate-400">{cat.productCount}+ products</p>

                    {/* Arrow */}
                    <div className="relative flex items-center gap-1 mt-3 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
                      style={{ color: color.from }}
                    >
                      Shop <ArrowRight size={11} />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-7 py-3 border-2 border-secondary text-secondary font-semibold rounded-xl hover:bg-secondary hover:text-white transition-all duration-250 text-sm"
          >
            All {categories.length} Categories <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
