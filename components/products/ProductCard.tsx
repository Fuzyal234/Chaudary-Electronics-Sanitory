'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'list';
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const [imageLoaded, setImageLoaded] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const discountLabel = product.discount ? `-${product.discount}%` : null;
  const openDetail = () => router.push(`/products/${product.id}`);

  if (variant === 'list') {
    return (
      <div
        onClick={openDetail}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') openDetail(); }}
        className="cursor-pointer flex gap-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-slate-100 dark:border-white/10 hover:border-slate-200 dark:hover:border-white/20 hover:shadow-md transition-all duration-200 group"
      >
        <div className="relative w-28 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50 dark:bg-white/5">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-2"
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <p className="text-[11px] font-semibold text-secondary uppercase tracking-wider mb-0.5">{product.brand}</p>
            <h3 className="font-medium text-slate-800 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-slate-800 dark:text-white">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="text-xs text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              disabled={product.stock === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-secondary text-white text-xs font-semibold rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-40"
            >
              <ShoppingCart size={12} /> Add
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={openDetail}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') openDetail(); }}
      className="cursor-pointer group relative flex flex-col bg-white dark:bg-dark-card rounded-xl border border-slate-100 dark:border-white/10 overflow-hidden hover:border-slate-200 dark:hover:border-white/20 hover:shadow-md transition-all duration-200"
    >
      {/* Discount badge */}
      {discountLabel && (
        <span className="absolute top-2.5 left-2.5 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md pointer-events-none">
          {discountLabel}
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
        className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
          inWishlist
            ? 'text-red-500 bg-red-50 dark:bg-red-500/10'
            : 'text-slate-300 hover:text-red-400 bg-white/80 dark:bg-primary/60'
        }`}
      >
        <Heart size={13} fill={inWishlist ? 'currentColor' : 'none'} />
      </button>

      {/* Image */}
      <div className="relative aspect-square bg-slate-50 dark:bg-white/[0.03]">
        {!imageLoaded && <div className="absolute inset-0 bg-slate-100 dark:bg-white/5 animate-pulse" />}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className={`object-contain p-5 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">{product.brand}</p>
        <h3 className="text-sm font-medium text-slate-800 dark:text-white leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-white/8">
          <div>
            <div className="font-bold text-slate-800 dark:text-white text-sm">{formatPrice(product.price)}</div>
            {product.oldPrice && (
              <div className="text-[11px] text-slate-400 line-through">{formatPrice(product.oldPrice)}</div>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            disabled={product.stock === 0}
            className="flex items-center gap-1 px-3 py-1.5 bg-secondary text-white text-xs font-semibold rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-40"
          >
            <ShoppingCart size={11} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
