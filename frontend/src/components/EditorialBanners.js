'use client';

import Link from 'next/link';
import Image from 'next/image';

const BANNERS = [
  {
    title: 'LUXURY FORMALS',
    subtitle: 'Exquisite craftsmanship for your most cherished occasions',
    image: '/images/AA4.jpeg',
    href: '/category/luxury-formals',
  },
  {
    title: 'LUXURY PRET',
    subtitle: 'Effortless elegance for the modern woman',
    image: '/images/AA5.jpeg',
    href: '/category/luxury-pret',
  },
];

export default function EditorialBanners() {
  return (
    <section className="editorial-banners">
      <div className="editorial-banners__grid">
        {BANNERS.map((banner) => (
          <Link
            key={banner.title}
            href={banner.href}
            className="editorial-banners__card group"
          >
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="editorial-banners__img"
              priority
            />
            <div className="editorial-banners__scrim" />
            <div className="editorial-banners__content">
              <h3 className="editorial-banners__title">{banner.title}</h3>
              <p className="editorial-banners__subtitle">{banner.subtitle}</p>
              <span className="editorial-banners__cta">SHOP NOW</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
