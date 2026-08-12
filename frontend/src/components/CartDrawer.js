'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

export default function CartDrawer() {
  const isMountedRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, subtotal } = useCart();

  // Schedule mount state update asynchronously to avoid set-state-in-effect violation
  useEffect(() => {
    const timer = setTimeout(() => {
      isMountedRef.current = true;
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') closeCart();
  }, [closeCart]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:pb-4 shrink-0">
              <h2 className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-noor-black">Shopping Bag ({items.length} Item{items.length !== 1 ? 's' : ''})</h2>
              <button onClick={closeCart} aria-label="Close cart" className="flex items-center justify-center text-noor-gray hover:text-noor-black transition-colors p-1">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-noor-gray mb-4" />
                  <p className="ty-body-sm text-noor-gray mb-4">Your bag is empty</p>
                  <Link
                    href="/category/all"
                    onClick={closeCart}
                    className="inline-flex items-center justify-center px-6 py-3 bg-noor-black text-white ty-button hover:bg-noor-black/90 transition-colors"
                  >
                    START SHOPPING
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6 pb-4">
                  {items.map((item, idx) => (
                    <div key={`${item.id}-${item.selectedSize || ''}-${item.selectedColor || ''}`} className="flex gap-3 sm:gap-4">
                      <div className="w-[80px] sm:w-[100px] h-[106px] sm:h-[133px] bg-zinc-100 overflow-hidden shrink-0">
                        {item.image && (
                          <Image src={item.image} alt={item.title || 'Product'} width={100} height={133} className="w-full h-full object-cover" loading="lazy" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                        <div>
                          <h3 className="text-[11px] sm:text-xs font-body font-semibold uppercase text-noor-black truncate">
                            {item.title || 'Untitled'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 sm:mt-2">
                            <span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-wider">Size: <span className="bg-zinc-100 px-1.5 py-0.5 font-semibold text-noor-black ml-1">{item.selectedSize || 'S'}</span></span>
                            <span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-wider">Color: <span className="bg-zinc-100 px-1.5 py-0.5 font-semibold text-noor-black ml-1">{item.selectedColor || 'BROWN'}</span></span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 sm:mt-auto gap-2">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-[9px] sm:text-[10px] uppercase text-noor-black font-semibold tracking-wider hidden sm:inline">Qty</span>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <button onClick={() => updateQuantity(idx, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Decrease quantity" className="flex items-center justify-center w-[20px] sm:w-[18px] h-[20px] sm:h-[18px] bg-black text-white disabled:opacity-50">
                                <Minus size={10} strokeWidth={3} />
                              </button>
                              <span className="text-xs font-semibold w-3 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(idx, item.quantity + 1)} disabled={item.quantity >= 10} aria-label="Increase quantity" className="flex items-center justify-center w-[20px] sm:w-[18px] h-[20px] sm:h-[18px] bg-black text-white disabled:opacity-50">
                                <Plus size={10} strokeWidth={3} />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] sm:text-xs font-semibold uppercase whitespace-nowrap">Rs.{item.price?.toLocaleString() ?? '14,990'}</span>
                            <button onClick={() => removeFromCart(idx)} aria-label={`Remove ${item.title}`} className="text-zinc-400 hover:text-red-500 transition-colors p-1">
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-zinc-100 shrink-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-noor-black">Subtotal</span>
                  <span className="text-[13px] font-semibold text-noor-black">Rs.{subtotal?.toLocaleString() || '14,990'}</span>
                </div>
                <p className="text-[8px] sm:text-[9px] text-zinc-500 uppercase tracking-wider mb-4">
                  Shipping & taxes calculated at checkout.
                </p>
                <button onClick={handleCheckout} className="w-full bg-white text-noor-black border border-noor-black py-3 text-xs font-semibold tracking-widest uppercase hover:bg-noor-black hover:text-white transition-colors">
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
