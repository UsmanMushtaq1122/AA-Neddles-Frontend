'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, PackageX, ChevronRight } from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';
import { categoriesApi } from '@/services/categories';
import { productsApi } from '@/services/products';
import ProductGrid from '@/components/ProductGrid';

const SPECIAL_SLUGS = {
  'new-arrivals': {
    name: 'New Arrivals',
    description: 'Fresh styles added to our collection — be the first to discover them.',
    mode: 'new-arrivals',
  },
  'best-sellers': {
    name: 'Best Sellers',
    description: 'Our most-loved pieces, chosen by you.',
    mode: 'best-sellers',
  },
  all: {
    name: 'All Products',
    description: 'Browse our complete collection of luxury fashion.',
    mode: 'all',
  },
};

const PAGE_SIZE = 48;

export default function CollectionBrowser({
  slug = 'all',
  breadcrumbLabel = 'Collections',
  breadcrumbHref = '/',
}) {
  const { collections, isLoading: collectionsLoading } = useCollections();
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    let active = true;
    categoriesApi
      .getAll()
      .then((res) => {
        if (!active) return;
        const list = res?.data || res || [];
        setCategories(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (active) setCategories([]);
      })
      .finally(() => {
        if (active) setCategoriesLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const special = SPECIAL_SLUGS[slug];
  const editorial = collections.find((c) => c.slug === slug || c.id === slug);
  const category = categories.find((c) => c.slug === slug || c.id === slug);

  const match = useMemo(() => {
    if (special) return { kind: 'special', ...special };
    if (editorial)
      return {
        kind: 'collection',
        name: editorial.name,
        description: editorial.description,
      };
    if (category)
      return {
        kind: 'category',
        name: category.name,
        description: category.description,
      };
    return null;
  }, [special, editorial, category]);

  const resolving =
    !special && !editorial && !category && (collectionsLoading || categoriesLoading);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('featured');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (resolving) return;
    const currentMatch = match;
    const kind = currentMatch?.kind;
    let active = true;

    setIsLoading(true);
    setError(null);
    setProducts([]);

    async function load() {
      try {
        let result = [];
        const res = await productsApi.getAll({ limit: PAGE_SIZE });
        const list = res?.data?.products || res?.data || res?.products || res || [];
        result = Array.isArray(list) ? list : [];

        if (kind === 'special' && currentMatch?.mode === 'new-arrivals') {
          result = result.filter((p) => p.isNewArrival);
        } else if (kind === 'special' && currentMatch?.mode === 'best-sellers') {
          result = result.filter((p) => p.isBestSeller);
        } else if (kind === 'category') {
          result = result.filter(
            (p) =>
              p.category === slug ||
              p.categorySlug === slug ||
              p.categoryId === slug ||
              p.subcategory === slug
          );
        } else if (kind === 'collection') {
          // If product has collection/campaign tags or category match
          const collName = currentMatch?.name?.toLowerCase() || '';
          const collSlug = slug.toLowerCase();
          const filtered = result.filter((p) => {
            const pTags = Array.isArray(p.tags) ? p.tags.map((t) => String(t).toLowerCase()) : [];
            const pCat = (p.category || '').toLowerCase();
            const pSubcat = (p.subcategory || '').toLowerCase();
            const pName = (p.name || '').toLowerCase();
            return (
              pTags.includes(collSlug) ||
              pTags.includes(collName) ||
              pCat.includes(collSlug) ||
              pSubcat.includes(collSlug) ||
              pName.includes(collName)
            );
          });
          // If tagged items exist, use them; otherwise show all products so page isn't empty
          result = filtered.length > 0 ? filtered : result;
        }

        if (active) setProducts(result);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to load products.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [editorial, match, resolving, slug, special, attempt]);

  const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    const list = [...products];
    if (sortBy === 'price-asc') {
      return list.sort((a, b) => (a.price || 0) - (b.price || 0));
    }
    if (sortBy === 'price-desc') {
      return list.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    if (sortBy === 'newest') {
      return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    if (sortBy === 'best-selling') {
      return list.filter((p) => p.isBestSeller).concat(list.filter((p) => !p.isBestSeller));
    }
    return list;
  }, [products, sortBy]);

  const isLoadingAnything = resolving || isLoading;
  const displayName = match?.name ?? slug.replace(/-/g, ' ');

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#1A1A1A]/60">
        <Link href="/" className="transition-colors hover:text-[#C9A27E]">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[#1A1A1A]/30" />
        <Link href={breadcrumbHref} className="transition-colors hover:text-[#C9A27E]">
          {breadcrumbLabel}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[#1A1A1A]/30" />
        <span className="font-medium text-[#1A1A1A] capitalize">{displayName}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#1A1A1A]/50">
          Collection
        </p>
        <h1 className="mt-2 text-3xl font-light tracking-wide text-[#1A1A1A] md:text-4xl capitalize">
          {displayName}
        </h1>
        <div className="mx-auto mt-4 h-px w-16 bg-[#C9A27E]" />
        {match?.description && (
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#1A1A1A]/60">
            {match.description}
          </p>
        )}
      </div>

      {/* Toolbar */}
      <div className="mb-8 flex items-center justify-between border-b border-[#E8DDD4] pb-4">
        <p className="text-sm text-[#1A1A1A]/60">
          <span className="font-medium text-[#1A1A1A]">{sortedProducts.length}</span>{' '}
          {sortedProducts.length === 1 ? 'product' : 'products'}
        </p>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-[#E8DDD4] bg-transparent px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#C9A27E]"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="best-selling">Best Selling</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoadingAnything ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-[#1A1A1A]/50">
          <Loader2 className="h-8 w-8 animate-spin text-[#C9A27E]" />
          <p className="text-sm">Loading collection...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <PackageX className="mx-auto h-12 w-12 text-[#1A1A1A]/30 mb-3" />
          <h3 className="text-lg font-light text-[#1A1A1A]">Couldn&apos;t Load Products</h3>
          <p className="mt-1 text-sm text-[#1A1A1A]/60">{error}</p>
          <button
            onClick={() => setAttempt((p) => p + 1)}
            className="mt-4 inline-block rounded-lg bg-[#1A1A1A] px-5 py-2 text-xs font-medium uppercase tracking-wider text-white hover:bg-[#1A1A1A]/90"
          >
            Try Again
          </button>
        </div>
      ) : sortedProducts.length > 0 ? (
        <ProductGrid products={sortedProducts} />
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg font-light text-[#1A1A1A]/60">
            No products found in this collection yet.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-[#C9A27E] transition-colors hover:text-[#C9A27E]/70"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </section>
  );
}

