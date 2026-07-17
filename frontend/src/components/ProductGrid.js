'use client';

import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';

export default function ProductGrid({ products = [], loading = false, columns = 3 }) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
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
      <div className="text-center py-16">
        <p className="text-zinc-400 ty-body-sm">No products found.</p>
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
