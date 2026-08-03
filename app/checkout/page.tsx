'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SmartImage from '@/components/ui/SmartImage';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShoppingBag, ArrowLeft, Banknote, Building2, CreditCard, ShieldCheck, Truck,
  Tag, Check, X, Lock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatPrice } from '@/lib/utils';
import { DELIVERY, PROMO_CODES } from '@/lib/store';
import { generateOrderNumber, saveOrder } from '@/lib/orders';
import { Order, PaymentMethod } from '@/types';

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; sub: string; Icon: typeof Banknote }[] = [
  { value: 'cod', label: 'Cash on Delivery', sub: 'Pay the rider when your order arrives', Icon: Banknote },
  { value: 'bank', label: 'Bank Transfer', sub: 'Pay in advance via bank / online transfer', Icon: Building2 },
  { value: 'card', label: 'Card on Delivery', sub: 'Swipe your card at the doorstep', Icon: CreditCard },
];

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, cartCount, clearCart } = useApp();

  const [mounted, setMounted] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', city: '', notes: '' });

  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  useEffect(() => setMounted(true), []);

  const subtotal = cartTotal;
  const deliveryFee = subtotal >= DELIVERY.freeThreshold ? 0 : DELIVERY.fee;
  const discount = promo ? Math.round((subtotal * promo.percent) / 100) : 0;
  const total = subtotal - discount + deliveryFee;

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    const match = PROMO_CODES[code];
    if (!match) {
      setPromo(null);
      setPromoError('That code isn’t valid. Try CHAUDHRY10.');
      return;
    }
    setPromo({ code, percent: match.percent });
    setPromoError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || placing) return;
    setPlacing(true);

    const now = new Date();
    const order: Order = {
      id: newId(),
      orderNumber: generateOrderNumber(now),
      date: now.toISOString(),
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        address: form.address.trim(),
        city: form.city.trim(),
        notes: form.notes.trim() || undefined,
      },
      items: cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        brand: item.product.brand,
        sku: item.product.sku,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0],
      })),
      subtotal,
      deliveryFee,
      discount,
      discountCode: promo?.code,
      total,
      paymentMethod: payment,
      status: 'confirmed',
    };

    saveOrder(order);
    // Brief pause for perceived processing, then reveal the receipt.
    await new Promise((r) => setTimeout(r, 900));
    clearCart();
    router.push(`/receipt/${order.id}`);
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 text-primary dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-secondary focus:bg-white dark:focus:bg-white/10 transition-all';
  const labelClass = 'block text-sm font-semibold text-primary dark:text-white mb-2';

  if (!mounted) {
    return <div className="max-w-screen-2xl mx-auto px-6 py-24 text-center text-slate-400">Loading checkout…</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-screen-2xl mx-auto px-6 py-24">
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-white/10">
            <ShoppingBag size={40} className="text-slate-300" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary dark:text-white">Your cart is empty</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Add some products before heading to checkout.</p>
          </div>
          <Link
            href="/products"
            className="rounded-xl bg-secondary px-7 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-secondary-dark"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-5 sm:px-6 lg:px-8 py-10">
      <Link href="/products" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-secondary">
        <ArrowLeft size={16} /> Continue shopping
      </Link>

      <h1 className="font-heading text-3xl font-bold text-primary dark:text-white">Checkout</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">Complete your details to place the order and generate your receipt.</p>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Customer */}
          <section className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-dark-card sm:p-8">
            <h2 className="font-heading text-lg font-bold text-primary dark:text-white">Delivery Details</h2>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Ahmed Raza" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone Number *</label>
                <input required type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+92 300 0000000" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Email <span className="font-normal text-slate-400">(optional — for receipt copy)</span></label>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="your@email.com" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Delivery Address *</label>
                <input required value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="House / shop no, street, area" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>City *</label>
                <input required value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} placeholder="e.g. Lahore" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Order Notes <span className="font-normal text-slate-400">(optional)</span></label>
                <input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Landmark, timing, etc." className={inputClass} />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-dark-card sm:p-8">
            <h2 className="font-heading text-lg font-bold text-primary dark:text-white">Payment Method</h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {PAYMENT_OPTIONS.map((opt) => {
                const active = payment === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setPayment(opt.value)}
                    className={`flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all ${
                      active
                        ? 'border-secondary bg-secondary/5 shadow-sm'
                        : 'border-slate-200 dark:border-white/25 hover:border-secondary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <opt.Icon size={22} className={active ? 'text-secondary' : 'text-slate-400'} />
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${active ? 'border-secondary bg-secondary text-white' : 'border-slate-300'}`}>
                        {active && <Check size={12} />}
                      </span>
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${active ? 'text-secondary' : 'text-primary dark:text-white'}`}>{opt.label}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{opt.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-dark-card lg:sticky lg:top-24">
            <h2 className="font-heading text-lg font-bold text-primary dark:text-white">Order Summary</h2>

            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-white/20 dark:bg-white/5">
                    <SmartImage src={item.product.images[0]} alt={item.product.name} fill className="object-contain p-1" />
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs font-semibold leading-snug text-primary dark:text-white">{item.product.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{formatPrice(item.product.price)}</p>
                  </div>
                  <p className="text-xs font-bold text-primary dark:text-white">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Promo */}
            <div className="mt-5 border-t border-slate-100 pt-5 dark:border-white/20">
              {promo ? (
                <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2.5 dark:bg-emerald-500/10">
                  <span className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                    <Tag size={14} /> {promo.code} · {promo.percent}% off
                  </span>
                  <button type="button" onClick={() => { setPromo(null); setPromoInput(''); }} className="text-emerald-600 hover:text-emerald-700">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
                      placeholder="Promo code"
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm uppercase text-primary placeholder:text-slate-400 placeholder:normal-case focus:border-secondary focus:outline-none dark:border-white/20 dark:bg-white/5 dark:text-white"
                    />
                    <button type="button" onClick={applyPromo} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light">
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="mt-1.5 text-xs text-red-500">{promoError}</p>}
                  <p className="mt-1.5 text-xs text-slate-400">Try <button type="button" onClick={() => setPromoInput('CHAUDHRY10')} className="font-semibold text-secondary">CHAUDHRY10</button> for 10% off.</p>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-5 text-sm dark:border-white/20">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-medium text-primary dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? 'font-semibold text-emerald-500' : 'font-medium text-primary dark:text-white'}>
                  {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-medium text-emerald-600">
                  <span>Discount</span>
                  <span>− {formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/20">
                <span className="font-bold text-primary dark:text-white">Total</span>
                <span className="font-heading text-xl font-black text-primary dark:text-white">{formatPrice(total)}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: placing ? 1 : 1.02 }}
              whileTap={{ scale: placing ? 1 : 0.98 }}
              type="submit"
              disabled={placing}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-4 text-base font-bold text-white shadow-lg shadow-secondary/30 transition-all hover:bg-secondary-dark disabled:opacity-70"
            >
              {placing ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Placing Order…
                </>
              ) : (
                <>Place Order · {formatPrice(total)}</>
              )}
            </motion.button>

            <div className="mt-4 space-y-1.5 text-xs text-slate-400">
              <p className="flex items-center gap-1.5"><Lock size={12} className="text-emerald-500" /> Your details are kept private.</p>
              <p className="flex items-center gap-1.5"><Truck size={12} className="text-secondary" /> Free delivery over {formatPrice(DELIVERY.freeThreshold)}.</p>
              <p className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-accent" /> 100% genuine products · 7-day returns.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
