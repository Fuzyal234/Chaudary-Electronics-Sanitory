'use client';

import { useState, useEffect, use } from 'react';
import SmartImage from '@/components/ui/SmartImage';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Plus, Minus, ChevronRight, Truck, ShieldCheck, RotateCcw, Star } from 'lucide-react';
import { useCatalog } from '@/context/CatalogContext';
import { useApp } from '@/context/AppContext';
import { formatPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import { Product } from '@/types';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getProductById, getProductsByCategory, ready } = useCatalog();
  const { addToCart, toggleWishlist, isInWishlist, addToRecentlyViewed } = useApp();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'features' | 'reviews'>('description');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const product = getProductById(id);

  // Record this product in the user's recently-viewed history.
  useEffect(() => {
    if (product) addToRecentlyViewed(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  // The catalog hydrates from localStorage on the client, so wait for it before
  // 404ing — otherwise an admin-added product would flash "not found".
  if (!product) {
    if (!ready) {
      return (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-5 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
            <div className="aspect-square rounded-[24px] bg-slate-100 dark:bg-white/5 animate-pulse" />
            <div className="space-y-4">
              <div className="h-6 w-32 rounded bg-slate-100 dark:bg-white/5 animate-pulse" />
              <div className="h-10 w-3/4 rounded bg-slate-100 dark:bg-white/5 animate-pulse" />
              <div className="h-24 w-full rounded bg-slate-100 dark:bg-white/5 animate-pulse" />
              <div className="h-12 w-full rounded bg-slate-100 dark:bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>
      );
    }
    notFound();
  }

  const inWishlist = isInWishlist(product.id);
  const related = getProductsByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 5);

  return (
    <>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-5 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8 flex-wrap">
          <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-secondary transition-colors">Products</Link>
          <ChevronRight size={14} />
          <Link href={`/categories/${product.category.toLowerCase()}`} className="hover:text-secondary transition-colors">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-primary dark:text-white font-medium line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-16">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-[24px] overflow-hidden bg-slate-50 dark:bg-dark-card border border-slate-100 dark:border-white/20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <SmartImage src={product.images[activeImage] || product.images[0]} alt={product.name} fill className="object-contain p-8" />
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-slate-50 dark:bg-dark-card ${activeImage === i ? 'border-secondary shadow-lg' : 'border-slate-100 dark:border-white/20 hover:border-secondary/50'}`}
                  >
                    <SmartImage src={img} alt="" fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {product.isNew && <Badge variant="new">NEW ARRIVAL</Badge>}
                  {product.isBestSeller && <Badge variant="sale">BEST SELLER</Badge>}
                  {product.isFeatured && <Badge variant="primary">FEATURED</Badge>}
                </div>
                <p className="text-sm font-bold text-secondary uppercase tracking-widest mb-2">{product.brand}</p>
                <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-primary dark:text-white leading-tight">
                  {product.name}
                </h1>
              </div>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border-2 flex-shrink-0 transition-all ${inWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 dark:border-white/20 text-slate-400 hover:border-red-200 hover:text-red-400'}`}
              >
                <Heart size={22} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <StarRating rating={product.rating} reviews={product.reviews} size="md" />
              <span className="text-sm text-slate-400">·</span>
              <span className="text-sm font-medium text-slate-400">SKU: {product.sku}</span>
            </div>

            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{product.shortDescription}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 p-4 rounded-xl bg-slate-50 dark:bg-white/5">
              <span className="font-heading text-4xl font-black text-primary dark:text-white">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="text-xl text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>
              )}
              {product.discount && (
                <span className="px-2.5 py-1 bg-red-100 text-red-600 font-bold text-sm rounded-lg">{product.discount}% OFF</span>
              )}
            </div>

            {/* Stock */}
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-6 border ${product.stock > 10 ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' : product.stock > 0 ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20' : 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20'}`}>
              <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span className={`font-semibold text-sm ${product.stock > 10 ? 'text-emerald-700 dark:text-emerald-400' : product.stock > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-red-700 dark:text-red-400'}`}>
                {product.stock > 10 ? `In Stock (${product.stock} available)` : product.stock > 0 ? `Only ${product.stock} left — order soon!` : 'Out of Stock — Contact us'}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-6 mb-6">
              <span className="font-semibold text-primary dark:text-white">Quantity:</span>
              <div className="flex items-center gap-3 border-2 border-slate-100 dark:border-white/20 rounded-xl p-1">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-bold text-lg text-primary dark:text-white">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => addToCart(product, qty)}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                <ShoppingCart size={20} /> Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-4 bg-secondary text-white font-bold rounded-xl hover:bg-secondary-dark transition-all shadow-xl text-base"
              >
                Buy Now
              </motion.button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: Truck, label: 'Free Delivery', sub: 'Over PKR 5,000' },
                { icon: ShieldCheck, label: 'Genuine', sub: '100% Authentic' },
                { icon: RotateCcw, label: '7-Day Return', sub: 'Easy returns' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/20">
                  <item.icon size={20} className="text-secondary mb-1.5" />
                  <p className="text-xs font-bold text-primary dark:text-white">{item.label}</p>
                  <p className="text-[10px] text-slate-400">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Top features */}
            {product.features.length > 0 && (
              <div className="space-y-2">
                {product.features.slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <span className="w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 text-[10px] font-bold">✓</span>
                    <span className="text-slate-600 dark:text-slate-300">{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex border-b border-slate-200 dark:border-white/20 mb-8 gap-1 overflow-x-auto">
            {(['description', 'specs', 'features', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-semibold whitespace-nowrap capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-secondary text-secondary' : 'border-transparent text-slate-400 hover:text-primary dark:hover:text-white'}`}
              >
                {tab === 'specs' ? 'Specifications' : tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'description' && (
                <div className="prose prose-slate dark:prose-invert max-w-3xl">
                  <p className="text-slate-600 dark:text-slate-300 leading-loose text-base">{product.description}</p>
                </div>
              )}
              {activeTab === 'specs' && (
                <div className="max-w-2xl">
                  <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-white/20">
                    {Object.entries(product.specifications).map(([key, val], i) => (
                      <div key={key} className={`flex gap-4 p-4 text-sm ${i % 2 === 0 ? 'bg-slate-50 dark:bg-white/5' : 'bg-white dark:bg-dark-card'}`}>
                        <span className="font-semibold text-primary dark:text-white w-1/3 flex-shrink-0">{key}</span>
                        <span className="text-slate-600 dark:text-slate-300">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'features' && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-dark-card border border-slate-100 dark:border-white/20">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === 'reviews' && (
                <div className="max-w-2xl space-y-4">
                  <div className="flex items-center gap-4 p-6 rounded-2xl bg-primary text-white">
                    <div className="text-center">
                      <div className="font-heading text-5xl font-black text-accent">{product.rating}</div>
                      <div className="flex gap-1 justify-center mt-1">
                        {[1,2,3,4,5].map((s) => <Star key={s} size={14} className={s <= product.rating ? 'fill-accent text-accent' : 'fill-white/20 text-white/60'} />)}
                      </div>
                      <p className="text-slate-400 text-xs mt-1">{product.reviews} reviews</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-300 mb-3">Customer Satisfaction</p>
                      {[5,4,3,2,1].map((s) => (
                        <div key={s} className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs text-slate-400 w-4">{s}★</span>
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-accent rounded-full" style={{ width: s === 5 ? '75%' : s === 4 ? '18%' : s === 3 ? '5%' : '2%' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-center text-slate-400 text-sm py-4">
                    Reviews are collected from verified purchases only
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary dark:text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
