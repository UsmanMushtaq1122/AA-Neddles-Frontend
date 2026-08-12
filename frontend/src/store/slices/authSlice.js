'use client';

import { createSlice } from '@reduxjs/toolkit';

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name, value, maxAge = 86400) {
  if (typeof document === 'undefined') return;
  try {
    if (value) {
      document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
    } else {
      document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax; Secure`;
    }
  } catch {}
}

function loadAuth() {
  if (typeof window === 'undefined') return null;
  try {
    const tokenCookie = getCookie('accessToken');
    if (tokenCookie) {
      return { accessToken: tokenCookie };
    }
    const data = localStorage.getItem('aa-auth');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveAuth(data) {
  if (typeof window === 'undefined') return;
  try {
    if (data) {
      const toStore = { user: data.user, accessToken: data.accessToken };
      localStorage.setItem('aa-auth', JSON.stringify(toStore));
      setCookie('accessToken', data.accessToken, 86400);
    } else {
      localStorage.removeItem('aa-auth');
      localStorage.removeItem('aa-refresh-token');
      setCookie('accessToken', null);
    }
  } catch {}
}

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  hydrated: false,
  loading: false,
  error: null,
  otpPending: false,
  pendingEmail: null,
  otpVerification: { loading: false, success: false, error: null, message: null },
  forgotPassword: { loading: false, success: false, error: null, requiresOtp: false, email: null },
  resetPassword: { loading: false, success: false, error: null, tokenValid: null },
  emailVerification: { loading: false, success: false, error: null, status: 'idle' },
  changePassword: { loading: false, success: false, error: null },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateAuthAction: (state, action) => {
      if (action.payload) {
        state.user = action.payload.user || null;
        state.accessToken = action.payload.accessToken || null;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = !!action.payload.accessToken;
      }
      state.hydrated = true;
    },
    loginStartAction: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccessAction: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.otpPending = false;
      state.pendingEmail = null;
      state.error = null;
      saveAuth(action.payload);
    },
    loginRequireOtpAction: (state, action) => {
      state.loading = false;
      state.otpPending = true;
      state.pendingEmail = action.payload.email;
      state.error = null;
    },
    loginFailureAction: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutAction: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.otpPending = false;
      state.pendingEmail = null;
      saveAuth(null);
    },
    registerStartAction: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerRequireOtpAction: (state, action) => {
      state.loading = false;
      state.otpPending = true;
      state.pendingEmail = action.payload.email;
      state.error = null;
    },
    registerSuccessAction: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.otpPending = false;
      state.pendingEmail = null;
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

    // OTP actions
    otpStartAction: (state) => {
      state.otpVerification = { loading: true, success: false, error: null, message: null };
    },
    otpSuccessAction: (state, action) => {
      state.otpVerification = { loading: false, success: true, error: null, message: action.payload?.message || null };
    },
    otpFailureAction: (state, action) => {
      state.otpVerification = { loading: false, success: false, error: action.payload, message: null };
    },
    otpResetAction: (state) => {
      state.otpVerification = { loading: false, success: false, error: null, message: null };
    },

    forgotPasswordStartAction: (state) => {
      state.forgotPassword = { loading: true, success: false, error: null, requiresOtp: false, email: null };
    },
    forgotPasswordSuccessAction: (state, action) => {
      state.forgotPassword = {
        loading: false,
        success: true,
        error: null,
        requiresOtp: action.payload?.requiresOtp || false,
        email: action.payload?.email || null,
      };
    },
    forgotPasswordFailureAction: (state, action) => {
      state.forgotPassword = { loading: false, success: false, error: action.payload, requiresOtp: false, email: null };
    },
    forgotPasswordResetAction: (state) => {
      state.forgotPassword = { loading: false, success: false, error: null, requiresOtp: false, email: null };
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

    changePasswordStartAction: (state) => {
      state.changePassword = { loading: true, success: false, error: null };
    },
    changePasswordSuccessAction: (state) => {
      state.changePassword = { loading: false, success: true, error: null };
    },
    changePasswordFailureAction: (state, action) => {
      state.changePassword = { loading: false, success: false, error: action.payload };
    },
    changePasswordResetAction: (state) => {
      state.changePassword = { loading: false, success: false, error: null };
    },
    updateUserAction: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      const stored = loadAuth();
      if (stored) {
        saveAuth({ ...stored, user: { ...stored.user, ...action.payload } });
      }
    },
  },
});

export const {
  hydrateAuthAction,
  loginStartAction,
  loginSuccessAction,
  loginRequireOtpAction,
  loginFailureAction,
  logoutAction,
  registerStartAction,
  registerRequireOtpAction,
  registerSuccessAction,
  registerFailureAction,
  clearErrorAction,
  otpStartAction,
  otpSuccessAction,
  otpFailureAction,
  otpResetAction,
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
  changePasswordStartAction,
  changePasswordSuccessAction,
  changePasswordFailureAction,
  changePasswordResetAction,
  updateUserAction,
} = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectHydrated = (state) => state.auth.hydrated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectOtpVerification = (state) => state.auth.otpVerification;
export const selectForgotPassword = (state) => state.auth.forgotPassword;
export const selectResetPassword = (state) => state.auth.resetPassword;
export const selectEmailVerification = (state) => state.auth.emailVerification;
export const selectChangePassword = (state) => state.auth.changePassword;

export default authSlice.reducer;
