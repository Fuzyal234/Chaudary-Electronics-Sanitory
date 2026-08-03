'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const phone = '923001234567';
  const message = encodeURIComponent('Hello! I would like to inquire about your products.');

  return (
    <div className="fixed right-4 sm:right-6 bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:bottom-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-slate-100 dark:border-white/20 overflow-hidden w-[min(18rem,calc(100vw-2rem))]"
          >
            {/* Header */}
            <div className="bg-[#25D366] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Chaudhry Store</p>
                  <p className="text-xs text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full" /> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              <div className="bg-[#f0f0f0] dark:bg-white/10 rounded-xl rounded-tl-none px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 mb-4 max-w-[80%]">
                Hello! 👋 How can we help you today?
              </div>
              <a
                href={`https://wa.me/${phone}?text=${message}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-xl font-semibold text-sm hover:bg-[#20ba5a] transition-colors shadow-md"
              >
                <MessageCircle size={18} />
                Start Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((v) => !v)}
        className="relative w-[52px] h-[52px] sm:w-14 sm:h-14 bg-[#25D366] text-white rounded-full shadow-xl hover:shadow-2xl transition-shadow flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={24} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.2 }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M11.928 2C6.436 2 2 6.425 2 11.906c0 1.897.52 3.672 1.427 5.195L2 22l5.064-1.406A9.878 9.878 0 0011.928 21.8c5.492 0 9.928-4.425 9.928-9.894C21.856 6.425 17.42 2 11.928 2z" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />
        )}
      </motion.button>
    </div>
  );
}
