'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Target, Eye, Star } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

const timeline = [
  { year: '2003', title: 'Founded', desc: 'Chaudhry Store established as a small hardware shop in Model Town, Lahore with a vision to provide quality products.' },
  { year: '2008', title: 'Expansion', desc: 'Expanded to a larger showroom covering 5,000 sq ft, adding sanitary ware and electrical sections.' },
  { year: '2013', title: 'Brand Partnerships', desc: 'Became an official dealer for Schneider Electric, Legrand, and Philips — expanding our premium portfolio.' },
  { year: '2018', title: 'Online Presence', desc: 'Launched our digital catalog and WhatsApp ordering system, serving customers across Pakistan.' },
  { year: '2022', title: 'Premium Showroom', desc: 'Opened our premium 10,000 sq ft flagship showroom with live product displays and expert consultations.' },
  { year: '2026', title: 'New Horizons', desc: 'Launched our e-commerce platform to serve customers nationwide with fast delivery and online ordering.' },
];

const team = [
  { name: 'Muhammad Chaudhry', role: 'Founder & CEO', image: 'https://placehold.co/200x200/1E3A6E/F97316?text=MC', experience: '25+ years' },
  { name: 'Imran Chaudhry', role: 'Head of Procurement', image: 'https://placehold.co/200x200/2563EB/FFFFFF?text=IC', experience: '18+ years' },
  { name: 'Sana Malik', role: 'Customer Relations', image: 'https://placehold.co/200x200/16A34A/FFFFFF?text=SM', experience: '10+ years' },
  { name: 'Tariq Iqbal', role: 'Technical Expert', image: 'https://placehold.co/200x200/7C3AED/FFFFFF?text=TI', experience: '15+ years' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative py-24 overflow-hidden bg-primary">
        <div className="relative max-w-screen-2xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 text-accent text-sm font-bold tracking-widest uppercase mb-6">
              <span className="h-px w-8 bg-accent" /> Our Story <span className="h-px w-8 bg-accent" />
            </span>
            <h1 className="font-heading text-5xl lg:text-7xl font-bold text-white mb-6">
              Building Pakistan&apos;s<br />
              <span className="text-accent">Future, Together</span>
            </h1>
            <p className="text-slate-300 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              For over two decades, Chaudhry Sanitary, Electric & Hardware has been Pakistan&apos;s trusted partner for premium building materials, from luxury sanitary ware to industrial-grade electrical components.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="py-20 lg:py-28 bg-bg dark:bg-dark-bg">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                icon: Target,
                title: 'Our Mission',
                text: 'To provide Pakistani homeowners, contractors, and businesses with access to genuine, premium-quality sanitary ware, electrical components, and hardware at fair prices — backed by expert guidance and exceptional service.',
                color: 'from-secondary/10 to-secondary/5',
                iconColor: 'text-secondary',
              },
              {
                icon: Eye,
                title: 'Our Vision',
                text: 'To become Pakistan\'s most trusted one-stop destination for all construction and home improvement needs — recognized for quality, authenticity, expertise, and innovation in serving our customers.',
                color: 'from-accent/10 to-accent/5',
                iconColor: 'text-amber-600',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`relative p-8 lg:p-10 rounded-[24px] bg-gradient-to-br ${item.color} border border-slate-100 dark:border-white/10`}
              >
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-dark-card flex items-center justify-center mb-6 shadow-lg">
                  <item.icon size={30} className={item.iconColor} />
                </div>
                <h3 className="font-heading text-3xl font-bold text-primary dark:text-white mb-4">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-28 bg-slate-50 dark:bg-dark-surface">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <SectionHeader badge="Our Journey" title="Two Decades of" highlight="Excellence" className="mb-16" />
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px h-full w-0.5 bg-gradient-to-b from-secondary to-accent hidden lg:block" />
            <div className="space-y-10 lg:space-y-0">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6 }}
                  className={`relative lg:flex lg:items-center ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} mb-10`}
                >
                  <div className={`lg:w-1/2 ${i % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'}`}>
                    <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-slate-100 dark:border-white/10 hover:shadow-md transition-shadow">
                      <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-sm font-bold rounded-lg mb-3">{item.year}</span>
                      <h3 className="font-bold text-primary dark:text-white text-xl mb-2">{item.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-secondary border-4 border-white dark:border-dark-surface items-center justify-center shadow-lg">
                    <Star size={16} className="text-white fill-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-28 bg-bg dark:bg-dark-bg">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <SectionHeader badge="The Team" title="Meet Our" highlight="Experts" subtitle="Experienced professionals committed to serving you" className="mb-14" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="text-center"
              >
                <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg ring-4 ring-secondary/20">
                  <Image src={member.image} alt={member.name} fill className="object-cover" sizes="128px" />
                </div>
                <h3 className="font-bold text-primary dark:text-white text-base">{member.name}</h3>
                <p className="text-secondary text-sm font-medium">{member.role}</p>
                <p className="text-slate-400 text-xs mt-1">{member.experience} experience</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
