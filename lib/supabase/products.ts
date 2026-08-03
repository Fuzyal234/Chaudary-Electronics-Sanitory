import { supabase } from './client';
import { Product } from '@/types';

/** Row shape of the `public.products` table (snake_case columns). */
export interface ProductRow {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  brand: string;
  price: number;
  old_price: number | null;
  discount: number | null;
  rating: number;
  reviews: number;
  description: string;
  short_description: string;
  specifications: Record<string, string> | null;
  features: string[] | null;
  stock: number;
  images: string[] | null;
  tags: string[] | null;
  is_new: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  is_trending: boolean;
  sku: string;
  weight: string | null;
  dimensions: string | null;
}

export function rowToProduct(r: ProductRow): Product {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    subcategory: r.subcategory ?? undefined,
    brand: r.brand,
    price: Number(r.price),
    oldPrice: r.old_price != null ? Number(r.old_price) : undefined,
    discount: r.discount ?? undefined,
    rating: Number(r.rating),
    reviews: r.reviews,
    description: r.description,
    shortDescription: r.short_description,
    specifications: r.specifications ?? {},
    features: r.features ?? [],
    stock: r.stock,
    images: r.images ?? [],
    tags: r.tags ?? [],
    isNew: r.is_new,
    isFeatured: r.is_featured,
    isBestSeller: r.is_best_seller,
    isTrending: r.is_trending,
    sku: r.sku,
    weight: r.weight ?? undefined,
    dimensions: r.dimensions ?? undefined,
  };
}

export function productToRow(p: Product): ProductRow {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory ?? null,
    brand: p.brand,
    price: p.price,
    old_price: p.oldPrice ?? null,
    discount: p.discount ?? null,
    rating: p.rating ?? 0,
    reviews: p.reviews ?? 0,
    description: p.description ?? '',
    short_description: p.shortDescription ?? '',
    specifications: p.specifications ?? {},
    features: p.features ?? [],
    stock: p.stock ?? 0,
    images: p.images ?? [],
    tags: p.tags ?? [],
    is_new: Boolean(p.isNew),
    is_featured: Boolean(p.isFeatured),
    is_best_seller: Boolean(p.isBestSeller),
    is_trending: Boolean(p.isTrending),
    sku: p.sku ?? '',
    weight: p.weight ?? null,
    dimensions: p.dimensions ?? null,
  };
}

/** Map only the provided (camelCase) fields to snake_case for partial updates. */
export function productToRowPartial(p: Partial<Product>): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  if ('name' in p) r.name = p.name;
  if ('category' in p) r.category = p.category;
  if ('subcategory' in p) r.subcategory = p.subcategory ?? null;
  if ('brand' in p) r.brand = p.brand;
  if ('price' in p) r.price = p.price;
  if ('oldPrice' in p) r.old_price = p.oldPrice ?? null;
  if ('discount' in p) r.discount = p.discount ?? null;
  if ('rating' in p) r.rating = p.rating;
  if ('reviews' in p) r.reviews = p.reviews;
  if ('description' in p) r.description = p.description;
  if ('shortDescription' in p) r.short_description = p.shortDescription;
  if ('specifications' in p) r.specifications = p.specifications;
  if ('features' in p) r.features = p.features;
  if ('stock' in p) r.stock = p.stock;
  if ('images' in p) r.images = p.images;
  if ('tags' in p) r.tags = p.tags;
  if ('isNew' in p) r.is_new = Boolean(p.isNew);
  if ('isFeatured' in p) r.is_featured = Boolean(p.isFeatured);
  if ('isBestSeller' in p) r.is_best_seller = Boolean(p.isBestSeller);
  if ('isTrending' in p) r.is_trending = Boolean(p.isTrending);
  if ('sku' in p) r.sku = p.sku;
  if ('weight' in p) r.weight = p.weight ?? null;
  if ('dimensions' in p) r.dimensions = p.dimensions ?? null;
  return r;
}

function db() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.'
    );
  }
  return supabase;
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await db()
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as ProductRow[]).map(rowToProduct);
}

export async function insertProduct(p: Product): Promise<Product> {
  const { data, error } = await db().from('products').insert(productToRow(p)).select().single();
  if (error) throw error;
  return rowToProduct(data as ProductRow);
}

export async function updateProductRow(id: string, patch: Partial<Product>): Promise<Product> {
  const { data, error } = await db()
    .from('products')
    .update(productToRowPartial(patch))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return rowToProduct(data as ProductRow);
}

export async function deleteProductRow(id: string): Promise<void> {
  const { error } = await db().from('products').delete().eq('id', id);
  if (error) throw error;
}

/** Bulk upsert (used to seed / restore the starter catalog). */
export async function upsertProducts(list: Product[]): Promise<void> {
  const { error } = await db()
    .from('products')
    .upsert(list.map(productToRow), { onConflict: 'id' });
  if (error) throw error;
}
