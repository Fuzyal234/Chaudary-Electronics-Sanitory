'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal, Grid3X3, List, X, Search } from 'lucide-react';
import { products as allProducts } from '@/data/products';
import { categories } from '@/data/categories';
import { brands } from '@/data/brands';
import { FilterState, Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
const PRICE_MAX = 200000;

const defaultFilters: FilterState = {
  categories: [],
  brands: [],
  priceRange: [0, PRICE_MAX],
  rating: 0,
  availability: 'all',
  sortBy: 'featured',
  viewMode: 'grid',
};

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let result = allProducts;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    if (filters.categories.length > 0) result = result.filter((p) => filters.categories.includes(p.category));
    if (filters.brands.length > 0) result = result.filter((p) => filters.brands.includes(p.brand));
    result = result.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    return [...result].sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [filters, searchQuery]);

  const toggleCategory = (cat: string) =>
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(cat) ? f.categories.filter((c) => c !== cat) : [...f.categories, cat],
    }));

  const toggleBrand = (brand: string) =>
    setFilters((f) => ({
      ...f,
      brands: f.brands.includes(brand) ? f.brands.filter((b) => b !== brand) : [...f.brands, brand],
    }));

  const resetFilters = () => { setFilters(defaultFilters); setSearchQuery(''); };
  const hasActiveFilters = filters.categories.length > 0 || filters.brands.length > 0;

  const sidebar = (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 text-sm focus:outline-none focus:border-secondary transition-colors placeholder:text-slate-400"
        />
      </div>

      {/* Categories */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Categories</p>
        <div className="space-y-1 max-h-56 overflow-y-auto">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer py-1 group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.name)}
                onChange={() => toggleCategory(cat.name)}
                className="w-3.5 h-3.5 rounded accent-secondary"
              />
              <span className="text-sm text-slate-600 dark:text-slate-300 flex-1 group-hover:text-secondary transition-colors">{cat.name}</span>
              <span className="text-xs text-slate-400">{cat.productCount}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Brands</p>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-2 cursor-pointer py-1 group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand.name)}
                onChange={() => toggleBrand(brand.name)}
                className="w-3.5 h-3.5 rounded accent-secondary"
              />
              <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-secondary transition-colors">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-dark-card">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">All Products</h1>
          <p className="text-sm text-slate-400 mt-0.5">{allProducts.length} items</p>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-slate-700 dark:text-white text-sm">Filters</span>
                {hasActiveFilters && (
                  <button onClick={resetFilters} className="text-xs text-slate-400 hover:text-red-500 transition-colors">Reset</button>
                )}
              </div>
              {sidebar}
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-white/15 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:border-secondary hover:text-secondary transition-colors"
                >
                  <SlidersHorizontal size={14} /> Filters
                </button>
                <span className="text-sm text-slate-500">{filtered.length} products</span>
              </div>

              <div className="flex items-center gap-1 border border-slate-200 dark:border-white/15 rounded-lg p-0.5">
                <button
                  onClick={() => setFilters((f) => ({ ...f, viewMode: 'grid' }))}
                  className={`p-1.5 rounded-md transition-colors ${filters.viewMode === 'grid' ? 'bg-secondary text-white' : 'text-slate-400 hover:text-secondary'}`}
                >
                  <Grid3X3 size={15} />
                </button>
                <button
                  onClick={() => setFilters((f) => ({ ...f, viewMode: 'list' }))}
                  className={`p-1.5 rounded-md transition-colors ${filters.viewMode === 'list' ? 'bg-secondary text-white' : 'text-slate-400 hover:text-secondary'}`}
                >
                  <List size={15} />
                </button>
              </div>
            </div>

            {/* Active tags */}
            {(filters.categories.length > 0 || filters.brands.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.categories.map((cat) => (
                  <span key={cat} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs rounded-full">
                    {cat}
                    <button onClick={() => toggleCategory(cat)}><X size={10} /></button>
                  </span>
                ))}
                {filters.brands.map((brand) => (
                  <span key={brand} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs rounded-full">
                    {brand}
                    <button onClick={() => toggleBrand(brand)}><X size={10} /></button>
                  </span>
                ))}
              </div>
            )}

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-slate-400 mb-4">No products match your filters.</p>
                <button onClick={resetFilters} className="px-5 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary-dark transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={filters.viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className={
                    filters.viewMode === 'grid'
                      ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4'
                      : 'space-y-3'
                  }
                >
                  {filtered.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant={filters.viewMode === 'list' ? 'list' : 'default'}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-dark-card z-50 shadow-xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/10">
                <span className="font-semibold text-slate-800 dark:text-white">Filters</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-4">
                {sidebar}
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-white/10">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-full py-2.5 bg-secondary text-white rounded-lg text-sm font-semibold hover:bg-secondary-dark transition-colors"
                >
                  Show {filtered.length} results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
