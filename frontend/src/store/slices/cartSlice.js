'use client';

import { createSlice } from '@reduxjs/toolkit';

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
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartIsOpen = (state) => state.cart.isOpen;
export const selectItemCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectSubtotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

export { loadCart };
export default cartSlice.reducer;
