'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  toggleWishlistAction,
  selectWishlistItems,
} from '@/store/slices/wishlistSlice';

export function useWishlist() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);

  const toggleWishlist = useCallback(
    (productId) => dispatch(toggleWishlistAction(productId)),
    [dispatch]
  );

  const isWishlisted = useCallback(
    (productId) => wishlistItems.includes(productId),
    [wishlistItems]
  );

  return { wishlistItems, toggleWishlist, isWishlisted };
}
