'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-secondary" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative max-w-screen-2xl mx-auto px-6 lg:px-8 text-center">
          <SectionHeader badge="Get in Touch" title="Contact" highlight="Us" subtitle="We're here to help — reach out anytime" dark />
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary dark:text-white mb-2">Let&apos;s Talk</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Have a project in mind? Need help choosing the right products? Our expert team is ready to assist you.
              </p>
            </div>

            {[
              { icon: Phone, title: 'Phone', lines: ['+92 300 1234567', '+92 42 35601234'], href: 'tel:+923001234567' },
              { icon: MessageCircle, title: 'WhatsApp', lines: ['+92 300 1234567', 'Click to start a chat'], href: 'https://wa.me/923001234567' },
              { icon: Mail, title: 'Email', lines: ['info@chaudhry.pk', 'sales@chaudhry.pk'], href: 'mailto:info@chaudhry.pk' },
              { icon: MapPin, title: 'Store Address', lines: ['Main Bazar, Model Town', 'Lahore, Punjab, Pakistan'], href: '#' },
              { icon: Clock, title: 'Business Hours', lines: ['Mon–Fri: 9:00 AM – 8:00 PM', 'Sat: 9:00 AM – 6:00 PM · Sun: Closed'], href: '#' },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 4 }}
                className="flex items-start gap-4 p-5 rounded-xl bg-white dark:bg-dark-card border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-lg hover:border-secondary/30 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary group-hover:text-white transition-all">
                  <item.icon size={20} className="text-secondary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{item.title}</p>
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-sm text-primary dark:text-white font-medium">{line}</p>
                  ))}
                </div>
              </motion.a>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-dark-card rounded-[24px] p-8 lg:p-10 border border-slate-100 dark:border-white/10 shadow-xl"
            >
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center text-center py-12 gap-4"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle size={40} className="text-emerald-500" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-primary dark:text-white">Message Sent!</h3>
                  <p className="text-slate-500 dark:text-slate-400">Thank you for contacting us. We&apos;ll respond within 24 business hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    className="px-6 py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-secondary-dark transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="font-heading text-2xl font-bold text-primary dark:text-white mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[
                        { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name', required: true },
                        { id: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', required: true },
                        { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+92 300 0000000', required: false },
                        { id: 'subject', label: 'Subject', type: 'text', placeholder: 'How can we help?', required: true },
                      ].map((field) => (
                        <div key={field.id}>
                          <label className="block text-sm font-semibold text-primary dark:text-white mb-2">{field.label}</label>
                          <input
                            type={field.type}
                            value={form[field.id as keyof typeof form]}
                            onChange={(e) => setForm((f) => ({ ...f, [field.id]: e.target.value }))}
                            placeholder={field.placeholder}
                            required={field.required}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-primary dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-secondary focus:bg-white dark:focus:bg-white/10 transition-all"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary dark:text-white mb-2">Message</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        placeholder="Describe your requirements, project details or question..."
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-primary dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-secondary focus:bg-white dark:focus:bg-white/10 transition-all resize-none"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-secondary text-white font-bold rounded-xl hover:bg-secondary-dark transition-all shadow-lg shadow-secondary/30 text-base disabled:opacity-70"
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : <Send size={20} />}
                      {loading ? 'Sending...' : 'Send Message'}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
