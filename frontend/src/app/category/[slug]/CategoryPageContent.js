"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { SlidersHorizontal, ChevronRight, ArrowUpDown } from "lucide-react";
import productsData from "@/features/products/products.json";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Best Selling", value: "best-selling" },
  { label: "New Arrivals", value: "new-arrivals" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "A-Z", value: "name-asc" },
  { label: "Z-A", value: "name-desc" },
];

const subCategoryMap = {
  unstitched: [
    { label: "Lawn", value: "lawn" },
    { label: "M.Prints", value: "mprints" },
    { label: "Chiffon", value: "chiffon" },
    { label: "Winter Luxe", value: "winter-luxe" },
    { label: "Soiree", value: "soiree" },
  ],
  "ready-to-wear": [
    { label: "Casual", value: "casual" },
    { label: "Semi-Formal", value: "semi-formal" },
    { label: "Formal", value: "formal" },
  ],
  formal: [
    { label: "Luxury Formals", value: "luxury-formals" },
    { label: "Couture", value: "couture" },
  ],
};

const matchesFilters = (product, filters) => {
  if (!filters || Object.keys(filters).length === 0) return true;
  if (filters.price) {
    const price = product.salePrice || product.price;
    const match = filters.price.some((range) => {
      if (range === "Under Rs. 5,000") return price < 5000;
      if (range === "Rs. 5,000 - Rs. 15,000") return price >= 5000 && price <= 15000;
      if (range === "Rs. 15,000 - Rs. 30,000") return price >= 15000 && price <= 30000;
      if (range === "Rs. 30,000 - Rs. 50,000") return price >= 30000 && price <= 50000;
      if (range === "Above Rs. 50,000") return price > 50000;
      return false;
    });
    if (!match) return false;
  }
  if (filters.size) {
    const hasSize = product.sizes.some((s) => filters.size.includes(s));
    if (!hasSize) return false;
  }
  if (filters.fabric) {
    const productFabrics = product.fabric.split(/\s*&\s*|\s*,\s*/);
    const hasFabric = filters.fabric.some(f => productFabrics.includes(f));
    if (!hasFabric) return false;
  }
  if (filters.collection) {
    const collectionSlugs = {
      "New Arrivals": "new-arrivals",
      "Luxury Pret": "luxury-pret",
      "Luxury Formals": "luxury-formals",
      Couture: "couture",
      Unstitched: "unstitched",
      Kidswear: "kidswear",
      Menswear: "menswear",
    };
    const match = filters.collection.some((col) => {
      const slug = collectionSlugs[col];
      return slug && (product.subcategory === slug || product.category === slug);
    });
    if (!match) return false;
  }
  return true;
};

export default function CategoryPageContent({ slug }) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("featured");
  const [showSort, setShowSort] = useState(false);
  const [columns, setColumns] = useState(3);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState(null);

  const categoryName =
    slug === "all"
      ? "All Products"
      : slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

  const subCategories = subCategoryMap[slug] || [];

  useEffect(() => {
    setActiveTab(null);
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    let list = productsData;
    if (slug && slug !== "all") {
      list = productsData.filter(
        (p) => p.category === slug || p.subcategory === slug
      );
    }
    setAllProducts(list);
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    if (!showSort) return;
    const handleClick = (e) => {
      if (!e.target.closest('.sort-dropdown')) {
        setShowSort(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showSort]);

  const products = useMemo(() => {
    let result = [...allProducts];
    if (activeTab) {
      result = result.filter((p) => {
        const fabricMatch = p.fabric.toLowerCase().includes(activeTab.replace('-', ' '));
        const subcategoryMatch = p.subcategory === activeTab;
        const categoryMatch = p.category === activeTab;
        return fabricMatch || subcategoryMatch || categoryMatch;
      });
    }
    result = result.filter((p) => matchesFilters(p, filters));

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case "price-desc":
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case "new-arrivals": {
        const productIds = productsData.map((p) => p.id);
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || productIds.indexOf(a.id) - productIds.indexOf(b.id));
        break;
      }
      case "name-asc":
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "name-desc":
        result.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
      default:
        break;
    }

    return result;
  }, [allProducts, sort, filters, activeTab]);

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
                  className={`min-w-28 border px-4 py-2 font-body text-sm font-medium transition-colors ${
                    isActive
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
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setColumns(2)}
                className={`p-2.5 rounded-md transition-colors ${columns === 2 ? 'bg-zinc-100 text-noor-black' : 'text-zinc-400 hover:text-zinc-600'}`}
                aria-label="Two column view"
              >
                <div className="flex gap-[3px] items-center justify-center w-5 h-5">
                  <div className="w-[7px] h-[14px] border border-current rounded-[1px]"></div>
                  <div className="w-[7px] h-[14px] border border-current rounded-[1px]"></div>
                </div>
              </button>
              <button
                onClick={() => setColumns(4)}
                className={`p-2.5 rounded-md transition-colors ${columns === 4 ? 'bg-zinc-100 text-noor-black' : 'text-zinc-400 hover:text-zinc-600'}`}
                aria-label="Four column view"
              >
                <div className="grid grid-cols-2 gap-[3px] items-center justify-center w-5 h-5">
                  <div className="w-[7px] h-[7px] border border-current rounded-[1px]"></div>
                  <div className="w-[7px] h-[7px] border border-current rounded-[1px]"></div>
                  <div className="w-[7px] h-[7px] border border-current rounded-[1px]"></div>
                  <div className="w-[7px] h-[7px] border border-current rounded-[1px]"></div>
                </div>
              </button>
              <button
                onClick={() => setColumns(3)}
                className={`p-2.5 rounded-md transition-colors ${columns === 3 ? 'bg-zinc-100 text-noor-black' : 'text-zinc-400 hover:text-zinc-600'}`}
                aria-label="Three column view"
              >
                <div className="grid grid-cols-3 gap-[2px] items-center justify-center w-5 h-5">
                  <div className="w-[5px] h-[5px] border border-current rounded-[1px]"></div>
                  <div className="w-[5px] h-[5px] border border-current rounded-[1px]"></div>
                  <div className="w-[5px] h-[5px] border border-current rounded-[1px]"></div>
                  <div className="w-[5px] h-[5px] border border-current rounded-[1px]"></div>
                  <div className="w-[5px] h-[5px] border border-current rounded-[1px]"></div>
                  <div className="w-[5px] h-[5px] border border-current rounded-[1px]"></div>
                </div>
              </button>
            </div>

            <div className="relative sort-dropdown">
              <button
                onClick={(e) => { e.stopPropagation(); setShowSort(!showSort); }}
                className="flex items-center gap-[10px] bg-[#F5F5F5] rounded-[12px] h-[52px] px-[24px] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#e5e5e5] hover:shadow-sm font-body text-sm font-medium text-noor-black"
                aria-label="Sort products"
              >
                <ArrowUpDown size={16} strokeWidth={2} />
                <span>Sort</span>
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-zinc-200 rounded-[12px] shadow-lg z-50 overflow-hidden py-2">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSort(opt.value); setShowSort(false); }}
                      className={`block w-full text-left px-4 py-2.5 font-body text-sm transition-colors ${
                        sort === opt.value
                          ? 'bg-zinc-50 text-noor-black font-medium'
                          : 'text-zinc-600 hover:bg-zinc-50 hover:text-noor-black'
                      }`}
                    >
                      {opt.label}
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
        />
        <div className="flex-1">
          <ProductGrid products={products} loading={loading} columns={columns} />
        </div>
      </div>
    </div>
  );
}
