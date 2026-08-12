'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ShoppingBag, Heart, User, Plus, Minus, LogOut, Package, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import LogoutModal from '@/components/LogoutModal';
import AnnouncementBar from '@/components/AnnouncementBar';
import MobileHeader from '@/components/MobileHeader';
import { categoriesApi } from '@/services/categories';

/* ── Desktop nav links ── */
const NAV_LINKS = [];

function UserAvatar({ name, size = 32 }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  return (
    <div
      className="bg-noor-maroon text-white rounded-full flex items-center justify-center font-medium"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('women');
  const [expandedRow, setExpandedRow] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [apiCategories, setApiCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const { items, openCart } = useCart();
  const { isAuthenticated, user, logout, hydrated } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    categoriesApi.getAll()
      .then((res) => {
        const cats = res.data?.categories || [];
        setApiCategories(cats);
      })
      .catch(() => { })
      .finally(() => setCategoriesLoaded(true));
  }, []);

  const drawerData = useMemo(() => {
    const parents = apiCategories.filter((c) => !c.parentId);
    const tabColors = ['#1a1a1a', '#4a9b6f', '#b07c4a', '#1a1a1a'];
    const tabs = parents.map((p, i) => ({
      id: p.slug,
      label: p.name.toUpperCase(),
      color: tabColors[i] || '#1a1a1a',
    }));

    const cats = {};
    parents.forEach((p) => {
      cats[p.slug] = apiCategories
        .filter((c) => c.parentId === p.id)
        .map((c) => ({
          label: c.name.toUpperCase(),
          href: `/category/${c.slug}`,
          expandable: Boolean(c.children?.length),
        }));
    });

    return { tabs, categories: cats };
  }, [apiCategories]);

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
    const handleKeyDown = (e) => {
      if (!drawerOpen) return;
      if (e.key === 'Escape') {
        closeDrawer();
      }
      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen, closeDrawer]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  useEffect(() => {
    const timer = setTimeout(() => setUserDropdownOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleRow = (label) =>
    setExpandedRow((prev) => (prev === label ? null : label));

  const handleLogout = async () => {
    setLoggingOut(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoggingOut(false);
    setLogoutModalOpen(false);
    setUserDropdownOpen(false);
    logout();
  };

  const categories = drawerData.categories[activeTab] || [];

  return (
    <>
      <MobileHeader onMenuOpen={() => setDrawerOpen(true)} />
      <div className={`site-header-wrap ${isScrolled ? 'is-scrolled' : ''} ${!isHomePage ? 'is-solid' : ''}`}>

        {/* Announcement bar */}
        <AnnouncementBar />

        {/* Top bar */}
        <div className="site-header-topbar topbar">
          <div className="topbar-inner">
            <div className="topbar-left">
              <Link href="/order-tracking" className="topbar-link">Order Tracking</Link>
              <span className="topbar-sep">|</span>
              <Link href="/store-locations" className="topbar-link">Store Locations</Link>
            </div>
            <div className="topbar-right">
              <a href="https://instagram.com/aaneddles" target="_blank" rel="noreferrer" className="topbar-link" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <span className="topbar-sep">|</span>
              <a href="https://facebook.com/aaneddles" target="_blank" rel="noreferrer" className="topbar-link" aria-label="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <span className="topbar-sep">|</span>
              <a href="https://tiktok.com/@aaneddles" target="_blank" rel="noreferrer" className="topbar-link" aria-label="TikTok">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
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

            {/* CENTER */}
            <div className="header-center">
              <Link href="/" className="hdr-logo" aria-label="AA Needles Home">
                <Image
                  src="/logo.png"
                  alt="AA Needles"
                  width={220}
                  height={220}
                  priority
                  className="w-auto object-contain"
                />
              </Link>
            </div>

            {/* RIGHT */}
            <div className="header-right">
              <Link href="/wishlist" className="hdr-icon-btn" aria-label="Wishlist">
                <Heart size={20} strokeWidth={1.5} />
              </Link>

              {/* User area */}
              {hydrated && isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="hdr-icon-btn flex items-center gap-1.5"
                    aria-label="Account menu"
                    aria-expanded={userDropdownOpen}
                    aria-haspopup="true"
                  >
                    <UserAvatar name={user?.name} size={26} />
                    <ChevronDown
                      size={14}
                      strokeWidth={1.5}
                      className={`hidden md:block text-noor-gray transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-60 bg-white border border-zinc-100 shadow-lg z-50"
                      >
                        <div className="px-4 py-3 border-b border-zinc-100">
                          <p className="ty-body-sm font-medium text-noor-black truncate">{user?.name}</p>
                          <p className="ty-micro text-noor-gray truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 ty-body-sm text-noor-black hover:bg-zinc-50 transition-colors"
                          >
                            <User size={16} strokeWidth={1.5} />
                            My Profile
                          </Link>
                          <Link
                            href="/orders"
                            className="flex items-center gap-3 px-4 py-2.5 ty-body-sm text-noor-black hover:bg-zinc-50 transition-colors"
                          >
                            <Package size={16} strokeWidth={1.5} />
                            My Orders
                          </Link>
                          <Link
                            href="/wishlist"
                            className="flex items-center gap-3 px-4 py-2.5 ty-body-sm text-noor-black hover:bg-zinc-50 transition-colors"
                          >
                            <Heart size={16} strokeWidth={1.5} />
                            Wishlist
                          </Link>
                        </div>
                        <div className="border-t border-zinc-100 py-1">
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              setLogoutModalOpen(true);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 ty-body-sm text-noor-gray hover:bg-zinc-50 hover:text-noor-black transition-colors"
                          >
                            <LogOut size={16} strokeWidth={1.5} />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login" className="hdr-icon-btn" aria-label="Sign in">
                  <User size={20} strokeWidth={1.5} />
                </Link>
              )}

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
              id="mobile-navigation-drawer"
            >
              {/* Drawer header */}
              <div className="drawer-head">
                <Link href="/" className="drawer-logo" onClick={closeDrawer}>
                  <Image
                    src="/logo.png"
                    alt="AA Needles"
                    width={120}
                    height={120}
                    style={{ objectFit: 'contain', height: '60px', width: 'auto' }}
                  />
                </Link>
                <button
                  className="drawer-close"
                  onClick={closeDrawer}
                  aria-label="Close menu"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Category tabs */}
              <div className="drawer-tabs" role="tablist">
                {drawerData.tabs.map((tab, i) => (
                  <span key={tab.id} style={{ display: 'contents' }}>
                    {i > 0 && <span className="drawer-tab-sep" aria-hidden="true">|</span>}
                    <button
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      className={`drawer-tab ${activeTab === tab.id ? 'is-active' : ''
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

              {/* Section label */}
              <div className="drawer-section-label">BEST SELLERS</div>

              {/* Category rows */}
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
                            : <Plus size={16} strokeWidth={1.5} />}
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

              {/* Bottom links removed per request */}
              <div className="drawer-footer">
                {/* Footer links intentionally removed */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        loading={loggingOut}
      />
    </>
  );
}
