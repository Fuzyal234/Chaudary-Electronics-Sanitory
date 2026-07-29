'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-16 lg:py-20 bg-white dark:bg-dark-bg">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-6">
            <Mail size={28} className="text-secondary" />
          </div>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-primary dark:text-white mb-4">
            Get Exclusive Deals &{' '}
            <span className="gradient-text">Offers</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Subscribe to our newsletter and be the first to know about new arrivals, exclusive discounts, and construction tips from our experts.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 text-emerald-600 font-semibold text-lg"
            >
              <CheckCircle size={28} className="text-emerald-500" />
              Thank you! You&apos;re now subscribed.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-white/20 bg-white dark:bg-dark-card text-primary dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary text-white font-bold rounded-xl hover:bg-secondary-dark transition-colors shadow-lg shadow-secondary/30 text-sm whitespace-nowrap"
              >
                Subscribe <ArrowRight size={16} />
              </motion.button>
            </form>
          )}

          <p className="text-xs text-slate-400 mt-4">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
