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

const initialState = {
  user: null,
  isAuthenticated: false,
  hydrated: false,
  loading: false,
  error: null,
  forgotPassword: { loading: false, success: false, error: null },
  resetPassword: { loading: false, success: false, error: null, tokenValid: null },
  emailVerification: { loading: false, success: false, error: null, status: 'idle' },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateAuthAction: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.hydrated = true;
    },
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

    forgotPasswordStartAction: (state) => {
      state.forgotPassword = { loading: true, success: false, error: null };
    },
    forgotPasswordSuccessAction: (state) => {
      state.forgotPassword = { loading: false, success: true, error: null };
    },
    forgotPasswordFailureAction: (state, action) => {
      state.forgotPassword = { loading: false, success: false, error: action.payload };
    },
    forgotPasswordResetAction: (state) => {
      state.forgotPassword = { loading: false, success: false, error: null };
    },

    resetPasswordStartAction: (state) => {
      state.resetPassword = { ...state.resetPassword, loading: true, success: false, error: null };
    },
    resetPasswordSuccessAction: (state) => {
      state.resetPassword = { loading: false, success: true, error: null, tokenValid: true };
    },
    resetPasswordFailureAction: (state, action) => {
      state.resetPassword = { loading: false, success: false, error: action.payload, tokenValid: false };
    },
    resetPasswordTokenCheckAction: (state, action) => {
      state.resetPassword = { ...state.resetPassword, tokenValid: action.payload };
    },
    resetPasswordResetAction: (state) => {
      state.resetPassword = { loading: false, success: false, error: null, tokenValid: null };
    },

    verifyEmailStartAction: (state) => {
      state.emailVerification = { loading: true, success: false, error: null, status: 'verifying' };
    },
    verifyEmailSuccessAction: (state) => {
      state.emailVerification = { loading: false, success: true, error: null, status: 'success' };
    },
    verifyEmailFailureAction: (state, action) => {
      state.emailVerification = { loading: false, success: false, error: action.payload, status: 'failed' };
    },
    verifyEmailExpiredAction: (state) => {
      state.emailVerification = { loading: false, success: false, error: 'Verification link has expired', status: 'expired' };
    },
    verifyEmailResetAction: (state) => {
      state.emailVerification = { loading: false, success: false, error: null, status: 'idle' };
    },
  },
});

export const {
  hydrateAuthAction,
  loginStartAction,
  loginSuccessAction,
  loginFailureAction,
  logoutAction,
  registerStartAction,
  registerSuccessAction,
  registerFailureAction,
  clearErrorAction,
  forgotPasswordStartAction,
  forgotPasswordSuccessAction,
  forgotPasswordFailureAction,
  forgotPasswordResetAction,
  resetPasswordStartAction,
  resetPasswordSuccessAction,
  resetPasswordFailureAction,
  resetPasswordTokenCheckAction,
  resetPasswordResetAction,
  verifyEmailStartAction,
  verifyEmailSuccessAction,
  verifyEmailFailureAction,
  verifyEmailExpiredAction,
  verifyEmailResetAction,
} = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectHydrated = (state) => state.auth.hydrated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectForgotPassword = (state) => state.auth.forgotPassword;
export const selectResetPassword = (state) => state.auth.resetPassword;
export const selectEmailVerification = (state) => state.auth.emailVerification;

export default authSlice.reducer;
