import Link from 'next/link';
import { Package } from 'lucide-react';

export default function EmptyCart() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-noor-cream rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={32} className="text-noor-maroon" />
        </div>
        <h2 className="ty-h3 text-noor-black mb-2">Your cart is empty</h2>
        <p className="ty-body-sm text-zinc-400 leading-relaxed mb-8">
          Looks like you haven&apos;t added any items yet. Explore our collection to find something you love.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 px-8 py-3.5 bg-noor-black text-white ty-button hover:bg-noor-gold transition-colors">
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
}
