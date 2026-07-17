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
  selectAuth,
  selectIsAuthenticated,
  selectUser,
  selectAuthLoading,
  selectAuthError,
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

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector(selectAuth);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

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

  return {
    ...auth,
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}
