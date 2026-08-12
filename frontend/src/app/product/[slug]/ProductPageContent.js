'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Heart, ShoppingBag } from 'lucide-react';
import { productsApi } from '@/services/products';
import ProductCard from '@/components/ProductCard';
import Accordion from '@/components/Accordion';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ProductPageContent({ slug: initialSlug }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const slug = initialSlug;
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
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
        const res = await productsApi.getBySlug(slug);
        const found = res.data;
        setProduct(found || null);
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

          const sizes = found.sizes || (found.images || []).length > 0 ? ['One Size'] : ['One Size'];
          const isCustomSize = sizes.length === 1 && (sizes[0] === 'Custom' || sizes[0] === 'One Size');
          setSelectedSize(isCustomSize ? sizes[0] : sizes[0]);
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
  const isCustomSize = product.sizes.length === 1 && (product.sizes[0] === 'Custom' || product.sizes[0] === 'One Size');
  const MAX_QUANTITY = 10;

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

  const handleBuyNow = () => {
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
    router.push(isAuthenticated ? '/checkout' : '/login?redirect=/checkout');
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
  const articleNumber = `${product.slug}-${selectedSize || product.sizes[0]}`
    .replace(/\s+/g, '-');

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 pt-[115px]">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-3 mb-8 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="text-zinc-400 hover:text-noor-black transition-colors text-[15px] tracking-wide" style={{ textDecoration: 'underline', textUnderlineOffset: '4px', textDecorationColor: '#ccc' }}>Home</Link>
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
                        Rs.{(product.salePrice ?? 0).toLocaleString()}
                      </span>
                      <span className="text-[16px] text-zinc-400 line-through">
                        Rs.{(product.price ?? 0).toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[22px] font-semibold text-noor-black tracking-tight">
                      Rs.{(product.price ?? 0).toLocaleString()}
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

            {isCustomSize ? (
              <div className="border-t border-zinc-200 mt-5 pt-5">
                <span className="text-[12px] uppercase tracking-[0.08em] font-semibold text-noor-black block mb-2">
                  Size: {product.sizes[0]}
                </span>
                <p className="text-[13px] text-zinc-500">This item is made to {product.sizes[0].toLowerCase()} order. Contact us for sizing assistance.</p>
              </div>
            ) : (
              <div className="border-t border-zinc-200 mt-5 pt-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[12px] uppercase tracking-[0.08em] font-semibold text-noor-black">
                    Size
                  </span>
                  <button
                    onClick={() => addToast('Size guide coming soon.', 'info')}
                    className="text-[12px] text-zinc-500 flex items-center gap-1.5 hover:text-noor-black transition-colors uppercase tracking-[0.06em]"
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
              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-noor-gold text-white text-[11px] font-semibold uppercase tracking-[0.06em] hover:bg-noor-gold/90 transition-all"
                aria-label="Buy now"
              >
                BUY IT NOW
              </button>
            </div>

            <div className="mt-6 border-t border-zinc-100">
              <Accordion items={[
                {
                  title: 'Description',
                  content: product.description,
                },
                {
                  title: 'Product Care',
                  render: () => (
                    <>
                      <h4 className="ty-body font-semibold text-noor-black">Fabric</h4>
                      <p className="mt-2 ty-body-sm text-zinc-600">{product.fabric}</p>

                      <h4 className="ty-body font-semibold text-noor-black mt-4">Care</h4>
                      <div className="mt-3 space-y-3">
                        {[
                          { text: "Don't wash — Dry clean only" },
                          { text: 'Can be ironed on low heat' },
                          { text: "Don't use too much bleach" },
                        ].map((item) => (
                          <div key={item.text} className="flex items-center gap-4 p-3 border border-zinc-100">
                            <div className="ty-body-sm text-zinc-700">{item.text}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  ),
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
                      src={item.images?.[0] || '/placeholder.png'}
                      alt={item.title}
                      width={400}
                      height={533}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="ty-body-sm font-medium text-noor-black">{item.title}</h3>
                  <p className="ty-body-sm text-zinc-500 mt-1">Rs.{(item.price ?? 0).toLocaleString()}</p>
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
                  className="w-[70vw] sm:w-[calc(50%-10px)] md:w-[calc(20%-16px)] shrink-0 snap-start group cursor-pointer block"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-zinc-100 mb-3">
                    <Image
                      src={item.images?.[0] || '/placeholder.png'}
                      alt={item.title}
                      width={400}
                      height={533}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="ty-body-sm font-medium text-noor-black">{item.title}</h3>
                  <p className="ty-body-sm text-zinc-500 mt-1">Rs.{(item.price ?? 0).toLocaleString()}</p>
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
                <div key={p.id} className="w-[70vw] sm:w-[calc(50%-10px)] md:w-[calc(25%-15px)] shrink-0 snap-start">
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
                <div key={p.id} className="w-[70vw] sm:w-[calc(50%-10px)] md:w-[calc(25%-15px)] shrink-0 snap-start">
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
