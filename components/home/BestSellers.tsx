'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import { getBestSellers, getFeaturedProducts, getNewArrivals } from '@/data/products';
import { Product } from '@/types';

const tabs = [
  { id: 'best', label: 'Best Sellers', getter: getBestSellers },
  { id: 'featured', label: 'Featured', getter: getFeaturedProducts },
  { id: 'new', label: 'New Arrivals', getter: getNewArrivals },
];

export default function BestSellers() {
  const [activeTab, setActiveTab] = useState('best');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const products = tabs.find((t) => t.id === activeTab)?.getter() ?? [];

  return (
    <>
      <section className="py-20 lg:py-28 bg-slate-50 dark:bg-dark-surface">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeader
              badge="Top Picks"
              title="Our"
              highlight="Best Products"
              subtitle="Handpicked for quality, value and customer satisfaction."
              align="left"
            />
            <div className="flex items-center p-1 bg-white dark:bg-dark-card rounded-xl border border-slate-100 dark:border-white/10 shadow-sm gap-1 flex-shrink-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-slate-500 hover:text-primary dark:hover:text-white'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="tab-bg"
                      className="absolute inset-0 bg-secondary rounded-lg"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <span className="relative">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6"
            >
              {products.slice(0, 10).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary dark:bg-secondary text-white font-bold rounded-xl hover:bg-primary-light dark:hover:bg-secondary-dark transition-all shadow-lg hover:shadow-xl text-base"
            >
              View All Products <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
