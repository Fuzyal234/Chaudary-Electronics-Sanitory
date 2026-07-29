'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart, ArrowRight, Plus, Minus } from 'lucide-react';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { formatPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: Props) {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) return null;
  const inWishlist = isInWishlist(product.id);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-dark-card rounded-[24px] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Gallery */}
              <div className="relative p-6 bg-slate-50 dark:bg-white/5 rounded-t-[24px] md:rounded-l-[24px] md:rounded-tr-none">
                <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl bg-white dark:bg-dark-card flex items-center justify-center shadow-md hover:bg-slate-50 transition-colors">
                  <X size={18} className="text-slate-500" />
                </button>
                <div className="aspect-square relative rounded-2xl overflow-hidden bg-white dark:bg-dark-card">
                  <Image src={product.images[activeImage] || product.images[0]} alt={product.name} fill className="object-contain p-4" />
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-2 mt-3">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all relative ${activeImage === i ? 'border-secondary' : 'border-transparent'}`}
                      >
                        <Image src={img} alt="" fill className="object-contain p-1" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6 lg:p-8">
                <div className="flex gap-2 mb-3">
                  {product.isNew && <Badge variant="new">NEW</Badge>}
                  {product.isBestSeller && <Badge variant="sale">BEST SELLER</Badge>}
                  {product.discount && <Badge variant="sale">-{product.discount}% OFF</Badge>}
                </div>
                <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">{product.brand}</p>
                <h2 className="font-heading font-bold text-primary dark:text-white text-xl lg:text-2xl leading-snug mb-3">
                  {product.name}
                </h2>
                <StarRating rating={product.rating} reviews={product.reviews} size="md" className="mb-4" />
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">{product.shortDescription}</p>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-3xl font-bold text-primary dark:text-white">{formatPrice(product.price)}</span>
                  {product.oldPrice && <span className="text-lg text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>}
                </div>

                {/* Stock */}
                <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                    {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
                  </span>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Qty:</span>
                  <div className="flex items-center gap-3 border border-slate-200 dark:border-white/20 rounded-xl p-1">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-primary dark:text-white">{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mb-5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { addToCart(product, qty); onClose(); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-secondary text-white font-bold rounded-xl hover:bg-secondary-dark transition-all shadow-lg text-sm"
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => toggleWishlist(product)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${inWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 dark:border-white/20 text-slate-400 hover:border-red-200 hover:text-red-400'}`}
                  >
                    <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
                  </motion.button>
                </div>

                {/* Features */}
                {product.features.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    {product.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 text-[10px] font-bold">✓</span>
                        {f}
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  href={`/products/${product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-2 text-sm text-secondary font-semibold hover:text-secondary-dark transition-colors"
                >
                  View Full Details <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
