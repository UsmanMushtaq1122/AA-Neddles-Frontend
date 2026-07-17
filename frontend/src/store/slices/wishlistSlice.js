'use client';

import { createSlice } from '@reduxjs/toolkit';

function loadWishlist() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('aa-wishlist');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveWishlist(items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('aa-wishlist', JSON.stringify(items));
  } catch {}
}

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    hydrateWishlistAction: (state, action) => {
      state.items = action.payload;
    },
    toggleWishlistAction: (state, action) => {
      const productId = action.payload;
      const index = state.items.indexOf(productId);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(productId);
      }
      saveWishlist(state.items);
    },
  },
});

export const { hydrateWishlistAction, toggleWishlistAction } = wishlistSlice.actions;
export const selectWishlistItems = (state) => state.wishlist.items;

export { loadWishlist };
export default wishlistSlice.reducer;
