'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Truck, RotateCcw, Phone } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

/** Terms of trade — what a customer can hold us to, stated plainly. */
const terms = [
  {
    icon: ShieldCheck,
    term: 'Authorized stock only',
    detail: 'Every item comes from the manufacturer or their appointed distributor. No parallel imports, no relabelled copies.',
    figure: '100%',
  },
  {
    icon: Truck,
    term: 'Dispatched the same day',
    detail: 'Order before 2:00 PM and it leaves the counter that afternoon. Delivery is free above PKR 5,000, nationwide.',
    figure: '2:00 PM',
  },
  {
    icon: RotateCcw,
    term: 'Seven days to return it',
    detail: 'Wrong size, wrong thread, changed your mind — bring it back unused within a week and we settle it.',
    figure: '7 days',
  },
  {
    icon: Phone,
    term: 'Someone who knows the part',
    detail: 'Our counter staff have specified fittings and circuits for two decades. Call before you buy the wrong one.',
    figure: '6 days/wk',
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function WhyChooseUs() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-paper dark:bg-dark-surface">
      <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-10">
        <SectionHeader
          badge="Why Chaudhry"
          title="What you can hold"
          highlight="us to."
          subtitle="Four commitments we have kept since 2003. They are not offers, and they do not expire."
          align="center"
          className="mb-14"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {terms.map((t, i) => (
            <motion.div
              key={t.term}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.07, duration: 0.5, ease }}
              className="group card card-hover p-6 lg:p-7 flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="w-12 h-12 rounded-xl bg-accent/8 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors duration-300 dark:bg-white/8 dark:text-accent-light">
                  <t.icon size={21} strokeWidth={1.9} />
                </span>
                <span className="t-figure text-[15px] text-steel group-hover:text-accent transition-colors whitespace-nowrap">
                  {t.figure}
                </span>
              </div>

              <h3 className="font-display font-semibold text-[16.5px] text-primary dark:text-white leading-snug">
                {t.term}
              </h3>
              <p className="mt-2.5 text-[14px] text-steel dark:text-slate-400 leading-relaxed">
                {t.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
