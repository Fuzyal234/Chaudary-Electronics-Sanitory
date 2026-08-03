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
import { useAuth } from '@/context/AuthContext';
import { categories } from '@/data/categories';
import { useCatalog } from '@/context/CatalogContext';
import { STORE } from '@/lib/store';
import { cn } from '@/lib/utils';
import Logo from '@/components/layout/Logo';

const categoryIcons: Record<string, React.ReactNode> = {
  sanitary: <Bath size={17} />,
  electric: <Zap size={17} />,
  lighting: <Lightbulb size={17} />,
  bathroom: <Droplets size={17} />,
  pipes: <Pipette size={17} />,
  switches: <ToggleRight size={17} />,
  'water-pumps': <Wrench size={17} />,
  'water-tanks': <Container size={17} />,
  geysers: <Flame size={17} />,
  hardware: <Wrench size={17} />,
  plumbing: <Wrench size={17} />,
  tools: <Hammer size={17} />,
  paint: <Paintbrush size={17} />,
  kitchen: <ChefHat size={17} />,
  construction: <Building2 size={17} />,
  safety: <ShieldCheck size={17} />,
  fasteners: <Cog size={17} />,
  'door-hardware': <DoorOpen size={17} />,
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
  const { user } = useAuth();
  const { categoryCounts, products } = useCatalog();
  const catalogTotal = products.length;
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const activeLink = usePathname();
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A drawer that lets the page scroll underneath it feels broken on a phone.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [mobileOpen]);

  // Close the drawer on navigation, so a tapped link never leaves it open.
  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [activeLink]);

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

  const iconBtn =
    'relative p-2.5 rounded-xl border border-[var(--hair)] text-primary dark:text-slate-200 hover:border-secondary hover:text-secondary dark:hover:text-blue-300 transition-colors';

  return (
    <>
      {/* Utility strip */}
      <div className="hidden lg:flex items-center justify-between px-5 sm:px-6 lg:px-10 h-10 bg-primary text-white">
        <div className="flex items-center gap-6">
          <a
            href={`tel:${STORE.phones[0].replace(/\s/g, '')}`}
            className="flex items-center gap-2 text-[13px] text-white/85 hover:text-accent-light transition-colors"
          >
            <Phone size={13} /> {STORE.phones[0]}
          </a>
          <span className="text-[13px] text-white/70">Mon–Sat · 9:00 AM – 8:00 PM</span>
        </div>
        <div className="flex items-center gap-5 text-[13px]">
          <span className="text-white/70">Free delivery over PKR 5,000</span>
          <span className="w-px h-4 bg-white/25" />
          <Link href="/offers" className="font-semibold text-accent-light hover:text-white transition-colors">
            Today&apos;s deals →
          </Link>
          <span className="w-px h-4 bg-white/25" />
          <Link
            href={user ? '/admin' : '/admin/login'}
            className="flex items-center gap-1.5 text-white/85 hover:text-accent-light transition-colors"
          >
            <ShieldCheck size={13} /> {user ? 'Admin' : 'Staff'}
          </Link>
        </div>
      </div>

      {/* Main bar */}
      <header
        className={cn(
          'sticky top-0 z-50 border-b border-[var(--hair)] transition-shadow duration-300',
          'bg-paper/95 dark:bg-dark-bg/95 backdrop-blur-md',
          scrolled && 'shadow-[0_4px_20px_-8px_rgba(13,26,45,0.35)]'
        )}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-5 lg:px-6">
          <div className="flex items-center h-[72px] gap-3 lg:gap-5">

            <Logo compact className="-ml-1" />

            <nav className="hidden lg:flex items-center gap-0.5 mr-auto">
              {navLinks.map((link) => {
                const isActive = activeLink === link.href;
                const cls = cn(
                  'flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-[14px] font-display font-semibold transition-colors',
                  isActive
                    ? 'bg-secondary/10 text-secondary dark:bg-white/10 dark:text-blue-300'
                    : 'text-primary/80 dark:text-slate-300 hover:bg-secondary/8 hover:text-secondary dark:hover:bg-white/8 dark:hover:text-blue-300'
                );

                return link.hasMega ? (
                  <div
                    key={link.href}
                    onMouseEnter={handleMegaEnter}
                    onMouseLeave={handleMegaLeave}
                    ref={megaRef}
                  >
                    <Link href={link.href} className={cls}>
                      {link.label}
                      <ChevronDown size={13} className={cn('transition-transform duration-200', megaOpen && 'rotate-180')} />
                    </Link>
                  </div>
                ) : (
                  <Link key={link.href} href={link.href} className={cls}>{link.label}</Link>
                );
              })}
            </nav>

            {/* Search — one line, never wraps, and it shrinks before the nav does */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2.5 px-3.5 h-11 rounded-xl border border-[var(--hair)] bg-bg dark:bg-white/5 text-steel dark:text-slate-300 hover:border-secondary hover:bg-paper dark:hover:bg-white/10 transition-colors flex-1 min-w-[150px] max-w-[240px] group"
            >
              <Search size={16} className="flex-shrink-0 text-steel group-hover:text-secondary transition-colors" />
              <span className="flex-1 text-left text-[14px] whitespace-nowrap truncate">Search products</span>
              <span className="hidden lg:flex flex-shrink-0 items-center t-code text-[10px] px-1.5 py-1 rounded-md border border-[var(--hair)] bg-paper dark:bg-white/10 text-steel">
                ⌘K
              </span>
            </button>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-auto md:ml-0 flex-shrink-0">
              <button onClick={() => setSearchOpen(true)} aria-label="Search" className={cn(iconBtn, 'md:hidden')}>
                <Search size={18} />
              </button>

              <button
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                className={cn(iconBtn, 'hidden sm:inline-flex')}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button onClick={() => setWishlistOpen(true)} aria-label="Saved items" className={iconBtn}>
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[19px] h-[19px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-dark-bg">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCartOpen(true)}
                aria-label="Cart"
                className="relative flex items-center gap-2 px-4 h-11 rounded-xl bg-secondary text-white text-[14px] font-display font-semibold hover:bg-secondary-dark transition-colors shadow-[0_10px_24px_-12px_rgba(30,90,200,0.95)]"
              >
                <ShoppingCart size={17} />
                <span className="hidden sm:block">Cart</span>
                {cartCount > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-white text-secondary text-[11px] font-bold flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              <button onClick={() => setMobileOpen((v) => !v)} aria-label="Menu" className={cn(iconBtn, 'lg:hidden')}>
                {mobileOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
            </div>
          </div>
        </div>

        {/* Read progress */}
        <div
          className="absolute bottom-0 left-0 h-[3px] rounded-r-full bg-gradient-to-r from-secondary to-accent transition-[width] duration-75 ease-linear"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Department menu */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full border-t border-[var(--hair)] bg-paper dark:bg-dark-bg shadow-[0_30px_60px_-30px_rgba(13,26,45,0.6)] z-50"
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMegaLeave}
            >
              <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-10 py-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      onClick={() => setMegaOpen(false)}
                      className="group flex items-center gap-3 px-3.5 py-3 rounded-xl border border-[var(--hair)] hover:border-secondary hover:bg-secondary/5 transition-colors"
                    >
                      <span className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors dark:bg-white/10 dark:text-blue-300">
                        {categoryIcons[cat.slug] || <Wrench size={17} />}
                      </span>
                      <div className="min-w-0">
                        <div className="font-display font-semibold text-[13.5px] text-primary dark:text-white leading-tight truncate">
                          {cat.name}
                        </div>
                        <div className="text-[12px] text-steel dark:text-slate-400 mt-0.5">{categoryCounts[cat.slug] ?? 0} items</div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-[var(--hair)] flex items-center justify-between">
                  <p className="text-[13.5px] text-steel dark:text-slate-400">
                    {catalogTotal} {catalogTotal === 1 ? 'item' : 'items'} in stock
                  </p>
                  <Link
                    href="/categories"
                    onClick={() => setMegaOpen(false)}
                    className="text-[14px] font-display font-semibold text-secondary hover:text-secondary-dark transition-colors"
                  >
                    View all departments →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 w-80 max-w-full bg-paper dark:bg-dark-bg z-50 shadow-2xl flex flex-col lg:hidden border-l border-[var(--hair)]"
          >
            <div className="flex items-center justify-between px-5 h-[72px] border-b border-[var(--hair)]">
              <span className="font-display font-bold text-[16px] text-primary dark:text-white">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className={iconBtn}>
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain p-4">
              <div className="space-y-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-4 py-3 rounded-xl border border-[var(--hair)] font-display font-semibold text-[14.5px] text-primary dark:text-white hover:bg-secondary hover:text-white hover:border-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <p className="t-eyebrow text-steel mt-7 mb-3 px-1">Departments</p>
              <div className="space-y-1.5">
                {categories.slice(0, 8).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[var(--hair)] hover:border-secondary transition-colors"
                  >
                    <span className="text-secondary dark:text-blue-300">{categoryIcons[cat.slug] || <Wrench size={17} />}</span>
                    <span className="text-[14px] text-primary dark:text-slate-200">{cat.name}</span>
                    <span className="ml-auto text-[12px] text-steel">{categoryCounts[cat.slug] ?? 0}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-[var(--hair)] space-y-2 safe-bottom">
              <button
                onClick={toggleDarkMode}
                className="sm:hidden w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--hair)] text-[14px] font-display font-semibold text-primary dark:text-white"
              >
                {darkMode ? <Sun size={15} /> : <Moon size={15} />}
                {darkMode ? 'Light mode' : 'Dark mode'}
              </button>
              <Link
                href={user ? '/admin' : '/admin/login'}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--hair)] text-[14px] font-display font-semibold text-primary dark:text-white"
              >
                <ShieldCheck size={15} /> {user ? 'Admin panel' : 'Staff portal'}
              </Link>
              <a
                href={`tel:${STORE.phones[0].replace(/\s/g, '')}`}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary text-white text-[14px] font-display font-semibold"
              >
                <Phone size={15} /> {STORE.phones[0]}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {mobileOpen && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
