'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ShoppingBag, Heart, User, Plus, Minus, LogOut, Package, ChevronDown, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import LogoutModal from '@/components/LogoutModal';
import AnnouncementBar from '@/components/AnnouncementBar';
import MobileHeader from '@/components/MobileHeader';
import { menuApi } from '@/services/menu';

/* ── Default menu name/slug ── */
const MENU_NAME = 'main-mobile-menu';

/* ── UserAvatar ── */
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

/* ── Recursive single menu item renderer ── */
function MenuNode({ item, depth = 0, onClose, expandedRow, toggleRow }) {
  const isExternal = item.type === 'EXTERNAL_LINK';
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedRow === item.id;

  const labelStyle = item.isHighlighted
    ? {
        color: item.textColor || '#FFFFFF',
        backgroundColor: item.bgColor || '#8B1A1A',
        fontWeight: item.fontWeight === 'bold' ? 700 : item.fontWeight === 'semibold' ? 600 : 400,
        borderRadius: '4px',
        padding: '2px 10px',
        display: 'inline-block',
        margin: '2px 0',
      }
    : {};

  const indent = depth > 0 ? { paddingLeft: `${depth * 16 + 16}px` } : {};

  if (isExternal) {
    return (
      <div className="drawer-row-wrap">
        <div className="drawer-row" style={indent}>
          <a
            href={item.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="drawer-row-label flex items-center gap-1.5"
            style={labelStyle}
            onClick={onClose}
          >
            {item.icon && <span aria-hidden="true">{item.icon}</span>}
            <span>{item.title}</span>
            <ExternalLink size={12} strokeWidth={1.5} className="opacity-50" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="drawer-row-wrap">
      <div className="drawer-row" style={indent}>
        {item.url ? (
          <Link
            href={item.url}
            className="drawer-row-label"
            style={labelStyle}
            onClick={onClose}
          >
            {item.icon && <span aria-hidden="true" className="mr-1.5">{item.icon}</span>}
            {item.title}
          </Link>
        ) : (
          <span className="drawer-row-label" style={labelStyle}>
            {item.icon && <span aria-hidden="true" className="mr-1.5">{item.icon}</span>}
            {item.title}
          </span>
        )}

        {hasChildren && (
          <button
            className="drawer-row-toggle"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            onClick={() => toggleRow(item.id)}
          >
            {isExpanded ? (
              <Minus size={16} strokeWidth={1.5} />
            ) : (
              <Plus size={16} strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>

      {/* Children (recursive) */}
      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="drawer-sub"
            style={{ overflow: 'hidden' }}
          >
            {item.url && (
              <Link
                href={item.url}
                className="drawer-sub-link"
                onClick={onClose}
                style={{ paddingLeft: `${(depth + 1) * 16 + 16}px` }}
              >
                View All {item.title}
              </Link>
            )}
            {item.children.map((child) => (
              <MenuNode
                key={child.id}
                item={child}
                depth={depth + 1}
                onClose={onClose}
                expandedRow={expandedRow}
                toggleRow={toggleRow}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Header ── */
export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /* ── Menu data ── */
  const [menuData, setMenuData] = useState(null);
  const [menuLoaded, setMenuLoaded] = useState(false);

  const { items, openCart } = useCart();
  const { isAuthenticated, user, logout, hydrated } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);

  /* ── Fetch menu from API ── */
  useEffect(() => {
    menuApi.getTree(MENU_NAME)
      .then((res) => {
        const data = res.data;
        setMenuData(data);
        // Set first active tab
        if (data?.items?.length > 0) {
          setActiveTabId(data.items[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setMenuLoaded(true));
  }, []);

  /* ── Top-level tabs (items with no parent, rendered as tabs) ── */
  const tabs = menuData?.items || [];

  /* ── Children of active tab ── */
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const activeChildren = activeTab?.children || [];

  /* ── Scroll handler ── */
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

  /* ── Keyboard handler ── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!drawerOpen) return;
      if (e.key === 'Escape') {
        closeDrawer();
        return;
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

  /* ── Body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  /* ── Close user dropdown on route change ── */
  useEffect(() => {
    const timer = setTimeout(() => setUserDropdownOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  /* ── Click outside user dropdown ── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleRow = (id) =>
    setExpandedRow((prev) => (prev === id ? null : id));

  const handleLogout = async () => {
    setLoggingOut(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoggingOut(false);
    setLogoutModalOpen(false);
    setUserDropdownOpen(false);
    logout();
  };

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
              <a href="https://www.instagram.com/aaneedlesofficial/" target="_blank" rel="noreferrer" className="topbar-link" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <span className="topbar-sep">|</span>
              <a href="https://facebook.com/aaneddles" target="_blank" rel="noreferrer" className="topbar-link" aria-label="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <span className="topbar-sep">|</span>
              <a href="https://www.tiktok.com/@aaneedlesofficial" target="_blank" rel="noreferrer" className="topbar-link" aria-label="TikTok">
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
                          <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 ty-body-sm text-noor-black hover:bg-zinc-50 transition-colors">
                            <User size={16} strokeWidth={1.5} />
                            My Profile
                          </Link>
                          <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 ty-body-sm text-noor-black hover:bg-zinc-50 transition-colors">
                            <Package size={16} strokeWidth={1.5} />
                            My Orders
                          </Link>
                          <Link href="/wishlist" className="flex items-center gap-3 px-4 py-2.5 ty-body-sm text-noor-black hover:bg-zinc-50 transition-colors">
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
          MEGA DRAWER — API-driven, unlimited nesting
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
              ref={drawerRef}
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

              {/* Loading skeleton */}
              {!menuLoaded && (
                <div className="drawer-tabs">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-4 w-16 bg-zinc-200 animate-pulse rounded"
                    />
                  ))}
                </div>
              )}

              {/* Category tabs — top-level menu items */}
              {menuLoaded && tabs.length > 0 && (
                <div className="drawer-tabs" role="tablist">
                  {tabs.map((tab, i) => (
                    <span key={tab.id} style={{ display: 'contents' }}>
                      {i > 0 && <span className="drawer-tab-sep" aria-hidden="true">|</span>}
                      <button
                        role="tab"
                        aria-selected={activeTabId === tab.id}
                        className={`drawer-tab ${activeTabId === tab.id ? 'is-active' : ''} ${tab.isHighlighted ? 'is-special' : ''}`}
                        style={
                          tab.isHighlighted
                            ? { color: tab.textColor, backgroundColor: tab.bgColor }
                            : undefined
                        }
                        onClick={() => {
                          setActiveTabId(tab.id);
                          setExpandedRow(null);
                        }}
                      >
                        {tab.icon && <span aria-hidden="true" className="mr-1">{tab.icon}</span>}
                        {tab.title.toUpperCase()}
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Nav rows — children of active tab, unlimited nesting */}
              <nav className="drawer-nav" aria-label="Category navigation">
                {activeChildren.map((item) => (
                  <MenuNode
                    key={item.id}
                    item={item}
                    depth={0}
                    onClose={closeDrawer}
                    expandedRow={expandedRow}
                    toggleRow={toggleRow}
                  />
                ))}
                {menuLoaded && activeChildren.length === 0 && (
                  <p className="px-4 py-6 text-sm text-zinc-400">No items in this section.</p>
                )}
              </nav>

              <div className="drawer-footer">
                {/* Footer links — configurable via menu items with no parent and type CUSTOM_URL */}
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
