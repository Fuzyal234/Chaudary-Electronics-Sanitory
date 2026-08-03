'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, PackageSearch } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import { useCatalog } from '@/context/CatalogContext';
import { Product } from '@/types';

const tabs = [
  { id: 'best', label: 'Moving fastest' },
  { id: 'featured', label: 'Counter picks' },
  { id: 'new', label: 'Just landed' },
];

export default function BestSellers() {
  const { getBestSellers, getFeaturedProducts, getNewArrivals } = useCatalog();
  const [activeTab, setActiveTab] = useState('best');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const products =
    activeTab === 'featured'
      ? getFeaturedProducts()
      : activeTab === 'new'
        ? getNewArrivals()
        : getBestSellers();

  return (
    <>
      <section className="py-14 sm:py-20 lg:py-24 bg-paper dark:bg-dark-surface">
        <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-9 sm:mb-12">
            <SectionHeader
              badge="Off the shelf"
              title="What contractors"
              highlight="are buying."
              subtitle="Ranked by what actually leaves the counter, not by what we would like to sell."
              align="left"
            />

            {/* Three tabs do not fit across a phone, so the strip scrolls
                instead of overflowing the screen edge. */}
            <div className="no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 lg:flex-shrink-0">
              <div className="inline-flex p-1 rounded-xl bg-bg dark:bg-white/5 border border-[var(--hair)] gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 lg:px-5 py-2.5 rounded-lg text-[13.5px] font-display font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-steel hover:text-primary dark:hover:text-white'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-lg bg-secondary"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <span className="relative">{tab.label}</span>
                </button>
              ))}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {products.length > 0 ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5"
              >
                {products.slice(0, 10).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </motion.div>
            ) : (
              /* Nothing is flagged for this shelf yet — point at what does exist
                 rather than leaving a hole in the page. */
              <motion.div
                key={`${activeTab}-empty`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="card flex flex-col items-center text-center px-6 py-16"
              >
                <span className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-5 dark:bg-white/10 dark:text-blue-300">
                  <PackageSearch size={24} />
                </span>
                <h3 className="font-display font-semibold text-[18px] text-primary dark:text-white">
                  Nothing on this shelf yet
                </h3>
                <p className="mt-2 text-[14px] text-steel dark:text-slate-400 max-w-sm">
                  No products carry the &ldquo;{tabs.find((t) => t.id === activeTab)?.label.toLowerCase()}&rdquo; mark
                  right now. The full catalog is still open.
                </p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-secondary text-white font-display font-semibold text-[14px] hover:bg-secondary-dark transition-colors"
                >
                  Browse the catalog
                  <ArrowRight size={15} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-center">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-primary text-white font-display font-semibold text-[15px] hover:bg-secondary transition-colors shadow-[0_14px_34px_-16px_rgba(13,26,45,0.9)]"
            >
              Browse every product
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
