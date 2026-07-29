'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, ShieldCheck, Star, Truck, Zap } from 'lucide-react';

const slides = [
  {
    id: 0,
    badge: 'Premium Sanitary Collection',
    title: 'Elevate Your',
    highlight: 'Bathroom',
    subtitle: 'Premium sanitary ware, showers, basins, and accessories from leading brands — delivered across Pakistan.',
    cta: { label: 'Shop Sanitary', href: '/categories/sanitary' },
    ctaSecondary: { label: 'Browse All', href: '/products' },
    orb1: 'bg-blue-500',
    orb2: 'bg-cyan-400',
    showcase: {
      image: 'https://mastersanitaryware.com/wp-content/uploads/2024/11/OP-1.jpg',
      name: 'Master OP-1 Comfort Toilet Suite',
      price: 'PKR 28,500',
      badge: 'Best Seller',
    },
  },
  {
    id: 1,
    badge: 'Electrical Solutions',
    title: 'Power Your',
    highlight: 'World',
    subtitle: 'Cables, switches, MCBs, LED lights and smart electrical solutions for every residential and commercial project.',
    cta: { label: 'Shop Electrical', href: '/categories/electric' },
    ctaSecondary: { label: 'LED Lighting', href: '/categories/lighting' },
    orb1: 'bg-yellow-500',
    orb2: 'bg-orange-400',
    showcase: {
      image: 'https://powerhouseexpress.com.pk/cdn/shop/files/schneider-ic60n-2p-mcb-breaker.webp',
      name: 'Schneider IC60N 2P MCB 32A',
      price: 'PKR 5,300',
      badge: 'Genuine',
    },
  },
  {
    id: 2,
    badge: 'Hardware & Power Tools',
    title: 'Build with',
    highlight: 'Confidence',
    subtitle: 'Professional tools, fasteners, and construction materials trusted by contractors and builders across Pakistan.',
    cta: { label: 'Shop Hardware', href: '/categories/hardware' },
    ctaSecondary: { label: 'Power Tools', href: '/categories/tools' },
    orb1: 'bg-emerald-500',
    orb2: 'bg-teal-400',
    showcase: {
      image: 'https://powerhouseexpress.com.pk/cdn/shop/files/total-tg1061356-impact-drill-machine.webp',
      name: 'Total Impact Drill 680W',
      price: 'PKR 8,860',
      badge: 'Pro Grade',
    },
  },
];

const trustBadges = [
  { icon: Truck, label: 'Free Delivery', sub: 'Orders over PKR 5,000' },
  { icon: ShieldCheck, label: 'Genuine Products', sub: '100% Authentic' },
  { icon: Star, label: '4.9 / 5 Stars', sub: 'Top Rated Store' },
  { icon: Zap, label: 'Same Day Dispatch', sub: 'Order before 2 PM' },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden flex flex-col bg-[#0D1B35]" style={{ minHeight: 'calc(100vh - 64px)' }}>

      {/* Animated background gradient per slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-gradient-to-br from-[#0D1B35] via-[#0f2347] to-[#0D1B35]"
        />
      </AnimatePresence>

      {/* Orb 1 — top left */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`orb1-${current}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.18, scale: 1, y: [0, -18, 0], x: [0, 10, 0] }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.8 }, scale: { duration: 0.8 }, y: { duration: 9, repeat: Infinity, ease: 'easeInOut' }, x: { duration: 11, repeat: Infinity, ease: 'easeInOut' } }}
          className={`absolute -top-20 -left-20 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none ${slide.orb1}`}
        />
      </AnimatePresence>

      {/* Orb 2 — bottom right */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`orb2-${current}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.12, scale: 1, y: [0, 14, 0], x: [0, -8, 0] }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.8 }, scale: { duration: 0.8 }, y: { duration: 7, repeat: Infinity, ease: 'easeInOut' }, x: { duration: 13, repeat: Infinity, ease: 'easeInOut' } }}
          className={`absolute -bottom-24 -right-24 w-[520px] h-[520px] rounded-full blur-3xl pointer-events-none ${slide.orb2}`}
        />
      </AnimatePresence>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      {/* Content */}
      <div className="relative flex-1 flex items-center">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 w-full py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-14 lg:gap-20 items-center">

            {/* Left */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${current}`}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
              >
                {/* Badge */}
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
                  className="mb-6"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/80 text-sm font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    {slide.badge}
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                  variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-[3.75rem] font-bold text-white leading-[1.08] mb-5 tracking-tight"
                >
                  {slide.title}{' '}
                  <motion.span
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    style={{
                      backgroundImage: 'linear-gradient(90deg, #f97316, #fbbf24, #fb923c, #f97316)',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {slide.highlight}
                  </motion.span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } }}
                  className="text-base sm:text-lg text-white/55 leading-relaxed mb-8 max-w-lg"
                >
                  {slide.subtitle}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
                  className="flex flex-wrap gap-3 mb-12"
                >
                  <Link
                    href={slide.cta.href}
                    className="group inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-all text-sm shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-[1.02]"
                  >
                    {slide.cta.label}
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href={slide.ctaSecondary.href}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/8 text-white font-semibold rounded-xl border border-white/15 hover:bg-white/14 hover:border-white/25 transition-all text-sm"
                  >
                    {slide.ctaSecondary.label}
                  </Link>
                </motion.div>

                {/* Trust row */}
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
                  className="flex items-center gap-4 flex-wrap"
                >
                  {[
                    { icon: ShieldCheck, text: '100% Genuine' },
                    { icon: Truck, text: 'Free Delivery' },
                    { icon: Star, text: '4.9 Rated' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-1.5 text-white/50 text-sm">
                      <Icon size={13} className="text-accent" />
                      {text}
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Right — product card */}
            <div className="hidden lg:flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`card-${current}`}
                  initial={{ opacity: 0, scale: 0.9, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.65, ease, delay: 0.18 }}
                  className="relative w-full max-w-[360px]"
                >
                  {/* Glow ring behind card */}
                  <motion.div
                    animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-2xl bg-accent/20 blur-2xl"
                  />

                  {/* Card */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative bg-white rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.35)] overflow-hidden"
                  >
                    <Link href={slide.cta.href} className="absolute inset-0 z-20" aria-label={slide.showcase.name} />
                    <div className="relative h-56 bg-gradient-to-br from-slate-50 to-slate-100">
                      <Image
                        src={slide.showcase.image}
                        alt={slide.showcase.name}
                        fill
                        className="object-contain p-6"
                        priority
                        sizes="400px"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-accent text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                        {slide.showcase.badge}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="text-[13px] font-semibold text-slate-800 line-clamp-1">{slide.showcase.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-accent font-bold text-lg leading-none">{slide.showcase.price}</p>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-amber-400 text-amber-400" />)}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating pill — genuine */}
                  <motion.div
                    initial={{ opacity: 0, x: 18, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.4, ease }}
                    className="absolute -right-4 top-6 bg-white rounded-xl shadow-2xl px-3 py-2 border border-slate-100/80 flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <ShieldCheck size={12} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-800 leading-none">Genuine</p>
                      <p className="text-[9px] text-slate-400">Authorized</p>
                    </div>
                  </motion.div>

                  {/* Floating pill — delivery */}
                  <motion.div
                    initial={{ opacity: 0, x: -18, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.65, duration: 0.4, ease }}
                    className="absolute -left-4 bottom-20 bg-white rounded-xl shadow-2xl px-3 py-2 border border-slate-100/80 flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Truck size={11} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-800 leading-none">Same Day</p>
                      <p className="text-[9px] text-slate-400">Lahore delivery</p>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>

      {/* Slide dots + scroll cue */}
      <div className="relative pb-6 flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-400 ${i === current ? 'w-8 bg-accent' : 'w-2.5 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="text-white/25"
        >
          <ChevronDown size={18} />
        </motion.div>
      </div>

      {/* Trust bar */}
      <div className="relative border-t border-white/8 bg-white/[0.04]">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/8">
            {trustBadges.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                className="flex items-center gap-3 px-5 py-4"
              >
                <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                  <b.icon size={15} className="text-accent" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-none">{b.label}</p>
                  <p className="text-white/40 text-xs mt-0.5">{b.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
