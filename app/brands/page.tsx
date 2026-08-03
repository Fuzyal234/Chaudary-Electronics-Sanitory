'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Globe, Package, Calendar } from 'lucide-react';
import { brands } from '@/data/brands';
import SectionHeader from '@/components/ui/SectionHeader';
import { useState } from 'react';

const allCountries = ['All', ...Array.from(new Set(brands.map((b) => b.country)))];

export default function BrandsPage() {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? brands : brands.filter((b) => b.country === filter);

  return (
    <div>
      <div className="bg-primary py-16">
        <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Our Partners"
            title="Premium"
            highlight="Brands"
            subtitle="Official stockists of Pakistan's most trusted and international premium brands"
            dark
          />
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {allCountries.map((country) => (
            <button
              key={country}
              onClick={() => setFilter(country)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${filter === country ? 'bg-secondary text-white border-secondary' : 'border-slate-200 dark:border-white/20 text-slate-600 dark:text-slate-300 hover:border-secondary'}`}
            >
              {country}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Link href={`/brands/${brand.slug}`} className="group block h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col p-6 rounded-xl bg-white dark:bg-dark-card border border-slate-100 dark:border-white/20 shadow-sm hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Logo */}
                  <div className="relative h-20 mb-5 rounded-xl bg-slate-50 dark:bg-white/5 overflow-hidden">
                    <Image src={brand.logo} alt={brand.name} fill className="object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
                  </div>

                  <h3 className="font-heading font-bold text-primary dark:text-white text-xl mb-2 group-hover:text-secondary transition-colors">
                    {brand.name}
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                    {brand.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t border-slate-100 dark:border-white/20 text-center">
                    <div>
                      <Globe size={14} className="text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-400">{brand.country}</p>
                    </div>
                    <div>
                      <Package size={14} className="text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-400">{brand.productCount}+ items</p>
                    </div>
                    <div>
                      <Calendar size={14} className="text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-400">Est. {brand.established}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {brand.categories.slice(0, 3).map((cat) => (
                      <span key={cat} className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-semibold rounded-md">{cat}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-secondary text-sm font-semibold group-hover:gap-2 transition-all">
                    View Products <ArrowRight size={16} />
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
