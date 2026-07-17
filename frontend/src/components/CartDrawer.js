'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

export default function CartDrawer() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, subtotal } = useCart();

  useEffect(() => {
    setIsMounted(true);
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
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 pb-4">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-noor-black">Shopping Bag ( {items.length} Item{items.length !== 1 ? 's' : ''} )</h2>
              <button onClick={closeCart} aria-label="Close cart" className="flex items-center justify-center text-noor-gray hover:text-noor-black transition-colors">
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
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
                <div className="space-y-6">
                  {items.map((item, idx) => (
                    <div key={`${item.id}-${item.selectedSize || ''}-${item.selectedColor || ''}`} className="flex gap-4">
                      <div className="w-[100px] h-[133px] bg-zinc-100 overflow-hidden shrink-0 ">
                        {item.image && (
                          <Image src={item.image} alt={item.title || 'Product'} width={100} height={133} className="w-full h-full object-cover" loading="lazy" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1.5">
                            {item.sku || 'M2PW002-SML-UBR'} | IN STOCK
                          </div>
                          <h3 className="text-xs font-body font-semibold uppercase mb-4 text-noor-black">
                            {item.title || 'Untitled'}
                          </h3>
                          
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase text-noor-black font-semibold tracking-wider">Size:</span>
                            <span className="text-[10px] bg-zinc-100 px-2 py-0.5  uppercase font-semibold text-noor-black">{item.selectedSize || 'S'}</span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] uppercase text-noor-black font-semibold tracking-wider">Color:</span>
                            <span className="text-[10px] bg-zinc-100 px-2 py-0.5  uppercase font-semibold text-noor-black">{item.selectedColor || 'BROWN'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase text-noor-black font-semibold tracking-wider">Quantity</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(idx, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                                className="flex items-center justify-center w-[18px] h-[18px] bg-black text-white disabled:opacity-50"
                              >
                                <Minus size={12} strokeWidth={3} />
                              </button>
                              <span className="text-xs font-semibold w-3 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(idx, item.quantity + 1)}
                                disabled={item.quantity >= 10}
                                aria-label="Increase quantity"
                                className="flex items-center justify-center w-[18px] h-[18px] bg-black text-white disabled:opacity-50"
                              >
                                <Plus size={12} strokeWidth={3} />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold uppercase">Rs.{item.price?.toLocaleString() ?? '14,990'}</span>
                            <button
                              onClick={() => removeFromCart(idx)}
                              aria-label={`Remove ${item.title}`}
                              className="text-zinc-400 hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
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
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-noor-black">Subtotal</span>
                  <span className="text-[13px] font-semibold text-noor-black">Rs.{subtotal?.toLocaleString() || '14,990'}</span>
                </div>
                <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-5">
                  Shipping, taxes, and discount codes calculated at checkout.
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-white text-noor-black border border-noor-black py-3.5 text-xs font-semibold tracking-widest uppercase hover:bg-noor-black hover:text-white transition-colors "
                >
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
