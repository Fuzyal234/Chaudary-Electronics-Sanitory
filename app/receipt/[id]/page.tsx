'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Printer, MessageCircle, ArrowLeft, FileWarning } from 'lucide-react';
import { Order } from '@/types';
import { getOrder } from '@/lib/orders';
import { STORE } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import ReceiptDocument from '@/components/receipt/ReceiptDocument';

export default function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // undefined = still loading (localStorage is client-only), null = not found.
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    setOrder(getOrder(id) ?? null);
  }, [id]);

  const handlePrint = () => window.print();

  const handleWhatsApp = () => {
    if (!order) return;
    const lines = [
      `*${STORE.name}*`,
      `Order Confirmation — ${order.orderNumber}`,
      '',
      ...order.items.map((it) => `• ${it.name} ×${it.quantity} — ${formatPrice(it.price * it.quantity)}`),
      '',
      `*Total: ${formatPrice(order.total)}*`,
      `Deliver to: ${order.customer.name}, ${order.customer.address}, ${order.customer.city}`,
    ];
    const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (order === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div className="mx-auto h-96 w-full max-w-3xl animate-pulse rounded-[20px] bg-slate-100 dark:bg-white/5" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-500/10">
          <FileWarning size={36} />
        </div>
        <h1 className="font-heading text-2xl font-bold text-primary dark:text-white">Receipt not found</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          This receipt isn’t available on this device. Receipts are saved locally to the browser used at checkout.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-secondary px-7 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-secondary-dark"
        >
          <ArrowLeft size={16} /> Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Success banner — screen only */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="no-print mb-8 text-center"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-500 dark:bg-emerald-500/15"
        >
          <CheckCircle2 size={38} />
        </motion.div>
        <h1 className="font-heading text-2xl font-bold text-primary dark:text-white sm:text-3xl">Order Confirmed!</h1>
        <p className="mx-auto mt-2 max-w-md text-slate-500 dark:text-slate-400">
          Thank you, {order.customer.name.split(' ')[0]}. Your order{' '}
          <span className="font-semibold text-secondary">{order.orderNumber}</span> has been placed. Your receipt is
          below.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-secondary/30 transition-colors hover:bg-secondary-dark"
          >
            <Printer size={18} /> Print / Save as PDF
          </button>
          <button
            onClick={handleWhatsApp}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-colors hover:bg-emerald-600"
          >
            <MessageCircle size={18} /> Send on WhatsApp
          </button>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-slate-50 dark:border-white/20 dark:text-white dark:hover:bg-white/5"
          >
            <ArrowLeft size={16} /> Continue shopping
          </Link>
        </div>
      </motion.div>

      <ReceiptDocument order={order} />

      <p className="no-print mt-6 text-center text-xs text-slate-400">
        Tip: In the print dialog, choose <span className="font-semibold">“Save as PDF”</span> as the destination to
        download a copy.
      </p>
    </div>
  );
}
