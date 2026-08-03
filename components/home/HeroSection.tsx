'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, Headset, Star } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';

const departments = [
  {
    dept: 'Sanitary ware',
    title: 'Porcelain, brass',
    highlight: 'and chrome.',
    subtitle:
      'Master and Sonex suites, basins, taps and shower sets. Authorized stock, crated and delivered anywhere in Pakistan.',
    cta: { label: 'Shop sanitary', href: '/categories/sanitary' },
    ctaSecondary: { label: 'Full catalog', href: '/products' },
    showcase: {
      image: 'https://mastersanitaryware.com/wp-content/uploads/2020/12/OP-6-1.jpg',
      name: 'Royal Comfort One-Piece Toilet',
      brand: 'Master',
      price: 'PKR 29,245',
      note: 'One-piece · S-trap 4″',
      tag: 'Best seller',
    },
  },
  {
    dept: 'Electrical',
    title: 'Copper you',
    highlight: 'can count on.',
    subtitle:
      'Pakistan Cables, Fast and GM conductor. Schneider, ABB and Legrand protection. Every reel and breaker traceable to the authorized line.',
    cta: { label: 'Shop electrical', href: '/categories/electric' },
    ctaSecondary: { label: 'LED lighting', href: '/categories/lighting' },
    showcase: {
      image: 'https://powerhouseexpress.com.pk/cdn/shop/files/schneider-ic60n-2p-mcb-breaker.webp',
      name: 'Schneider IC60N 2P MCB',
      brand: 'Schneider',
      price: 'PKR 5,300',
      note: '32 A · 6 kA · C-curve',
      tag: 'Genuine',
    },
  },
  {
    dept: 'Hardware & tools',
    title: 'Tools that',
    highlight: 'outlast the job.',
    subtitle:
      'Total power tools, fasteners and site hardware, stocked for contractors who are working to a deadline rather than a wish list.',
    cta: { label: 'Shop hardware', href: '/categories/hardware' },
    ctaSecondary: { label: 'Power tools', href: '/categories/tools' },
    showcase: {
      image: 'https://powerhouseexpress.com.pk/cdn/shop/files/total-tg1061356-impact-drill-machine.webp',
      name: 'Total Impact Drill 680W',
      brand: 'Total',
      price: 'PKR 8,860',
      note: '680 W · 13 mm chuck',
      tag: 'Pro grade',
    },
  },
];

const assurances = [
  { icon: ShieldCheck, label: 'Authorized stock', sub: 'Never a relabelled copy' },
  { icon: Truck, label: 'Free delivery', sub: 'On orders over PKR 5,000' },
  { icon: Headset, label: 'Expert advice', sub: 'Six days a week' },
  { icon: Star, label: '4.9 out of 5', sub: 'From verified orders' },
];

const ease = [0.22, 1, 0.36, 1] as const;
const DWELL = 7000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const slide = departments[current];

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % departments.length), DWELL);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative field-dark text-white overflow-hidden">
      <div className="absolute inset-0 dotfield opacity-40 pointer-events-none" />

      <div className="relative max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_470px] gap-10 lg:gap-14 items-center pt-9 pb-12 sm:pt-12 sm:pb-14 lg:pt-16 lg:pb-16">

          {/* Statement */}
          <div>
            {/* Department picker. On a phone the three names do not fit on one
                line, so the row scrolls sideways rather than wrapping ragged. */}
            <div className="scroll-strip sm:flex-wrap sm:mx-0 sm:px-0 mb-7 sm:mb-8">
              {departments.map((d, i) => (
                <button
                  key={d.dept}
                  onClick={() => setCurrent(i)}
                  className={`relative overflow-hidden whitespace-nowrap t-eyebrow text-[11px] px-4 py-3 sm:py-2.5 rounded-full border transition-colors ${
                    i === current
                      ? 'bg-white/12 border-white/25 text-white'
                      : 'bg-white/[0.03] border-white/20 text-white/70 hover:text-white/80 hover:border-white/20'
                  }`}
                >
                  {i === current && (
                    <motion.span
                      key={`fill-${current}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: DWELL / 1000, ease: 'linear' }}
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent origin-left"
                    />
                  )}
                  {d.dept}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.18 } }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              >
                <motion.h1
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } }}
                  className="t-display text-[2.4rem] sm:text-[3.6rem] lg:text-[4.1rem] xl:text-[4.6rem] text-white mb-5 sm:mb-6"
                >
                  {slide.title}
                  <br />
                  <span className="gradient-text">{slide.highlight}</span>
                </motion.h1>

                <motion.p
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
                  className="text-[15px] sm:text-[17px] text-white/75 leading-relaxed mb-9 max-w-lg"
                >
                  {slide.subtitle}
                </motion.p>

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } }}
                  className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3"
                >
                  <Link
                    href={slide.cta.href}
                    className="group inline-flex items-center justify-center sm:justify-start gap-2.5 px-5 sm:px-7 py-4 rounded-xl bg-secondary text-white font-display font-semibold text-[14px] sm:text-[15px] text-center hover:bg-secondary-light transition-colors shadow-[0_12px_30px_-12px_rgba(30,90,200,0.9)]"
                  >
                    {slide.cta.label}
                    <ArrowRight size={16} className="flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href={slide.ctaSecondary.href}
                    className="inline-flex items-center justify-center sm:justify-start px-5 sm:px-7 py-4 rounded-xl bg-white/8 border border-white/25 text-white font-display font-semibold text-[14px] sm:text-[15px] text-center hover:bg-white/14 hover:border-white/25 transition-colors"
                  >
                    {slide.ctaSecondary.label}
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Showcase card. Phones get it too — a shop's hero should show
              something you can actually buy, not just a headline. On small
              screens it lays out sideways so it costs a fraction of the height. */}
          <div className="block">
            <AnimatePresence mode="wait">
              <motion.div
                key={`card-${current}`}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.18 } }}
                transition={{ duration: 0.55, ease, delay: 0.1 }}
                className="relative"
              >
                {/* Soft halo behind the card */}
                <div className="absolute -inset-6 rounded-[2rem] bg-secondary/20 blur-3xl pointer-events-none hidden lg:block" />

                <Link
                  href={slide.cta.href}
                  className="group relative flex lg:block bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-[0_30px_70px_-30px_rgba(0,0,0,0.75)]"
                >
                  <div className="relative w-[38%] min-w-[130px] self-stretch lg:w-auto lg:self-auto lg:aspect-[4/3] porcelain product-img-wrapper flex-shrink-0">
                    <SmartImage
                      src={slide.showcase.image}
                      alt={slide.showcase.name}
                      fill
                      className="object-contain p-4 lg:p-10"
                      sizes="(max-width: 1024px) 40vw, 470px"
                    />
                    <span className="absolute top-2.5 left-2.5 lg:top-4 lg:left-4 t-eyebrow text-[9px] lg:text-[10px] px-2.5 py-1.5 rounded-full bg-accent text-white">
                      {slide.showcase.tag}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col justify-center lg:block">
                    <div className="flex items-center justify-between gap-2">
                      <span className="t-eyebrow text-[10px] lg:text-[12px] text-secondary truncate">{slide.showcase.brand}</span>
                      <span className="t-code text-steel hidden sm:block truncate">{slide.showcase.note}</span>
                    </div>
                    <p className="mt-2 lg:mt-2.5 font-display font-semibold text-[14px] sm:text-[15px] lg:text-[16px] text-primary dark:text-white leading-snug line-clamp-2">
                      {slide.showcase.name}
                    </p>
                    <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-[var(--hair)] flex items-center justify-between gap-2">
                      <span className="t-figure text-[17px] sm:text-[19px] lg:text-[22px] text-primary dark:text-white">{slide.showcase.price}</span>
                      <span className="inline-flex items-center gap-1.5 text-[12px] lg:text-[13px] font-display font-semibold text-secondary dark:text-blue-300 group-hover:gap-2.5 transition-all flex-shrink-0">
                        View <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Assurances */}
      <div className="relative border-t border-white/20 bg-white/[0.03]">
        <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-5 gap-x-4 sm:gap-x-8 py-6 sm:py-7">
            {assurances.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.4, ease }}
                className="flex items-center gap-3 sm:gap-3.5"
              >
                <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/8 border border-white/20 flex items-center justify-center flex-shrink-0">
                  <a.icon size={16} className="text-accent-light" />
                </span>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-[13px] sm:text-[14px] text-white leading-tight">{a.label}</p>
                  {/* Wraps rather than truncates: a half-shown promise is worse
                      than a two-line one. */}
                  <p className="text-[12px] sm:text-[12.5px] text-white/70 mt-1 leading-snug">{a.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
