'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import productsData from '@/features/products/products.json';

export default function SearchPageContent() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return productsData.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        (p.fabric && p.fabric.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-noor-gray" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, category, fabric..."
            className="w-full pl-12 pr-4 py-4 ty-body border border-zinc-200 bg-white focus:outline-none focus:border-noor-maroon focus:ring-1 focus:ring-noor-maroon/20 transition-colors"
            aria-label="Search products"
            autoFocus
          />
        </div>
      </div>

      {query.trim() === '' ? (
        <div className="text-center py-20">
          <Search size={48} className="mx-auto text-zinc-200 mb-4" />
          <p className="text-noor-gray ty-body-sm">Type to search our collections</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-noor-gray ty-body-sm">No results found for &ldquo;{query}&rdquo;</p>
          <p className="text-zinc-400 ty-caption mt-1">Try different keywords or browse our categories</p>
        </div>
      ) : (
        <div>
          <p className="ty-body-sm text-noor-gray mb-6">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
