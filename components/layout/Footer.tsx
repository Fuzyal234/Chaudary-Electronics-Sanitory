'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { categories } from '@/data/categories';
import { useCatalog } from '@/context/CatalogContext';
import { STORE } from '@/lib/store';
import { useState } from 'react';
import Logo from '@/components/layout/Logo';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories' },
  { label: 'Brands', href: '/brands' },
  { label: 'Special offers', href: '/offers' },
  { label: 'About us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const SvgFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const SvgInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const SvgYoutube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.25 29 29 0 0 0-.47-5.43z" />
    <polygon fill="currentColor" className="text-primary" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);
const SvgTwitter = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  { Icon: SvgFacebook, href: '#', label: 'Facebook' },
  { Icon: SvgInstagram, href: '#', label: 'Instagram' },
  { Icon: SvgYoutube, href: '#', label: 'YouTube' },
  { Icon: SvgTwitter, href: '#', label: 'Twitter / X' },
];

export default function Footer() {
  const { categoryCounts } = useCatalog();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="relative field-dark text-white overflow-hidden">
      <div className="absolute inset-0 dotfield pointer-events-none opacity-30" />

      {/* Stock list band */}
      <div className="relative border-b border-white/20">
        <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-10 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-[20px] lg:text-[24px] text-white tracking-tight">
                New stock, price changes, closing days
              </h3>
              <p className="mt-2 text-[13.5px] text-white/70">One email a month. Nothing else.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto md:min-w-[400px]">
              {subscribed ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[14px] font-display font-semibold text-accent-light"
                >
                  Added — we&apos;ll write when there&apos;s something worth saying.
                </motion.p>
              ) : (
                <>
                  <label htmlFor="footer-email" className="sr-only">Email address</label>
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="flex-1 min-w-0 px-4 h-12 rounded-l-xl bg-white/[0.07] border border-white/25 border-r-0 text-white placeholder:text-white/65 text-[14px] focus:outline-none focus:border-accent transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 h-12 rounded-r-xl bg-secondary text-white text-[14px] font-display font-semibold hover:bg-secondary-light transition-colors flex-shrink-0"
                  >
                    Sign up
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Directory */}
      <div className="relative max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">

          <div>
            <Logo tone="dark" className="mb-6" />
            <p className="text-[14px] text-white/70 leading-relaxed mb-7 max-w-xs">
              A Lahore trade counter since 2003. Sanitary ware, electrical supply, hardware and
              construction materials — authorized stock, priced for the trade.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl border border-white/25 flex items-center justify-center text-white/75 hover:text-primary hover:bg-accent hover:border-accent transition-colors"
                >
                  <s.Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="t-eyebrow text-accent-light mb-5">Pages</h4>
            <ul className="space-y-0">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between py-2.5 border-b border-white/20 text-[14px] text-white/75 hover:text-white transition-colors"
                  >
                    {link.label}
                    <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-accent transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="t-eyebrow text-accent-light mb-5">Departments</h4>
            <ul className="space-y-0">
              {categories.slice(0, 8).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="group flex items-center justify-between py-2.5 border-b border-white/20 text-[14px] text-white/75 hover:text-white transition-colors"
                  >
                    {cat.name}
                    <span className="text-[12.5px] text-white/60 group-hover:text-accent-light transition-colors">{categoryCounts[cat.slug] ?? 0}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="t-eyebrow text-accent-light mb-5">The counter</h4>
            <ul className="space-y-4 mb-7">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-accent flex-shrink-0 mt-0.5" />
                <span className="text-[14px] text-white/75 leading-relaxed">
                  {STORE.address},<br />{STORE.city}
                </span>
              </li>
              {STORE.phones.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <Phone size={15} className="text-accent flex-shrink-0" />
                  <a href={`tel:${p.replace(/\s/g, '')}`} className="t-figure text-[13px] text-white/75 hover:text-white transition-colors">
                    {p}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-accent flex-shrink-0" />
                <a href={`mailto:${STORE.email}`} className="text-[14px] text-white/75 hover:text-white transition-colors">
                  {STORE.email}
                </a>
              </li>
            </ul>

            <div className="rounded-xl border border-white/22 bg-white/[0.04]">
              <p className="t-eyebrow text-white/70 px-4 py-3 border-b border-white/22">Opening hours</p>
              <div className="px-4 py-1">
                {[
                  ['Mon – Fri', '9:00 – 20:00'],
                  ['Saturday', '9:00 – 18:00'],
                  ['Sunday', 'Closed'],
                ].map(([day, time]) => (
                  <div key={day} className="flex justify-between py-2 border-b border-white/20 last:border-0">
                    <span className="text-[13px] text-white/70">{day}</span>
                    <span className={`text-[13px] font-display font-semibold ${time === "Closed" ? "text-white/65" : "text-white"}`}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Colophon */}
      <div className="relative border-t border-white/20">
        <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-10 py-5 pb-6 sm:pr-28 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-white/70 text-center sm:text-left">
            © {new Date().getFullYear()} {STORE.name} · NTN {STORE.ntn}
          </p>
          <div className="flex items-center gap-5">
            <Link href="#" className="text-[13px] text-white/70 hover:text-accent-light transition-colors">Privacy</Link>
            <Link href="#" className="text-[13px] text-white/70 hover:text-accent-light transition-colors">Terms</Link>
            <Link href="#" className="text-[13px] text-white/70 hover:text-accent-light transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
