'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Grid3X3, List } from 'lucide-react';
import { getCategoryBySlug } from '@/data/categories';
import { useCatalog } from '@/context/CatalogContext';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import { Product } from '@/types';
import { notFound } from 'next/navigation';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { getProductsByCategory } = useCatalog();
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const products = getProductsByCategory(category.name);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <>
      {/* Header */}
      <div className="bg-primary py-14">
        <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/categories" className="hover:text-accent transition-colors">Categories</Link>
            <ChevronRight size={14} />
            <span className="text-white">{category.name}</span>
          </div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">{category.name}</h1>
          <p className="text-slate-400 max-w-2xl">{category.description}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {category.subcategories.map((sub) => (
              <span key={sub} className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium border border-white/20">
                {sub}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {products.length > 0 ? `${products.length} products in ${category.name}` : `No products yet in ${category.name}`}
          </p>
          <div className="flex gap-2">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-secondary text-white' : 'text-slate-400 hover:text-secondary'}`}>
              <Grid3X3 size={18} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-secondary text-white' : 'text-slate-400 hover:text-secondary'}`}>
              <List size={18} />
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl font-semibold text-slate-400 mb-2">Products coming soon</p>
            <p className="text-slate-400 mb-6">We&apos;re adding new {category.name} products regularly</p>
            <Link href="/products" className="px-6 py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-secondary-dark transition-colors inline-block">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6' : 'space-y-4'}>
            {products.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ProductCard product={product} variant={viewMode === 'list' ? 'list' : 'default'} onQuickView={setQuickViewProduct} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
