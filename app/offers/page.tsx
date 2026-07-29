'use client';

import { motion } from 'framer-motion';
import { Percent, Flame, Zap, Star } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { products } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import { useState } from 'react';
import { Product } from '@/types';

const deals = products.filter((p) => p.discount && p.discount >= 15).sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));

export default function OffersPage() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <>
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#1a2f6e] to-secondary" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative max-w-screen-2xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Flame size={16} className="text-accent" />
              <span className="text-accent text-sm font-bold">Limited Time Offers</span>
            </div>
            <h1 className="font-heading text-5xl lg:text-7xl font-bold text-white mb-4">
              Today&apos;s <span className="text-accent">Best Deals</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Exclusive discounts on premium sanitary, electrical and hardware products. Updated daily — don&apos;t miss out!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Promo Codes */}
      <section className="py-12 bg-slate-50 dark:bg-dark-surface">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { code: 'SANITARY25', desc: '25% OFF on all sanitary products', color: 'from-primary to-primary-light', icon: Star },
              { code: 'ELECT20', desc: '20% OFF electrical items', color: 'from-secondary to-blue-700', icon: Zap },
              { code: 'TOOLS30', desc: '30% OFF tools & hardware', color: 'from-emerald-700 to-emerald-900', icon: Percent },
            ].map((promo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${promo.color} text-white`}
              >
                <promo.icon size={40} className="absolute right-4 top-4 opacity-10" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Promo Code</p>
                <div className="font-mono font-black text-2xl text-accent mb-2">{promo.code}</div>
                <p className="text-sm text-white/80">{promo.desc}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(promo.code)}
                  className="mt-3 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors border border-white/20"
                >
                  Copy Code
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals */}
      <section className="py-16 bg-bg dark:bg-dark-bg">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <SectionHeader badge="On Sale Now" title="Discounted" highlight="Products" className="mb-12" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {deals.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <ProductCard product={product} onQuickView={setQuickViewProduct} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
