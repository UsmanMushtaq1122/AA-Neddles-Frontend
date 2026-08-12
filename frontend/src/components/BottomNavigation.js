'use client';

import Link from 'next/link';
import { Heart, Home, Search, ShoppingBag } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useScrollDirection } from '@/hooks/useScrollDirection';

const navigationItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Favourite', href: '/wishlist', icon: Heart },
];

function isActiveRoute(pathname, href) {
  return href === '/' ? pathname === href : pathname.startsWith(href);
}

export default function BottomNavigation() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const isVisible = useScrollDirection();

  return (
    <nav
      className={`bottom-navigation ${isVisible ? 'is-visible' : 'is-hidden'}`}
      aria-label="Mobile navigation"
    >
      {navigationItems.map(({ label, href, icon: Icon }) => {
        const active = isActiveRoute(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={`bottom-navigation-item ${active ? 'is-active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}

      <button
        type="button"
        className={`bottom-navigation-item ${pathname === '/checkout' ? 'is-active' : ''}`}
        onClick={openCart}
        aria-label={`Open shopping bag${itemCount ? `, ${itemCount} items` : ''}`}
        aria-current={pathname === '/checkout' ? 'page' : undefined}
      >
        <span className="bottom-navigation-cart-icon">
          <ShoppingBag size={26} strokeWidth={1.5} aria-hidden="true" />
          {itemCount > 0 && <span className="bottom-navigation-badge">{itemCount}</span>}
        </span>
        <span>My bag</span>
      </button>
    </nav>
  );
}
