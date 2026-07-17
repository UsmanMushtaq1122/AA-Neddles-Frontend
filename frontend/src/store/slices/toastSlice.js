'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToastAction: (state, action) => {
      state.toasts.push(action.payload);
    },
    removeToastAction: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToastAction, removeToastAction } = toastSlice.actions;
export const selectToasts = (state) => state.toast.toasts;

export default toastSlice.reducer;
