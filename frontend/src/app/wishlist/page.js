'use client';

import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';
import PageLayout from '@/components/PageLayout';
import { useWishlist } from '@/hooks/useWishlist';
import productsData from '@/features/products/products.json';
import ProductGrid from '@/components/ProductGrid';

function WishlistContent() {
  const { wishlistItems } = useWishlist();
  const wishlistProducts = productsData.filter((p) => wishlistItems.includes(p.id));

  return (
    <div>
      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-noor-cream rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={28} strokeWidth={1.5} className="text-noor-maroon" />
            </div>
            <h2 className="ty-h3 text-noor-black mb-3">Your Wishlist is Empty</h2>
            <p className="ty-body-sm text-noor-gray leading-relaxed mb-6">
              Save your favorite items to your wishlist and shop them later.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-noor-black text-white ty-button hover:bg-noor-maroon transition-colors"
            >
              <ArrowLeft size={14} />
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-8">
            <p className="ty-body-sm text-zinc-500">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          <ProductGrid products={wishlistProducts} columns={4} />
        </div>
      )}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <AuthGuard>
      <PageLayout
        title="Wishlist"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Wishlist' },
        ]}
      >
        <WishlistContent />
      </PageLayout>
    </AuthGuard>
  );
}
