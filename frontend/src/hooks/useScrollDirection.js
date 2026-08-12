'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollDirection(threshold = 8) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const frameId = useRef(null);

  useEffect(() => {
    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      const distance = currentScrollY - lastScrollY.current;

      if (currentScrollY <= threshold) {
        setIsVisible(true);
      } else if (Math.abs(distance) >= threshold) {
        setIsVisible(distance < 0);
      }

      lastScrollY.current = currentScrollY;
      frameId.current = null;
    };

    const handleScroll = () => {
      if (frameId.current === null) {
        frameId.current = window.requestAnimationFrame(updateVisibility);
      }
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId.current !== null) window.cancelAnimationFrame(frameId.current);
    };
  }, [threshold]);

  return isVisible;
}
