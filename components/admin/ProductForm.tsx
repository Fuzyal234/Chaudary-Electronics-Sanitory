'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Link2, Trash2, Plus, Star, Loader2 } from 'lucide-react';
import { Product } from '@/types';
import { brands } from '@/data/brands';
import { categories } from '@/data/categories';
import { formatPrice, errorMessage } from '@/lib/utils';
import SmartImage from '@/components/ui/SmartImage';
import { uploadProductImage } from '@/lib/supabase/storage';

interface Props {
  product?: Product; // present → edit mode
  onSubmit: (product: Product) => void;
  onClose: () => void;
}

export default function ProductForm({ product, onSubmit, onClose }: Props) {
  const isEdit = Boolean(product);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState(product?.name ?? '');
  const [brand, setBrand] = useState(product?.brand ?? '');
  const [category, setCategory] = useState(product?.category ?? '');
  const [sku, setSku] = useState(product?.sku ?? '');
  const [price, setPrice] = useState<string>(product ? String(product.price) : '');
  const [oldPrice, setOldPrice] = useState<string>(product?.oldPrice ? String(product.oldPrice) : '');
  const [stock, setStock] = useState<string>(product ? String(product.stock) : '10');
  const [shortDescription, setShortDescription] = useState(product?.shortDescription ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? false);

  const [urlInput, setUrlInput] = useState('');
  const [imgError, setImgError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    setImages((prev) => [...prev, u]);
    setUrlInput('');
    setImgError('');
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImgError('');
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setImages((prev) => [...prev, url]);
    } catch (err) {
      setImgError(errorMessage(err, 'Upload failed. Try again or paste a URL.'));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Required';
    if (!brand.trim()) next.brand = 'Required';
    if (!category.trim()) next.category = 'Required';
    const priceNum = Number(price);
    if (!price || Number.isNaN(priceNum) || priceNum <= 0) next.price = 'Enter a valid price';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const priceNum = Number(price);
    const oldPriceNum = oldPrice ? Number(oldPrice) : undefined;
    const finalImages = images.length
      ? images
      : [`https://placehold.co/600x600/1E3A6E/FFFFFF?text=${encodeURIComponent(name.slice(0, 18) || 'Product')}`];

    const discount =
      oldPriceNum && oldPriceNum > priceNum ? Math.round((1 - priceNum / oldPriceNum) * 100) : undefined;

    const result: Product = {
      // Carry over existing fields (specs/features/rating) when editing.
      ...(product ?? {}),
      id: product?.id ?? `custom-${Date.now().toString(36)}`,
      name: name.trim(),
      brand: brand.trim(),
      category: category.trim(),
      sku: sku.trim() || `CHY-${Date.now().toString(36).toUpperCase()}`,
      price: priceNum,
      oldPrice: oldPriceNum,
      discount,
      stock: Math.max(0, Number(stock) || 0),
      shortDescription: shortDescription.trim() || name.trim(),
      description: description.trim() || shortDescription.trim() || name.trim(),
      images: finalImages,
      isNew,
      isFeatured,
      isBestSeller,
      rating: product?.rating ?? 4.5,
      reviews: product?.reviews ?? 0,
      specifications: product?.specifications ?? {},
      features: product?.features ?? [],
      tags: product?.tags ?? name.toLowerCase().split(/\s+/).filter(Boolean),
    };

    onSubmit(result);
  };

  const input =
    'w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm text-primary transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none dark:bg-white/5 dark:text-white';
  const inputBorder = (field?: string) =>
    `${input} ${errors[field ?? ''] ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-secondary dark:border-white/20'}`;
  const label = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm sm:p-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-[22px] border border-slate-100 bg-white shadow-2xl dark:border-white/20 dark:bg-dark-card"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-white/20">
          <div>
            <h2 className="font-heading text-lg font-bold text-primary dark:text-white">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-slate-400">{isEdit ? product?.name : 'List a new item in your catalog'}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
          {/* Basics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={label}>Product Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Master OP-6 One-Piece Toilet" className={inputBorder('name')} />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label className={label}>Brand *</label>
              <input list="brand-list" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Select or type" className={inputBorder('brand')} />
              <datalist id="brand-list">{brands.map((b) => <option key={b.id} value={b.name} />)}</datalist>
              {errors.brand && <p className="mt-1 text-xs text-red-500">{errors.brand}</p>}
            </div>
            <div>
              <label className={label}>Category *</label>
              <input list="cat-list" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Select or type" className={inputBorder('category')} />
              <datalist id="cat-list">{categories.map((c) => <option key={c.id} value={c.name} />)}</datalist>
              {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label className={label}>Price (PKR) *</label>
              <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" className={inputBorder('price')} />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
            </div>
            <div>
              <label className={label}>Old Price</label>
              <input type="number" min="0" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} placeholder="optional" className={inputBorder()} />
            </div>
            <div>
              <label className={label}>Stock</label>
              <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" className={inputBorder()} />
            </div>
            <div>
              <label className={label}>SKU</label>
              <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="auto" className={inputBorder()} />
            </div>
          </div>
          {oldPrice && Number(oldPrice) > Number(price) && Number(price) > 0 && (
            <p className="-mt-2 text-xs font-medium text-emerald-600">
              {Math.round((1 - Number(price) / Number(oldPrice)) * 100)}% discount will show ({formatPrice(Number(oldPrice) - Number(price))} off)
            </p>
          )}

          {/* Descriptions */}
          <div>
            <label className={label}>Short Description</label>
            <input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="One-line summary shown on cards" className={inputBorder()} />
          </div>
          <div>
            <label className={label}>Full Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Detailed description shown on the product page" className={`${inputBorder()} resize-none`} />
          </div>

          {/* Images */}
          <div>
            <label className={label}>Product Images</label>
            {images.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-3">
                {images.map((src, i) => (
                  <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-white/20 dark:bg-white/5">
                    <SmartImage src={src} alt="" fill className="object-contain p-1" />
                    {i === 0 && (
                      <span className="absolute left-1 top-1 flex items-center gap-0.5 rounded bg-primary px-1 py-0.5 text-[9px] font-bold text-white">
                        <Star size={8} fill="currentColor" /> Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex flex-1 gap-2">
                <div className="relative flex-1">
                  <Link2 size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }}
                    placeholder="Paste image URL"
                    className={`${input} border border-slate-200 pl-8 focus:border-secondary dark:border-white/20`}
                  />
                </div>
                <button type="button" onClick={addUrl} className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 text-sm font-semibold text-primary transition-colors hover:bg-slate-200 dark:bg-white/10 dark:text-white">
                  <Plus size={15} /> Add
                </button>
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:border-secondary hover:text-secondary disabled:opacity-60 dark:border-white/20"
              >
                {uploading ? <><Loader2 size={15} className="animate-spin" /> Uploading…</> : <><Upload size={15} /> Upload</>}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
            </div>
            {imgError && <p className="mt-1.5 text-xs text-red-500">{imgError}</p>}
            <p className="mt-1.5 text-xs text-slate-400">Upload an image (stored in the cloud) or paste a URL. First image is the main thumbnail; a placeholder is used if none is added.</p>
          </div>

          {/* Flags */}
          <div>
            <label className={label}>Badges</label>
            <div className="flex flex-wrap gap-2">
              {([
                ['New Arrival', isNew, setIsNew] as const,
                ['Featured', isFeatured, setIsFeatured] as const,
                ['Best Seller', isBestSeller, setIsBestSeller] as const,
              ]).map(([lbl, val, set]) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => set(!val)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                    val
                      ? 'border-secondary bg-secondary text-white'
                      : 'border-slate-200 text-slate-500 hover:border-secondary/40 dark:border-white/20 dark:text-slate-300'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-white/20">
          <button onClick={onClose} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10">
            Cancel
          </button>
          <button onClick={handleSubmit} className="rounded-xl bg-secondary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-secondary/30 transition-colors hover:bg-secondary-dark">
            {isEdit ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
