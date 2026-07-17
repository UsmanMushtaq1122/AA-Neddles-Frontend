'use client';

import { createSlice } from '@reduxjs/toolkit';

function loadAuth() {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem('aa-auth');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveAuth(user) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem('aa-auth', JSON.stringify(user));
    } else {
      localStorage.removeItem('aa-auth');
    }
  } catch {}
}

const savedAuth = typeof window !== 'undefined' ? loadAuth() : null;

const initialState = {
  user: savedAuth,
  isAuthenticated: !!savedAuth,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStartAction: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccessAction: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      saveAuth(action.payload);
    },
    loginFailureAction: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutAction: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      saveAuth(null);
    },
    registerStartAction: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccessAction: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      saveAuth(action.payload);
    },
    registerFailureAction: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrorAction: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStartAction,
  loginSuccessAction,
  loginFailureAction,
  logoutAction,
  registerStartAction,
  registerSuccessAction,
  registerFailureAction,
  clearErrorAction,
} = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
