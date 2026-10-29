'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Play, Star, X } from 'lucide-react';
import Link from 'next/link';
import { testimonialsApi } from '@/services/testimonials';

function getVideoPoster(url) {
  if (!url) return '';
  return url.replace('/video/upload/', '/video/upload/so_0,w_800,q_auto/').replace(/\.[^/.]+$/, '.jpg');
}

function getInitials(name) {
  return (name || 'Customer')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function Rating({ value = 5 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={11}
          aria-hidden="true"
          className={index < value ? 'fill-noor-gold text-noor-gold' : 'text-white/60'}
        />
      ))}
    </div>
  );
}

function VideoCard({ testimonial, onOpen }) {
  const [posterFailed, setPosterFailed] = useState(false);
  const poster = getVideoPoster(testimonial.videoUrl);

  return (
    <button
      type="button"
      onClick={() => onOpen(testimonial)}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-noor-black text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-noor-gold"
      aria-label={`Play testimonial from ${testimonial.customerName || 'customer'}`}
    >
      {!posterFailed && poster ? (
        <img
          src={poster}
          alt=""
          loading="lazy"
          onError={() => setPosterFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-noor-maroon via-[#5f2020] to-noor-black">
          <span className="font-heading text-5xl text-white/20">{getInitials(testimonial.customerName)}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/5" />
      <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-noor-black shadow-lg transition duration-300 group-hover:scale-110">
        <Play size={18} fill="currentColor" aria-hidden="true" />
      </span>
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <p className="truncate text-xs font-semibold text-white sm:text-sm">
          {testimonial.customerName || 'Customer'}
        </p>
        <p className="mt-1 line-clamp-2 text-[0.6875rem] leading-relaxed text-white/75 sm:text-xs">
          {testimonial.content || 'A customer story shared with AA Needles.'}
        </p>
        <div className="mt-2">
          <Rating value={testimonial.rating} />
        </div>
      </div>
    </button>
  );
}

function PhotoCard({ testimonial, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(testimonial)}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl bg-noor-cream text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-noor-gold"
      aria-label={`View testimonial photo from ${testimonial.customerName || 'customer'}`}
    >
      <img
        src={testimonial.image || testimonial.customerImage}
        alt={`${testimonial.customerName || 'Customer'} testimonial`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <p className="truncate text-xs font-semibold text-white sm:text-sm">
          {testimonial.customerName || 'Customer'}
        </p>
        <p className="mt-1 line-clamp-2 text-[0.6875rem] leading-relaxed text-white/75 sm:text-xs">
          {testimonial.content || 'A customer story shared with AA Needles.'}
        </p>
        <div className="mt-2">
          <Rating value={testimonial.rating} />
        </div>
      </div>
    </button>
  );
}

function TestimonialModal({ testimonial, onClose }) {
  useEffect(() => {
    if (!testimonial) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [testimonial, onClose]);

  if (!testimonial) return null;
  const isVideo = testimonial.type === 'video' && testimonial.videoUrl;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${testimonial.customerName || 'Customer'} testimonial`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
          aria-label="Close testimonial preview"
        >
          <X size={20} aria-hidden="true" />
        </button>
        {isVideo ? (
          <video
            src={testimonial.videoUrl}
            controls
            autoPlay
            playsInline
            className="max-h-[75vh] w-full bg-black object-contain"
          />
        ) : (
          <img
            src={testimonial.image || testimonial.customerImage}
            alt={`${testimonial.customerName || 'Customer'} testimonial`}
            className="max-h-[75vh] w-full object-contain"
          />
        )}
        <div className="space-y-2 p-4 sm:p-5">
          <p className="font-semibold text-noor-black">{testimonial.customerName || 'Customer'}</p>
          {testimonial.content && <p className="text-sm leading-relaxed text-noor-gray">{testimonial.content}</p>}
          <Rating value={testimonial.rating} />
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsPreview() {
  const [testimonials, setTestimonials] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  useEffect(() => {
    testimonialsApi.getAll()
      .then((res) => setTestimonials(Array.isArray(res.data) ? res.data : []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoaded(true));
  }, []);

  const gallery = useMemo(
    () => testimonials.filter((testimonial) => (
      (testimonial.type === 'video' && testimonial.videoUrl)
      || (testimonial.type !== 'video' && (testimonial.image || testimonial.customerImage))
    )),
    [testimonials],
  );

  if (!loaded || gallery.length === 0) return null;

  return (
    <>
      <section className="tst-section tst-section--cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="mb-4 inline-block text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-noor-maroon">
              Testimonials
            </span>
            <h2 className="ty-h1 leading-[1.08] text-noor-black">What Our Customers Say</h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-noor-gray">
              Customer experiences, shared in their own words.
            </p>
          </div>
        </div>
      </section>

      <section className="tst-section bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center md:mb-14">
            <p className="ty-label mb-3 font-semibold text-noor-maroon">Gallery</p>
            <h2 className="ty-h2 text-noor-black">Our Customers, Our Pride</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-noor-gray">
              Photos and stories shared by our customers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {gallery.map((testimonial) => (
              <div key={testimonial.id}>
                {testimonial.type === 'video' ? (
                  <VideoCard testimonial={testimonial} onOpen={setSelectedTestimonial} />
                ) : (
                  <PhotoCard testimonial={testimonial} onOpen={setSelectedTestimonial} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center md:mt-12">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 bg-noor-black px-7 py-3.5 text-white transition-colors hover:bg-noor-gold"
            >
              View All Testimonials
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <TestimonialModal
        testimonial={selectedTestimonial}
        onClose={() => setSelectedTestimonial(null)}
      />
    </>
  );
}
