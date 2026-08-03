'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package, Sparkles, Pencil, AlertTriangle, Wallet, ArrowUpRight, PlusCircle, Store, ImageIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCatalog } from '@/context/CatalogContext';
import { formatPrice } from '@/lib/utils';
import { ROLE_LABELS, ROLE_STYLES } from '@/lib/permissions';
import SmartImage from '@/components/ui/SmartImage';

export default function AdminDashboard() {
  const { user, can } = useAuth();
  const { products, counts, isCustom, needsSeed, seedCatalog, syncing } = useCatalog();

  const stats = useMemo(() => {
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
    const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    return { outOfStock, lowStock, inventoryValue };
  }, [products]);

  const recentlyAdded = useMemo(() => products.filter((p) => isCustom(p.id)).slice(0, 5), [products, isCustom]);

  const cards = [
    { label: 'Total Products', value: counts.total, Icon: Package, tint: 'text-secondary bg-secondary/10' },
    { label: 'Added by Staff', value: counts.custom, Icon: Sparkles, tint: 'text-accent bg-accent/10' },
    { label: 'Price / Info Edits', value: counts.edited, Icon: Pencil, tint: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/15' },
    { label: 'Out of Stock', value: stats.outOfStock, Icon: AlertTriangle, tint: 'text-red-500 bg-red-100 dark:bg-red-500/15' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-primary dark:text-white">
              Welcome back, {user?.name.split(' ')[0]}
            </h1>
            {user && (
              <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${ROLE_STYLES[user.role].badge}`}>
                {ROLE_LABELS[user.role]}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Here’s what’s happening with your catalog today.
          </p>
        </div>
        {can('product:create') && (
          <Link
            href="/admin/products?new=1"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-secondary/30 transition-colors hover:bg-secondary-dark"
          >
            <PlusCircle size={18} /> Add Product
          </Link>
        )}
      </div>

      {/* Seed catalog banner (shown when the database is empty) */}
      {needsSeed && can('product:create') && (
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/20 dark:bg-amber-500/10 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/20">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="font-semibold text-primary dark:text-white">Your catalog is empty</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Import the 70 starter products to populate the store.</p>
            </div>
          </div>
          <button
            onClick={() => seedCatalog()}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-secondary/30 transition-colors hover:bg-secondary-dark disabled:opacity-70"
          >
            {syncing ? 'Importing…' : 'Import starter catalog'}
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-white/20 dark:bg-dark-card"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${c.tint}`}>
              <c.Icon size={20} />
            </div>
            <p className="font-heading text-3xl font-black text-primary dark:text-white">{c.value}</p>
            <p className="mt-0.5 text-xs font-medium text-slate-400">{c.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Inventory value banner */}
      <div className="mt-4 flex flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl bg-primary p-6 text-white sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <Wallet size={24} className="text-accent" />
          </div>
          <div>
            <p className="text-sm text-slate-300">Total inventory value (price × stock)</p>
            <p className="font-heading text-3xl font-black">{formatPrice(stats.inventoryValue)}</p>
          </div>
        </div>
        <p className="text-sm text-slate-300">
          {stats.lowStock} item{stats.lowStock === 1 ? '' : 's'} running low on stock
        </p>
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { href: '/admin/products', label: 'Manage Products', desc: 'Edit prices, images & details', Icon: Package },
          { href: '/admin/products?new=1', label: 'Add a Product', desc: 'List a new item for sale', Icon: PlusCircle, gate: 'product:create' as const },
          { href: '/', label: 'View Storefront', desc: 'See changes live on the site', Icon: Store },
        ]
          .filter((a) => !a.gate || can(a.gate))
          .map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-secondary/40 hover:shadow-md dark:border-white/20 dark:bg-dark-card"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
                <a.Icon size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-primary dark:text-white">{a.label}</p>
                <p className="text-xs text-slate-400">{a.desc}</p>
              </div>
              <ArrowUpRight size={18} className="text-slate-300 transition-colors group-hover:text-secondary" />
            </Link>
          ))}
      </div>

      {/* Recently added */}
      <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-white/20 dark:bg-dark-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-primary dark:text-white">Recently added by staff</h2>
          <Link href="/admin/products" className="text-sm font-semibold text-secondary hover:text-secondary-dark">
            View all
          </Link>
        </div>
        {recentlyAdded.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-300 dark:bg-white/5">
              <ImageIcon size={26} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">No staff-added products yet.</p>
            {can('product:create') && (
              <Link href="/admin/products?new=1" className="text-sm font-semibold text-secondary hover:text-secondary-dark">
                Add your first product →
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/20">
            {recentlyAdded.map((p) => (
              <div key={p.id} className="flex items-center gap-4 py-3">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 dark:border-white/20 dark:bg-white/5">
                  <SmartImage src={p.images[0]} alt={p.name} fill className="object-contain p-1" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-primary dark:text-white">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.brand} · {p.category}</p>
                </div>
                <p className="text-sm font-bold text-primary dark:text-white">{formatPrice(p.price)}</p>
                <Link href={`/admin/products?edit=${p.id}`} className="rounded-lg p-2 text-slate-400 hover:text-secondary">
                  <Pencil size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
