'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import PasswordStrength, { PasswordRequirements } from '@/components/PasswordStrength';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const {
    resetPasswordRequest,
    checkResetToken,
    resetPassword,
    resetResetPassword,
  } = useAuth();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [tokenChecking, setTokenChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      setTokenChecking(true);
      await checkResetToken(token);
      setTokenChecking(false);
    };
    if (token) {
      verify();
    } else {
      const timer = setTimeout(() => setTokenChecking(false), 0);
      return () => clearTimeout(timer);
    }
  }, [token, checkResetToken]);

  useEffect(() => {
    return () => resetResetPassword();
  }, [resetResetPassword]);

  const validate = () => {
    const errs = {};
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const errs = validate();
      setErrors((prev) => ({ ...prev, [name]: errs[name] || undefined }));
      if (name === 'confirmPassword' || name === 'password') {
        if (name === 'password' && touched.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: form.confirmPassword && value !== form.confirmPassword ? 'Passwords do not match' : undefined,
          }));
        }
      }
    }
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    const errs = validate();
    setErrors(errs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ password: true, confirmPassword: true });
    if (Object.keys(errs).length > 0) return;
    await resetPasswordRequest(token, form.password);
  };

  if (tokenChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-noor-maroon mx-auto mb-4" />
          <p className="ty-body-sm text-noor-gray">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!token || resetPassword.tokenValid === false) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-md px-4 sm:px-6 lg:px-8 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h1 className="ty-h2 text-noor-black mb-3">Invalid reset link</h1>
            <p className="ty-body-sm text-noor-gray mb-8">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block w-full bg-noor-black text-white py-4 ty-button hover:bg-noor-gold transition-all duration-300"
            >
              Request new reset link
            </Link>
            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 ty-body-sm text-noor-maroon hover:text-noor-black transition-colors font-medium"
              >
                <ArrowLeft size={16} />
                Back to login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-noor-cream flex items-center justify-center mx-auto mb-4">
            <KeyRound size={28} className="text-noor-maroon" strokeWidth={1.5} />
          </div>
          <h1 className="ty-h2 text-noor-black">Set new password</h1>
          <p className="ty-body-sm text-noor-gray mt-2">
            Enter your new password below.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {resetPassword.success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h2 className="ty-h3 text-noor-black mb-3">Password updated</h2>
              <p className="ty-body-sm text-noor-gray mb-8">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
              <Link
                href="/login"
                className="inline-block w-full bg-noor-black text-white py-4 ty-button hover:bg-noor-gold transition-all duration-300"
              >
                Sign in
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AnimatePresence>
                {resetPassword.error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6 flex items-center gap-2"
                    role="alert"
                  >
                    <AlertCircle size={16} />
                    {resetPassword.error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label htmlFor="rp-password" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">
                    New password
                  </label>
                  <div className="relative">
                    <Lock size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-noor-gray pointer-events-none" />
                    <input
                      id="rp-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter new password"
                      className={`w-full pl-14 pr-11 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 transition-all ${
                        errors.password && touched.password
                          ? 'border-red-300 focus:ring-red-200 bg-red-50'
                          : 'focus:ring-noor-maroon/20 focus:border-noor-maroon'
                      }`}
                      aria-invalid={!!(errors.password && touched.password)}
                      aria-describedby={errors.password ? 'rp-password-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-noor-gray hover:text-noor-black transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p id="rp-password-error" className="text-red-500 ty-caption mt-1.5" role="alert">{errors.password}</p>
                  )}
                  <PasswordStrength password={form.password} />
                  <PasswordRequirements password={form.password} />
                </div>

                <div>
                  <label htmlFor="rp-confirm" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-noor-gray pointer-events-none" />
                    <input
                      id="rp-confirm"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Confirm new password"
                      className={`w-full pl-14 pr-11 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 transition-all ${
                        errors.confirmPassword && touched.confirmPassword
                          ? 'border-red-300 focus:ring-red-200 bg-red-50'
                          : 'focus:ring-noor-maroon/20 focus:border-noor-maroon'
                      }`}
                      aria-invalid={!!(errors.confirmPassword && touched.confirmPassword)}
                      aria-describedby={errors.confirmPassword ? 'rp-confirm-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-noor-gray hover:text-noor-black transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p id="rp-confirm-error" className="text-red-500 ty-caption mt-1.5" role="alert">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={resetPassword.loading}
                  className="w-full bg-noor-black text-white py-4 ty-button hover:bg-noor-gold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {resetPassword.loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update password'
                  )}
                </button>
              </form>

              <div className="text-center mt-6">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 ty-body-sm text-noor-maroon hover:text-noor-black transition-colors font-medium"
                >
                  <ArrowLeft size={16} />
                  Back to login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-noor-maroon border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
