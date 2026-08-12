'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Loader2, Tag, X, AlertCircle, Lock, Truck, Package, ChevronDown
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

function SkeletonLine({ className }) {
  return <div className={`bg-zinc-100 rounded animate-pulse ${className}`} />;
}

export function CheckoutSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <SkeletonLine className="h-8 w-48 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-4">
          <SkeletonLine className="h-14 w-full" />
          <SkeletonLine className="h-14 w-full" />
          <SkeletonLine className="h-14 w-3/4" />
          <SkeletonLine className="h-14 w-full" />
          <SkeletonLine className="h-12 w-full mt-4" />
        </div>
        <div className="lg:col-span-2">
          <SkeletonLine className="h-80 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function OrderSummaryContent({ items, subtotal, shippingCost, discountAmount, total, codFee = 0, couponCode, setCouponCode, couponState, couponMessage, applyCoupon, removeCoupon, mobile }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <div className="p-5">
      <h3 className="text-[11px] font-bold text-noor-black uppercase tracking-[0.12em] mb-4">Order Summary</h3>
      <div className="space-y-4 max-h-72 overflow-y-auto pr-1 mb-4">
        {items.map((item) => (
          <div key={`${item.id}-${item.selectedSize || ''}-${item.selectedColor || ''}`} className="flex gap-3">
            <div className="relative w-14 h-[72px] bg-zinc-100 overflow-hidden shrink-0 border border-zinc-100">
              {item.image ? (
                <Image src={item.image} alt={item.title} width={56} height={72} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                  <Package size={24} />
                </div>
              )}
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-noor-black text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-noor-black line-clamp-1">{item.title}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {item.selectedSize && <span className="text-[10px] text-zinc-400">{item.selectedSize}</span>}
                {item.selectedColor && (
                  <>
                    <span className="text-[10px] text-zinc-300">•</span>
                    <span className="text-[10px] text-zinc-400">{item.selectedColor}</span>
                  </>
                )}
              </div>
              <p className="text-[12px] font-semibold text-noor-black mt-0.5">
                Rs.{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-200 pt-4 mb-4">
        {couponState === 'success' ? (
          <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-emerald-600" />
              <div>
                <p className="text-[11px] font-semibold text-emerald-700">{couponCode.toUpperCase()}</p>
                <p className="text-[10px] text-emerald-600">{couponMessage}</p>
              </div>
            </div>
            <button type="button" onClick={removeCoupon} className="text-zinc-400 hover:text-red-500 transition-colors" aria-label="Remove coupon">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div>
            <label className="text-[10px] uppercase tracking-[0.1em] font-medium text-zinc-400 mb-2 block">Discount Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 px-3 py-2.5 border border-zinc-200 text-[12px] focus:outline-none focus:ring-1 focus:ring-noor-gold/30 focus:border-noor-gold transition-all placeholder:text-zinc-300"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } }}
              />
              <button
                type="button"
                onClick={applyCoupon}
                disabled={couponState === 'loading' || !couponCode.trim()}
                className="px-4 py-2.5 bg-noor-black text-white text-[10px] font-semibold uppercase tracking-wider hover:bg-noor-gold transition-colors disabled:opacity-40 flex items-center gap-1.5"
              >
                {couponState === 'loading' ? <Loader2 size={12} className="animate-spin" /> : null}
                Apply
              </button>
            </div>
            {couponState === 'error' && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle size={11} /> {couponMessage}
              </motion.p>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-zinc-200 pt-4 space-y-2.5">
        <div className="flex justify-between text-[12px]">
          <span className="text-zinc-400">Subtotal</span>
          <span className="font-medium text-noor-black">Rs.{subtotal.toLocaleString()}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-[12px]">
            <span className="text-emerald-600">Discount</span>
            <span className="font-medium text-emerald-600">-Rs.{discountAmount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-[12px]">
          <span className="text-zinc-400">Shipping</span>
          <span className={`font-medium ${shippingCost === 0 ? 'text-emerald-600' : 'text-noor-black'}`}>
            {shippingCost === 0 ? 'Free' : `Rs.${shippingCost}`}
          </span>
        </div>
        {codFee > 0 && (
          <div className="flex justify-between text-[12px]">
            <span className="text-zinc-400">Cash on Delivery Fee</span>
            <span className="font-medium text-noor-black">Rs.{codFee.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-[15px] font-bold text-noor-black pt-3 border-t border-zinc-200">
          <span>Total</span>
          <span>Rs.{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-zinc-200 grid grid-cols-3 gap-2">
        {[
          { icon: <Lock size={14} />, label: 'Secure' },
          { icon: <Truck size={14} />, label: 'Fast Delivery' },
          { icon: <Package size={14} />, label: 'Easy Returns' },
        ].map((b) => (
          <div key={b.label} className="flex flex-col items-center gap-1 text-center">
            <span className="text-zinc-300">{b.icon}</span>
            <span className="text-[9px] text-zinc-400 font-medium">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (!mobile) return content;

  return (
    <div className="lg:hidden mb-4">
      <button type="button" onClick={() => setMobileOpen(!mobileOpen)} className="w-full bg-white border border-zinc-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package size={18} className="text-zinc-400" />
          <span className="text-[13px] font-semibold text-noor-black">Order Summary ({items.length} item{items.length !== 1 ? 's' : ''})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold text-noor-black">Rs.{total.toLocaleString()}</span>
          <ChevronDown size={16} className={`text-zinc-400 transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
