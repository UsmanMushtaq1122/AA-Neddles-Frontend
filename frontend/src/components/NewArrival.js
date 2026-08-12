'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useCarouselKeyboard } from '@/hooks/useCarouselKeyboard';
import { categoriesApi } from '@/services/categories';
import { bannersApi } from '@/services/banners';

const CATEGORY_FALLBACK_IMAGE = '/images/AA1.jpeg';
const EDITORIAL_FALLBACK_IMAGE = '/images/AA1.jpeg';

export default function NewArrival() {
  const [apiCategories, setApiCategories] = useState([]);
  const [editorialBanners, setEditorialBanners] = useState([]);

  useEffect(() => {
    categoriesApi.getAll()
      .then((res) => {
        const cats = res.data?.categories || [];
        setApiCategories(cats);
      })
      .catch(() => {});

    bannersApi.getAll()
      .then((res) => {
        const banners = (res.data || [])
          .filter((b) => b.type === 'editorial')
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        setEditorialBanners(banners);
      })
      .catch(() => {});
  }, []);

  const categories = apiCategories.map((cat) => ({
    label: cat.name,
    href: `/category/${cat.slug}`,
    image: cat.image || CATEGORY_FALLBACK_IMAGE,
  }));

  const editorialCards = editorialBanners.slice(0, 2).map((b) => ({
    id: b.id,
    label: b.title || 'Shop Collection',
    href: b.link || '/category/all',
    image: b.image || EDITORIAL_FALLBACK_IMAGE,
  }));

  const tallCards = editorialBanners.slice(2, 5).map((b) => ({
    id: b.id,
    label: b.title || 'Shop Collection',
    href: b.link || '/category/all',
    image: b.image || EDITORIAL_FALLBACK_IMAGE,
  }));

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    loop: false,
    dragFree: false,
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index) => emblaApi?.scrollTo(index), [emblaApi]);

  const syncSelectedIndex = useCallback(() => {
    if (!emblaApi) return;
    const currentInView = emblaApi.slidesInView(true)[0];
    setSelectedIndex(currentInView ?? emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const handleWheel = useCallback(
    (event) => {
      if (!emblaApi) return;

      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (delta === 0) return;

      event.preventDefault();

      if (delta > 0) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollPrev();
      }
    },
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => syncSelectedIndex();
    const onReInit = () => syncSelectedIndex();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onReInit);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onReInit);
    };
  }, [emblaApi, syncSelectedIndex]);

  const { handleKeyDown } = useCarouselKeyboard(emblaApi);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="ty-h2 text-noor-black">
              New Arrivals
            </h2>
            <p className="mt-3 ty-body text-noor-gray">
              Explore the Newest Additions Today
            </p>
          </div>
          <Link
            href="/category/all"
            className="inline-flex items-center gap-2 ty-body-sm font-medium text-noor-black hover:text-noor-gold transition-colors"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {categories.length > 0 && (
          <div
            className="overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
            ref={emblaRef}
            onWheel={handleWheel}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-label="New arrivals category slider"
          >
            <div className="flex gap-4 md:gap-5">
              {categories.map((category, i) => (
                <motion.div
                  key={category.href}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_56%] md:flex-[0_0_42%] lg:flex-[0_0_31%] xl:flex-[0_0_26%]"
                >
                  <Link
                    href={category.href}
                    className="group relative block aspect-[4/5] overflow-hidden bg-noor-black shadow-[0_14px_40px_rgba(0,0,0,0.12)] rounded-3xl md:rounded-[20px] max-md:rounded-[16px] transition-all duration-300 ease hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                  >
                    <Image
                      src={category.image}
                      alt={category.label}
                      fill
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 86vw, (max-width: 768px) 56vw, (max-width: 1024px) 42vw, (max-width: 1280px) 31vw, 26vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
                      <h3 className="max-w-[70%] ty-h3 text-white drop-shadow-sm">
                        {category.label}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {categories.length > 0 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {categories.map((category, index) => (
              <button
                key={category.href}
                type="button"
                onClick={() => scrollTo(index)}
                aria-label={`Go to ${category.label}`}
                aria-current={index === selectedIndex ? 'step' : undefined}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? 'w-8 bg-noor-black' : 'w-2 bg-zinc-300 hover:bg-zinc-400'
                }`}
              />
            ))}
          </div>
        )}

        {editorialCards.length > 0 && (
          <div className={`mt-10 grid grid-cols-1 gap-4 md:gap-6 ${editorialCards.length > 1 ? 'md:grid-cols-2' : ''}`}>
            {editorialCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={card.href}
                  className="group relative block overflow-hidden bg-noor-black shadow-[0_14px_40px_rgba(0,0,0,0.10)] h-[72vh] md:h-[84vh] lg:h-[92vh] min-h-[520px] rounded-3xl md:rounded-[20px] max-md:rounded-[16px] transition-all duration-300 ease hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                >
                  <Image
                    src={encodeURI(card.image)}
                    alt={card.label}
                    fill
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 md:p-6">
                    <h3 className="ty-h3 text-white drop-shadow-sm">
                      {card.label}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {tallCards.length > 0 && (
          <div className={`mt-6 grid grid-cols-1 gap-4 md:gap-6 ${tallCards.length > 2 ? 'lg:grid-cols-3' : tallCards.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-2' : ''}`}>
            {tallCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={card.href}
                  className="group relative block overflow-hidden bg-noor-black shadow-[0_14px_40px_rgba(0,0,0,0.10)] h-[72vh] lg:h-[88vh] min-h-[540px] rounded-3xl md:rounded-[20px] max-md:rounded-[16px] transition-all duration-300 ease hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                >
                  <Image
                    src={encodeURI(card.image)}
                    alt={card.label}
                    fill
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 md:p-6">
                    <h3 className="ty-h3 text-white drop-shadow-sm">
                      {card.label}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
