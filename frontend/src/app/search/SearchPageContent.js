'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, AlertCircle } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { productsApi } from '@/services/products';

const DEBOUNCE_MS = 400;
const PAGE_SIZE = 20;

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export default function SearchPageContent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const performSearch = useCallback(async (searchQuery, pageNum) => {
    const q = searchQuery.trim();
    if (!q) {
      setResults([]);
      setTotal(0);
      setTotalPages(0);
      setSearched(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await productsApi.getAll({
        search: q,
        page: pageNum,
        limit: PAGE_SIZE,
      });
      const data = response.data;
      setResults(data.products || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError(err.message || 'Search failed. Please try again.');
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setPage(1), 0);
    performSearch(debouncedQuery, 1);
    return () => clearTimeout(timer);
  }, [debouncedQuery, performSearch]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    performSearch(debouncedQuery, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="py-8">
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-noor-gray pointer-events-none" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, category, fabric..."
            className="w-full pl-12 pr-12 py-4 ty-body border border-zinc-200 bg-white focus:outline-none focus:border-noor-maroon focus:ring-1 focus:ring-noor-maroon/20 transition-colors"
            aria-label="Search products"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Empty / initial state */}
      {!searched && !loading && (
        <div className="text-center py-20">
          <Search size={48} className="mx-auto text-zinc-200 mb-4" />
          <p className="text-noor-gray ty-body-sm">Type to search our collections</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={32} className="text-noor-maroon animate-spin mb-4" />
          <p className="text-noor-gray ty-body-sm">Searching...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-20">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <p className="text-red-500 ty-body-sm mb-2">{error}</p>
          <button
            onClick={() => performSearch(debouncedQuery, 1)}
            className="text-noor-maroon ty-body-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* No results */}
      {!loading && searched && !error && results.length === 0 && query.trim() !== '' && (
        <div className="text-center py-20">
          <Search size={48} className="mx-auto text-zinc-200 mb-4" />
          <p className="text-noor-gray ty-body-sm">
            No results found for &ldquo;{query.trim()}&rdquo;
          </p>
          <p className="text-zinc-400 ty-caption mt-1">
            Try different keywords or browse our categories
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && searched && results.length > 0 && (
        <div>
          <p className="ty-body-sm text-noor-gray mb-6">
            {total} result{total !== 1 ? 's' : ''} found for &ldquo;{query.trim()}&rdquo;
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 ty-body-sm border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 ty-body-sm rounded-lg transition-colors ${
                      pageNum === page
                        ? 'bg-noor-maroon text-white'
                        : 'border border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 ty-body-sm border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
