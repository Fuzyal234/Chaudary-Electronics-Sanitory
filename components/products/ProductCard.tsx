'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SmartImage from '@/components/ui/SmartImage';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'list';
  onQuickView?: (product: Product) => void;
}

function stockLine(stock: number) {
  if (stock === 0) return { text: 'Out of stock', tone: 'text-steel' };
  if (stock <= 5) return { text: `Only ${stock} left`, tone: 'text-amber-600' };
  return { text: 'In stock', tone: 'text-stock' };
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const [imageLoaded, setImageLoaded] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const openDetail = () => router.push(`/products/${product.id}`);
  const stock = stockLine(product.stock);

  if (variant === 'list') {
    return (
      <div
        onClick={openDetail}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') openDetail(); }}
        className="group cursor-pointer card card-hover flex gap-4 p-4"
      >
        <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 porcelain product-img-wrapper">
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-2"
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <span className="t-eyebrow text-secondary dark:text-blue-300">{product.brand}</span>
            <h3 className="mt-1.5 font-display font-semibold text-primary dark:text-white text-[15px] leading-snug line-clamp-2 group-hover:text-secondary dark:group-hover:text-blue-300 transition-colors">
              {product.name}
            </h3>
          </div>

          <div className="flex items-end justify-between mt-3">
            <div>
              <div className="t-figure text-[17px] text-primary dark:text-white">{formatPrice(product.price)}</div>
              {product.oldPrice && (
                <div className="text-[12px] text-steel line-through mt-0.5">{formatPrice(product.oldPrice)}</div>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              disabled={product.stock === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-secondary text-white text-[13px] font-display font-semibold hover:bg-secondary-dark transition-colors disabled:opacity-40"
            >
              <ShoppingCart size={13} /> Add
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
      className="group cursor-pointer card card-hover flex flex-col overflow-hidden"
    >
      {/* Photo */}
      <div className="relative aspect-square porcelain product-img-wrapper">
        {!imageLoaded && <div className="absolute inset-0 skeleton rounded-none" />}
        <SmartImage
          src={product.images[0]}
          alt={product.name}
          fill
          className={`object-contain p-6 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {product.discount ? (
          <span className="absolute top-3 left-3 t-eyebrow text-[10px] px-2.5 py-1.5 rounded-full bg-accent text-white shadow-sm">
            −{product.discount}%
          </span>
        ) : product.isNew ? (
          <span className="absolute top-3 left-3 t-eyebrow text-[10px] px-2.5 py-1.5 rounded-full bg-secondary text-white shadow-sm">
            New
          </span>
        ) : null}

        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          aria-label={inWishlist ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
            inWishlist
              ? 'bg-white text-rose-500 shadow-sm'
              : 'bg-white/80 text-steel hover:text-rose-500 dark:bg-primary/70 dark:text-slate-300'
          }`}
        >
          <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Detail */}
      <div className="flex-1 flex flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          {/* A card is ~165px wide in the two-up phone grid — not enough for a
              brand and a part number without both being cut off. The brand wins
              there; the part number returns as soon as there is room. */}
          <span className="t-eyebrow text-secondary dark:text-blue-300 truncate">{product.brand}</span>
          <span className="t-code text-steel truncate hidden sm:block">{product.sku}</span>
        </div>

        <h3 className="mt-2 font-display font-semibold text-[14px] leading-snug text-primary dark:text-white line-clamp-2 group-hover:text-secondary dark:group-hover:text-blue-300 transition-colors">
          {product.name}
        </h3>

        <span className={`mt-2 text-[12px] font-medium ${stock.tone}`}>{stock.text}</span>

        <div className="mt-4 pt-3.5 border-t border-[var(--hair)] flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="t-figure text-[17px] text-primary dark:text-white truncate">
              {formatPrice(product.price)}
            </div>
            {product.oldPrice && (
              <div className="text-[12px] text-steel line-through truncate">
                {formatPrice(product.oldPrice)}
              </div>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            disabled={product.stock === 0}
            aria-label={`Add ${product.name} to cart`}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-secondary text-white text-[13px] font-display font-semibold hover:bg-secondary-dark transition-colors disabled:opacity-40 flex-shrink-0"
          >
            <ShoppingCart size={13} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
