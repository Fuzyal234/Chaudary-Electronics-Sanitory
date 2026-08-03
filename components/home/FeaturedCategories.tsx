'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Bath, Lightbulb, Droplets, Pipette, ToggleRight, Hammer, ShieldCheck, Wrench, Flame, Container } from 'lucide-react';
import { categories } from '@/data/categories';
import SectionHeader from '@/components/ui/SectionHeader';
import { useCatalog } from '@/context/CatalogContext';

const iconMap: Record<string, React.ReactNode> = {
  sanitary:      <Bath size={22} />,
  electric:      <Zap size={22} />,
  lighting:      <Lightbulb size={22} />,
  bathroom:      <Droplets size={22} />,
  pipes:         <Pipette size={22} />,
  switches:      <ToggleRight size={22} />,
  'water-pumps': <Wrench size={22} />,
  'water-tanks': <Container size={22} />,
  geysers:       <Flame size={22} />,
  hardware:      <Hammer size={22} />,
  tools:         <Hammer size={22} />,
  safety:        <ShieldCheck size={22} />,
};

const featured = categories.slice(0, 8);
const ease = [0.22, 1, 0.36, 1] as const;

export default function FeaturedCategories() {
  const { categoryCounts } = useCatalog();
  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-bg dark:bg-dark-bg">
      <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader
            badge="Shop by department"
            title="Everything the counter"
            highlight="carries."
            subtitle="Eighteen departments under one roof — from a single washer to a full electrical fit-out."
            align="left"
          />
          <Link
            href="/categories"
            className="group hidden md:inline-flex items-center gap-2 text-[14px] font-display font-semibold text-secondary hover:text-secondary-dark transition-colors flex-shrink-0"
          >
            All {categories.length} departments
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {featured.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05, duration: 0.5, ease }}
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="group card card-hover flex flex-col h-full p-5 lg:p-6 overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/8 text-secondary flex items-center justify-center mb-5 group-hover:bg-secondary group-hover:text-white transition-colors duration-300 dark:bg-white/8 dark:text-blue-300">
                  {iconMap[cat.slug] ?? <Wrench size={22} />}
                </div>

                <div>
                  <h3 className="font-display font-semibold text-[16px] leading-tight text-primary dark:text-white group-hover:text-secondary dark:group-hover:text-blue-300 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[13px] text-steel dark:text-slate-400">
                      {categoryCounts[cat.slug] === 1 ? '1 product' : `${categoryCounts[cat.slug] ?? 0} products`}
                    </span>
                    <ArrowRight
                      size={15}
                      className="text-steel group-hover:text-secondary group-hover:translate-x-1 transition-all duration-300"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 md:hidden">
          <Link
            href="/categories"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--hair-strong)] text-primary dark:text-white font-display font-semibold text-[14px] hover:bg-secondary hover:text-white hover:border-secondary transition-colors"
          >
            All {categories.length} departments
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
