'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import PageLayout from '@/components/PageLayout';
import { ordersApi } from '@/services/orders';
import { Package, ChevronRight, Clock } from 'lucide-react';

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

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-indigo-100 text-indigo-800',
  QUALITY_CHECK: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-cyan-100 text-cyan-800',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  RETURNED: 'bg-gray-100 text-gray-800',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function OrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ordersApi.getMyOrders()
      .then((res) => {
        if (res.success && res.data) {
          setOrders(res.data.orders || []);
        }
      })
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-8 h-8 border-2 border-noor-maroon border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-noor-gray">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-noor-cream rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={28} strokeWidth={1.5} className="text-noor-maroon" />
          </div>
          <h2 className="ty-h3 text-noor-black mb-3">No Orders Yet</h2>
          <p className="ty-body-sm text-noor-gray leading-relaxed mb-6">
            You haven&apos;t placed any orders yet. Start shopping to see your order history here.
          </p>
          <Link
            href="/category/all"
            className="inline-block px-8 py-3 bg-noor-black text-white ty-button hover:bg-noor-gold transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="block bg-white border border-zinc-100 hover:border-zinc-200 transition-colors"
        >
          <div className="p-5 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-noor-black">
                  {order.orderNumber}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[order.status] || 'bg-zinc-100 text-zinc-800'}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-noor-gray">
                <span className="flex items-center gap-1">
                  <Clock size={14} strokeWidth={1.5} />
                  {formatDate(order.createdAt)}
                </span>
                <span>
                  {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                </span>
                <span className="font-medium text-noor-black">
                  Rs. {order.total?.toLocaleString()}
                </span>
              </div>
            </div>
            <ChevronRight size={18} strokeWidth={1.5} className="text-zinc-300 shrink-0" />
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <PageLayout
        title="My Orders"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'My Orders' },
        ]}
      >
        <OrdersContent />
      </PageLayout>
    </AuthGuard>
  );
}
