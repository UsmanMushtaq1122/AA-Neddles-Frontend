'use client';

import { createSlice } from '@reduxjs/toolkit';
import { roundPrice } from '@/lib/utils';

function loadCart() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('aa-cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('aa-cart', JSON.stringify(items));
  } catch {}
}

const initialState = {
  items: [],
  isOpen: false,
  syncing: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hydrateCartAction: (state, action) => {
      state.items = action.payload;
    },
    addToCartAction: (state, action) => {
      const product = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.id === product.id && item.selectedSize === product.selectedSize && item.selectedColor === product.selectedColor
      );
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += (product.quantity || 1);
      } else {
        state.items.push({ ...product, quantity: product.quantity || 1 });
      }
      saveCart(state.items);
    },
    removeFromCartAction: (state, action) => {
      state.items.splice(action.payload, 1);
      saveCart(state.items);
    },
    updateQuantityAction: (state, action) => {
      const { index, quantity } = action.payload;
      if (quantity <= 0) {
        state.items.splice(index, 1);
      } else {
        state.items[index].quantity = quantity;
      }
      saveCart(state.items);
    },
    clearCartAction: (state) => {
      state.items = [];
      saveCart(state.items);
    },
    toggleCartAction: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCartAction: (state) => {
      state.isOpen = true;
    },
    closeCartAction: (state) => {
      state.isOpen = false;
    },
    setCartFromApiAction: (state, action) => {
      state.items = action.payload;
      saveCart(state.items);
    },
    mergeCartFromApiAction: (state, action) => {
      const serverItems = action.payload;
      const localItems = state.items;
      const merged = [];
      const itemKey = (item) => `${item.id}:${item.selectedSize || ''}:${item.selectedColor || ''}`;
      const serverIds = new Set(serverItems.map(itemKey));

      for (const serverItem of serverItems) {
        const localMatches = localItems.filter((item) => itemKey(item) === itemKey(serverItem));

        if (localMatches.length > 0) {
          const totalLocalQty = localMatches.reduce((sum, l) => sum + l.quantity, 0);
          const mergedQty = Math.max(serverItem.quantity, totalLocalQty);
          merged.push({ ...localMatches[0], quantity: mergedQty });
        } else {
          merged.push(serverItem);
        }
      }

      for (const localItem of localItems) {
        if (!serverIds.has(itemKey(localItem))) {
          merged.push(localItem);
        }
      }

      state.items = merged;
      saveCart(state.items);
    },
    setSyncingAction: (state, action) => {
      state.syncing = action.payload;
    },
  },
});

export const {
  hydrateCartAction,
  addToCartAction,
  removeFromCartAction,
  updateQuantityAction,
  clearCartAction,
  toggleCartAction,
  openCartAction,
  closeCartAction,
  setCartFromApiAction,
  mergeCartFromApiAction,
  setSyncingAction,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartIsOpen = (state) => state.cart.isOpen;
export const selectCartSyncing = (state) => state.cart.syncing;
export const selectItemCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectSubtotal = (state) =>
  roundPrice(state.cart.items.reduce((sum, item) => sum + roundPrice((item.price || 0) * item.quantity), 0));

export { loadCart };
export default cartSlice.reducer;
