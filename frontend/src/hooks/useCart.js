'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect, useRef } from 'react';
import {
  addToCartAction,
  removeFromCartAction,
  updateQuantityAction,
  clearCartAction,
  toggleCartAction,
  openCartAction,
  closeCartAction,
  mergeCartFromApiAction,
  setSyncingAction,
  selectCartItems,
  selectCartIsOpen,
  selectCartSyncing,
  selectItemCount,
  selectSubtotal,
} from '@/store/slices/cartSlice';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { cartApi } from '@/services/cart';

function mapApiItem(item) {
  return {
    id: item.product?.id || item.productId,
    _cartItemId: item.id,
    title: item.product?.name || '',
    price: item.price || item.product?.price || 0,
    image: item.product?.images?.[0]?.url || item.product?.image || '',
    slug: item.product?.slug || '',
    quantity: item.quantity,
    selectedSize: '',
    selectedColor: '',
  };
}

export function useCart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const isOpen = useSelector(selectCartIsOpen);
  const syncing = useSelector(selectCartSyncing);
  const itemCount = useSelector(selectItemCount);
  const subtotal = useSelector(selectSubtotal);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const initialSyncDone = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !initialSyncDone.current) {
      initialSyncDone.current = true;
      dispatch(setSyncingAction(true));
      const localItems = [...items];
      cartApi.get()
        .then(async (res) => {
          if (!res.success || !res.data) return;
          const apiItems = (res.data.items || []).map(mapApiItem);
          const serverItemMap = new Map(apiItems.map((i) => [i.id, i]));

          dispatch(mergeCartFromApiAction(apiItems));

          for (const localItem of localItems) {
            const serverItem = serverItemMap.get(localItem.id);
            if (!serverItem) {
              try { await cartApi.addItem(localItem.id, localItem.quantity); } catch {}
            } else if (localItem.quantity > serverItem.quantity) {
              try { await cartApi.updateItem(serverItem._cartItemId, localItem.quantity); } catch {}
            }
          }
        })
        .catch(() => {})
        .finally(() => dispatch(setSyncingAction(false)));
    } else if (!isAuthenticated) {
      initialSyncDone.current = false;
    }
  }, [isAuthenticated, dispatch]);

  const addToCart = useCallback(
    async (product) => {
      dispatch(addToCartAction(product));
      if (isAuthenticated) {
        try {
          await cartApi.addItem(product.id, product.quantity || 1);
        } catch {}
      }
    },
    [dispatch, isAuthenticated]
  );

  const removeFromCart = useCallback(
    async (index, cartItemId) => {
      dispatch(removeFromCartAction(index));
      if (isAuthenticated && cartItemId) {
        try {
          await cartApi.removeItem(cartItemId);
        } catch {}
      }
    },
    [dispatch, isAuthenticated]
  );

  const updateQuantity = useCallback(
    async (index, quantity, cartItemId) => {
      dispatch(updateQuantityAction({ index, quantity }));
      if (isAuthenticated && cartItemId) {
        try {
          if (quantity <= 0) {
            await cartApi.removeItem(cartItemId);
          } else {
            await cartApi.updateItem(cartItemId, quantity);
          }
        } catch {}
      }
    },
    [dispatch, isAuthenticated]
  );

  const clearCart = useCallback(async () => {
    dispatch(clearCartAction());
    if (isAuthenticated) {
      try {
        await cartApi.clear();
      } catch {}
    }
  }, [dispatch, isAuthenticated]);

  const toggleCart = useCallback(() => dispatch(toggleCartAction()), [dispatch]);
  const openCart = useCallback(() => dispatch(openCartAction()), [dispatch]);
  const closeCart = useCallback(() => dispatch(closeCartAction()), [dispatch]);

  return { items, isOpen, syncing, itemCount, subtotal, addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, openCart, closeCart };
}
