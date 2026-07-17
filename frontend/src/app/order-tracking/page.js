'use client';

import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Search, Package } from 'lucide-react';

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [searched, setSearched] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setSearched(true);
    }
  };

  return (
    <PageLayout
      title="Order Tracking"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Order Tracking' },
      ]}
    >
      <div className="text-center py-16 max-w-md mx-auto">
        <div className="w-16 h-16 bg-noor-cream rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={28} strokeWidth={1.5} className="text-noor-maroon" />
        </div>
        <h2 className="ty-h3 text-noor-black mb-3">Track Your Order</h2>
        <p className="text-noor-gray text-sm leading-relaxed mb-8">
          Enter your order number to track your shipment.
        </p>

        <form onSubmit={handleTrack} className="space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter order number (e.g. ORD-12345)"
              className="w-full pl-12 pr-4 py-4 border border-zinc-200 text-sm text-noor-black placeholder:text-zinc-300 outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10"
              aria-label="Order number"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-noor-black text-white text-sm font-semibold uppercase tracking-wider hover:bg-noor-maroon transition-colors"
          >
            Track Order
          </button>
        </form>

        {searched && (
          <div className="mt-8 p-6 bg-noor-cream">
            <p className="text-sm text-noor-gray">
              Order <span className="font-semibold text-noor-black">{orderNumber}</span> is currently being processed.
              You will receive an email with tracking details once your order ships.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
