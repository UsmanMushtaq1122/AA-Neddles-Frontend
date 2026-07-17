'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ShoppingBag, Heart, User, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';

/* ── Desktop nav links ── */
const NAV_LINKS = [];

/* ── Drawer data ── */
const DRAWER_TABS = [
  { id: 'women',         label: 'WOMEN',         color: '#1a1a1a' },
  { id: 'kids',          label: 'KIDS',           color: '#4a9b6f' },
  { id: 'brides',        label: 'BRIDES',         color: '#b07c4a' },
  { id: 'men',           label: 'MEN',            color: '#1a1a1a' },
  { id: 'special-offers',label: 'SPECIAL OFFERS', color: '#cc0000' },
];

const DRAWER_CATEGORIES = {
  women: [
    { label: 'UNSTITCHED',     href: '/category/unstitched',      expandable: true  },
    { label: 'LUXURY FORMALS', href: '/category/luxury-formals',  expandable: true  },
    { label: 'LUXURY PRET',    href: '/category/luxury-pret',     expandable: true  },
    { label: 'STITCHED',       href: '/category/stitched',        expandable: true  },
    { label: 'M.LUXE FABRICS', href: '/category/mluxe-fabrics',   expandable: false },
    { label: 'JEWELRY',        href: '/category/jewelry',         expandable: true  },
    { label: 'ACCESSORIES',    href: '/category/accessories',     expandable: true  },
    { label: 'FRAGRANCES',     href: '/category/fragrances',      expandable: true  },
  ],
  kids: [
    { label: 'GIRLS',          href: '/category/kids-girls',      expandable: true  },
    { label: 'BOYS',           href: '/category/kids-boys',       expandable: true  },
    { label: 'INFANTS',        href: '/category/kids-infants',    expandable: false },
  ],
  brides: [
    { label: 'BRIDAL COUTURE', href: '/category/bridal-couture',  expandable: true  },
    { label: 'LUXURY FORMALS', href: '/category/luxury-formals',  expandable: true  },
    { label: 'BRIDESMAID',     href: '/category/bridesmaid',      expandable: false },
  ],
  men: [
    { label: 'KURTA SHALWAR',  href: '/category/kurta-shalwar',   expandable: true  },
    { label: 'WAISTCOAT',      href: '/category/waistcoat',       expandable: false },
    { label: 'SHERWANI',       href: '/category/sherwani',        expandable: true  },
  ],
  'special-offers': [
    { label: 'SALE',           href: '/category/sale',            expandable: false },
    { label: 'BUNDLE DEALS',   href: '/category/bundle-deals',    expandable: false },
    { label: 'CLEARANCE',      href: '/category/clearance',       expandable: false },
  ],
};

export default function Header() {
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [activeTab, setActiveTab]       = useState('women');
  const [expandedRow, setExpandedRow]   = useState(null);
  const [isScrolled, setIsScrolled]     = useState(false);
  const { items, openCart } = useCart();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setExpandedRow(null);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const toggleRow = (label) =>
    setExpandedRow((prev) => (prev === label ? null : label));

  const categories = DRAWER_CATEGORIES[activeTab] || [];

  return (
    <>
      {/* ══════════════════════════════════════════
          FIXED HEADER SHELL
      ══════════════════════════════════════════ */}
      <div className={`site-header-wrap ${isScrolled ? 'is-scrolled' : ''} ${!isHomePage ? 'is-solid' : ''}`}>



        {/* Top bar */}
        <div className="site-header-topbar topbar">
          <div className="topbar-inner">
            <div className="topbar-left">
              <Link href="/order-tracking" className="topbar-link">Order Tracking</Link>
              <span className="topbar-sep">|</span>
              <Link href="/store-locations" className="topbar-link">Store Locations</Link>
            </div>
            <div className="topbar-right">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="topbar-link" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <span className="topbar-sep">|</span>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="topbar-link" aria-label="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <span className="topbar-sep">|</span>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="topbar-link" aria-label="TikTok">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <header className="site-header-main">
          <div className="header-inner">

            {/* LEFT */}
            <div className="header-left">
              <button
                id="mobile-menu-toggle"
                onClick={() => setDrawerOpen(true)}
                className="hdr-icon-btn"
                aria-label="Open menu"
                aria-expanded={drawerOpen}
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>

              <Link href="/search" className="hdr-icon-btn" aria-label="Search">
                <Search size={20} strokeWidth={1.5} />
              </Link>

              <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="hdr-nav-link">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* CENTER — Logo */}
            <Link href="/" className="hdr-logo" aria-label="AA Neddles home">
              AA Neddles.
            </Link>

            {/* RIGHT */}
            <div className="header-right">
              <Link href="/wishlist" className="hdr-icon-btn" aria-label="Wishlist">
                <Heart size={20} strokeWidth={1.5} />
              </Link>
              <Link href="/profile" className="hdr-icon-btn" aria-label="Account">
                <User size={20} strokeWidth={1.5} />
              </Link>
              <button onClick={openCart} className="hdr-icon-btn relative" aria-label="Cart">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {items?.length > 0 && (
                  <span className="hdr-badge">{items.length}</span>
                )}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* ══════════════════════════════════════════
          MEGA DRAWER
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop — blurred, darkened right side */}
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="drawer-backdrop"
              onClick={closeDrawer}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.32, ease: [0.32, 0, 0.08, 1] }}
              className="drawer-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* ── Drawer header: logo + close ── */}
              <div className="drawer-head">
                <Link href="/" className="drawer-logo" onClick={closeDrawer}>
                  AA Neddles.
                </Link>
                <button
                  className="drawer-close"
                  onClick={closeDrawer}
                  aria-label="Close menu"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* ── Category tabs ── */}
              <div className="drawer-tabs" role="tablist">
                {DRAWER_TABS.map((tab, i) => (
                  <span key={tab.id} style={{ display: 'contents' }}>
                    {i > 0 && <span className="drawer-tab-sep" aria-hidden="true">|</span>}
                    <button
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      className={`drawer-tab ${
                        activeTab === tab.id ? 'is-active' : ''
                      } ${tab.id === 'special-offers' ? 'is-special' : ''}`}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setExpandedRow(null);
                      }}
                    >
                      {tab.label}
                    </button>
                  </span>
                ))}
              </div>

              {/* ── Section label ── */}
              <div className="drawer-section-label">BEST SELLERS</div>

              {/* ── Category rows ── */}
              <nav className="drawer-nav" aria-label="Category navigation">
                {categories.map((cat) => (
                  <div key={cat.label} className="drawer-row-wrap">
                    <div className="drawer-row">
                      <Link
                        href={cat.href}
                        className="drawer-row-label"
                        onClick={closeDrawer}
                      >
                        {cat.label}
                      </Link>
                      {cat.expandable && (
                        <button
                          className="drawer-row-toggle"
                          aria-label={expandedRow === cat.label ? 'Collapse' : 'Expand'}
                          onClick={() => toggleRow(cat.label)}
                        >
                          {expandedRow === cat.label
                            ? <Minus size={16} strokeWidth={1.5} />
                            : <Plus  size={16} strokeWidth={1.5} />}
                        </button>
                      )}
                    </div>
                    <AnimatePresence initial={false}>
                      {expandedRow === cat.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeInOut' }}
                          className="drawer-sub"
                          style={{ overflow: 'hidden' }}
                        >
                          <Link href={cat.href} className="drawer-sub-link" onClick={closeDrawer}>
                            View All {cat.label.charAt(0) + cat.label.slice(1).toLowerCase()}
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>

              {/* ── Bottom links ── */}
              <div className="drawer-footer">
                <Link href="/order-tracking" className="drawer-footer-link" onClick={closeDrawer}>Order Tracking</Link>
                <Link href="/store-locations" className="drawer-footer-link" onClick={closeDrawer}>Store Locations</Link>
                <Link href="/profile"         className="drawer-footer-link" onClick={closeDrawer}>My Account</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
}
