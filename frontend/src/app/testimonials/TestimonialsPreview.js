'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { testimonialsApi } from '@/services/testimonials';

/* ═══════════════════════════════════════════════
   HOMEPAGE PREVIEW — lightweight, no carousels,
   no modals, no heavy state
   ═══════════════════════════════════════════════ */

export default function TestimonialsPreview() {
  const [galleryCustomers, setGalleryCustomers] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    testimonialsApi.getAll()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setGalleryCustomers(res.data
            .filter((t) => (!t.type || t.type === 'gallery') && (t.image || t.customerImage))
            .map((t) => ({
            id: t.id,
            name: t.customerName || 'Customer',
            rating: t.rating,
            text: t.content || '',
            image: t.image || t.customerImage,
            height: 'medium',
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || galleryCustomers.length === 0) return null;

  return (
    <>
      {/* ── Section Title ── */}
      <section className="tst-section tst-section--cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <span className="inline-block text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-noor-maroon mb-4">
              Testimonials
            </span>
            <h2 className="ty-h1 text-noor-black leading-[1.08]">
              What Our Customers Say
            </h2>
            <p className="mt-5 text-base text-noor-gray max-w-xl mx-auto leading-relaxed">
              Customer experiences, shared in their own words.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Gallery — static masonry, no modal ── */}
      <section className="tst-section bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="ty-label text-noor-maroon font-semibold mb-3"
            >
              Gallery
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="ty-h2 text-noor-black"
            >
              Our Customers, Our Pride
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 max-w-2xl mx-auto text-sm leading-relaxed text-noor-gray"
            >
              Photos and feedback shared by our customers.
            </motion.p>
          </div>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {galleryCustomers.map((customer, i) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.3) }}
                className="break-inside-avoid"
              >
                <div className="group relative block w-full overflow-hidden bg-noor-cream rounded-3xl md:rounded-[20px] max-md:rounded-[16px]">
                  <Image
                    src={customer.image}
                    alt={customer.name}
                    width={400}
                    height={customer.height === 'tall' ? 420 : customer.height === 'medium' ? 320 : 260}
                    className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ width: '100%', height: customer.height === 'tall' ? '420px' : customer.height === 'medium' ? '320px' : '260px' }}
                    loading="lazy"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={12} className={j < customer.rating ? 'fill-noor-gold text-noor-gold' : 'text-zinc-200'} />
                      ))}
                    </div>
                    <p className="text-white text-xs italic leading-relaxed line-clamp-2">
                      &ldquo;{customer.text}&rdquo;
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <p className="text-white text-xs font-semibold">{customer.name}</p>
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-xs font-semibold">{customer.name}</p>
                        <p className="text-white/60 text-[0.625rem]">Customer</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} size={10} className={j < customer.rating ? 'fill-noor-gold text-noor-gold' : 'text-zinc-200'} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 px-8 py-4 bg-noor-black text-white ty-button hover:bg-noor-gold transition-colors duration-300"
            >
              View All Testimonials
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

    </>
  );
}
