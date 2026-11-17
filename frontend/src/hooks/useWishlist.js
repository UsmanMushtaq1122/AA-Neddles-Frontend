'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  toggleWishlistAction,
  setWishlistFromApiAction,
  selectWishlistItems,
} from '@/store/slices/wishlistSlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { wishlistApi } from '@/services/wishlist';
import { trackAddToWishlist } from '@/lib/meta-pixel';

export function useWishlist() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      wishlistApi.get()
        .then((res) => {
          if (res.success && res.data) {
            const ids = res.data.map((p) => p.id);
            dispatch(setWishlistFromApiAction(ids));
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, dispatch]);

  const toggleWishlist = useCallback(
    async (product) => {
      const productId = product?.id;
      if (!productId) {
        console.error('Cannot toggle wishlist without a product ID');
        return;
      }
      const wasWishlisted = wishlistItems.includes(productId);
      dispatch(toggleWishlistAction(productId));
      if (isAuthenticated) {
        try {
          const result = await wishlistApi.toggle(productId);
          if (result?.data?.wishlisted === true) trackAddToWishlist(product);
        } catch {}
      } else if (!wasWishlisted) {
        trackAddToWishlist(product);
      }
    },
    [dispatch, isAuthenticated, wishlistItems]
  );

  const isWishlisted = useCallback(
    (productId) => wishlistItems.includes(productId),
    [wishlistItems]
  );

  return { wishlistItems, toggleWishlist, isWishlisted };
}
