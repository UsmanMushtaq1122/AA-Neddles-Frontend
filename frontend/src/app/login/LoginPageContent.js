'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import SocialLoginButton from '@/components/SocialLoginButton';
import { useAuth } from '@/hooks/useAuth';
import GuestGuard from '@/components/GuestGuard';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');
  const { login, loading, error, isAuthenticated, clearError, socialLogin } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [socialLoading, setSocialLoading] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => setShowSuccess(true), 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = { ...errors };
      if (name === 'email') {
        if (!value.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.email = 'Please enter a valid email address';
        else delete newErrors.email;
      }
      if (name === 'password') {
        if (!value) newErrors.password = 'Password is required';
        else delete newErrors.password;
      }
      setErrors(newErrors);
    }
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    const errs = validate();
    setErrors(errs);
  };

  const rawRedirect = searchParams.get('redirect') || '/';
  const redirectUrl = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ email: true, password: true });
    if (Object.keys(errs).length > 0) return;

    const result = await login(form.email, form.password);
    if (result?.requiresOtp) {
      const targetEmail = result.email || form.email;
      router.push(`/verify-otp?type=login&email=${encodeURIComponent(targetEmail)}&redirect=${encodeURIComponent(redirectUrl)}`);
    } else if (result?.success) {
      router.replace(redirectUrl);
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider);
    const result = await socialLogin(provider);
    setSocialLoading(null);
    if (result?.success) {
      router.replace(redirectUrl);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setSocialLoading('google');
    const result = await socialLogin('google', credentialResponse.credential);
    setSocialLoading(null);
    if (result) {
      router.replace(redirectUrl);
    }
  };

  const handleGoogleError = () => {
    setSocialLoading(null);
  };

  return (
    <div className="bg-white flex items-center justify-center px-4 py-8 sm:py-14 min-h-[calc(100vh-140px)]">
      <div className="w-full max-w-[400px]">
        <GuestGuard>
          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-medium text-zinc-900">
              Login
            </h1>
          </div>

          {/* Notifications */}
          <AnimatePresence>
            {verified === 'true' && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-2.5 mb-4 rounded-lg flex items-center gap-2"
              >
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                Email verified successfully! You can now log in.
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 mb-4 rounded-lg flex items-center gap-2"
                role="alert"
              >
                <AlertCircle size={15} className="text-red-500 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-2.5 mb-4 rounded-lg flex items-center gap-2"
              >
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                Welcome back! Redirecting...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
            {/* Email */}
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email"
                className={`w-full px-4 py-3.5 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 placeholder:font-light text-sm focus:outline-none focus:border-zinc-800 transition-colors ${
                  errors.email && touched.email ? 'border-red-400 bg-red-50/20' : ''
                }`}
                aria-invalid={!!(errors.email && touched.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && touched.email && (
                <p id="email-error" className="text-red-500 text-xs mt-1" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Password"
                  className={`w-full pl-4 pr-11 py-3.5 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 placeholder:font-light text-sm focus:outline-none focus:border-zinc-800 transition-colors ${
                    errors.password && touched.password ? 'border-red-400 bg-red-50/20' : ''
                  }`}
                  aria-invalid={!!(errors.password && touched.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p id="password-error" className="text-red-500 text-xs mt-1" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="pt-0.5 pb-0.5">
              <Link
                href="/forgot-password"
                className="text-sm text-zinc-800 hover:text-black underline underline-offset-2 transition-colors font-normal"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#111111] hover:bg-black text-white py-3.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>

          {/* Create Account Link */}
          <div className="text-center mt-3.5">
            <Link
              href={rawRedirect && rawRedirect !== '/' ? `/register?redirect=${encodeURIComponent(rawRedirect)}` : '/register'}
              className="text-sm text-zinc-800 hover:text-black underline underline-offset-2 transition-colors font-normal"
            >
              Create account
            </Link>
          </div>

          {/* Divider */}
          <div className="relative my-4 flex items-center">
            <div className="flex-grow border-t border-zinc-300" />
            <span className="flex-shrink mx-3 text-xs text-zinc-500 font-medium tracking-wider">OR</span>
            <div className="flex-grow border-t border-zinc-300" />
          </div>

          {/* Google Login */}
          <div>
            <SocialLoginButton
              provider="google"
              label="Sign in with Google"
              onClick={() => handleSocialLogin('google')}
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              loading={socialLoading === 'google'}
            />
          </div>
        </GuestGuard>
      </div>
    </div>
  );
}

export default function LoginPageContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
