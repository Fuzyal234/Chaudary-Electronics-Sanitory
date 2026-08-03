'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin, ArrowRight, Clock } from 'lucide-react';
import { STORE } from '@/lib/store';

/**
 * The sign-off. A hardware customer's next step is almost never "subscribe" —
 * it is "call the counter" or "come round". The newsletter lives in the footer;
 * this closes the page on the shop itself.
 */
const hours = [
  { day: 'Monday – Friday', time: '9:00 AM – 8:00 PM' },
  { day: 'Saturday', time: '9:00 AM – 6:00 PM' },
  { day: 'Sunday', time: 'Closed', closed: true },
];

export default function Newsletter() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-bg dark:bg-dark-bg">
      <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl field-dark border border-white/20 shadow-[0_30px_70px_-40px_rgba(13,26,45,0.9)]"
        >
          <div className="absolute inset-0 dotfield opacity-30 pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-16 p-8 sm:p-12 lg:p-14 items-center">
            <div>
              <span className="t-eyebrow inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/10 border border-white/25 text-accent-light mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Talk to the counter
              </span>

              <h2 className="t-display text-[2.2rem] sm:text-[2.9rem] lg:text-[3.3rem] text-white">
                Not sure which part
                <span className="gradient-text"> you need?</span>
              </h2>

              <p className="mt-5 text-[16px] text-white/75 leading-relaxed max-w-xl">
                Send us a photo of the fitting or the old breaker. Someone who has specified it a
                hundred times will tell you exactly what to order.
              </p>

              <div className="flex flex-wrap gap-3 mt-9">
                <a
                  href={`https://wa.me/${STORE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-secondary text-white font-display font-semibold text-[15px] hover:bg-secondary-light transition-colors shadow-[0_12px_30px_-12px_rgba(30,90,200,0.95)]"
                >
                  <MessageCircle size={17} />
                  WhatsApp us
                </a>
                <a
                  href={`tel:${STORE.phones[0].replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-white/10 border border-white/25 text-white font-display font-semibold text-[15px] hover:bg-white/16 transition-colors"
                >
                  <Phone size={17} />
                  {STORE.phones[0]}
                </a>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 px-5 py-4 text-white/75 font-display font-semibold text-[15px] hover:text-white transition-colors"
                >
                  Find us
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Hours — the practical detail people actually look for */}
            <div className="rounded-2xl bg-white/[0.07] border border-white/25 overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/20">
                <MapPin size={15} className="text-accent-light flex-shrink-0" />
                <span className="text-[13.5px] text-white/85">{STORE.address}, {STORE.city}</span>
              </div>
              <div className="px-5 py-2">
                <div className="flex items-center gap-2 pt-3 pb-1">
                  <Clock size={14} className="text-accent-light" />
                  <span className="t-eyebrow text-white/70">Opening hours</span>
                </div>
                {hours.map((h) => (
                  <div
                    key={h.day}
                    className="flex items-center justify-between py-3 border-b border-white/15 last:border-0"
                  >
                    <span className="text-[13.5px] text-white/75">{h.day}</span>
                    <span className={`text-[13px] font-display font-semibold ${h.closed ? 'text-white/55' : 'text-white'}`}>
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
