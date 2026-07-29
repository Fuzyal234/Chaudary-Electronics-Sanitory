'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Truck, RotateCcw, Phone } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: '100% Genuine',
    description: 'Every product sourced directly from authorized manufacturers. Zero counterfeit, zero compromise.',
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Same-day dispatch for orders before 2 PM. Free delivery on orders over PKR 5,000 nationwide.',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: "7-day hassle-free returns on all products. Not satisfied? We'll make it right.",
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
  },
  {
    icon: Phone,
    title: 'Expert Support',
    description: 'Experienced engineers available 6 days a week to help you pick the right products.',
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-24 bg-white dark:bg-dark-bg">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-secondary mb-3">Why Us</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
            Why Choose <span className="text-secondary">Chaudhry?</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm max-w-md mx-auto">
            Your trusted partner for all construction and home improvement projects since 2003.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group p-6 rounded-2xl bg-slate-50 dark:bg-dark-card border border-slate-100 dark:border-white/10 hover:shadow-lg transition-all duration-250"
            >
              <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}>
                <f.icon size={20} className={f.text} />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white text-[15px] mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
