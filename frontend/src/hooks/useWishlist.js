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
    async (productId) => {
      dispatch(toggleWishlistAction(productId));
      if (isAuthenticated) {
        try {
          await wishlistApi.toggle(productId);
        } catch {}
      }
    },
    [dispatch, isAuthenticated]
  );

  const isWishlisted = useCallback(
    (productId) => wishlistItems.includes(productId),
    [wishlistItems]
  );

  return { wishlistItems, toggleWishlist, isWishlisted };
}
