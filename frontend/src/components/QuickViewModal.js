'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/useToast';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const sizes = product?.sizes?.length ? product.sizes : ['One Size'];
  const [selectedSize, setSelectedSize] = useState(() => sizes[0]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!product) return null;

  const slug = product.slug || product.id;
  const isSale = product.salePrice != null;
  const MAX_QUANTITY = 10;

  const handleAddToBag = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.salePrice || product.price,
      image: product.images?.[0] || '',
      selectedSize,
      selectedColor: null,
      quantity,
      slug,
    });
    addToast(`${product.title} added to your bag`);
    onClose();
  };

  const handleWishlistToggle = () => {
    const wasWishlisted = isWishlisted(product.id);
    toggleWishlist(product.id);
    addToast(wasWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'info');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-[100]"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Quick view: ${product.title}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 text-noor-gray hover:text-noor-black transition-colors bg-white/90 rounded-full p-1.5"
                aria-label="Close"
              >
                <X size={18} strokeWidth={1.5} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative aspect-[3/4] bg-noor-cream">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.altText || product.title || 'AA Neddles product'}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-noor-gray">
                      <span className="ty-caption">No Image</span>
                    </div>
                  )}
                </div>

                <div className="p-5 md:p-8 flex flex-col">
                  <h2 className="text-[18px] md:text-[22px] font-medium text-noor-black leading-snug">
                    {product.title}
                  </h2>

                  <div className="flex items-center gap-3 mt-3">
                    {isSale ? (
                      <>
                        <span className="text-[18px] font-bold text-noor-maroon">
                          Rs.{(product.salePrice ?? 0).toLocaleString()}
                        </span>
                        <span className="text-[14px] text-zinc-400 line-through">
                          Rs.{(product.price ?? 0).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-[18px] font-bold text-noor-black">
                        Rs.{(product.price ?? 0).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {product.description && (
                    <p className="mt-4 text-[13px] leading-relaxed text-zinc-600 line-clamp-3">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-5">
                    <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-noor-black block mb-3">
                      Size
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[46px] px-3.5 py-2 text-[12px] font-medium border transition-all ${selectedSize === size ? 'bg-noor-black text-white border-noor-black' : 'border-zinc-300 text-zinc-700 hover:border-noor-black hover:text-noor-black'
                            }`}
                          aria-pressed={selectedSize === size}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-noor-black block mb-3">
                      Quantity
                    </span>
                    <div className="flex items-center gap-0 w-max">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-10 h-10 grid place-items-center bg-zinc-200 text-zinc-600 disabled:opacity-40 transition-colors hover:bg-zinc-300"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="w-11 h-10 grid place-items-center text-[14px] font-medium border-t border-b border-zinc-200" aria-live="polite" aria-label={`Quantity: ${quantity}`}>{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(MAX_QUANTITY, quantity + 1))}
                        disabled={quantity >= MAX_QUANTITY}
                        className="w-10 h-10 grid place-items-center bg-noor-black text-white disabled:opacity-40 transition-colors hover:bg-zinc-800"
                        aria-label="Increase quantity"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2.5">
                    <button
                      onClick={handleAddToBag}
                      className="w-full py-3.5 bg-noor-black text-white text-[11px] font-semibold uppercase tracking-[0.06em] flex items-center justify-center gap-2.5 hover:bg-noor-gold transition-all"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag size={16} />
                      ADD TO CART
                    </button>
                    <button
                      onClick={handleWishlistToggle}
                      className="w-full py-3.5 border-2 border-noor-black text-noor-black text-[11px] font-semibold uppercase tracking-[0.06em] flex items-center justify-center gap-2.5 hover:bg-zinc-50 transition-all"
                      aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart size={16} className={isWishlisted(product.id) ? 'fill-red-500 text-red-500' : ''} />
                      {isWishlisted(product.id) ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
                    </button>
                    <Link
                      href={`/product/${slug}`}
                      onClick={onClose}
                      className="w-full py-3.5 bg-noor-gold text-white text-[11px] font-semibold uppercase tracking-[0.06em] flex items-center justify-center gap-2.5 hover:bg-noor-gold/90 transition-all"
                    >
                      VIEW FULL DETAILS
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
