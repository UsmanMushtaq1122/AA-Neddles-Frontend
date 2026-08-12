'use client';

import { motion } from 'framer-motion';
import { PackageSearch } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function ProductGrid({ products = [], loading = false, columns = 3, onClearFilters }) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns] || gridCols[3]} gap-4 md:gap-6`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-skeleton">
            <div className="aspect-[3/4] bg-zinc-100 rounded-3xl md:rounded-[20px] max-md:rounded-[16px]" />
            <div className="mt-3 space-y-2">
              <div className="h-4 bg-zinc-100 rounded w-3/4" />
              <div className="h-3 bg-zinc-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200">
          <PackageSearch size={28} className="text-zinc-300" />
        </div>
        <h3 className="font-body text-xl font-semibold text-noor-black">
          No products found
        </h3>
        <p className="mx-auto mt-2 max-w-sm font-body text-sm text-zinc-400">
          We couldn&apos;t find any products matching your selection. Try
          adjusting your filters, or check back soon as new pieces arrive.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-6 inline-flex items-center gap-2 border border-noor-black px-6 py-2.5 font-body text-sm font-medium text-noor-black transition-colors hover:bg-noor-black hover:text-white"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[3]} gap-4 md:gap-6`}>
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
