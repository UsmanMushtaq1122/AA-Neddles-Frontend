'use client';

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  Truck,
  RefreshCw,
  Heart,
  MessageCircle,
  ShoppingBag,
  Play,
  X,
  BadgeCheck,
  ArrowRight,
  Camera,
  Volume2,
  Maximize,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCarouselKeyboard } from '@/hooks/useCarouselKeyboard';
import { testimonialsApi } from '@/services/testimonials';

/* ═══════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════ */

const customerStories = [
  {
    before: 'I was hesitant to order online because fabric quality often disappoints.',
    experience: 'The dress arrived exactly as shown in the photos. The embroidery, the fabric, the stitching — everything was premium.',
    result: "Now I've ordered five more outfits. AA Neddles is my trusted brand for every occasion.",
    name: 'Ayesha Khan',
    city: 'Lahore',
    product: 'Luxury Lawn Collection',
    image: '/images/AA1.jpeg',
  },
  {
    before: 'Living abroad, I was sceptical about ordering from Pakistan online.',
    experience: 'The packaging was luxurious, the outfit fit perfectly, and the fabric quality rivals international brands.',
    result: 'My whole family in Dubai was impressed. I now order every Eid and wedding season.',
    name: 'Fatima Riaz',
    city: 'Karachi (now Dubai)',
    product: 'Luxury Pret — Noor Series',
    image: '/images/AA4.jpeg',
  },
  {
    before: 'I needed a bridal lehenga but was worried about custom fittings from online orders.',
    experience: 'The team helped with custom measurements and colour adjustments. The craftsmanship was breathtaking.',
    result: 'On my wedding day I felt like royalty. I have recommended AA Neddles to all my friends.',
    name: 'Maham Sheikh',
    city: 'Faisalabad',
    product: 'Bridal — Mehendi Collection',
    image: '/images/AA7.jpeg',
  },
];

const trustStats = [
  { value: 50000, suffix: '+', label: 'Happy Customers', icon: Heart },
  { value: 100000, suffix: '+', label: 'Orders Delivered', icon: ShoppingBag },
  { value: 49, suffix: '', label: 'Average Rating', display: '4.9', suffixDisplay: '/5', icon: Star },
  { value: 95, suffix: '%', label: 'Repeat Customers', icon: RefreshCw },
  { value: 0, suffix: '', label: 'Nationwide Delivery', display: '100%', icon: Truck },
];

const videoTestimonials = [
  {
    id: 1,
    name: 'Sana Tariq',
    city: 'Islamabad',
    product: 'Formal Wear — Guldasta',
    rating: 5,
    thumbnail: '/images/AA6.jpeg',
    duration: '0:43',
    review: 'Their formal wear is simply stunning. The embroidery details are exquisite and the fit is perfect.',
    verified: true,
  },
  {
    id: 2,
    name: 'Ayesha Malik',
    city: 'Lahore',
    product: 'Bridal Lehenga',
    rating: 5,
    thumbnail: '/images/AA2.jpeg',
    duration: '1:12',
    review: 'The bridal lehenga was a dream. Every stitch was perfection. Worth every rupee.',
    verified: true,
  },
  {
    id: 3,
    name: 'Hira Khan',
    city: 'Rawalpindi',
    product: 'Ready to Wear — Spring Edit',
    rating: 5,
    thumbnail: '/images/AA10.jpeg',
    duration: '0:38',
    review: 'I have been a loyal customer for years. The new arrivals never disappoint.',
    verified: true,
  },
  {
    id: 4,
    name: 'Fatima Noor',
    city: 'Karachi',
    product: 'Luxury Pret — Noor Series',
    rating: 5,
    thumbnail: '/images/AA4.jpeg',
    duration: '0:55',
    review: 'Absolutely love the luxury pret collection! The fabric quality and finishing are exceptional.',
    verified: true,
  },
  {
    id: 5,
    name: 'Maham Tariq',
    city: 'Faisalabad',
    product: 'Unstitched Collection',
    rating: 5,
    thumbnail: '/images/AA7.jpeg',
    duration: '0:47',
    review: 'The unstitched collection gives me freedom to tailor everything perfectly. Premium quality.',
    verified: true,
  },
  {
    id: 6,
    name: 'Zainab Ali',
    city: 'Multan',
    product: 'Luxury Formals — Zara',
    rating: 5,
    thumbnail: '/images/AA3.jpeg',
    duration: '1:05',
    review: 'Ordered for my sister wedding. The craftsmanship is museum-quality. Absolutely stunning.',
    verified: true,
  },
];

const instagramPosts = [
  { username: '@qudsia1412', category: 'Unstitched', image: '/images/AA1.jpeg', review: 'In love with this fabric quality!', city: 'Lahore' },
  { username: '@stopcopyingmyusername', category: 'Luxury Pret', image: '/images/AA4.jpeg', review: 'Perfect Eid outfit every time.', city: 'Karachi' },
  { username: '@qudsia.ali', category: 'Luxury Formals', image: '/images/AA3.jpeg', review: 'The embroidery is breathtaking.', city: 'Islamabad' },
  { username: '@mariam.jafry', category: 'Luxury Formals', image: '/images/AA6.jpeg', review: 'My go-to brand for every occasion.', city: 'Rawalpindi' },
  { username: '@by.rooj1', category: 'Luxury Formals', image: '/images/AA10.jpeg', review: 'Premium packaging and fast delivery.', city: 'Faisalabad' },
  { username: '@aaneddles.style', category: 'Luxury Pret', image: '/images/AA7.jpeg', review: 'Never disappoints. Pure luxury.', city: 'Multan' },
  { username: '@fashion.diary', category: 'Ready to Wear', image: '/images/AA8.jpeg', review: 'Best stitching quality in Pakistan.', city: 'Peshawar' },
  { username: '@elegant.wardrobe', category: 'Bridal', image: '/images/AA11.jpeg', review: 'My bridal lehenga was a dream come true.', city: 'Quetta' },
];

const mosaicCards = [
  { type: 'image', image: '/images/AA1.jpeg', size: 'large', name: 'Ayesha Khan', product: 'Luxury Lawn', review: 'Stunning quality and perfect fit.' },
  { type: 'video', image: '/images/AA6.jpeg', size: 'medium', name: 'Sana Tariq', product: 'Formal Wear', duration: '0:43' },
  { type: 'image', image: '/images/AA3.jpeg', size: 'small', name: 'Mehreen Aslam', product: 'Luxury Formals' },
  { type: 'image', image: '/images/AA4.jpeg', size: 'small', name: 'Fatima Riaz', product: 'Luxury Pret' },
  { type: 'video', image: '/images/AA2.jpeg', size: 'medium', name: 'Ayesha Malik', product: 'Bridal Lehenga', duration: '1:12' },
  { type: 'image', image: '/images/AA10.jpeg', size: 'small', name: 'Hira Qureshi', product: 'Ready to Wear' },
  { type: 'image', image: '/images/AA8.jpeg', size: 'small', name: 'Zainab Ali', product: 'Unstitched Premium' },
  { type: 'image', image: '/images/AA7.jpeg', size: 'large', name: 'Maham Sheikh', product: 'Bridal Collection', review: 'Museum-quality craftsmanship.' },
  { type: 'image', image: '/images/AA11.jpeg', size: 'small', name: 'Amina Malik', product: 'Eid Collection' },
  { type: 'image', image: '/images/AA5.jpeg', size: 'small', name: 'Nadia Hussain', product: 'Luxury Pret' },
];

const shopTheLookProducts = [
  { name: 'Luxury Lawn — Summer Breeze', price: 'PKR 8,990', image: '/images/AA1.jpeg', customer: 'Ayesha Khan', city: 'Lahore' },
  { name: 'Luxury Pret — Noor Series', price: 'PKR 12,500', image: '/images/AA4.jpeg', customer: 'Fatima Riaz', city: 'Karachi' },
  { name: 'Formal Wear — Guldasta', price: 'PKR 18,900', image: '/images/AA6.jpeg', customer: 'Sana Tariq', city: 'Islamabad' },
  { name: 'Bridal — Mehendi Collection', price: 'PKR 45,000', image: '/images/AA7.jpeg', customer: 'Maham Sheikh', city: 'Faisalabad' },
];

const marqueeItems = [
  '★★★★★ 4.9/5 Rating',
  '50,000+ Happy Customers',
  'Verified Reviews',
  'Nationwide Delivery',
  'Premium Fabric Quality',
  'Fast Shipping',
  'Trusted Across Pakistan',
  'Handcrafted Excellence',
  '★★★★★ 4.9/5 Rating',
  '50,000+ Happy Customers',
  'Verified Reviews',
  'Nationwide Delivery',
  'Premium Fabric Quality',
  'Fast Shipping',
  'Trusted Across Pakistan',
  'Handcrafted Excellence',
];

/* ═══════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════ */

function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? 'fill-noor-gold text-noor-gold' : 'text-zinc-200'}
        />
      ))}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-noor-gold text-[0.625rem] font-semibold uppercase tracking-wider">
      <BadgeCheck size={12} className="text-noor-gold" />
      Verified Purchase
    </span>
  );
}

function SectionHeading({ eyebrow, title, subtitle, light = false }) {
  return (
    <div className="text-center mb-12 md:mb-16">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="ty-label text-noor-maroon font-semibold mb-3"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`ty-h2 ${light ? 'text-white' : 'text-noor-black'}`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mt-4 max-w-2xl mx-auto text-sm leading-relaxed ${light ? 'text-white/70' : 'text-noor-gray'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════ */

function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   SECTION TITLE — "Loved By Women Across Pakistan"
   ═══════════════════════════════════════════════ */

function SectionTitle() {
  return (
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
          <h1 className="ty-h1 text-noor-black leading-[1.08]">
            Loved By Women
            <br />
            Across Pakistan
          </h1>
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
  );
}

/* ═══════════════════════════════════════════════
   SECTION 1 — CUSTOMER PHOTO GALLERY (MASONRY)
   ═══════════════════════════════════════════════ */

function CustomerPhotoGallery({ customers = [] }) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <section className="tst-section bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title="Our Customers, Our Pride"
          subtitle="Real women. Real photos. Real trust in our quality and craftsmanship."
        />

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
          {customers.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.3) }}
              className="break-inside-avoid"
            >
              <button
                type="button"
                onClick={() => setSelectedCustomer(customer)}
                className="group relative block w-full overflow-hidden bg-noor-cream cursor-pointer"
              >
                <Image
                  src={customer.image}
                  alt={customer.name}
                  width={400}
                  height={customer.height === 'tall' ? 420 : customer.height === 'medium' ? 320 : 260}
                  className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ height: customer.height === 'tall' ? '420px' : customer.height === 'medium' ? '320px' : '260px' }}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                  <StarRating rating={customer.rating} size={12} />
                  <p className="mt-2 text-white text-xs italic leading-relaxed line-clamp-2">
                    &ldquo;{customer.text}&rdquo;
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <p className="text-white text-xs font-semibold">{customer.name}</p>
                    <span className="text-white/50 text-[0.625rem]">{customer.city}</span>
                  </div>
                  <div className="mt-2">
                    <VerifiedBadge />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-white text-noor-black text-[0.625rem] font-semibold uppercase tracking-wider transition-colors hover:bg-noor-gold hover:text-white">
                      View Story
                    </span>
                    <span className="px-3 py-1.5 bg-white/20 text-white text-[0.625rem] font-semibold uppercase tracking-wider backdrop-blur-sm border border-white/30 transition-colors hover:bg-white hover:text-noor-black">
                      Shop This Look
                    </span>
                  </div>
                </div>

                {/* Bottom Info Bar (always visible) */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-xs font-semibold">{customer.name}</p>
                      <p className="text-white/60 text-[0.625rem]">{customer.city}</p>
                    </div>
                    <StarRating rating={customer.rating} size={10} />
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 md:p-8"
          onClick={() => setSelectedCustomer(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-4xl bg-white overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-noor-black hover:bg-white transition-colors shadow-lg"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Image Side */}
              <div className="relative aspect-[3/4] md:aspect-auto">
                <Image
                  src={selectedCustomer.image}
                  alt={selectedCustomer.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Content Side */}
              <div className="p-6 md:p-8 flex flex-col gap-5">
                <StarRating rating={selectedCustomer.rating} size={16} />

                <p className="text-base text-zinc-700 italic leading-relaxed">
                  &ldquo;{selectedCustomer.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-noor-cream shrink-0">
                    <Image src={selectedCustomer.image} alt={selectedCustomer.name} width={48} height={48} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-noor-black">{selectedCustomer.name}</p>
                      {selectedCustomer.verified && <BadgeCheck size={14} className="text-noor-gold" />}
                    </div>
                    <p className="text-xs text-zinc-400">{selectedCustomer.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <ShoppingBag size={12} />
                    {selectedCustomer.product}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {selectedCustomer.date}
                  </span>
                </div>

                <VerifiedBadge />

                <div className="flex items-center gap-3 mt-auto pt-4">
                  <Link
                    href={`/category/all`}
                    className="tst-btn tst-btn--dark tst-btn--full"
                  >
                    <ShoppingBag size={14} />
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 2 — CUSTOMER STORIES
   ═══════════════════════════════════════════════ */

function CustomerStories() {
  return (
    <section className="tst-section tst-section--cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Stories"
          title="Real Women, Real Stories"
          subtitle="Every outfit tells a story. Hear the journeys of women who trust AA Neddles."
        />

        <div className="space-y-10 md:space-y-16">
          {customerStories.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`flex flex-col gap-8 md:gap-12 items-center ${
                i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2">
                <div className="relative overflow-hidden bg-noor-cream">
                  <Image
                    src={story.image}
                    alt={story.name}
                    width={600}
                    height={450}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50 shrink-0">
                        <Image src={story.image} alt={story.name} width={40} height={40} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{story.name}</p>
                        <p className="text-white/70 text-xs">{story.city}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Content */}
              <div className="w-full md:w-1/2">
                <Quote size={28} className="text-noor-gold/40 mb-4" />

                {/* Before */}
                <div className="mb-5">
                  <span className="inline-block text-[0.625rem] font-bold uppercase tracking-[0.12em] text-noor-muted mb-2">
                    Before
                  </span>
                  <p className="text-sm text-zinc-500 leading-relaxed italic">
                    &ldquo;{story.before}&rdquo;
                  </p>
                </div>

                {/* Experience */}
                <div className="mb-5 pl-4 border-l-2 border-noor-gold">
                  <span className="inline-block text-[0.625rem] font-bold uppercase tracking-[0.12em] text-noor-gold mb-2">
                    Experience
                  </span>
                  <p className="text-sm text-noor-black leading-relaxed font-medium">
                    {story.experience}
                  </p>
                </div>

                {/* Result */}
                <div className="mb-6">
                  <span className="inline-block text-[0.625rem] font-bold uppercase tracking-[0.12em] text-green-600 mb-2">
                    Result
                  </span>
                  <p className="text-sm text-noor-black leading-relaxed">
                    {story.result}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-noor-maroon/10 text-noor-maroon text-xs font-semibold uppercase tracking-wider">
                  <ShoppingBag size={14} />
                  {story.product}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3 — TRUST BAR
   ═══════════════════════════════════════════════ */

function TrustBar() {
  return (
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
                  {stat.display ? (
                    <>{stat.display}<span className="text-white/40">{stat.suffixDisplay}</span></>
                  ) : (
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  )}
                </div>
                <p className="tst-trustbar-label">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 4 — VIDEO TESTIMONIAL SHOWCASE
   ═══════════════════════════════════════════════ */

function VideoShowcase() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  const { handleKeyDown } = useCarouselKeyboard(emblaApi);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onReInit = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on('select', onReInit);
    emblaApi.on('reInit', onReInit);
    onReInit();
  }, [emblaApi]);

  return (
    <section className="tst-section tst-section--cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Video Reviews"
          title="Hear Their Stories"
          subtitle="Real women. Real experiences. Real confidence."
        />

        <div className="flex items-center justify-end gap-2 mb-8">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="tst-arrow"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="tst-arrow"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div
          className="overflow-hidden"
          ref={emblaRef}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Video testimonials carousel"
        >
          <div className="flex gap-5 md:gap-6">
            {videoTestimonials.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.3) }}
                className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_60%] md:flex-[0_0_45%] lg:flex-[0_0_38%] transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setActiveVideo(video)}
                  className="tst-video-card group text-left"
                >
                  <div className="tst-video-thumb">
                    <Image
                      src={video.thumbnail}
                      alt={video.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 38vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                    {/* Play Button */}
                    <div className="tst-video-play group-hover:scale-110">
                      <Play size={20} className="ml-0.5 text-white" fill="white" />
                    </div>

                    {/* Duration */}
                    <span className="tst-video-duration">{video.duration}</span>
                  </div>

                  <div className="tst-video-info">
                    <div className="tst-video-avatar">
                      <Image src={video.thumbnail} alt={video.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="tst-video-name">{video.name}</p>
                        {video.verified && <BadgeCheck size={12} className="text-noor-gold shrink-0" />}
                      </div>
                      <p className="tst-video-product">{video.product}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <StarRating rating={video.rating} size={10} />
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="tst-modal-backdrop"
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="tst-video-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="tst-modal-close"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Video Player Placeholder */}
            <div className="tst-video-modal-player">
              <Image
                src={activeVideo.thumbnail}
                alt={activeVideo.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 720px"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="tst-video-modal-play">
                  <Play size={28} className="ml-1 text-white" fill="white" />
                </button>
              </div>

              {/* Fake Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="w-full h-1 bg-white/30 rounded-full mb-2">
                  <div className="h-full w-0 bg-noor-gold rounded-full" />
                </div>
                <div className="flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-3">
                    <Play size={14} fill="white" />
                    <Volume2 size={14} />
                    <span>{activeVideo.duration}</span>
                  </div>
                  <Maximize size={14} />
                </div>
              </div>
            </div>

            {/* Video Details */}
            <div className="tst-video-modal-details">
              <div className="tst-video-modal-avatar">
                <Image src={activeVideo.thumbnail} alt={activeVideo.name} fill className="object-cover" sizes="48px" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="tst-video-modal-name">{activeVideo.name}</p>
                  {activeVideo.verified && <BadgeCheck size={14} className="text-noor-gold" />}
                </div>
                <p className="tst-video-modal-product">{activeVideo.product}</p>
                <StarRating rating={activeVideo.rating} size={12} />
              </div>
            </div>

            <p className="tst-video-modal-review px-6 pb-4">
              &ldquo;{activeVideo.review}&rdquo;
            </p>

            <div className="tst-video-modal-actions">
              <Link href="/category/all" className="tst-btn tst-btn--dark tst-btn--full">
                <ShoppingBag size={14} />
                Shop This Outfit
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 5 — INSTAGRAM INSPIRED WALL
   ═══════════════════════════════════════════════ */

function InstagramWall() {
  return (
    <section className="tst-section bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Social"
          title="Instagram-Inspired Wall"
          subtitle="Follow our customers and their stunning looks across Pakistan."
        />

        <div className="tst-instagram-grid">
          {instagramPosts.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.25) }}
            >
              <div className="tst-ig-card group">
                <div className="tst-ig-img">
                  <Image
                    src={post.image}
                    alt={post.username}
                    width={400}
                    height={400}
                    className="w-full aspect-square object-cover"
                  />

                  {/* Hover Overlay */}
                  <div className="tst-ig-overlay">
                    <p className="tst-ig-review">&ldquo;{post.review}&rdquo;</p>
                    <div className="tst-ig-author">
                      <Camera size={12} className="text-white" />
                      <span className="tst-ig-name">{post.username}</span>
                      <span className="tst-ig-city">{post.city}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-3 py-2.5 bg-white border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-[0.6875rem] font-semibold text-noor-black truncate">{post.username}</p>
                      <p className="text-[0.5625rem] text-zinc-400">{post.category}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Heart size={12} className="transition-colors hover:text-rose-500 cursor-pointer" />
                      <MessageCircle size={12} className="transition-colors hover:text-noor-black cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 6 — VIDEO + PHOTO MOSAIC
   ═══════════════════════════════════════════════ */

function MosaicGrid() {
  return (
    <section className="tst-section tst-section--cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured"
          title="Style Campaign"
          subtitle="A curated collection of our finest customer moments."
        />

        <div className="tst-mosaic">
          {mosaicCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
              className={`tst-mosaic-card ${
                card.size === 'large' ? 'tst-mosaic-card--large' :
                card.size === 'medium' ? 'tst-mosaic-card--medium' :
                'tst-mosaic-card--small'
              }`}
            >
              <div className="tst-mosaic-img">
                <Image
                  src={card.image}
                  alt={card.name || ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Video Play Overlay */}
                {card.type === 'video' && (
                  <div className="tst-mosaic-play">
                    <Play size={16} className="ml-0.5 text-white" fill="white" />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="tst-mosaic-overlay">
                  {card.review && (
                    <p className="tst-mosaic-review">&ldquo;{card.review}&rdquo;</p>
                  )}
                  {card.name && (
                    <p className="tst-mosaic-name">{card.name}</p>
                  )}
                  {card.product && (
                    <p className="tst-mosaic-product">{card.product}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 7 — SHOP THE LOOK
   ═══════════════════════════════════════════════ */

function ShopTheLook() {
  return (
    <section className="tst-section bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Shop the Look"
          title="Worn & Loved"
          subtitle="See what our customers are wearing and shop the exact outfits."
        />

        <div className="tst-stl-grid">
          {shopTheLookProducts.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <div className="tst-stl-card group">
                <div className="tst-stl-images">
                  <div className="tst-stl-customer relative">
                    <Image
                      src={product.image}
                      alt={product.customer}
                      width={300}
                      height={300}
                      className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="tst-stl-customer-info">
                      <p className="tst-stl-customer-name">{product.customer}</p>
                      <p className="tst-stl-customer-city">{product.city}</p>
                    </div>
                  </div>
                  <div className="tst-stl-product relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="tst-stl-details">
                  <p className="tst-stl-product-name">{product.name}</p>
                  <p className="tst-stl-price">{product.price}</p>
                  <div className="tst-stl-actions">
                    <Link href="/category/all" className="tst-btn tst-btn--dark tst-btn--sm flex-1">
                      <ShoppingBag size={12} />
                      Quick Add
                    </Link>
                    <Link href="/category/all" className="tst-btn tst-btn--outline tst-btn--sm flex-1">
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 8 — SOCIAL PROOF STRIP (MARQUEE)
   ═══════════════════════════════════════════════ */

function SocialProofStrip() {
  return (
    <section className="tst-marquee-wrap">
      <div className="tst-marquee" aria-hidden="false">
        {marqueeItems.map((item, i) => (
          <span key={i} className="tst-marquee-item">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   CTA SECTION
   ═══════════════════════════════════════════════ */

function CTASection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-noor-dark">
      <Image
        src="/images/AA3.jpeg"
        alt="AA Neddles collection"
        fill
        className="absolute inset-0 h-full w-full object-cover opacity-25"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/70" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="ty-h1 text-white leading-tight">
            Join Thousands Of
            <br />
            Happy Customers
          </h2>
          <p className="mt-6 text-lg text-white/60 max-w-lg mx-auto">
            Experience the luxury of premium Pakistani fashion.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/category/new-arrivals"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-noor-black ty-button hover:bg-noor-gold hover:text-white transition-all duration-300"
            >
              Shop New Arrivals
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/category/all"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white ty-button hover:bg-white hover:text-noor-black transition-all duration-300"
            >
              Explore Best Sellers
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   MAIN CONTENT
   ═══════════════════════════════════════════════ */

export default function TestimonialsContent() {
  const [apiTestimonials, setApiTestimonials] = useState([]);
  const [testimonialsLoaded, setTestimonialsLoaded] = useState(false);

  useEffect(() => {
    testimonialsApi.getAll()
      .then((res) => {
        const data = res.data || [];
        setApiTestimonials(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => setTestimonialsLoaded(true));
  }, []);

  const galleryData = useMemo(() => {
    if (!testimonialsLoaded) return [];
    const gallery = apiTestimonials.filter((t) => !t.type || t.type === 'gallery' || t.type === 'photo');
    return gallery.map((t, i) => ({
      id: t.id || i,
      name: t.customerName || 'Customer',
      city: t.city || '',
      product: t.product || '',
      rating: t.rating || 5,
      text: t.content || t.comment || '',
      image: t.image || t.customerImage || '',
      verified: true,
      date: t.date || '',
      height: (['tall', 'medium', 'short'])[i % 3],
    }));
  }, [apiTestimonials, testimonialsLoaded]);

  return (
    <>
      <SectionTitle />
      <CustomerPhotoGallery customers={galleryData} />
      <CustomerStories />
      <TrustBar />
      <VideoShowcase />
      <InstagramWall />
      <MosaicGrid />
      <ShopTheLook />
      <SocialProofStrip />
      <CTASection />
    </>
  );
}
