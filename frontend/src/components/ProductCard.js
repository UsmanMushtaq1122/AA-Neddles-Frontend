'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ArrowRight, ScanSearch } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/useToast';
import QuickViewModal from '@/components/QuickViewModal';

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const wasWishlisted = isWishlisted(product.id);
    toggleWishlist(product.id);
    addToast(wasWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info');
  };

  if (!product) return null;

  const slug = product.slug || product.id;

  return (
    <>
    <div className="group relative block rounded-3xl md:rounded-[20px] max-md:rounded-[16px] transition-all duration-300 ease hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] will-change-transform">
      <div className="relative aspect-[3/4] overflow-hidden bg-noor-cream rounded-3xl md:rounded-[20px] max-md:rounded-[16px]">
        <Link href={`/product/${slug}`} className="block w-full h-full" aria-label={product.title}>
          {product.images?.[0] && !imageError ? (
            <Image
              src={product.images[0]}
              alt={product.altText || product.title ? `${product.title} — AA Neddles` : 'AA Neddles product'}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-noor-gray">
              <span className="ty-caption">No Image</span>
            </div>
          )}
        </Link>

        {product.badge ? (
          <span className="absolute top-3 left-3 px-3 py-1 bg-noor-maroon text-white text-xs font-medium shadow-sm z-10 rounded-full">
            {product.badge}
          </span>
        ) : product.isNew ? (
          <span className="absolute top-3 left-3 px-3 py-1 bg-white text-black text-xs font-medium shadow-sm z-10 rounded-full">
            New
          </span>
        ) : null}

        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-300 z-10 pointer-events-auto">
          <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2.5">
            <Link href={`/product/${slug}`} className="flex items-center gap-2 text-sm font-medium text-zinc-800 flex-1 hover:text-noor-maroon transition-colors">
              View Details
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleQuickView}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-zinc-100 transition-colors"
                aria-label="Quick view"
              >
                <ScanSearch size={20} className="text-zinc-500" />
              </button>
              <button
                type="button"
                onClick={handleWishlistToggle}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-zinc-100 transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart
                  size={20}
                  className={isWishlisted(product.id) ? 'fill-noor-maroon text-noor-maroon' : 'text-zinc-400 hover:text-noor-gold transition-colors'}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 px-1">
        <Link href={`/product/${slug}`} className="block">
          <h3 className="ty-body text-black font-normal line-clamp-2 hover:text-noor-maroon transition-colors">
            {product.title}
          </h3>
          {product.salePrice ? (
            <div className="flex items-center gap-2 mt-1">
              <p className="ty-price font-bold text-noor-maroon">
                Rs.{product.salePrice.toLocaleString()}
              </p>
              <p className="text-[13px] text-zinc-400 line-through">
                Rs.{product.price?.toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="ty-price font-bold text-black mt-1">
              Rs.{product.price?.toLocaleString()}
            </p>
          )}
        </Link>
      </div>
    </div>

    <QuickViewModal key={`qv-${product.id}-${String(quickViewOpen)}`} product={product} isOpen={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
    </>
  );
}
