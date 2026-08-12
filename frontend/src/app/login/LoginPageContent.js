'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/hooks/useAuth';
import GuestGuard from '@/components/GuestGuard';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');
  const { login, loading, error, isAuthenticated, clearError, socialLogin } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('aa-remembered-email');
      if (savedEmail) {
        const timer = setTimeout(() => {
          setForm((prev) => ({ ...prev, email: savedEmail }));
          setRememberMe(true);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email';
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
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.email = 'Please enter a valid email';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ email: true, password: true });
    if (Object.keys(errs).length > 0) return;

    if (rememberMe) {
      localStorage.setItem('aa-remembered-email', form.email);
    } else {
      localStorage.removeItem('aa-remembered-email');
    }

    const result = await login(form.email, form.password);
    if (result?.requiresOtp) {
      const targetEmail = result.email || form.email;
      router.push(`/verify-otp?type=login&email=${encodeURIComponent(targetEmail)}`);
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider);
    await socialLogin(provider);
    setSocialLoading(null);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setSocialLoading('google');
    await socialLogin('google', credentialResponse.credential);
    setSocialLoading(null);
  };

  const handleGoogleError = () => {
    setSocialLoading(null);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-4 sm:px-6 lg:px-8 py-12">
        <GuestGuard>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center mb-8"
          >
            <h1 className="ty-h2 text-noor-black">Welcome back</h1>
            <p className="ty-body-sm text-noor-gray mt-2">Sign in to your AA Neddles account</p>
          </motion.div>

          <AnimatePresence>
            {verified === 'true' && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 mb-6 flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                Email verified successfully! You can now sign in.
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6"
                role="alert"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 mb-6 flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                Welcome back! Redirecting...
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <div className="relative">
                <Mail size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-noor-gray pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Email address"
                  className={`w-full pl-14 pr-4 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 transition-all ${
                    errors.email && touched.email
                      ? 'border-red-300 focus:ring-red-200 bg-red-50'
                      : 'focus:ring-noor-maroon/20 focus:border-noor-maroon'
                  }`}
                  aria-invalid={!!(errors.email && touched.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && touched.email && (
                <p id="email-error" className="text-red-500 ty-caption mt-1.5" role="alert">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-noor-gray pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Password"
                  className={`w-full pl-14 pr-11 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 transition-all ${
                    errors.password && touched.password
                      ? 'border-red-300 focus:ring-red-200 bg-red-50'
                      : 'focus:ring-noor-maroon/20 focus:border-noor-maroon'
                  }`}
                  aria-invalid={!!(errors.password && touched.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
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
                <p id="password-error" className="text-red-500 ty-caption mt-1.5" role="alert">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-zinc-300 text-noor-maroon focus:ring-noor-maroon/20 accent-noor-maroon"
                />
                <span className="ty-body-sm text-noor-gray">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="ty-body-sm text-noor-maroon hover:text-noor-black transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-noor-black text-white py-4 ty-button hover:bg-noor-gold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="ty-body-sm text-noor-gray">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-noor-maroon font-medium hover:text-noor-black transition-colors">
                Create one
              </Link>
            </span>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center ty-caption uppercase tracking-[0.1em]">
              <span className="bg-white px-4 text-noor-gray">OR</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="w-full">
              {socialLoading === 'google' ? (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-3 py-3 ty-body font-medium bg-white border border-zinc-200 text-noor-black opacity-60 cursor-not-allowed"
                >
                  <Loader2 size={18} className="animate-spin" />
                  Connecting...
                </button>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  width="100%"
                  theme="outline"
                  text="continue_with"
                  shape="rectangular"
                />
              )}
            </div>
          </div>
        </GuestGuard>
      </div>
    </div>
  );
}

export default function LoginPageContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-noor-maroon border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
