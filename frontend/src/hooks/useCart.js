'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  addToCartAction,
  removeFromCartAction,
  updateQuantityAction,
  clearCartAction,
  toggleCartAction,
  openCartAction,
  closeCartAction,
  selectCartItems,
  selectCartIsOpen,
  selectItemCount,
  selectSubtotal,
} from '@/store/slices/cartSlice';

export function useCart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const isOpen = useSelector(selectCartIsOpen);
  const itemCount = useSelector(selectItemCount);
  const subtotal = useSelector(selectSubtotal);

  const addToCart = useCallback(
    (product) => {
      dispatch(addToCartAction(product));
      dispatch(openCartAction());
    },
    [dispatch]
  );

  const removeFromCart = useCallback(
    (index) => dispatch(removeFromCartAction(index)),
    [dispatch]
  );

  const updateQuantity = useCallback(
    (index, quantity) => dispatch(updateQuantityAction({ index, quantity })),
    [dispatch]
  );

  const clearCart = useCallback(() => dispatch(clearCartAction()), [dispatch]);
  const toggleCart = useCallback(() => dispatch(toggleCartAction()), [dispatch]);
  const openCart = useCallback(() => dispatch(openCartAction()), [dispatch]);
  const closeCart = useCallback(() => dispatch(closeCartAction()), [dispatch]);

  return {
    items,
    isOpen,
    itemCount,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  };
}
