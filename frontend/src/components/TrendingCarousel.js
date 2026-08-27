'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTrendingProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

const TABS = ['NEW ARRIVALS', 'LUXURY PRET', 'LUXURY FORMALS', 'KIDSWEAR'];

const TAB_TO_CATEGORY = {
  'LUXURY PRET': 'luxury-pret',
  'LUXURY FORMALS': 'luxury-formals',
  'KIDSWEAR': 'kids',
};

export default function TrendingCarousel() {
  const [activeTab, setActiveTab] = useState('NEW ARRIVALS');
  const { data: allProducts, isLoading, error } = useTrendingProducts();
  const carouselRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const filteredProducts = activeTab === 'NEW ARRIVALS'
    ? allProducts
    : allProducts?.filter(p => {
        const target = TAB_TO_CATEGORY[activeTab];
        return p.category === target || p.subcategory === target;
      }) || [];

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(scrollLeft / maxScroll);
    } else {
      setScrollProgress(0);
    }
  };

  const scrollPrev = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.firstElementChild?.clientWidth || 300;
      carouselRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.firstElementChild?.clientWidth || 300;
      carouselRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      setScrollProgress(0);
    }
  }, [activeTab]);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[32px] font-normal tracking-wide mb-6">MOST TRENDING</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-noor-cream animate-pulse rounded-3xl md:rounded-[20px] max-md:rounded-[16px]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !allProducts?.length) {
    return null;
  }

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[32px] font-normal tracking-wide mb-6">MOST TRENDING</h2>

        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm uppercase whitespace-nowrap transition-colors tracking-wide ${
                  activeTab === tab
                    ? 'text-black border-b border-black pb-1'
                    : 'text-gray-500 hover:text-black pb-1'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6 flex-shrink-0">
            <Link href="/category/all" className="text-sm border-b border-black pb-0.5 hover:text-gray-600 transition-colors">View all</Link>
            <div className="flex items-center gap-4">
              <button
                onClick={scrollPrev}
                className="text-gray-500 hover:text-black transition-colors"
                aria-label="Previous slide"
              >
                <ArrowLeft strokeWidth={1.5} size={22} />
              </button>
              <button
                onClick={scrollNext}
                className="text-gray-500 hover:text-black transition-colors"
                aria-label="Next slide"
              >
                <ArrowRight strokeWidth={1.5} size={22} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory gap-4 md:gap-6 pb-4"
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex-none w-[85%] sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-[22%] snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="mt-8 mx-auto relative h-[3px] bg-gray-200">
            <div
              className="absolute top-0 h-full bg-black transition-all duration-100 ease-out"
              style={{
                width: '20%',
                left: `${scrollProgress * 80}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
