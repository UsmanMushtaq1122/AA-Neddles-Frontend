"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { SlidersHorizontal, ChevronRight, ArrowUpDown } from "lucide-react";
import { productsApi } from "@/services/products";
import { categoriesApi } from "@/services/categories";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar, { FALLBACK_PRICE_RANGES } from "@/components/FilterSidebar";

const subCategoryMap = {
  
};

const matchesFilters = (product, filters, priceRanges) => {
  if (!filters || Object.keys(filters).length === 0) return true;
  if (filters.price) {
    const price = product.salePrice || product.price;
    const match = filters.price.some((label) => {
      const range = priceRanges.find((r) => r.label === label);
      if (!range) return false;
      if (range.min != null && price < range.min) return false;
      if (range.max != null && price > range.max) return false;
      return true;
    });
    if (!match) return false;
  }
  if (filters.size) {
    const hasSize = (product.sizes || []).some((s) => filters.size.includes(s));
    if (!hasSize) return false;
  }
  if (filters.fabric) {
    const productFabrics = (product.fabric || "").split(/\s*&\s*|\s*,\s*/);
    const hasFabric = filters.fabric.some(f => productFabrics.includes(f));
    if (!hasFabric) return false;
  }
  if (filters.collection) {
    const match = filters.collection.some(
      (slug) => slug === product.category || slug === product.subcategory
    );
    if (!match) return false;
  }
  return true;
};

const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest First", value: "newest" },
  { label: "Name: A to Z", value: "name-asc" },
];

export default function CategoryPageContent({ slug }) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(3);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [facets, setFacets] = useState(null);
  const sortRef = useRef(null);


  const categoryName =
    slug === "all"
      ? "All Products"
      : slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

  const subCategories = subCategoryMap[slug] || [];

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveTab(null);
      setSortBy("default");
      setFilters({});
      setLoading(true);
    }, 0);
    const fetchProducts = async () => {
      try {
        let result;
        if (slug && slug !== "all") {
          const catRes = await categoriesApi.getAll();
          const categories = catRes.data?.categories || [];
          const matched = categories.find(
            (c) => c.slug === slug
          );
          if (matched) {
            result = await productsApi.getAll({ categoryId: matched.id, limit: 100 });
          } else {
            result = await productsApi.getAll({ limit: 100 });
          }
        } else {
          result = await productsApi.getAll({ limit: 100 });
        }
        setAllProducts(result.data?.products || []);
      } catch {
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    productsApi
      .getFacets()
      .then((res) => { if (res?.data) setFacets(res.data); })
      .catch(() => {});
    return () => clearTimeout(timer);
  }, [slug]);

  const products = useMemo(() => {
    let result = [...allProducts];
    if (activeTab) {
      result = result.filter((p) => {
        const fabricMatch = (p.fabric || '').toLowerCase().includes(activeTab.replace('-', ' '));
        const subcategoryMatch = p.subcategory === activeTab;
        const categoryMatch = p.category === activeTab;
        return fabricMatch || subcategoryMatch || categoryMatch;
      });
    }
    result = result.filter((p) => matchesFilters(p, filters, facets?.priceRanges || FALLBACK_PRICE_RANGES));

    // Apply sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === "newest") {
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
    }

    return result;
  }, [allProducts, filters, activeTab, sortBy, facets]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 pt-[115px]">
      <nav className="flex items-center gap-2 font-body text-xs text-zinc-400 mb-6 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-noor-black transition-colors">Home</Link>
        <ChevronRight size={12} className="shrink-0 text-zinc-300" />
        <span className="text-zinc-800 font-medium">{categoryName}</span>
      </nav>

      <div className="mb-10">
        <h1 className="font-body text-[36px] md:text-[50px] font-bold text-noor-black tracking-tight leading-[1.1]">
          {categoryName}
        </h1>
        {subCategories.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2.5">
            {subCategories.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(isActive ? null : tab.value)}
                  className={`min-w-28 border px-4 py-2 font-body text-sm font-medium transition-colors ${isActive
                    ? 'border-noor-black bg-zinc-50 text-noor-black'
                    : 'border-zinc-200 bg-white text-noor-black hover:border-zinc-400 hover:bg-zinc-50'
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex flex-row flex-wrap gap-4 items-center justify-between border-b border-zinc-100 pb-5">
          <button
            onClick={() => setFilterOpen(true)}
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-noor-black hover:text-noor-black/70 transition-colors w-fit"
            aria-label="Show filters"
          >
            <SlidersHorizontal size={16} />
            <span>Show Filter&apos;s</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setColumns(2)}
                className={`p-2 rounded-md transition-colors ${columns === 2 ? 'bg-zinc-100 text-noor-black' : 'text-zinc-400 hover:text-zinc-600'}`}
                aria-label="Two column view"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="8" height="18" rx="1"/><rect x="13" y="3" width="8" height="18" rx="1"/></svg>
              </button>
              <button
                type="button"
                onClick={() => setColumns(3)}
                className={`p-2 rounded-md transition-colors ${columns === 3 ? 'bg-zinc-100 text-noor-black' : 'text-zinc-400 hover:text-zinc-600'}`}
                aria-label="Three column view"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="5" height="18" rx="1"/><rect x="9.5" y="3" width="5" height="18" rx="1"/><rect x="17" y="3" width="5" height="18" rx="1"/></svg>
              </button>
              <button
                type="button"
                onClick={() => setColumns(4)}
                className={`hidden md:block p-2 rounded-md transition-colors ${columns === 4 ? 'bg-zinc-100 text-noor-black' : 'text-zinc-400 hover:text-zinc-600'}`}
                aria-label="Four column view"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>
              </button>
            </div>

            {/* Sort Button */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen((prev) => !prev)}
                className={`inline-flex items-center gap-2 border px-4 py-2 font-body text-sm font-medium transition-colors ${sortOpen
                  ? 'border-noor-black bg-zinc-50 text-noor-black'
                  : 'border-zinc-200 bg-white text-noor-black hover:border-zinc-400 hover:bg-zinc-50'
                  }`}
                aria-label="Sort products"
              >
                <ArrowUpDown size={16} />
                <span>Sort</span>
              </button>

              {sortOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 min-w-[200px] bg-white border border-zinc-200 shadow-lg py-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 font-body text-sm transition-colors ${sortBy === option.value
                        ? 'bg-zinc-100 text-noor-black font-medium'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-noor-black'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:flex lg:items-start lg:gap-8">
        <FilterSidebar
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={filters}
          setFilters={setFilters}
          facets={facets}
        />
        <div className="flex-1">
          <ProductGrid
            products={products}
            loading={loading}
            columns={columns}
            onClearFilters={() => {
              setFilters({});
              setActiveTab(null);
              setSortBy("default");
            }}
          />
        </div>
      </div>
    </div>
  );
}
