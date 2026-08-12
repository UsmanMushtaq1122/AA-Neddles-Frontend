'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
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
  selectAuth,
  selectIsAuthenticated,
  selectUser,
  selectAuthLoading,
  selectAuthError,
  selectHydrated,
  selectOtpVerification,
  selectForgotPassword,
  selectResetPassword,
  selectEmailVerification,
  selectChangePassword,
} from '@/store/slices/authSlice';
import { authApi } from '@/services/auth';
import { api } from '@/services/index';

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector(selectAuth);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const otpVerification = useSelector(selectOtpVerification);
  const forgotPassword = useSelector(selectForgotPassword);
  const resetPassword = useSelector(selectResetPassword);
  const emailVerification = useSelector(selectEmailVerification);
  const changePassword = useSelector(selectChangePassword);
  const hydrated = useSelector(selectHydrated);

  const login = useCallback(
    async (email, password) => {
      dispatch(loginStartAction());
      try {
        const response = await authApi.login(email, password);
        if (response.success && response.data) {
          if (response.data.requiresOtpVerification) {
            dispatch(loginRequireOtpAction({ email: response.data.email }));
            return { requiresOtp: true, email: response.data.email };
          }
          dispatch(loginSuccessAction({
            user: response.data.user,
            accessToken: response.data.token,
            refreshToken: response.data.refreshToken,
          }));
          return { success: true };
        }
        dispatch(loginFailureAction(response.message || 'Login failed'));
        return { success: false };
      } catch (err) {
        dispatch(loginFailureAction(err.message || 'Something went wrong. Please try again.'));
        return { success: false };
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (userData) => {
      dispatch(registerStartAction());
      try {
        const response = await authApi.register(userData);
        if (response.success && response.data) {
          if (response.data.requiresOtpVerification) {
            dispatch(registerRequireOtpAction({ email: response.data.email }));
            return { requiresOtp: true, email: response.data.email };
          }
          dispatch(registerSuccessAction({
            user: response.data.user,
            accessToken: response.data.token,
            refreshToken: response.data.refreshToken,
          }));
          return { success: true };
        }
        const backendErrors = response.errors ? response.errors.join('. ') : response.message || 'Registration failed';
        dispatch(registerFailureAction(backendErrors));
        return { success: false };
      } catch (err) {
        const backendErrors = err.data?.errors
          ? (Array.isArray(err.data.errors) ? err.data.errors.join('. ') : err.data.errors)
          : (err.data?.message || err.message || 'Registration failed. Please try again.');
        dispatch(registerFailureAction(backendErrors));
        return { success: false };
      }
    },
    [dispatch]
  );

  const verifyOtpRequest = useCallback(
    async (email, otp) => {
      dispatch(otpStartAction());
      try {
        const response = await authApi.verifyOtp(email, otp);
        if (response.success && response.data) {
          dispatch(otpSuccessAction({ message: response.data.message }));
          dispatch(loginSuccessAction({
            user: response.data.user,
            accessToken: response.data.token,
            refreshToken: response.data.refreshToken,
          }));
          return { success: true, message: response.data.message };
        }
        dispatch(otpFailureAction(response.message || 'OTP verification failed'));
        return { success: false, error: response.message || 'OTP verification failed' };
      } catch (err) {
        const msg = err.data?.message || err.message || 'Verification failed. Please try again.';
        dispatch(otpFailureAction(msg));
        return { success: false, error: msg };
      }
    },
    [dispatch]
  );

  const resendOtpRequest = useCallback(
    async (email) => {
      try {
        const response = await authApi.resendOtp(email);
        return {
          success: response.success,
          message: response.data?.message || response.message,
          cooldownSeconds: response.data?.cooldownSeconds,
        };
      } catch (err) {
        return {
          success: false,
          error: err.data?.message || err.message || 'Failed to resend code.',
        };
      }
    },
    []
  );

  const verifyPasswordResetOtpRequest = useCallback(
    async (email, otp, newPassword) => {
      dispatch(otpStartAction());
      try {
        const response = await authApi.verifyPasswordResetOtp(email, otp, newPassword);
        if (response.success) {
          dispatch(otpSuccessAction({ message: response.data?.message || 'Password reset successfully' }));
          return { success: true, message: response.data?.message };
        }
        dispatch(otpFailureAction(response.message || 'Password reset failed'));
        return { success: false, error: response.message };
      } catch (err) {
        const msg = err.data?.message || err.message || 'Password reset failed.';
        dispatch(otpFailureAction(msg));
        return { success: false, error: msg };
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {}
    api.clearAuth();
    dispatch(logoutAction());
    router.push('/');
  }, [dispatch, router]);

  const clearError = useCallback(() => dispatch(clearErrorAction()), [dispatch]);

  const forgotPasswordRequest = useCallback(
    async (email) => {
      dispatch(forgotPasswordStartAction());
      try {
        const response = await authApi.forgotPassword(email);
        dispatch(forgotPasswordSuccessAction({
          requiresOtp: response.data?.requiresOtp || true,
          email: response.data?.email || email,
        }));
        return {
          success: true,
          requiresOtp: response.data?.requiresOtp || true,
          email: response.data?.email || email,
        };
      } catch (err) {
        dispatch(forgotPasswordFailureAction(err.message || 'Something went wrong.'));
        return { success: false, error: err.message };
      }
    },
    [dispatch]
  );

  const resetPasswordRequest = useCallback(
    async (token, newPassword) => {
      dispatch(resetPasswordStartAction());
      try {
        const response = await authApi.resetPassword(token, newPassword);
        dispatch(resetPasswordSuccessAction());
        return true;
      } catch (err) {
        dispatch(resetPasswordFailureAction(err.message || 'Invalid or expired reset link.'));
        return false;
      }
    },
    [dispatch]
  );

  const checkResetToken = useCallback(
    async (token) => {
      try {
        const response = await api.get(`/auth/check-reset-token?token=${encodeURIComponent(token)}`);
        dispatch(resetPasswordTokenCheckAction(response.success === true));
        return response.success === true;
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
        const response = await authApi.verifyEmail(token);
        if (response.success) {
          dispatch(verifyEmailSuccessAction());
          return true;
        }
        dispatch(verifyEmailExpiredAction());
        return false;
      } catch (err) {
        dispatch(verifyEmailFailureAction(err.message || 'Verification failed.'));
        return false;
      }
    },
    [dispatch]
  );

  const resendVerificationEmail = useCallback(async (email) => {
    try {
      const res = await authApi.resendOtp(email);
      return res.success;
    } catch {
      return false;
    }
  }, []);

  const socialLogin = useCallback(
    async (provider, credential) => {
      dispatch(loginStartAction());
      try {
        const response = await authApi.socialLogin(provider.toLowerCase(), credential || '');
        if (response.success && response.data) {
          dispatch(loginSuccessAction({
            user: response.data.user,
            accessToken: response.data.token,
            refreshToken: response.data.refreshToken,
          }));
          return true;
        }
        dispatch(loginFailureAction(`${provider} login failed.`));
        return false;
      } catch (err) {
        dispatch(loginFailureAction(err.message || `${provider} login failed.`));
        return false;
      }
    },
    [dispatch]
  );

  const changePasswordRequest = useCallback(
    async (currentPassword, newPassword) => {
      dispatch(changePasswordStartAction());
      try {
        const response = await authApi.changePassword(currentPassword, newPassword);
        if (response.success) {
          dispatch(changePasswordSuccessAction());
          return true;
        }
        dispatch(changePasswordFailureAction(response.message || 'Failed to change password'));
        return false;
      } catch (err) {
        dispatch(changePasswordFailureAction(err.message || 'Something went wrong.'));
        return false;
      }
    },
    [dispatch]
  );

  const resetForgotPassword = useCallback(() => dispatch(forgotPasswordResetAction()), [dispatch]);
  const resetResetPassword = useCallback(() => dispatch(resetPasswordResetAction()), [dispatch]);
  const resetEmailVerification = useCallback(() => dispatch(verifyEmailResetAction()), [dispatch]);
  const resetChangePassword = useCallback(() => dispatch(changePasswordResetAction()), [dispatch]);
  const resetOtpVerification = useCallback(() => dispatch(otpResetAction()), [dispatch]);

  return {
    ...auth,
    isAuthenticated,
    user,
    loading,
    error,
    otpVerification,
    forgotPassword,
    resetPassword,
    emailVerification,
    changePassword,
    hydrated,
    login,
    register,
    logout,
    clearError,
    verifyOtpRequest,
    resendOtpRequest,
    verifyPasswordResetOtpRequest,
    forgotPasswordRequest,
    resetPasswordRequest,
    checkResetToken,
    verifyEmailRequest,
    resendVerificationEmail,
    socialLogin,
    changePasswordRequest,
    resetForgotPassword,
    resetResetPassword,
    resetEmailVerification,
    resetChangePassword,
    resetOtpVerification,
  };
}
