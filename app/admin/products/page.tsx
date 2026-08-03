'use client';

import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search, PlusCircle, Pencil, Trash2, RotateCcw, AlertTriangle, Package, X, Sparkles, ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCatalog } from '@/context/CatalogContext';
import { formatPrice, errorMessage } from '@/lib/utils';
import { Product } from '@/types';
import ProductForm from '@/components/admin/ProductForm';
import SmartImage from '@/components/ui/SmartImage';

function ProductsAdmin() {
  const searchParams = useSearchParams();
  const { can } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, resetCatalog, isCustom, isEdited, counts } = useCatalog();

  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Handle deep links from the dashboard (?new=1 or ?edit=<id>) once, after hydration.
  const handled = useRef(false);
  useEffect(() => {
    if (handled.current || products.length === 0) return;
    if (searchParams.get('new') && can('product:create')) {
      setEditing(null);
      setFormOpen(true);
      handled.current = true;
    } else {
      const editId = searchParams.get('edit');
      if (editId) {
        const match = products.find((p) => p.id === editId);
        if (match) {
          setEditing(match);
          setFormOpen(true);
        }
      }
      handled.current = true;
    }
  }, [products, searchParams, can]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }, [products, query]);

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditing(null); };

  const handleSubmit = async (product: Product) => {
    try {
      if (editing) await updateProduct(editing.id, product);
      else await addProduct(product);
      closeForm();
    } catch (e) {
      alert(errorMessage(e, 'Failed to save product.'));
    }
  };

  const canDelete = can('product:delete');
  const canReset = can('catalog:reset');
  const canCreate = can('product:create');

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary dark:text-white">Products</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {counts.total} products · {counts.custom} added · {counts.edited} edited
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canReset && (counts.custom > 0 || counts.edited > 0) && (
            <button
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:border-red-200 hover:text-red-500 dark:border-white/25 dark:text-slate-300"
            >
              <RotateCcw size={16} /> Reset
            </button>
          )}
          {canCreate && (
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-secondary/30 transition-colors hover:bg-secondary-dark"
            >
              <PlusCircle size={18} /> Add Product
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative mt-6">
        <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, brand, category or SKU…"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-primary transition-all placeholder:text-slate-400 focus:border-secondary focus:outline-none dark:border-white/25 dark:bg-dark-card dark:text-white"
        />
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white dark:border-white/20 dark:bg-dark-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-widest text-slate-400 dark:border-white/20">
                <th className="px-5 py-3 font-bold">Product</th>
                <th className="px-3 py-3 font-bold">Brand / Category</th>
                <th className="px-3 py-3 text-right font-bold">Price</th>
                <th className="px-3 py-3 text-center font-bold">Stock</th>
                <th className="px-3 py-3 text-center font-bold">Status</th>
                <th className="px-5 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-slate-400">
                    No products match “{query}”.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/60 dark:border-white/5 dark:hover:bg-white/5">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 dark:border-white/20 dark:bg-white/5">
                          <SmartImage src={p.images[0]} alt={p.name} fill className="object-contain p-1" />
                        </div>
                        <div className="min-w-0 max-w-[240px]">
                          <p className="truncate font-semibold text-primary dark:text-white">{p.name}</p>
                          <p className="text-xs text-slate-400">SKU {p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-slate-600 dark:text-slate-300">{p.brand}</p>
                      <p className="text-xs text-slate-400">{p.category}</p>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <p className="font-bold text-primary dark:text-white">{formatPrice(p.price)}</p>
                      {p.oldPrice && <p className="text-xs text-slate-400 line-through">{formatPrice(p.oldPrice)}</p>}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-block rounded-md px-2 py-1 text-xs font-bold ${
                          p.stock === 0
                            ? 'bg-red-100 text-red-600 dark:bg-red-500/15'
                            : p.stock <= 10
                              ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/15'
                              : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15'
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {isCustom(p.id) && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent-dark dark:text-accent">
                            <Sparkles size={10} /> Staff
                          </span>
                        )}
                        {isEdited(p.id) && (
                          <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/15">
                            Edited
                          </span>
                        )}
                        {!isCustom(p.id) && !isEdited(p.id) && <span className="text-[10px] text-slate-300">—</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/products/${p.id}`}
                          target="_blank"
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-secondary dark:hover:bg-white/10"
                          title="View on store"
                        >
                          <ExternalLink size={15} />
                        </Link>
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-secondary/10 hover:text-secondary"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => setConfirmDelete(p)}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit modal */}
      <AnimatePresence>
        {formOpen && <ProductForm product={editing ?? undefined} onSubmit={handleSubmit} onClose={closeForm} />}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {confirmDelete && (
          <ConfirmDialog
            title="Delete product?"
            body={`“${confirmDelete.name}” will be removed from the storefront. You can restore the original catalog anytime with Reset.`}
            confirmLabel="Delete"
            danger
            Icon={Trash2}
            onConfirm={async () => {
              try { await deleteProduct(confirmDelete.id); }
              catch (e) { alert(e instanceof Error ? e.message : 'Failed to delete product.'); }
              finally { setConfirmDelete(null); }
            }}
            onClose={() => setConfirmDelete(null)}
          />
        )}
      </AnimatePresence>

      {/* Reset confirm */}
      <AnimatePresence>
        {confirmReset && (
          <ConfirmDialog
            title="Reset catalog?"
            body="This removes all staff additions and edits, restoring the original product catalog. This cannot be undone."
            confirmLabel="Reset everything"
            danger
            Icon={AlertTriangle}
            onConfirm={async () => {
              try { await resetCatalog(); }
              catch (e) { alert(e instanceof Error ? e.message : 'Failed to reset catalog.'); }
              finally { setConfirmReset(false); }
            }}
            onClose={() => setConfirmReset(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ConfirmDialog({
  title, body, confirmLabel, danger, Icon, onConfirm, onClose,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  Icon: typeof Trash2;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-2xl dark:border-white/20 dark:bg-dark-card"
      >
        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${danger ? 'bg-red-100 text-red-500 dark:bg-red-500/15' : 'bg-secondary/10 text-secondary'}`}>
          <Icon size={26} />
        </div>
        <h3 className="font-heading text-lg font-bold text-primary dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{body}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 dark:border-white/25 dark:text-slate-300 dark:hover:bg-white/5">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold text-white shadow-lg transition-colors ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-secondary hover:bg-secondary-dark'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center gap-2 py-16 text-slate-400"><Package size={18} /> Loading products…</div>}>
      <ProductsAdmin />
    </Suspense>
  );
}
