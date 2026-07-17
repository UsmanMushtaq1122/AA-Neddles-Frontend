'use client';

import { useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useFeaturedProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

export default function CoutureCarousel() {
  const { data: products, isLoading, error } = useFeaturedProducts();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  }, [
    Autoplay({
      delay: 4000,
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="ty-h2 text-center mb-12 text-noor-black">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-noor-cream animate-pulse rounded-3xl md:rounded-[20px] max-md:rounded-[16px]" />
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
        <div className="flex items-center justify-between mb-12">
          <h2 className="ty-h2 text-noor-black">Featured Products</h2>
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              className="w-11 h-11 flex items-center justify-center border border-noor-lightgray hover:bg-noor-black hover:text-white transition-colors rounded-full"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              className="w-11 h-11 flex items-center justify-center border border-noor-lightgray hover:bg-noor-black hover:text-white transition-colors rounded-full"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-none w-full sm:w-1/2 lg:w-1/4 pl-6"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
