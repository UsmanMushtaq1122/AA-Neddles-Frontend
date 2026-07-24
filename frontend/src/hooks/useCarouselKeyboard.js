
'use client';

import { useCallback } from 'react';

export function useCarouselKeyboard(emblaApi) {
  const handleKeyDown = useCallback(
    (event) => {
      if (!emblaApi) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          emblaApi.scrollPrev();
          break;
        case 'ArrowRight':
          event.preventDefault();
          emblaApi.scrollNext();
          break;
        case 'Home':
          event.preventDefault();
          emblaApi.scrollTo(0);
          break;
        case 'End':
          event.preventDefault();
          emblaApi.scrollTo(emblaApi.scrollSnapList().length - 1);
          break;
      }
    },
    [emblaApi]
  );

  return { handleKeyDown };
}
