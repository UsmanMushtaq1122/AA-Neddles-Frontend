'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';

const EASE_LUXURY = [0.25, 0.1, 0.25, 1];

const collectionFallbackGradients = {
  'summer-edit':
    'linear-gradient(135deg, #C9A27E33 0%, #F8F5F2 30%, #E8DDD4 70%, #C9A27E22 100%)',
  'luxury-pret':
    'linear-gradient(135deg, #1A1A1A18 0%, #E8DDD4 40%, #C9A27E33 100%)',
};

export default function Collections() {
  const { collections, isLoading } = useCollections();

  if (!isLoading && collections.length === 0) {
    return null;
  }

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-wide text-[#1A1A1A]"
          >
            Our Collections
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-4 h-[1px] w-20 bg-[#C9A27E]"
          />
        </div>

        {/* Collections Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#C9A27E]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {collections.map((collection, i) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: EASE_LUXURY }}
              >
                <Link
                  href={`/collections/${collection.slug || collection.id}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm transition-shadow duration-300 group-hover:shadow-md"
                >
                  {/* Image */}
                  <div
                    className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{
                      ...(collection.image
                        ? {
                            backgroundImage: `url(${collection.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }
                        : {
                            background:
                              collectionFallbackGradients[collection.slug] ||
                              'linear-gradient(135deg, #E8DDD4 0%, #F8F5F2 100%)',
                          }),
                    }}
                  />

                  {/* Top-Left Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="inline-block px-3 py-1 bg-white text-[#1A1A1A] text-xs font-medium rounded-lg shadow-sm">
                      Collection
                    </span>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500" />

                  {/* Text Content */}
                  <div className="absolute inset-x-0 bottom-16 sm:bottom-20 md:bottom-24 p-4 sm:p-6 md:p-8 z-10">
                    <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-white tracking-wide drop-shadow-sm">
                      {collection.name}
                    </h3>
                    {collection.description && (
                      <p className="mt-1 text-xs sm:text-sm text-white/80 max-w-sm line-clamp-2 leading-relaxed">
                        {collection.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom Floating Bar */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3.5 sm:left-3.5 sm:right-3.5 z-20">
                    <div className="flex items-center justify-between rounded-xl sm:rounded-2xl bg-white px-3.5 py-2 sm:px-4.5 sm:py-2.5 shadow-md shadow-black/10 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
                      <span className="text-xs sm:text-sm font-medium text-[#1A1A1A]">
                        Explore Collection
                      </span>
                      <ArrowRight className="h-4 w-4 text-[#1A1A1A] transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
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

