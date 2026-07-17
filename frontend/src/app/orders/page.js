'use client';

import AuthGuard from '@/components/AuthGuard';
import PageLayout from '@/components/PageLayout';
import { Package } from 'lucide-react';

function OrdersContent() {
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
      </div>
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
