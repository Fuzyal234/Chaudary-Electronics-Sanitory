'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Pause, Play, PackageSearch } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/a11y';

import ProductCard from '@/components/products/ProductCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCarouselProps {
  products: Product[];
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  /**
   * 'marquee' glides continuously like a shelf on a belt and never stops on its
   * own. 'step' advances a page at a time. Marquee needs a healthy number of
   * products to loop cleanly, so it downgrades to 'step' automatically.
   */
  mode?: 'marquee' | 'step';
  /** Seconds per slide in step mode. */
  interval?: number;
  /** Seconds for the belt to travel one slide-width in marquee mode. */
  glide?: number;
  className?: string;
}

/** Step mode: how many cards fit at each breakpoint. */
const STEP_BREAKPOINTS = {
  0:    { slidesPerView: 1.15, spaceBetween: 16 },
  480:  { slidesPerView: 2,    spaceBetween: 16 },
  768:  { slidesPerView: 3,    spaceBetween: 18 },
  1100: { slidesPerView: 4,    spaceBetween: 20 },
  1440: { slidesPerView: 5,    spaceBetween: 20 },
} as const;

const MAX_VISIBLE = 5;
/**
 * A seamless belt needs comfortably more cards than fit on screen, otherwise
 * Swiper runs out of slides mid-travel and snaps. Short catalogs get the row
 * repeated until it reaches this length — the standard way to fill a marquee.
 */
const BELT_MIN = 12;

/** Repeat `items` until there are at least `min`, keeping the original order. */
function fillBelt<T>(items: T[], min: number): T[] {
  if (items.length === 0 || items.length >= min) return items;
  const copies = Math.ceil(min / items.length);
  return Array.from({ length: copies }, () => items).flat();
}

export default function ProductCarousel({
  products,
  badge,
  title,
  highlight,
  subtitle,
  viewAllHref,
  viewAllLabel = 'View all',
  mode = 'marquee',
  interval = 4,
  glide = 3.4,
  className,
}: ProductCarouselProps) {
  const reduced = useReducedMotion() ?? false;
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperClass | null>(null);

  const [playing, setPlaying] = useState(!reduced);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // A reduced-motion preference is the only thing that drops the belt; two
  // products are enough to run one, because the row repeats to fill it.
  const isMarquee = mode === 'marquee' && !reduced && products.length >= 2;
  const belt = isMarquee ? fillBelt(products, BELT_MIN) : products;
  const canLoop = isMarquee || products.length > MAX_VISIBLE;
  const autoplayEnabled = !reduced && products.length > 1;

  const syncEdges = useCallback((swiper: SwiperClass) => {
    setAtStart(swiper.isBeginning);
    setAtEnd(swiper.isEnd);
  }, []);

  const togglePlay = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper?.autoplay) return;
    if (playing) {
      swiper.autoplay.stop();
      setPlaying(false);
    } else {
      swiper.autoplay.start();
      setPlaying(true);
    }
  }, [playing]);

  if (products.length === 0) {
    return (
      <section className={cn('py-14 sm:py-20 lg:py-24 bg-bg dark:bg-dark-bg', className)}>
        <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-10">
          <SectionHeader badge={badge} title={title} highlight={highlight} subtitle={subtitle} align="left" className="mb-10" />
          <div className="card flex flex-col items-center text-center px-6 py-16">
            <span className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-5 dark:bg-white/10 dark:text-blue-300">
              <PackageSearch size={24} />
            </span>
            <h3 className="font-display font-semibold text-[18px] text-primary dark:text-white">
              No products to show yet
            </h3>
            <p className="mt-2 text-[14px] text-steel dark:text-slate-400 max-w-sm">
              Once the catalog is stocked, it will run through here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const navBtn =
    'w-11 h-11 rounded-xl border border-[var(--hair-strong)] flex items-center justify-center text-primary dark:text-white transition-colors hover:bg-secondary hover:text-white hover:border-secondary disabled:opacity-30 disabled:pointer-events-none';

  return (
    <section className={cn('relative py-14 sm:py-20 lg:py-24 bg-bg dark:bg-dark-bg overflow-hidden', className)}>
      {/* A wash of brand colour behind the belt, so the rail reads as a band
          rather than as cards floating on a flat field. */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[420px] pointer-events-none bg-[radial-gradient(60%_100%_at_50%_50%,rgba(30,90,200,0.07),transparent_70%)] dark:bg-[radial-gradient(60%_100%_at_50%_50%,rgba(34,189,189,0.08),transparent_70%)]" />

      <div className="relative max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-8 sm:mb-10">
          <SectionHeader badge={badge} title={title} highlight={highlight} subtitle={subtitle} align="left" />

          <div className="flex items-center gap-3 flex-shrink-0">
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="group hidden sm:inline-flex items-center gap-2 mr-2 text-[14px] font-display font-semibold text-secondary hover:text-secondary-dark transition-colors"
              >
                {viewAllLabel}
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            {autoplayEnabled && (
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? 'Pause the product carousel' : 'Play the product carousel'}
                className={navBtn}
              >
                {playing ? <Pause size={16} /> : <Play size={16} />}
              </button>
            )}

            <button ref={prevRef} type="button" aria-label="Previous products" className={navBtn} disabled={!canLoop && atStart}>
              <ArrowLeft size={17} />
            </button>
            <button ref={nextRef} type="button" aria-label="Next products" className={navBtn} disabled={!canLoop && atEnd}>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* The belt runs full-bleed so products glide in and out of the viewport
          edges rather than stopping short at a container margin. */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn('product-rail relative', isMarquee && 'product-rail--marquee')}
      >
        <Swiper
          /* Swiper freezes its params at init, so a mode change has to remount
             the instance rather than try to patch the running one. */
          key={isMarquee ? 'marquee' : 'step'}
          modules={[Autoplay, Navigation, Pagination, Keyboard, A11y]}
          loop={canLoop}
          watchSlidesProgress
          keyboard={{ enabled: true, onlyInViewport: true }}
          a11y={{
            enabled: true,
            prevSlideMessage: 'Previous products',
            nextSlideMessage: 'Next products',
            paginationBulletMessage: 'Go to product group {{index}}',
          }}
          onBeforeInit={(swiper) => {
            const nav = swiper.params.navigation;
            if (nav && typeof nav !== 'boolean') {
              nav.prevEl = prevRef.current;
              nav.nextEl = nextRef.current;
            }
          }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            syncEdges(swiper);
          }}
          onSlideChange={syncEdges}
          onAutoplayStop={() => setPlaying(false)}
          onAutoplayStart={() => setPlaying(true)}
          /* Continuous belt: zero dwell between slides and a long, linear
             transition, so the row travels at constant speed instead of
             stepping. freeMode is deliberately off — it swallows autoplay's
             translation and the belt sits still. */
          slidesPerView={isMarquee ? 'auto' : undefined}
          spaceBetween={isMarquee ? 20 : undefined}
          breakpoints={isMarquee ? undefined : STEP_BREAKPOINTS}
          speed={isMarquee ? glide * 1000 : 650}
          allowTouchMove
          pagination={isMarquee ? false : { clickable: true, dynamicBullets: true }}
          autoplay={
            autoplayEnabled
              ? {
                  delay: isMarquee ? 0 : interval * 1000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          className={cn('!px-5 sm:!px-6 lg:!px-10 !pt-3', isMarquee ? '!pb-4' : '!pb-14')}
        >
          {belt.map((product, i) => (
            <SwiperSlide
              /* The belt may repeat a short catalog, so the key carries the
                 position as well as the product. */
              key={`${product.id}-${i}`}
              className={cn('!h-auto', isMarquee && '!w-[220px] sm:!w-[248px] lg:!w-[268px]')}
            >
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {isMarquee && (
        <p className="relative max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-10 mt-6 text-[13px] text-steel dark:text-slate-400">
          {/* "Hover" is meaningless on a touch screen. */}
          <span className="sm:hidden">Swipe to browse</span>
          <span className="hidden sm:inline">Hover to hold the belt · drag to browse</span>
        </p>
      )}
    </section>
  );
}
