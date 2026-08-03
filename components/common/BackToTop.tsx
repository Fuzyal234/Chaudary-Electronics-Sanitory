'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          /* Sits clear of the WhatsApp bubble below it, and of the iOS home
             indicator, at every screen size. */
          className="fixed right-4 sm:right-6 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] sm:bottom-24 z-40 w-11 h-11 sm:w-12 sm:h-12 bg-primary dark:bg-secondary text-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow flex items-center justify-center border border-white/20"
          title="Back to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
