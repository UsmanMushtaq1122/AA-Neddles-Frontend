'use client';

import Image from 'next/image';
import { useWornLovedProducts } from '@/hooks/useProducts';

export default function UGC() {
  const { data: products, isLoading, error } = useWornLovedProducts();

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="ty-h2 text-center mb-4 text-noor-black">#AANeddles</h2>
          <p className="ty-body text-center text-noor-gray mb-12">Worn & Loved by You</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-noor-cream animate-pulse rounded-3xl md:rounded-[20px] max-md:rounded-[16px]" />
              ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !products?.length) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="ty-h2 text-center mb-4 text-noor-black">#AANeddles</h2>
        <p className="ty-body text-center text-noor-gray mb-12">Worn & Loved by You</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product, index) => (
            <a
              key={product.id || index}
              href={product.instagramUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-noor-cream rounded-3xl md:rounded-[20px] max-md:rounded-[16px] transition-all duration-300 ease hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
            >
              {product.images?.[0] && (
                <Image
                  src={product.images[0]}
                  alt={product.name || 'User generated content'}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity ty-body-sm font-medium">
                  @aaneddles
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
