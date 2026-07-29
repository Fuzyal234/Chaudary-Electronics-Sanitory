'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, ArrowRight } from 'lucide-react';
import { categories } from '@/data/categories';
import { useState } from 'react';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Categories', href: '/categories' },
  { label: 'Brands', href: '/brands' },
  { label: 'Special Offers', href: '/offers' },
  { label: 'About Us', href: '/about' },
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
    <polygon fill="white" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);
const SvgTwitter = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  { Icon: SvgFacebook, href: '#', label: 'Facebook', color: 'hover:text-blue-500' },
  { Icon: SvgInstagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
  { Icon: SvgYoutube, href: '#', label: 'YouTube', color: 'hover:text-red-500' },
  { Icon: SvgTwitter, href: '#', label: 'Twitter / X', color: 'hover:text-sky-500' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="bg-primary dark:bg-primary-dark text-white relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Newsletter Band */}
      <div className="relative border-b border-white/10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-heading text-2xl lg:text-3xl font-bold text-white">
                Stay Updated with Latest Offers
              </h3>
              <p className="mt-2 text-slate-400 text-sm">
                Subscribe for exclusive deals, new arrivals and construction tips
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-3 min-w-0 md:min-w-[400px]">
              {subscribed ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 text-emerald-400 font-medium"
                >
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">✓</span>
                  Thank you for subscribing!
                </motion.div>
              ) : (
                <>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-secondary focus:bg-white/15 transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="flex items-center gap-2 px-5 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark transition-colors text-sm flex-shrink-0"
                  >
                    <Send size={16} /> Subscribe
                  </motion.button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-screen-2xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center shadow-lg">
                <span className="text-accent font-black text-2xl">C</span>
              </div>
              <div>
                <div className="font-heading font-bold text-white text-lg leading-tight">CHAUDHRY</div>
                <div className="text-[11px] text-accent tracking-widest uppercase font-medium">
                  Sanitary · Electric · Hardware
                </div>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Pakistan&apos;s trusted destination for premium sanitary ware, electrical supplies, hardware and construction materials. Quality products for every project.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-400 transition-all border border-white/10 hover:bg-white/20 hover:border-white/20 ${s.color}`}
                >
                  <s.Icon />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-slate-400 hover:text-accent text-sm transition-colors group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Categories</h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 8).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="flex items-center gap-2 text-slate-400 hover:text-accent text-sm transition-colors group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <span className="text-slate-400 text-sm leading-relaxed">
                  Main Bazar, Model Town,<br />Lahore, Punjab, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-accent flex-shrink-0" />
                <a href="tel:+923001234567" className="text-slate-400 hover:text-accent text-sm transition-colors">
                  +92 300 1234567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-accent flex-shrink-0" />
                <a href="tel:+924235601234" className="text-slate-400 hover:text-accent text-sm transition-colors">
                  +92 42 35601234
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-accent flex-shrink-0" />
                <a href="mailto:info@chaudhry.pk" className="text-slate-400 hover:text-accent text-sm transition-colors">
                  info@chaudhry.pk
                </a>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-2">Business Hours</p>
              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex justify-between"><span>Mon – Fri</span><span className="text-white">9:00 AM – 8:00 PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className="text-white">9:00 AM – 6:00 PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="text-red-400">Closed</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Chaudhry Sanitary, Electric & Hardware. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link href="#" className="hover:text-accent transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
