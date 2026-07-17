'use client';

import Link from 'next/link';

const CATEGORIES = [
  { name: 'Ready To Wear', slug: 'ready-to-wear', image: '/images/cat-rtw.webp' },
  { name: 'Unstitched', slug: 'unstitched', image: '/images/cat-unstitched.webp' },
  { name: 'Formals', slug: 'formals', image: '/images/cat-formals.webp' },
  { name: 'Bridals', slug: 'bridal', image: '/images/cat-bridal.webp' },
];

export default function CategoryStrip() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="ty-h2 text-center mb-12 text-noor-black">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-noor-cream rounded-3xl md:rounded-[20px] max-md:rounded-[16px] transition-all duration-300 ease hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 rounded-3xl md:rounded-[20px] max-md:rounded-[16px]"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl md:rounded-[20px] max-md:rounded-[16px]" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="ty-h4 text-white mb-1">{category.name}</h3>
                <p className="ty-caption text-white/70 uppercase tracking-wider">Explore Collection</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
