'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useCatalog } from '@/context/CatalogContext';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import { Product } from '@/types';

function SearchResults() {
  const { searchProducts } = useCatalog();
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const results = query.trim().length >= 2 ? searchProducts(query) : [];

  return (
    <>
      <div className="bg-primary py-12">
        <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold text-white mb-6">Search Products</h1>
          <div className="relative max-w-2xl">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, brands, categories..."
              autoFocus
              className="w-full pl-12 pr-12 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-base focus:outline-none focus:border-accent focus:bg-white/15 transition-all"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
        {query.trim().length < 2 ? (
          <div className="text-center py-20">
            <Search size={60} className="text-slate-200 mx-auto mb-4" />
            <p className="text-xl font-semibold text-slate-400">Start typing to search...</p>
            <p className="text-slate-400 text-sm mt-2">Search by product name, brand, or category</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <Search size={60} className="text-slate-200 mx-auto mb-4" />
            <p className="text-xl font-semibold text-slate-400">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-slate-400 text-sm mt-2">Try different keywords or browse our categories</p>
          </div>
        ) : (
          <>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Found <strong>{results.length}</strong> results for &ldquo;{query}&rdquo;
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
              {results.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
