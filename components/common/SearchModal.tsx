'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { searchProducts } from '@/data/products';
import { formatPrice } from '@/lib/utils';

const trending = ['Toilet', 'LED Panel', 'Water Pump', 'GM Wire', 'Ball Valve', 'Philips Bulb'];
const recent = ['Schneider MCB', 'Rain Shower', 'Kitchen Sink'];

export default function SearchModal() {
  const { searchOpen, setSearchOpen } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Results are derived from the query — no effect/state duplication needed.
  const results = useMemo(
    () => (query.trim().length >= 2 ? searchProducts(query).slice(0, 6) : []),
    [query]
  );

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery('');
  }, [setSearchOpen]);

  // Lock body scroll and focus the input while the modal is open (DOM side-effects only).
  useEffect(() => {
    if (!searchOpen) return;
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 100);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = '';
    };
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeSearch, setSearchOpen]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-primary/60 dark:bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
          onClick={closeSearch}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white dark:bg-dark-card rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-white/10"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-white/10">
              <Search size={22} className="text-secondary flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, brands, categories..."
                className="flex-1 text-base text-primary dark:text-white placeholder:text-slate-400 bg-transparent outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={18} />
                </button>
              )}
              <button
                onClick={closeSearch}
                className="text-xs px-2 py-1 rounded border border-slate-200 dark:border-white/20 text-slate-400 dark:text-slate-300 hover:border-slate-300 transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {results.length > 0 ? (
                <div className="p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{results.length} Results</p>
                  <div className="space-y-2">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={closeSearch}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-white/10 overflow-hidden flex-shrink-0 relative">
                          <Image src={product.images[0]} alt={product.name} fill className="object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-primary dark:text-white text-sm group-hover:text-secondary transition-colors truncate">{product.name}</p>
                          <p className="text-xs text-slate-400">{product.brand} · {product.category}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-primary dark:text-white text-sm">{formatPrice(product.price)}</p>
                          <p className="text-xs text-emerald-500">In Stock</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={closeSearch}
                    className="flex items-center justify-center gap-2 w-full mt-3 py-3 text-secondary text-sm font-semibold hover:bg-secondary/5 rounded-xl transition-colors"
                  >
                    View all results for &ldquo;{query}&rdquo; <ArrowRight size={16} />
                  </Link>
                </div>
              ) : query.length >= 2 ? (
                <div className="p-8 text-center">
                  <Search size={40} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No results for &ldquo;{query}&rdquo;</p>
                  <p className="text-slate-400 text-sm mt-1">Try different keywords or browse categories</p>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Recent */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={14} className="text-slate-400" />
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Searches</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recent.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-sm hover:bg-secondary/10 hover:text-secondary transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Trending */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={14} className="text-secondary" />
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trending Now</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trending.map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-3 py-1.5 rounded-lg border border-secondary/20 text-secondary text-sm hover:bg-secondary/10 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
