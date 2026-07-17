'use client';

import { useMemo } from 'react';
import { Tag } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import productsData from '@/features/products/products.json';

export default function OffersPageContent() {
  const saleProducts = useMemo(
    () => productsData.filter((p) => p.salePrice && p.salePrice < p.price),
    []
  );

  return (
    <div className="py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-noor-maroon/10 text-noor-maroon text-xs font-semibold uppercase tracking-wider mb-4">
          <Tag size={14} />
          Sale
        </div>
        <p className="text-noor-gray text-sm max-w-2xl">
          Grab these exclusive offers before they are gone. All sale items are subject to availability.
        </p>
      </div>

      {saleProducts.length === 0 ? (
        <div className="text-center py-20">
          <Tag size={48} className="mx-auto text-zinc-200 mb-4" />
          <p className="text-noor-gray text-sm">No current offers available</p>
          <p className="text-zinc-400 text-xs mt-1">Check back soon for new promotions</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
