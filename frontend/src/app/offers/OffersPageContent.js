'use client';

import { useState, useEffect, useMemo } from 'react';
import { Tag, Loader2 } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { productsApi } from '@/services/products';

export default function OffersPageContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.getAll({ limit: 100 })
      .then((res) => {
        const data = res.data || [];
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saleProducts = useMemo(
    () => products.filter((p) => p.salePrice && p.salePrice < p.price),
    [products]
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

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-noor-maroon" />
        </div>
      ) : saleProducts.length === 0 ? (
        <div className="text-center py-20">
          <Tag size={48} className="mx-auto text-zinc-200 mb-4" />
          <p className="text-noor-gray text-sm">No current offers available</p>
          <p className="text-zinc-400 text-xs mt-1">Check back soon for new promotions</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
