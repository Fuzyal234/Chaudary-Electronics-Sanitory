'use client';

import { Phone, Mail, MapPin, Globe, CheckCircle2, Banknote, Building2, CreditCard } from 'lucide-react';
import { Order, PaymentMethod } from '@/types';
import { STORE } from '@/lib/store';
import { formatPrice, formatDateTime, amountInWords } from '@/lib/utils';

const PAYMENT_META: Record<PaymentMethod, { label: string; note: string; Icon: typeof Banknote; paid: boolean }> = {
  cod: { label: 'Cash on Delivery', note: 'Payable to rider on delivery', Icon: Banknote, paid: false },
  bank: { label: 'Bank Transfer', note: 'Received — advance payment', Icon: Building2, paid: true },
  card: { label: 'Card on Delivery', note: 'Payable via card on delivery', Icon: CreditCard, paid: false },
};

/**
 * A self-contained, print-ready receipt "paper". Always rendered on a white
 * surface (regardless of site theme) so it looks like a physical document and
 * prints cleanly. The `receipt-print` class scopes the print stylesheet.
 */
export default function ReceiptDocument({ order }: { order: Order }) {
  const pay = PAYMENT_META[order.paymentMethod];

  return (
    <div className="receipt-print mx-auto w-full max-w-3xl overflow-hidden rounded-[20px] border border-slate-200 bg-white text-slate-700 shadow-xl">
      {/* Accent hairline */}
      <div className="h-1.5 w-full bg-gradient-to-r from-accent via-accent to-accent-dark" />

      {/* Header band */}
      <div className="bg-primary px-6 py-7 text-white sm:px-9">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-lg">
              <span className="font-heading text-3xl font-black text-primary">C</span>
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold leading-tight">{STORE.name}</h2>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.2em] text-accent">{STORE.tagline}</p>
              <div className="mt-3 space-y-1 text-xs text-slate-300">
                <p className="flex items-center gap-1.5"><MapPin size={12} className="text-accent" /> {STORE.address}, {STORE.city}</p>
                <p className="flex items-center gap-1.5"><Phone size={12} className="text-accent" /> {STORE.phones.join('  ·  ')}</p>
                <p className="flex items-center gap-1.5"><Mail size={12} className="text-accent" /> {STORE.email}</p>
              </div>
            </div>
          </div>

          {/* Receipt meta */}
          <div className="sm:text-right">
            <p className="font-heading text-2xl font-black tracking-tight text-white">SALES RECEIPT</p>
            <div className="mt-3 space-y-1 text-xs">
              <p className="text-slate-300">Receipt No.</p>
              <p className="font-mono text-sm font-bold text-white">{order.orderNumber}</p>
              <p className="pt-1 text-slate-300">{formatDateTime(order.date)}</p>
            </div>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/30">
              <CheckCircle2 size={13} /> Order Confirmed
            </span>
          </div>
        </div>
      </div>

      {/* Bill-to + payment */}
      <div className="grid gap-6 border-b border-slate-100 px-6 py-6 sm:grid-cols-2 sm:px-9">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">Billed To</p>
          <p className="font-heading text-base font-bold text-slate-900">{order.customer.name}</p>
          <div className="mt-1 space-y-0.5 text-sm text-slate-500">
            <p>{order.customer.phone}</p>
            {order.customer.email && <p>{order.customer.email}</p>}
            <p>{order.customer.address}</p>
            <p>{order.customer.city}</p>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">Payment</p>
          <p className="flex items-center gap-2 font-semibold text-slate-900 sm:justify-end">
            <pay.Icon size={16} className="text-secondary" /> {pay.label}
          </p>
          <p className="mt-1 text-sm text-slate-500">{pay.note}</p>
          <span
            className={`mt-2 inline-block rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
              pay.paid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            {pay.paid ? 'Paid' : 'Payment Due on Delivery'}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="px-6 py-6 sm:px-9">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 text-[11px] uppercase tracking-widest text-slate-400">
                <th className="py-2 pr-2 font-bold">#</th>
                <th className="py-2 pr-2 font-bold">Item</th>
                <th className="py-2 px-2 text-center font-bold">Qty</th>
                <th className="py-2 px-2 text-right font-bold">Unit Price</th>
                <th className="py-2 pl-2 text-right font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={item.id} className="border-b border-slate-100 align-top">
                  <td className="py-3 pr-2 text-slate-400">{i + 1}</td>
                  <td className="py-3 pr-2">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-400">
                      {item.brand} · SKU {item.sku}
                    </p>
                  </td>
                  <td className="py-3 px-2 text-center font-medium text-slate-700">{item.quantity}</td>
                  <td className="py-3 px-2 text-right text-slate-600">{formatPrice(item.price)}</td>
                  <td className="py-3 pl-2 text-right font-semibold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xs rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
            <p className="font-bold uppercase tracking-widest text-slate-400">Amount in words</p>
            <p className="mt-1 italic leading-relaxed text-slate-600">{amountInWords(order.total)}</p>
          </div>

          <div className="w-full sm:max-w-[280px]">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-slate-700">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery</span>
                <span className={order.deliveryFee === 0 ? 'font-semibold text-emerald-500' : 'font-medium text-slate-700'}>
                  {order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount{order.discountCode ? ` (${order.discountCode})` : ''}</span>
                  <span className="font-medium">− {formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="mt-1 flex items-center justify-between rounded-xl bg-primary px-4 py-3 text-white">
                <span className="text-sm font-semibold">Grand Total</span>
                <span className="font-heading text-xl font-black">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50 px-6 py-6 sm:px-9">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-heading text-sm font-bold text-slate-900">Thank you for shopping with us!</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Please retain this receipt for warranty claims and returns. Goods may be exchanged within 7 days in
              original condition with this receipt. Prices are inclusive of applicable taxes.
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
              <Globe size={12} className="text-secondary" /> {STORE.website}
              <span className="mx-1">·</span> NTN {STORE.ntn}
            </p>
          </div>
          <div className="text-center">
            <div className="mb-1 h-10 w-40 border-b border-dashed border-slate-300" />
            <p className="text-[11px] uppercase tracking-widest text-slate-400">Authorized Signature</p>
          </div>
        </div>
        <p className="mt-6 text-center text-[11px] text-slate-400">
          This is a computer-generated receipt and is valid without a physical signature.
        </p>
      </div>
    </div>
  );
}
