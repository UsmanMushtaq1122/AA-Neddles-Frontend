'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar';
import { useAuth } from '@/hooks/useAuth';

export default function MobileHeader({ onMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const { isAuthenticated, hydrated } = useAuth();
  const accountHref = hydrated && isAuthenticated
    ? '/profile'
    : pathname && pathname !== '/login'
      ? `/login?redirect=${encodeURIComponent(pathname)}`
      : '/login';

  useEffect(() => {
    if (!isHomepage) {
      return;
    }
    // Threshold: once user scrolls past the hero top area (~80px), go opaque
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage]);

  return (
    <div className={`mobile-header-wrap ${isHomepage ? 'mobile-header-wrap--hero' : ''}`}>
      {(!isHomepage || scrolled) && <AnnouncementBar />}
      <header
        className={`mobile-header ${isHomepage && !scrolled ? 'mobile-header--transparent' : 'mobile-header--solid'}`}
        aria-label="Mobile site header"
      >
        <button
          type="button"
          className="mobile-header-action"
          onClick={onMenuOpen}
          aria-label="Open navigation menu"
          aria-controls="mobile-navigation-drawer"
        >
          <Menu size={25} strokeWidth={1.5} aria-hidden="true" />
        </button>

        <Link href="/" className="mobile-header-logo" aria-label="AA Needles home">
          <Image
            src="/logo.png"
            alt="AA Needles"
            width={180}
            height={80}
            priority
          />
        </Link>

        <Link
          href={accountHref}
          className="mobile-header-action mobile-header-account"
          aria-label={hydrated && isAuthenticated ? 'Open your profile' : 'Sign in to your account'}
          prefetch
        >
          <User size={24} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </header>
    </div>
  );
}
