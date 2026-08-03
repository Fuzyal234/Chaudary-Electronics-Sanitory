'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '@/types';
import { products as seedProducts } from '@/data/products';
import { supabase } from '@/lib/supabase/client';
import {
  fetchProducts,
  insertProduct,
  updateProductRow,
  deleteProductRow,
  upsertProducts,
} from '@/lib/supabase/products';

/**
 * The live product catalog, backed by Supabase. The static seed is the initial
 * state (so SSR + the first client paint have content and the store still works
 * before the database is seeded); real rows replace it after fetch. Admin
 * mutations write to Supabase and update optimistically, and a realtime channel
 * refreshes every client when the catalog changes.
 */

const seedMap = new Map(seedProducts.map((p) => [p.id, p]));
const seedIds = new Set(seedProducts.map((p) => p.id));

/** A seed-origin product counts as "edited" when key fields differ from the seed. */
function isDifferentFromSeed(p: Product): boolean {
  const s = seedMap.get(p.id);
  if (!s) return false;
  return (
    p.price !== s.price ||
    (p.oldPrice ?? null) !== (s.oldPrice ?? null) ||
    p.stock !== s.stock ||
    p.name !== s.name ||
    p.shortDescription !== s.shortDescription ||
    (p.images[0] ?? '') !== (s.images[0] ?? '') ||
    p.images.length !== s.images.length ||
    Boolean(p.isFeatured) !== Boolean(s.isFeatured) ||
    Boolean(p.isNew) !== Boolean(s.isNew) ||
    Boolean(p.isBestSeller) !== Boolean(s.isBestSeller)
  );
}

interface CatalogContextType {
  products: Product[];
  ready: boolean;
  needsSeed: boolean; // DB reachable but empty
  syncing: boolean;
  // Read helpers — mirror the former data/products.ts API.
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getFeaturedProducts: () => Product[];
  getBestSellers: () => Product[];
  getNewArrivals: () => Product[];
  getTrendingProducts: () => Product[];
  searchProducts: (query: string) => Product[];
  // Mutations (used by the admin panel).
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, patch: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  seedCatalog: () => Promise<void>;
  resetCatalog: () => Promise<void>;
  // Per-product provenance for admin badges.
  isCustom: (id: string) => boolean;
  isEdited: (id: string) => boolean;
  counts: { total: number; custom: number; edited: number; seed: number };
}

const CatalogContext = createContext<CatalogContextType | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [ready, setReady] = useState(false);
  const [needsSeed, setNeedsSeed] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setReady(true);
      return;
    }
    try {
      const list = await fetchProducts();
      if (list.length > 0) {
        setProducts(list);
        setNeedsSeed(false);
      } else {
        setProducts(seedProducts);
        setNeedsSeed(true);
      }
    } catch {
      // Unreachable / not yet provisioned — fall back to the seed catalog.
      setProducts(seedProducts);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refresh();
    if (!supabase) return;
    const client = supabase;
    // Best-effort realtime: refresh when any client changes the catalog.
    const channel = client
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        refresh();
      })
      .subscribe();
    return () => {
      client.removeChannel(channel);
    };
  }, [refresh]);

  const getProductById = useCallback((id: string) => products.find((p) => p.id === id), [products]);
  const getProductsByCategory = useCallback(
    (category: string) => products.filter((p) => p.category.toLowerCase() === category.toLowerCase()),
    [products]
  );
  const getFeaturedProducts = useCallback(() => products.filter((p) => p.isFeatured), [products]);
  const getBestSellers = useCallback(() => products.filter((p) => p.isBestSeller), [products]);
  const getNewArrivals = useCallback(() => products.filter((p) => p.isNew), [products]);
  const getTrendingProducts = useCallback(
    () => products.filter((p) => p.isTrending || p.isFeatured).slice(0, 8),
    [products]
  );
  const searchProducts = useCallback(
    (query: string) => {
      const q = query.toLowerCase();
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    },
    [products]
  );

  const addProduct = useCallback(async (product: Product) => {
    setProducts((prev) => [product, ...prev.filter((p) => p.id !== product.id)]);
    setNeedsSeed(false);
    try {
      await insertProduct(product);
    } catch (e) {
      await refresh();
      throw e;
    }
  }, [refresh]);

  const updateProduct = useCallback(async (id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    try {
      await updateProductRow(id, patch);
    } catch (e) {
      await refresh();
      throw e;
    }
  }, [refresh]);

  const deleteProduct = useCallback(async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteProductRow(id);
    } catch (e) {
      await refresh();
      throw e;
    }
  }, [refresh]);

  const seedCatalog = useCallback(async () => {
    setSyncing(true);
    try {
      await upsertProducts(seedProducts);
      await refresh();
    } finally {
      setSyncing(false);
    }
  }, [refresh]);

  const resetCatalog = useCallback(async () => {
    setSyncing(true);
    try {
      // Restore seed products to their original values…
      await upsertProducts(seedProducts);
      // …and remove any staff-added (non-seed) products.
      const customIds = products.filter((p) => !seedIds.has(p.id)).map((p) => p.id);
      await Promise.all(customIds.map((id) => deleteProductRow(id).catch(() => undefined)));
      await refresh();
    } finally {
      setSyncing(false);
    }
  }, [products, refresh]);

  const isCustom = useCallback((id: string) => !seedIds.has(id), []);
  const isEdited = useCallback(
    (id: string) => {
      if (!seedIds.has(id)) return false;
      const p = products.find((x) => x.id === id);
      return p ? isDifferentFromSeed(p) : false;
    },
    [products]
  );

  const counts = useMemo(() => {
    const custom = products.filter((p) => !seedIds.has(p.id)).length;
    const edited = products.filter((p) => seedIds.has(p.id) && isDifferentFromSeed(p)).length;
    return { total: products.length, custom, edited, seed: products.length - custom };
  }, [products]);

  return (
    <CatalogContext.Provider
      value={{
        products,
        ready,
        needsSeed,
        syncing,
        getProductById,
        getProductsByCategory,
        getFeaturedProducts,
        getBestSellers,
        getNewArrivals,
        getTrendingProducts,
        searchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        seedCatalog,
        resetCatalog,
        isCustom,
        isEdited,
        counts,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
