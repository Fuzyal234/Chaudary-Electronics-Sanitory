'use client';

import ProductCarousel from '@/components/products/ProductCarousel';
import { useCatalog } from '@/context/CatalogContext';

/**
 * The rolling shelf. Runs across the whole catalog rather than a flagged
 * subset, so it always has something to show even before best-seller and
 * featured marks have been set in the admin panel.
 */
export default function CatalogShowcase() {
  const { products } = useCatalog();

  return (
    <ProductCarousel
      badge="On the shelf"
      title="Straight from the"
      highlight="catalog."
      subtitle="Every department, on rotation. Drag, use the arrows, or let it run."
      products={products.slice(0, 24)}
      viewAllHref="/products"
      viewAllLabel="Browse all products"
      interval={4}
    />
  );
}
