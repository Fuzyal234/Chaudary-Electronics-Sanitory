'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Bath, Lightbulb, Droplets, Pipette, ToggleRight, Hammer, ShieldCheck, Wrench, Flame, Container, ChefHat, Paintbrush, Building2, Cog, DoorOpen } from 'lucide-react';
import { categories } from '@/data/categories';
import SectionHeader from '@/components/ui/SectionHeader';
import { useCatalog } from '@/context/CatalogContext';

const iconMap: Record<string, React.ReactNode> = {
  sanitary: <Bath size={32} />,
  electric: <Zap size={32} />,
  lighting: <Lightbulb size={32} />,
  bathroom: <Droplets size={32} />,
  pipes: <Pipette size={32} />,
  switches: <ToggleRight size={32} />,
  'water-pumps': <Wrench size={32} />,
  'water-tanks': <Container size={32} />,
  geysers: <Flame size={32} />,
  hardware: <Hammer size={32} />,
  plumbing: <Wrench size={32} />,
  tools: <Hammer size={32} />,
  paint: <Paintbrush size={32} />,
  kitchen: <ChefHat size={32} />,
  construction: <Building2 size={32} />,
  safety: <ShieldCheck size={32} />,
  fasteners: <Cog size={32} />,
  'door-hardware': <DoorOpen size={32} />,
};

export default function CategoriesPage() {
  const { categoryCounts } = useCatalog();
  return (
    <div>
      <div className="bg-primary py-16">
        <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Browse All"
            title="Shop by"
            highlight="Category"
            subtitle="Explore our comprehensive range of products across all categories"
            dark
          />
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link href={`/categories/${cat.slug}`} className="group block">
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden rounded-xl bg-white dark:bg-dark-card border border-slate-100 dark:border-white/20 shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 text-center h-full"
                >
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                    {iconMap[cat.slug] || <Wrench size={32} />}
                  </div>
                  <h3 className="font-bold text-primary dark:text-white text-sm leading-tight group-hover:text-secondary transition-colors mb-1">{cat.name}</h3>
                  <p className="text-xs text-slate-400">
                    {categoryCounts[cat.slug] === 1 ? '1 product' : `${categoryCounts[cat.slug] ?? 0} products`}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-3 text-secondary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all">
                    Browse <ArrowRight size={12} />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
