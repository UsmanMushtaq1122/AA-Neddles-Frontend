'use client';

import { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Heart, ShoppingBag, X } from 'lucide-react';
import { productsApi } from '@/services/products';
import ProductCard from '@/components/ProductCard';
import Accordion from '@/components/Accordion';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/useToast';
import WhatsAppOrderLink from '@/components/WhatsAppOrderLink';

const PLACEHOLDER_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%23f0f0f0' width='400' height='500'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='18' fill='%23999'%3EImage Unavailable%3C/text%3E%3C/svg%3E`;

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ProductPageContent({ slug: initialSlug }) {
  const slug = initialSlug;
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [galleryScrollEl, setGalleryScrollEl] = useState(null);
  const youMayLikeRef = useRef(null);
  const recentlyViewedRef = useRef(null);
  const customersAlsoBoughtRef = useRef(null);
  const similarProductsRef = useRef(null);
  const topTrendingRef = useRef(null);
  const [customersAlsoBought, setCustomersAlsoBought] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [topTrendingProducts, setTopTrendingProducts] = useState([]);

  useEffect(() => {
    if (!sizeChartOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSizeChartOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [sizeChartOpen]);

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const handleScroll = (e) => {
    const el = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 5) {
      const progress = (scrollTop / maxScroll) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    }
  };

  useEffect(() => {
    const loadingTimer = setTimeout(() => setLoading(true), 0);
    const fetchProduct = async () => {
      try {
        setFetchError(false);
        setSelectedSize(null);
        const res = await productsApi.getBySlug(slug);
        const found = res.data;
        let rawSizes = found?.sizes;
        if (typeof rawSizes === 'string') {
          try {
            rawSizes = JSON.parse(rawSizes);
          } catch {
            rawSizes = [];
          }
        }
        const sizes = Array.isArray(rawSizes)
          ? rawSizes.filter((size) => typeof size === 'string' && size.trim()).map((size) => size.trim())
          : [];
        setProduct(found ? { ...found, sizes: sizes.length > 0 ? sizes : ['One Size'] } : null);
        if (found) {
          const relatedRes = await productsApi.getAll({ limit: 10 });
          const allProducts = relatedRes.data?.products || [];
          setRelated(allProducts.filter((p) => p.id !== found.id).slice(0, 10));
          setCustomersAlsoBought(allProducts.filter((p) => p.id !== found.id).slice(0, 10));
          setSimilarProducts(
            allProducts.filter(
              (p) => p.id !== found.id && p.categoryId === found.categoryId
            ).slice(0, 10)
          );
          setTopTrendingProducts(
            allProducts.filter((p) => p.isFeatured && p.id !== found.id).slice(0, 10)
          );

          try {
            const viewedStr = localStorage.getItem('recentlyViewed');
            let viewed = viewedStr ? JSON.parse(viewedStr) : [];
            const viewedProducts = [];
            setRecentlyViewed(viewedProducts);

            viewed = viewed.filter(id => id !== found.id);
            viewed.unshift(found.id);
            if (viewed.length > 10) viewed.pop();
            localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
          } catch (e) {
            console.error("Could not parse recently viewed", e);
          }

          setSelectedSize(sizes.length === 1 ? sizes[0] : null);
          setQuantity(1);
          setScrollProgress(0);
          setGalleryScrollEl(null);
        }
      } catch (err) {
        setProduct(null);
        if (err?.status === 404) {
          setFetchError(false);
        } else {
          setFetchError(true);
        }
      } finally {
        setLoading(false);
        clearTimeout(loadingTimer);
      }
    };
    fetchProduct();
    return () => clearTimeout(loadingTimer);
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="animate-skeleton">
          <div className="h-4 bg-zinc-200 rounded w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-[3/4] bg-zinc-200" />
            <div className="space-y-4">
              <div className="h-6 bg-zinc-200 rounded w-3/4" />
              <div className="h-5 bg-zinc-200 rounded w-1/3" />
              <div className="h-10 bg-zinc-200 rounded w-full mt-6" />
              <div className="h-10 bg-zinc-200 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
        {fetchError ? (
          <>
            <h1 className="ty-h3 font-semibold">Something went wrong</h1>
            <p className="text-zinc-400 mt-2">We couldn&apos;t load this product. Please try again.</p>
            <button
              onClick={() => { setLoading(true); setFetchError(false); window.location.reload(); }}
              className="inline-block mt-6 px-8 py-3 bg-noor-black text-white ty-button hover:bg-noor-gold transition-colors"
            >
              Retry
            </button>
          </>
        ) : (
          <>
            <h1 className="ty-h3 font-semibold">Product Not Found</h1>
            <p className="text-zinc-400 mt-2">The product you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/" className="inline-block mt-6 px-8 py-3 bg-noor-black text-white ty-button hover:bg-noor-gold transition-colors">
              Back to Home
            </Link>
          </>
        )}
      </div>
    );
  }

  const isSale = product.salePrice !== null;
  const singleSize = product.sizes.length === 1 ? product.sizes[0] : null;
  const isSingleSize = ['custom', 'one size', 'free size'].includes(singleSize?.toLowerCase());
  const isCustomSize = singleSize?.toLowerCase() === 'custom';
  const MAX_QUANTITY = 10;
  const sizeChart = [
    { size: 'XS', bust: '32', waist: '26', hips: '36' },
    { size: 'S', bust: '34', waist: '28', hips: '38' },
    { size: 'M', bust: '36', waist: '30', hips: '40' },
    { size: 'L', bust: '38', waist: '32', hips: '42' },
    { size: 'XL', bust: '40', waist: '34', hips: '44' },
    { size: '2XL', bust: '42', waist: '36', hips: '46' },
  ];

  const handleAddToBag = () => {
    if (!selectedSize) {
      addToast('Please select a size', 'warning');
      return;
    }
    addToCart({
      id: product.id,
      title: product.title,
      price: product.salePrice || product.price,
      image: product.images?.[0] || '',
      selectedSize,
      selectedColor: null,
      quantity,
      slug: product.slug,
    });
    addToast(`${product.title} added to your bag`);
  };

  const categoryLabel = (product.category || '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const subcategoryLabel = product.subcategory
    ? product.subcategory
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    : null;

  // Build a SKU-like article number from slug + selected size
  const articleNumber = `${product.slug}-${selectedSize || 'select-size'}`
    .replace(/\s+/g, '-');

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 pt-[104px] md:pt-[115px]">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 sm:gap-3 mb-6 md:mb-8 overflow-x-auto no-scrollbar whitespace-nowrap text-xs sm:text-[15px]" aria-label="Breadcrumb">
          <Link href="/" className="text-zinc-400 hover:text-noor-black transition-colors tracking-wide" style={{ textDecoration: 'underline', textUnderlineOffset: '4px', textDecorationColor: '#ccc' }}>Home</Link>
          <span aria-hidden="true" className="text-zinc-300 text-sm">&gt;</span>
          <Link
            href={`/category/${product.category}`}
            className="text-zinc-400 hover:text-noor-black transition-colors text-[15px] tracking-wide"
            style={{ textDecoration: 'underline', textUnderlineOffset: '4px', textDecorationColor: '#ccc' }}
          >
            {categoryLabel}
          </Link>
          {subcategoryLabel && (
            <>
              <span aria-hidden="true" className="text-zinc-300 text-sm">&gt;</span>
              <Link
                href={`/category/${product.category}?sub=${product.subcategory}`}
                className="text-zinc-400 hover:text-noor-black transition-colors text-[15px] tracking-wide"
                style={{ textDecoration: 'underline', textUnderlineOffset: '4px', textDecorationColor: '#ccc' }}
              >
                {subcategoryLabel}
              </Link>
            </>
          )}
          <span aria-hidden="true" className="text-zinc-300 text-sm">&gt;</span>
          <span className="text-noor-black font-semibold text-[15px] truncate" aria-current="page">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="w-full flex flex-col gap-4 md:sticky md:top-24 h-max">
            <div className="w-full relative flex">
              <div
                ref={(el) => {
                  if (el && !galleryScrollEl) setGalleryScrollEl(el);
                }}
                onScroll={handleScroll}
                className="flex-1 flex overflow-x-auto md:overflow-x-hidden md:overflow-y-auto no-scrollbar snap-x md:snap-y snap-mandatory h-auto md:max-h-[calc(100vh-220px)] flex-row md:flex-col"
              >
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-full shrink-0 snap-start aspect-[3/4] bg-zinc-50 overflow-hidden relative"
                  >
                    <Image
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      width={600}
                      height={800}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (e.currentTarget.src !== PLACEHOLDER_IMAGE) e.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="hidden md:block w-1 bg-zinc-200 rounded-full relative shrink-0 ml-4">
                <div
                  className="absolute top-0 left-0 w-full bg-noor-black rounded-full transition-all duration-75"
                  style={{ height: `${Math.max(0, scrollProgress)}%` }}
                />
              </div>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
                {product.images.map((_, idx) => {
                  const isActive = galleryScrollEl
                    ? Math.round((galleryScrollEl.scrollLeft / (galleryScrollEl.scrollWidth - galleryScrollEl.clientWidth || 1)) * (product.images.length - 1)) === idx
                    : idx === 0;
                  return (
                    <button
                      key={`dot-${idx}`}
                      onClick={() => {
                        if (galleryScrollEl) {
                          const width = galleryScrollEl.clientWidth;
                          galleryScrollEl.scrollTo({ left: width * idx, behavior: 'smooth' });
                        }
                      }}
                      aria-label={`Go to image ${idx + 1}`}
                      className={`w-2 h-2 rounded-full transition-all ${isActive ? 'bg-noor-black w-4' : 'bg-zinc-300'
                        }`}
                    />
                  );
                })}
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="hidden md:flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {product.images.map((img, idx) => {
                  const total = product.images.length;
                  const currentIdx = galleryScrollEl
                    ? Math.round((galleryScrollEl.scrollTop / (galleryScrollEl.scrollHeight - galleryScrollEl.clientHeight || 1)) * (total - 1))
                    : 0;
                  const isActive = currentIdx === idx;
                  return (
                    <button
                      key={`thumb-${idx}`}
                      onClick={() => {
                        if (galleryScrollEl) {
                          const height = galleryScrollEl.clientHeight;
                          galleryScrollEl.scrollTo({ top: height * idx, behavior: 'smooth' });
                        }
                      }}
                      aria-label={`View image ${idx + 1}`}
                      className={`flex-shrink-0 w-16 h-20 overflow-hidden transition-all border-2 ${isActive ? 'border-noor-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} thumbnail ${idx + 1}`}
                        width={64}
                        height={80}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Right: Product Details ── */}
          <div className="flex flex-col">
            {/* Title + In Stock */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-[22px] md:text-[26px] font-medium text-noor-black leading-snug" style={{ fontFamily: 'var(--font-body)' }}>
                {product.title}
              </h1>
              <span className="ml-2 shrink-0 inline-flex items-center border border-zinc-300 text-zinc-600 text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5">
                In Stock
              </span>
            </div>

            {/* SKU / Article Number */}
            <p className="text-[13px] text-zinc-400 mt-2 tracking-wide">{articleNumber}</p>

            {/* ── Price Row ── */}
            <div className="mt-8 border-t border-zinc-200 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] uppercase tracking-[0.08em] text-zinc-500 font-semibold">Price</span>
                <div>
                  {isSale ? (
                    <div className="flex items-center gap-3">
                      <span className="text-[22px] font-semibold text-noor-black tracking-tight">
                        {`Rs. ${(product.salePrice ?? 0).toLocaleString()}`}
                      </span>
                      <span className="text-[16px] text-zinc-400 line-through">
                        {`Rs. ${(product.price ?? 0).toLocaleString()}`}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[22px] font-semibold text-noor-black tracking-tight">
                      {`Rs. ${(product.price ?? 0).toLocaleString()}`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Shipping Row ── */}
            <div className="border-t border-zinc-200 mt-5 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] uppercase tracking-[0.08em] text-zinc-500 font-semibold">Shipping Time</span>
                <span className="text-[13px] font-semibold text-noor-black tracking-wide">3-5 BUSINESS DAYS</span>
              </div>
            </div>

            {isSingleSize ? (
              <div className="border-t border-zinc-200 mt-5 pt-5">
                <span className="text-[12px] uppercase tracking-[0.08em] font-semibold text-noor-black block mb-2">
                  Selected Size: {singleSize}
                </span>
                {isCustomSize && (
                  <p className="text-[13px] text-zinc-500">This item is made to order. Contact us for sizing assistance.</p>
                )}
              </div>
            ) : (
              <div className="border-t border-zinc-200 mt-5 pt-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[12px] uppercase tracking-[0.08em] font-semibold text-noor-black">
                    Size
                  </span>
                  <button
                    type="button"
                    onClick={() => setSizeChartOpen(true)}
                    className="flex min-h-10 items-center gap-1.5 rounded-sm text-[12px] uppercase tracking-[0.06em] text-zinc-500 transition-colors hover:text-noor-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-gold focus-visible:ring-offset-2"
                    aria-haspopup="dialog"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 7L2 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M22 17L2 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M6 7V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M10 7V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M14 7V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M18 7V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M6 17V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M10 17V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M14 17V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M18 17V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="font-semibold">SIZE CHART</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const outOfStock = (
                      (product.outOfStockSizes && product.outOfStockSizes.includes(size)) ||
                      (product.stockByOption && product.stockByOption[size] === 0) ||
                      (product.variants && product.variants.find(v => (v.size === size || v.name === size) && v.stock === 0))
                    );
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={outOfStock}
                        onClick={() => !outOfStock && setSelectedSize(size)}
                        className={`min-w-[52px] px-4 py-2.5 text-[13px] font-medium border transition-all ${
                          selectedSize === size
                            ? 'bg-noor-black text-white border-noor-black'
                            : outOfStock
                              ? 'border-zinc-200 text-zinc-300 line-through cursor-not-allowed opacity-50'
                              : 'border-zinc-300 text-zinc-700 hover:border-noor-black hover:text-noor-black'
                        }`}
                        aria-pressed={selectedSize === size}
                        aria-disabled={outOfStock}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-[12px] text-zinc-500" aria-live="polite">
                  {selectedSize ? `Selected Size: ${selectedSize}` : 'Select a size to continue.'}
                </p>
              </div>
            )}

            {/* ── Quantity ── */}
            <div className="border-t border-zinc-200 mt-5 pt-5">
              <span className="text-[12px] uppercase tracking-[0.08em] font-semibold text-noor-black block mb-3">
                Quantity
              </span>
              <div className="flex items-center gap-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-11 h-11 grid place-items-center bg-zinc-200 text-zinc-600 disabled:opacity-40 transition-colors hover:bg-zinc-300"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 h-11 grid place-items-center text-[15px] font-medium border-t border-b border-zinc-200" aria-live="polite" aria-label={`Quantity: ${quantity}`}>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(MAX_QUANTITY, quantity + 1))}
                  disabled={quantity >= MAX_QUANTITY}
                  className="w-11 h-11 grid place-items-center bg-noor-black text-white disabled:opacity-40 transition-colors hover:bg-zinc-800"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* ── Action Buttons ── */}
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const wasWishlisted = isWishlisted(product.id);
                    toggleWishlist(product.id);
                    addToast(wasWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                  }}
                  className="flex-1 py-4 border-2 border-noor-black text-noor-black text-[11px] font-semibold uppercase tracking-[0.06em] flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all"
                  aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart size={18} />
                  ADD TO WISHLIST
                </button>

                <button
                  onClick={handleAddToBag}
                  className="flex-1 py-4 bg-noor-black text-white text-[11px] font-semibold uppercase tracking-[0.06em] flex items-center justify-center gap-3 hover:bg-noor-gold transition-all"
                  aria-label="Add to cart"
                >
                  <ShoppingBag size={18} />
                  ADD TO CART
                </button>
              </div>
              <WhatsAppOrderLink
                product={product}
                size={selectedSize}
                requireSize={product.sizes.length > 1}
                onMissingSize={() => addToast('Please select a size', 'warning')}
                className="flex min-h-14 w-full items-center justify-center gap-3 bg-[#25D366] px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#1EBE5D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#128C7E] focus-visible:ring-offset-2"
              />
            </div>

            <div className="mt-6 border-t border-zinc-100">
              <Accordion items={[
                {
                  title: 'Description',
                  render: () => {
                    const ds = product.descriptionSections || {};
                    const sections = (Array.isArray(ds.sections) ? ds.sections : [])
                      .filter((s) => s && s.title && Array.isArray(s.items) && s.items.some(Boolean));
                    const hasStructured =
                      (typeof ds.color === 'string' && ds.color.trim()) ||
                      sections.length > 0 ||
                      (typeof ds.note === 'string' && ds.note.trim());
                    if (hasStructured) {
                      return (
                        <div className="space-y-4">
                          {typeof ds.color === 'string' && ds.color.trim() && (
                            <p className="ty-body-sm text-zinc-600">
                              <span className="font-semibold text-noor-black">Color:</span>{' '}
                              {ds.color}
                            </p>
                          )}
                          {sections.map((section, idx) => (
                            <div key={idx}>
                              <h4 className="ty-body font-semibold text-noor-black">
                                {section.title}
                              </h4>
                              <ul className="mt-2 space-y-1.5 pl-4">
                                {section.items.filter(Boolean).map((item, i) => (
                                  <li key={i} className="ty-body-sm text-zinc-600 list-disc">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                          {typeof ds.note === 'string' && ds.note.trim() && (
                            <div>
                              <h4 className="ty-body font-semibold text-noor-black">Note</h4>
                              <p className="mt-2 ty-body-sm text-zinc-600">{ds.note}</p>
                            </div>
                          )}
                          {sizeChartOpen && (
                            <div
                              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm sm:p-6"
                              onMouseDown={(event) => {
                                if (event.target === event.currentTarget) setSizeChartOpen(false);
                              }}
                            >
                              <section
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="size-chart-title"
                                className="relative max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-8"
                              >
                                <button
                                  type="button"
                                  onClick={() => setSizeChartOpen(false)}
                                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-noor-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-gold"
                                  aria-label="Close size chart"
                                >
                                  <X size={20} />
                                </button>

                                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-noor-gold">
                                  AA NEEDLES FIT GUIDE
                                </p>
                                <h2 id="size-chart-title" className="pr-12 text-2xl font-medium text-noor-black sm:text-3xl">
                                  Women&apos;s Size Chart
                                </h2>
                                <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500">
                                  Use these approximate body measurements to help choose your size. Measurements are in inches.
                                </p>

                                <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200">
                                  <table className="w-full min-w-[420px] border-collapse text-left text-sm">
                                    <thead>
                                      <tr className="bg-[#F7F4EF] text-[11px] uppercase tracking-wider text-zinc-600">
                                        <th scope="col" className="px-4 py-3 font-semibold">Size</th>
                                        <th scope="col" className="px-4 py-3 font-semibold">Bust (in)</th>
                                        <th scope="col" className="px-4 py-3 font-semibold">Waist (in)</th>
                                        <th scope="col" className="px-4 py-3 font-semibold">Hips (in)</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {sizeChart.map((row) => (
                                        <tr
                                          key={row.size}
                                          className={`border-t border-zinc-100 ${
                                            selectedSize?.toUpperCase() === row.size
                                              ? 'bg-[#C9A96E]/10 font-semibold text-noor-black'
                                              : 'text-zinc-600'
                                          }`}
                                        >
                                          <th scope="row" className="px-4 py-3.5 font-medium">{row.size}</th>
                                          <td className="px-4 py-3.5">{row.bust}</td>
                                          <td className="px-4 py-3.5">{row.waist}</td>
                                          <td className="px-4 py-3.5">{row.hips}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                <div className="mt-5 rounded-xl bg-[#F7F4EF] p-4">
                                  <h3 className="text-sm font-semibold text-noor-black">How to measure</h3>
                                  <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-zinc-600 sm:text-sm">
                                    <li><strong>Bust:</strong> Measure around the fullest part of your chest.</li>
                                    <li><strong>Waist:</strong> Measure around your natural waistline.</li>
                                    <li><strong>Hips:</strong> Measure around the fullest part of your hips.</li>
                                  </ul>
                                </div>
                                <p className="mt-4 text-xs leading-relaxed text-zinc-500">
                                  Fit can vary by style and fabric. For sizing help, please contact our customer support before ordering.
                                </p>
                              </section>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div className="ty-body-sm text-zinc-600 whitespace-pre-wrap">
                        {product.description}
                      </div>
                    );
                  },
                },
                {
                  title: 'Product Care',
                  render: () => {
                    let rawCare = product.careInstructions;
                    if (typeof rawCare === 'string') {
                      try {
                        rawCare = JSON.parse(rawCare);
                      } catch {
                        rawCare = rawCare.split(/\r?\n/);
                      }
                    }
                    const careInstructions = Array.isArray(rawCare)
                      ? rawCare.filter((instruction) => typeof instruction === 'string' && instruction.trim())
                        .map((instruction) => instruction.trim())
                      : typeof rawCare === 'string'
                        ? rawCare.split(/\r?\n/).map((instruction) => instruction.trim()).filter(Boolean)
                      : [];
                    const hasCare =
                      (typeof product.fabric === 'string' && product.fabric.trim()) ||
                      careInstructions.length > 0;
                    if (!hasCare) {
                      return (
                        <p className="ty-body-sm text-zinc-500">
                          Care information not available for this product.
                        </p>
                      );
                    }
                    return (
                      <>
                        {typeof product.fabric === 'string' && product.fabric.trim() && (
                          <div className="mb-4">
                            <h4 className="ty-body font-semibold text-noor-black">Fabric</h4>
                            <p className="mt-2 ty-body-sm text-zinc-600">{product.fabric}</p>
                          </div>
                        )}

                        {careInstructions.length > 0 && (
                          <>
                            <h4 className="ty-body font-semibold text-noor-black mt-2">Care</h4>
                            <div className="mt-3 divide-y divide-zinc-200 border-t border-b border-zinc-200">
                              {careInstructions.map((text) => (
                                <div key={text} className="py-4">
                                  <div className="text-[14px] md:text-[15px] font-normal text-zinc-600 tracking-wide">{text}</div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    );
                  },
                },
              ]} />
            </div>

          </div>
        </div>

        {customersAlsoBought.length > 0 && (
          <section className="mt-10 md:mt-12 border-t border-zinc-100 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="ty-h3 text-noor-black">
                Customers Also Bought
              </h2>
              <button
                onClick={() => {
                  if (customersAlsoBoughtRef.current) {
                    const itemWidth = customersAlsoBoughtRef.current.firstElementChild?.clientWidth || 300;
                    customersAlsoBoughtRef.current.scrollBy({ left: itemWidth + 16, behavior: 'smooth' });
                  }
                }}
                className="hidden md:flex items-center justify-center w-10 h-10 hover:bg-zinc-100 rounded-full transition-colors"
                aria-label="Scroll next"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div
              ref={customersAlsoBoughtRef}
              className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
            >
              {customersAlsoBought.map(p => (
                <div key={p.id} className="w-[70vw] sm:w-[calc(50%-10px)] md:w-[calc(25%-15px)] shrink-0 snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}

        {similarProducts.length > 0 && (
          <section className="mt-10 md:mt-12 border-t border-zinc-100 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="ty-h3 text-noor-black">Similar Products</h2>
              <button
                onClick={() => {
                  if (similarProductsRef.current) {
                    const itemWidth = similarProductsRef.current.firstElementChild?.clientWidth || 300;
                    similarProductsRef.current.scrollBy({ left: itemWidth + 16, behavior: 'smooth' });
                  }
                }}
                className="hidden md:flex items-center justify-center w-10 h-10 hover:bg-zinc-100 rounded-full transition-colors"
                aria-label="Scroll next"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div
              ref={similarProductsRef}
              className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
            >
              {similarProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.slug}`}
                  className="w-[70vw] sm:w-[calc(50%-10px)] md:w-[calc(20%-16px)] shrink-0 snap-start group cursor-pointer block"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-zinc-100 mb-3">
                    <Image
                      src={item.images?.[0] || PLACEHOLDER_IMAGE}
                      alt={item.title}
                      width={400}
                      height={533}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        if (e.currentTarget.src !== PLACEHOLDER_IMAGE) e.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </div>
                  <h3 className="ty-body-sm font-medium text-noor-black">{item.title}</h3>
                  <p className="ty-body-sm text-zinc-500 mt-1">{`Rs. ${(item.price ?? 0).toLocaleString()}`}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {topTrendingProducts.length > 0 && (
          <section className="mt-10 md:mt-12 border-t border-zinc-100 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="ty-h3 text-noor-black">Top Trending Products</h2>
              <button
                onClick={() => {
                  if (topTrendingRef.current) {
                    const itemWidth = topTrendingRef.current.firstElementChild?.clientWidth || 300;
                    topTrendingRef.current.scrollBy({ left: itemWidth + 16, behavior: 'smooth' });
                  }
                }}
                className="hidden md:flex items-center justify-center w-10 h-10 hover:bg-zinc-100 rounded-full transition-colors"
                aria-label="Scroll next"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div
              ref={topTrendingRef}
              className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
            >
              {topTrendingProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.slug}`}
                  className="w-[65vw] sm:w-[calc(50%-10px)] md:w-[calc(20%-16px)] shrink-0 snap-start group cursor-pointer block"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-zinc-100 mb-3">
                    <Image
                      src={item.images?.[0] || PLACEHOLDER_IMAGE}
                      alt={item.title}
                      width={400}
                      height={533}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        if (e.currentTarget.src !== PLACEHOLDER_IMAGE) e.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </div>
                  <h3 className="ty-body-sm font-medium text-noor-black">{item.title}</h3>
                  <p className="ty-body-sm text-zinc-500 mt-1">{`Rs. ${(item.price ?? 0).toLocaleString()}`}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-10 md:mt-12 border-t border-zinc-100 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="ty-h3 text-noor-black">
                You May Also Like
              </h2>
              <button
                onClick={() => {
                  if (youMayLikeRef.current) {
                    const itemWidth = youMayLikeRef.current.firstElementChild?.clientWidth || 300;
                    youMayLikeRef.current.scrollBy({ left: itemWidth + 16, behavior: 'smooth' });
                  }
                }}
                className="hidden md:flex items-center justify-center w-10 h-10 hover:bg-zinc-100 rounded-full transition-colors"
                aria-label="Scroll next"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div
              ref={youMayLikeRef}
              className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
            >
              {related.map(p => (
                <div key={p.id} className="w-[65vw] sm:w-[calc(50%-10px)] md:w-[calc(25%-15px)] shrink-0 snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}

        {recentlyViewed.length > 0 && (
          <section className="mt-10 md:mt-12 border-t border-zinc-100 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="ty-h3 text-noor-black">
                Recently Viewed Products
              </h2>
              <button
                onClick={() => {
                  if (recentlyViewedRef.current) {
                    const itemWidth = recentlyViewedRef.current.firstElementChild?.clientWidth || 300;
                    recentlyViewedRef.current.scrollBy({ left: itemWidth + 16, behavior: 'smooth' });
                  }
                }}
                className="hidden md:flex items-center justify-center w-10 h-10 hover:bg-zinc-100 rounded-full transition-colors"
                aria-label="Scroll next"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div
              ref={recentlyViewedRef}
              className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
            >
              {recentlyViewed.map(p => (
                <div key={p.id} className="w-[65vw] sm:w-[calc(50%-10px)] md:w-[calc(25%-15px)] shrink-0 snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

    </div>
  );
}
