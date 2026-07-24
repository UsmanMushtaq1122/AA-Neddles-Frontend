'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
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
  selectAuth,
  selectIsAuthenticated,
  selectUser,
  selectAuthLoading,
  selectAuthError,
  selectHydrated,
  selectForgotPassword,
  selectResetPassword,
  selectEmailVerification,
} from '@/store/slices/authSlice';

export const MOCK_USER = {
  id: '1',
  name: 'Ayesha Khan',
  email: 'ayesha@example.com',
  phone: '+92 300 1234567',
  avatar: null,
};

const VALID_CREDENTIALS = {
  email: 'ayesha@example.com',
  password: 'password123',
};

const MOCK_RESET_TOKEN = 'mock-reset-token-abc123';
const MOCK_VERIFY_TOKEN = 'mock-verify-token-xyz789';

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector(selectAuth);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const forgotPassword = useSelector(selectForgotPassword);
  const resetPassword = useSelector(selectResetPassword);
  const emailVerification = useSelector(selectEmailVerification);
  const hydrated = useSelector(selectHydrated);

  const login = useCallback(
    async (email, password) => {
      dispatch(loginStartAction());
      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        if (
          email.toLowerCase() === VALID_CREDENTIALS.email.toLowerCase() &&
          password === VALID_CREDENTIALS.password
        ) {
          dispatch(loginSuccessAction(MOCK_USER));
          return true;
        }
        dispatch(loginFailureAction('Invalid email or password. Please try again.'));
        return false;
      } catch {
        dispatch(loginFailureAction('Something went wrong. Please try again.'));
        return false;
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (userData) => {
      dispatch(registerStartAction());
      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const newUser = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          avatar: null,
          emailVerified: false,
        };
        dispatch(registerSuccessAction(newUser));
        return true;
      } catch {
        dispatch(registerFailureAction('Registration failed. Please try again.'));
        return false;
      }
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
    router.push('/');
  }, [dispatch, router]);

  const clearError = useCallback(() => dispatch(clearErrorAction()), [dispatch]);

  const forgotPasswordRequest = useCallback(
    async (email) => {
      dispatch(forgotPasswordStartAction());
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (email.toLowerCase() !== 'nonexistent@example.com') {
          dispatch(forgotPasswordSuccessAction());
          return true;
        }
        dispatch(forgotPasswordFailureAction('No account found with this email address.'));
        return false;
      } catch {
        dispatch(forgotPasswordFailureAction('Something went wrong. Please try again.'));
        return false;
      }
    },
    [dispatch]
  );

  const resetPasswordRequest = useCallback(
    async (token, newPassword) => {
      dispatch(resetPasswordStartAction());
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (token === MOCK_RESET_TOKEN || token === 'mock') {
          dispatch(resetPasswordSuccessAction());
          return true;
        }
        dispatch(resetPasswordFailureAction('Invalid or expired reset link.'));
        return false;
      } catch {
        dispatch(resetPasswordFailureAction('Something went wrong. Please try again.'));
        return false;
      }
    },
    [dispatch]
  );

  const checkResetToken = useCallback(
    async (token) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (token === MOCK_RESET_TOKEN || token === 'mock') {
          dispatch(resetPasswordTokenCheckAction(true));
          return true;
        }
        dispatch(resetPasswordTokenCheckAction(false));
        return false;
      } catch {
        dispatch(resetPasswordTokenCheckAction(false));
        return false;
      }
    },
    [dispatch]
  );

  const verifyEmailRequest = useCallback(
    async (token) => {
      dispatch(verifyEmailStartAction());
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (token === 'expired') {
          dispatch(verifyEmailExpiredAction());
          return false;
        }
        if (token === MOCK_VERIFY_TOKEN || token === 'mock') {
          dispatch(verifyEmailSuccessAction());
          return true;
        }
        dispatch(verifyEmailFailureAction('Invalid verification link.'));
        return false;
      } catch {
        dispatch(verifyEmailFailureAction('Verification failed. Please try again.'));
        return false;
      }
    },
    [dispatch]
  );

  const resendVerificationEmail = useCallback(
    async (email) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  const socialLogin = useCallback(
    async (provider) => {
      dispatch(loginStartAction());
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const socialUser = {
          id: Date.now().toString(),
          name: `${provider} User`,
          email: `user@${provider.toLowerCase()}.com`,
          phone: '',
          avatar: null,
        };
        dispatch(loginSuccessAction(socialUser));
        return true;
      } catch {
        dispatch(loginFailureAction(`${provider} login failed. Please try again.`));
        return false;
      }
    },
    [dispatch]
  );

  const resetForgotPassword = useCallback(() => dispatch(forgotPasswordResetAction()), [dispatch]);
  const resetResetPassword = useCallback(() => dispatch(resetPasswordResetAction()), [dispatch]);
  const resetEmailVerification = useCallback(() => dispatch(verifyEmailResetAction()), [dispatch]);

  return {
    ...auth,
    isAuthenticated,
    user,
    loading,
    error,
    forgotPassword,
    resetPassword,
    emailVerification,
    hydrated,
    login,
    register,
    logout,
    clearError,
    forgotPasswordRequest,
    resetPasswordRequest,
    checkResetToken,
    verifyEmailRequest,
    resendVerificationEmail,
    socialLogin,
    resetForgotPassword,
    resetResetPassword,
    resetEmailVerification,
  };
}
