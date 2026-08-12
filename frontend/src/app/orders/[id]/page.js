'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AuthGuard from '@/components/AuthGuard';
import PageLayout from '@/components/PageLayout';
import { ordersApi } from '@/services/orders';
import { Package, Truck, ChevronLeft } from 'lucide-react';

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

function OrderDetailsContent() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    ordersApi.getById(id)
      .then((res) => {
        if (res.success && res.data) {
          setOrder(res.data);
        }
      })
      .catch(() => setError('Failed to load order details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-8 h-8 border-2 border-noor-maroon border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-noor-cream rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={28} strokeWidth={1.5} className="text-noor-maroon" />
          </div>
          <h2 className="ty-h3 text-noor-black mb-3">Order Not Found</h2>
          <p className="ty-body-sm text-noor-gray mb-6">{error || 'This order could not be found.'}</p>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-sm text-noor-maroon hover:underline"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = getCurrentStep(order.status);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-sm text-noor-gray hover:text-noor-black transition-colors"
      >
        <ChevronLeft size={16} strokeWidth={1.5} />
        Back to My Orders
      </Link>

      <div className="bg-white border border-zinc-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="ty-h4 text-noor-black">{order.orderNumber}</h3>
            <p className="text-sm text-noor-gray">Placed on {formatDate(order.createdAt)}</p>
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
            <div className="flex items-center justify-between">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    i <= currentStep ? 'bg-noor-maroon' : 'bg-zinc-200'
                  }`} />
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`h-1 w-full ${i < currentStep ? 'bg-noor-maroon' : 'bg-zinc-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-noor-gray">{STATUS_LABELS[order.status]}</span>
              {order.trackingNumber && (
                <span className="text-xs text-noor-gray">Tracking: {order.trackingNumber}</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-zinc-100 p-6">
        <h4 className="ty-h4 text-noor-black mb-4">Items</h4>
        <div className="space-y-4">
          {(order.items || []).map((item) => (
            <div key={item.id} className="flex gap-4 pb-4 border-b border-zinc-50 last:border-0 last:pb-0">
              <div className="w-20 h-20 bg-zinc-50 relative shrink-0">
                {item.product?.images?.[0]?.url ? (
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-300">
                    <Package size={24} strokeWidth={1} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-noor-black truncate">
                  {item.product?.name || 'Product'}
                </p>
                <p className="text-xs text-noor-gray mt-1">Qty: {item.quantity}</p>
                <p className="text-sm font-medium text-noor-black mt-1">
                  Rs. {item.price?.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-zinc-100 p-6">
        <h4 className="ty-h4 text-noor-black mb-4">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-noor-gray">Subtotal</span>
            <span className="text-noor-black">Rs. {order.subtotal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-noor-gray">Shipping</span>
            <span className="text-noor-black">
              {order.shippingCost > 0 ? `Rs. ${order.shippingCost.toLocaleString()}` : 'Free'}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-noor-gray">Discount</span>
              <span className="text-green-600">-Rs. {order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-zinc-100 pt-2 font-medium">
            <span className="text-noor-black">Total</span>
            <span className="text-noor-black">Rs. {order.total?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-100 p-6">
        <h4 className="ty-h4 text-noor-black mb-4">Shipping Address</h4>
        {order.shippingAddress && (
          <div className="text-sm text-noor-gray space-y-1">
            {order.shippingAddress.fullName && <p>{order.shippingAddress.fullName}</p>}
            {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
            {order.shippingAddress.addressLine1 && <p>{order.shippingAddress.addressLine1}</p>}
            {order.shippingAddress.city && (
              <p>
                {[order.shippingAddress.city, order.shippingAddress.province].filter(Boolean).join(', ')}
                {order.shippingAddress.postalCode ? ` ${order.shippingAddress.postalCode}` : ''}
              </p>
            )}
          </div>
        )}
        {order.trackingUrl && (
          <a
            href={order.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-noor-maroon hover:underline"
          >
            <Truck size={16} strokeWidth={1.5} />
            Track Shipment
          </a>
        )}
      </div>

      <div className="bg-white border border-zinc-100 p-6">
        <h4 className="ty-h4 text-noor-black mb-4">Payment</h4>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-noor-gray">Method</span>
            <span className="text-noor-black capitalize">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-noor-gray">Status</span>
            <span className={`capitalize ${
              order.paymentStatus === 'COMPLETED' || order.paymentStatus === 'PAID'
                ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <AuthGuard>
      <PageLayout
        title="Order Details"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'My Orders', href: '/orders' },
          { label: 'Order Details' },
        ]}
      >
        <OrderDetailsContent />
      </PageLayout>
    </AuthGuard>
  );
}
