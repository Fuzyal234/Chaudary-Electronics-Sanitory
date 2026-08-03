'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, Globe, Calendar, Package } from 'lucide-react';
import { getBrandBySlug } from '@/data/brands';
import { useCatalog } from '@/context/CatalogContext';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import { Product } from '@/types';

export default function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { products } = useCatalog();
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const brandProducts = products.filter((p) => p.brand === brand.name);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <>
      <div className="bg-primary py-16">
        <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-8">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/brands" className="hover:text-accent transition-colors">Brands</Link>
            <ChevronRight size={14} />
            <span className="text-white">{brand.name}</span>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative w-40 h-28 rounded-2xl overflow-hidden bg-white flex-shrink-0">
              <Image src={brand.logo} alt={brand.name} fill className="object-contain p-3" />
            </div>
            <div>
              <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">{brand.name}</h1>
              <p className="text-slate-300 text-lg max-w-2xl mb-4">{brand.description}</p>
              <div className="flex flex-wrap gap-6 text-sm text-slate-400">
                <span className="flex items-center gap-2"><Globe size={16} className="text-accent" />{brand.country}</span>
                {brand.established && <span className="flex items-center gap-2"><Calendar size={16} className="text-accent" />Est. {brand.established}</span>}
                <span className="flex items-center gap-2"><Package size={16} className="text-accent" />{brand.productCount}+ products</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
        {brandProducts.length > 0 ? (
          <>
            <h2 className="font-heading text-2xl font-bold text-primary dark:text-white mb-8">
              {brand.name} Products ({brandProducts.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
              {brandProducts.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl font-semibold text-slate-400 mb-4">Products coming soon for {brand.name}</p>
            <Link href="/products" className="px-6 py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-secondary-dark transition-colors inline-block">
              Browse All Products
            </Link>
          </div>
        )}
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
}
