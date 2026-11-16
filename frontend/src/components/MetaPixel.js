'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  initializeMetaPixel,
  useMarketingConsent,
} from '@/lib/meta-pixel';

export default function MetaPixel() {
  const pathname = usePathname();
  const lastTrackedPath = useRef(null);
  const consent = useMarketingConsent();
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  useEffect(() => {
    if (!consent) {
      lastTrackedPath.current = null;
      return;
    }
    if (!pixelId || !pathname || pathname.startsWith('/admin')) return;
    if (!initializeMetaPixel(pixelId) || lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;
    window.fbq('track', 'PageView');
  }, [consent, pathname, pixelId]);

  useEffect(() => {
    if (!consent && window.fbq) window.fbq('consent', 'revoke');
  }, [consent]);

  return null;
}
