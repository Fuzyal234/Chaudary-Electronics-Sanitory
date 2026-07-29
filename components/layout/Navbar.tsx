'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingCart, Heart, Moon, Sun, Menu, X, Phone, ChevronDown,
  Zap, Droplets, Lightbulb, Wrench, Pipette, ToggleRight, Hammer, ShieldCheck,
  Flame, Bath, Container, ChefHat, Paintbrush, Building2, Cog, DoorOpen
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { categories } from '@/data/categories';
import { cn } from '@/lib/utils';

const categoryIcons: Record<string, React.ReactNode> = {
  sanitary: <Bath size={18} />,
  electric: <Zap size={18} />,
  lighting: <Lightbulb size={18} />,
  bathroom: <Droplets size={18} />,
  pipes: <Pipette size={18} />,
  switches: <ToggleRight size={18} />,
  'water-pumps': <Wrench size={18} />,
  'water-tanks': <Container size={18} />,
  geysers: <Flame size={18} />,
  hardware: <Wrench size={18} />,
  plumbing: <Wrench size={18} />,
  tools: <Hammer size={18} />,
  paint: <Paintbrush size={18} />,
  kitchen: <ChefHat size={18} />,
  construction: <Building2 size={18} />,
  safety: <ShieldCheck size={18} />,
  fasteners: <Cog size={18} />,
  'door-hardware': <DoorOpen size={18} />,
};

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories', hasMega: true },
  { label: 'Brands', href: '/brands' },
  { label: 'Offers', href: '/offers' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const { cartCount, wishlistCount, darkMode, toggleDarkMode, setCartOpen, setWishlistOpen, setSearchOpen } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const activeLink = usePathname();
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMegaEnter = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };

  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 200);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2 bg-primary text-white text-xs">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Phone size={12} /> +92 300 1234567
          </span>
          <span className="text-slate-300">Mon - Sat: 9:00 AM - 8:00 PM</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300">
          <span>Free delivery on orders over PKR 5,000</span>
          <span className="h-3 w-px bg-slate-600" />
          <Link href="/offers" className="text-accent hover:text-accent-light transition-colors font-medium">
            Today&apos;s Deals →
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/98 dark:bg-[#0D1B35]/98 backdrop-blur-md shadow-md border-b border-slate-200 dark:border-white/10'
            : 'bg-white dark:bg-[#0D1B35] border-b border-slate-100 dark:border-white/10'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-accent font-black text-lg leading-none">C</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-primary dark:text-white text-sm lg:text-base leading-tight tracking-tight">
                  CHAUDHRY
                </div>
                <div className="text-[10px] lg:text-xs text-secondary font-medium tracking-wider uppercase">
                  Sanitary · Electric · Hardware
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                link.hasMega ? (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={handleMegaEnter}
                    onMouseLeave={handleMegaLeave}
                    ref={megaRef}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
                        activeLink === link.href
                          ? 'text-secondary bg-secondary/10'
                          : 'text-slate-700 dark:text-slate-200 hover:text-secondary hover:bg-secondary/5'
                      )}
                    >
                      {link.label}
                      <ChevronDown size={14} className={cn('transition-transform duration-200', megaOpen && 'rotate-180')} />
                    </Link>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200',
                      activeLink === link.href
                        ? 'text-secondary bg-secondary/10'
                        : 'text-slate-700 dark:text-slate-200 hover:text-secondary hover:bg-secondary/5'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>

            {/* Search Bar */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/10 rounded-full text-slate-500 dark:text-slate-300 text-sm hover:bg-slate-200 dark:hover:bg-white/20 transition-colors w-48 lg:w-64 group"
            >
              <Search size={16} className="text-slate-400 group-hover:text-secondary transition-colors" />
              <span className="flex-1 text-left">Search products...</span>
              <span className="text-[10px] text-slate-400 bg-white dark:bg-white/20 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/20 hidden lg:block">⌘K</span>
            </button>

            {/* Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen(true)}
                className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-200"
              >
                <Search size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-200"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setWishlistOpen(true)}
                className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-200"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </motion.span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-xl hover:bg-secondary-dark transition-colors shadow-md hover:shadow-lg hover:shadow-secondary/30"
              >
                <ShoppingCart size={18} />
                <span className="hidden sm:block text-sm font-semibold">Cart</span>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Mobile menu toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-200"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Scroll progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-secondary via-accent to-accent transition-[width] duration-75 ease-linear"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Mega Menu */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#0D1B35] shadow-2xl z-50"
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMegaLeave}
            >
              <div className="max-w-screen-2xl mx-auto px-8 py-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      onClick={() => setMegaOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/5 dark:hover:bg-white/5 group transition-all"
                    >
                      <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-secondary group-hover:text-white transition-all">
                        {categoryIcons[cat.slug] || <Wrench size={16} />}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-primary dark:text-white group-hover:text-secondary transition-colors leading-tight">
                          {cat.name}
                        </div>
                        <div className="text-[10px] text-slate-400">{cat.productCount}+ items</div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                  <p className="text-sm text-slate-500">Browse all {categories.reduce((s, c) => s + c.productCount, 0)}+ products</p>
                  <Link
                    href="/categories"
                    onClick={() => setMegaOpen(false)}
                    className="text-sm font-semibold text-secondary hover:text-secondary-dark flex items-center gap-1 transition-colors"
                  >
                    View All Categories →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 w-80 max-w-full bg-white dark:bg-primary-dark z-50 shadow-2xl flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/10">
              <span className="font-heading font-bold text-primary dark:text-white">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <X size={20} className="text-slate-600 dark:text-slate-200" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-secondary/10 hover:text-secondary font-medium transition-all"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-4 mb-3">Categories</p>
                {categories.slice(0, 8).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 group transition-all"
                  >
                    <span className="text-secondary">{categoryIcons[cat.slug] || <Wrench size={16} />}</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-secondary">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-white/10">
              <a href="tel:+923001234567" className="flex items-center gap-2 px-4 py-3 bg-secondary/10 text-secondary rounded-xl font-medium text-sm">
                <Phone size={16} /> +92 300 1234567
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}
