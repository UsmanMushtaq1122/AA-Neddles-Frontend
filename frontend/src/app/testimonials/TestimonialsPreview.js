'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, BadgeCheck, Heart, ShoppingBag, Truck, RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { testimonialsApi } from '@/services/testimonials';

const DEFAULT_GALLERY = [
  { id: 1, name: 'Ayesha Khan', city: 'Lahore', product: 'Luxury Lawn Collection', rating: 5, text: 'Beautiful fabric and exactly like the website photos.', image: '/images/AA1.jpeg', height: 'tall' },
  { id: 2, name: 'Fatima Riaz', city: 'Karachi', product: 'Luxury Pret — Noor Series', rating: 5, text: 'The embroidery and stitching were flawless.', image: '/images/AA4.jpeg', height: 'medium' },
  { id: 3, name: 'Sana Tariq', city: 'Islamabad', product: 'Formal Wear — Guldasta', rating: 5, text: 'Simply stunning formal wear. Exquisite details.', image: '/images/AA6.jpeg', height: 'short' },
  { id: 4, name: 'Hira Qureshi', city: 'Rawalpindi', product: 'Ready to Wear — Spring Edit', rating: 5, text: 'Loyal customer for years. Never disappoints.', image: '/images/AA2.jpeg', height: 'tall' },
  { id: 5, name: 'Maham Sheikh', city: 'Faisalabad', product: 'Bridal — Mehendi Collection', rating: 5, text: 'Museum-quality craftsmanship. Impeccable.', image: '/images/AA7.jpeg', height: 'medium' },
  { id: 6, name: 'Zainab Ali', city: 'Multan', product: 'Unstitched — Premium Lawn', rating: 5, text: 'Beautiful designs and excellent fabric.', image: '/images/AA8.jpeg', height: 'short' },
];

const trustStats = [
  { value: '50,000+', label: 'Happy Customers', icon: Heart },
  { value: '100,000+', label: 'Orders Delivered', icon: ShoppingBag },
  { value: '4.9/5', label: 'Average Rating', icon: Star },
  { value: '95%', label: 'Repeat Customers', icon: RefreshCw },
  { value: '100%', label: 'Nationwide Delivery', icon: Truck },
];

/* ═══════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════ */

function AnimatedNumber({ value, duration = 2000 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return <span ref={ref}>{inView ? value : '0'}</span>;
}

/* ═══════════════════════════════════════════════
   HOMEPAGE PREVIEW — lightweight, no carousels,
   no modals, no heavy state
   ═══════════════════════════════════════════════ */

export default function TestimonialsPreview() {
  const [galleryCustomers, setGalleryCustomers] = useState(DEFAULT_GALLERY);

  useEffect(() => {
    testimonialsApi.getAll()
      .then((res) => {
        if (res.success && res.data?.length) {
          setGalleryCustomers(res.data.map((t, i) => ({
            id: t.id,
            name: t.name || t.customerName || `Customer ${i + 1}`,
            city: t.city || '',
            product: t.product || '',
            rating: t.rating || 5,
            text: t.comment || t.content || '',
            image: t.image || '/images/AA1.jpeg',
            height: ['tall', 'medium', 'short'][i % 3],
          })));
        }
      })
      .catch(() => {});
  }, []);

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
              Loved By Women
              <br />
              Across Pakistan
            </h2>
            <p className="mt-5 text-base text-noor-gray max-w-xl mx-auto leading-relaxed">
              Thousands of women trust our quality, craftsmanship, and timeless designs.
            </p>
            <div className="mt-6 flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-noor-gold text-noor-gold" />
              ))}
              <span className="ml-2 text-sm font-medium text-noor-black">4.9/5</span>
              <span className="ml-1 text-sm text-noor-gray">from 12,400+ reviews</span>
            </div>
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
              Real women. Real photos. Real trust in our quality and craftsmanship.
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
                <div className="group relative block w-full overflow-hidden bg-noor-cream">
                  <Image
                    src={customer.image}
                    alt={customer.name}
                    width={400}
                    height={customer.height === 'tall' ? 420 : customer.height === 'medium' ? 320 : 260}
                    className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ height: customer.height === 'tall' ? '420px' : customer.height === 'medium' ? '320px' : '260px' }}
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
                      <span className="text-white/50 text-[0.625rem]">{customer.city}</span>
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-xs font-semibold">{customer.name}</p>
                        <p className="text-white/60 text-[0.625rem]">{customer.city}</p>
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

      {/* ── Trust Bar ── */}
      <section className="tst-trustbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="tst-trustbar-grid">
            {trustStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <Icon size={20} className="text-noor-gold mb-3" />
                  <div className="tst-trustbar-value">
                    <AnimatedNumber value={stat.value} />
                  </div>
                  <p className="tst-trustbar-label">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
