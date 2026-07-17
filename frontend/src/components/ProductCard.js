'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/useToast';

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.salePrice || product.price,
        image: product.images?.[0],
        selectedSize: product.sizes?.[0] || null,
        selectedColor: product.colors?.[0] || null,
        slug: product.slug,
        quantity: 1,
      });
      addToast('Added to bag', 'success');
    }
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
    <Link href={`/product/${slug}`} className="group block rounded-3xl md:rounded-[20px] max-md:rounded-[16px] transition-all duration-300 ease hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
      <div className="relative aspect-[3/4] overflow-hidden bg-noor-cream rounded-3xl md:rounded-[20px] max-md:rounded-[16px]">
          {product.images?.[0] && !imageError ? (
          <Image
            src={product.images[0]}
            alt={product.title || 'Product image'}
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

        {product.badge ? (
          <span className="absolute top-3 left-3 px-3 py-1 bg-noor-maroon text-white text-xs font-medium shadow-sm z-10 rounded-full">
            {product.badge}
          </span>
        ) : product.isNew ? (
          <span className="absolute top-3 left-3 px-3 py-1 bg-white text-black text-xs font-medium shadow-sm z-10 rounded-full">
            New
          </span>
        ) : null}

        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 flex items-center justify-center bg-white/90 backdrop-blur-sm z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity rounded-full w-8 h-8"
        >
          <Heart
            size={18}
            className={isWishlisted(product.id) ? 'fill-red-500 text-red-500' : 'text-noor-black'}
          />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-300 z-10">
          <button
            onClick={handleAddToCart}
            className="w-full py-3 bg-noor-black text-white ty-button hover:bg-noor-black/90 transition-colors flex items-center justify-center gap-2 rounded-2xl"
          >
            <ShoppingBag size={16} />
            ADD TO CART
          </button>
        </div>

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
      </div>

      <div className="mt-4 px-1">
        <h3 className="text-[15px] leading-[1.4] text-black font-normal line-clamp-2">
          {product.title}
        </h3>
        {product.salePrice ? (
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[15px] font-bold text-noor-maroon">
              Rs.{product.salePrice.toLocaleString()}
            </p>
            <p className="text-[13px] text-zinc-400 line-through">
              Rs.{product.price?.toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-[15px] font-bold text-black mt-1">
            Rs.{product.price?.toLocaleString()}
          </p>
        )}
      </div>
    </Link>
  );
}
