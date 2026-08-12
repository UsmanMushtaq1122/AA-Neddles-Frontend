'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, User } from 'lucide-react';
import AnnouncementBar from '@/components/AnnouncementBar';

export default function MobileHeader({ onMenuOpen }) {
  return (
    <div className="mobile-header-wrap">
      <AnnouncementBar />
      <header className="mobile-header">
      <button
        type="button"
        className="mobile-header-action"
        onClick={onMenuOpen}
        aria-label="Open navigation menu"
        aria-controls="mobile-navigation-drawer"
      >
        <Menu size={25} strokeWidth={1.5} aria-hidden="true" />
      </button>

      <Link href="/" className="mobile-header-logo" aria-label="AA Neddles home">
        <Image
          src="/logo.png"
          alt="AA Neddles"
          width={180}
          height={80}
          priority
        />
      </Link>

      <Link href="/login" className="mobile-header-action" aria-label="Open account">
        <User size={24} strokeWidth={1.5} aria-hidden="true" />
      </Link>
      </header>
    </div>
  );
}
