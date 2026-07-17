'use client';

import { useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useWornLovedProducts } from '@/hooks/useProducts';
import Image from 'next/image';
import Link from 'next/link';

export default function WornLovedCarousel() {
  const { data: products, isLoading, error } = useWornLovedProducts();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  }, [
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  ]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    return () => {
      if (emblaApi) {
        emblaApi.destroy();
      }
    };
  }, [emblaApi]);

  if (isLoading) {
    return (
      <section className="py-20 bg-noor-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="ty-h2 text-center mb-12">Worn & Loved</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-white animate-pulse rounded-3xl md:rounded-[20px] max-md:rounded-[16px]" />
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
    <section className="py-20 bg-noor-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="ty-h2">Worn & Loved</h2>

        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-none w-1/2 md:w-1/4 pl-4"
              >
                <Link href={`/product/${product.slug || product.id}`} className="block group">
                  <div className="aspect-square bg-white overflow-hidden rounded-3xl md:rounded-[20px] max-md:rounded-[16px] transition-all duration-300 ease group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name || 'Product'}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
