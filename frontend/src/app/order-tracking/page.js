'use client';

import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { ordersApi } from '@/services/orders';
import { Search, Package, Truck, MapPin, Calendar } from 'lucide-react';

const STATUS_LABELS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  QUALITY_CHECK: 'Quality Check',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
};

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'QUALITY_CHECK', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

function getCurrentStep(status) {
  const idx = STATUS_STEPS.indexOf(status);
  return idx >= 0 ? idx : -1;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await ordersApi.trackOrder(orderNumber.trim());
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setError('Order not found');
      }
    } catch {
      setError('Order not found. Please check your order number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? getCurrentStep(order.status) : -1;

  return (
    <PageLayout
      title="Order Tracking"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Order Tracking' },
      ]}
    >
      <div className="max-w-lg mx-auto py-8">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-noor-cream rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck size={28} strokeWidth={1.5} className="text-noor-maroon" />
          </div>
          <h2 className="ty-h3 text-noor-black mb-3">Track Your Order</h2>
          <p className="text-noor-gray text-sm leading-relaxed">
            Enter your order number to check the current status of your shipment.
          </p>
        </div>

        <form onSubmit={handleTrack} className="space-y-4 mb-10">
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
            disabled={loading}
            className="w-full py-4 bg-noor-black text-white text-sm font-semibold uppercase tracking-wider hover:bg-noor-gold transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>

        {error && (
          <div className="p-6 bg-red-50 border border-red-100 text-center">
            <Package size={24} strokeWidth={1.5} className="mx-auto mb-3 text-red-400" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {order && !error && (
          <div className="space-y-6">
            <div className="bg-white border border-zinc-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-noor-black">{order.orderNumber}</h3>
                  <p className="text-sm text-noor-gray flex items-center gap-1 mt-1">
                    <Calendar size={14} strokeWidth={1.5} />
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

              {order.status !== 'CANCELLED' && order.status !== 'RETURNED' && (
                <div className="mt-6">
                  <div className="relative">
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step} className="flex items-center mb-2 last:mb-0">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          i <= currentStep ? 'bg-noor-maroon text-white' : 'bg-zinc-200 text-zinc-400'
                        }`}>
                          {i < currentStep ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                          ) : i === currentStep ? (
                            <div className="w-2.5 h-2.5 bg-white rounded-full" />
                          ) : (
                            <div className="w-2 h-2 bg-zinc-300 rounded-full" />
                          )}
                        </div>
                        <div className={`ml-3 text-sm ${
                          i <= currentStep ? 'text-noor-black font-medium' : 'text-zinc-400'
                        }`}>
                          {STATUS_LABELS[step]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {order.status === 'CANCELLED' && (
                <div className="mt-4 p-4 bg-red-50">
                  <p className="text-sm text-red-700">This order has been cancelled.</p>
                </div>
              )}
            </div>

            {order.trackingNumber && (
              <div className="bg-white border border-zinc-100 p-6">
                <h4 className="text-sm font-semibold text-noor-black mb-3 flex items-center gap-2">
                  <MapPin size={16} strokeWidth={1.5} />
                  Tracking Information
                </h4>
                <p className="text-sm text-noor-gray">Tracking Number: {order.trackingNumber}</p>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-sm text-noor-maroon hover:underline"
                  >
                    <Truck size={16} strokeWidth={1.5} />
                    Track with Courier
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
