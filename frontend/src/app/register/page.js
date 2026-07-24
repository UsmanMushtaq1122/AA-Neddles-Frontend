'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone, CheckCircle2, ArrowLeft, MailCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import PasswordStrength, { PasswordRequirements } from '@/components/PasswordStrength';
import SocialLoginButton from '@/components/SocialLoginButton';
import GuestGuard from '@/components/GuestGuard';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error, isAuthenticated, clearError, socialLogin } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [socialLoading, setSocialLoading] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !registrationSuccess) {
      router.replace('/');
    }
  }, [isAuthenticated, router, registrationSuccess]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
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
      if (name === 'password' && touched.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: form.confirmPassword && value !== form.confirmPassword ? 'Passwords do not match' : undefined,
        }));
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
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true });
    if (Object.keys(errs).length > 0) return;

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    const success = await register({
      name: fullName,
      email: form.email,
      password: form.password,
      phone: form.phone,
    });
    if (success) {
      setRegistrationSuccess(true);
    }
  };

  const handleSocialSignup = async (provider) => {
    setSocialLoading(provider);
    await socialLogin(provider);
    setSocialLoading(null);
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-md px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <MailCheck size={32} className="text-green-600" />
            </div>
            <h1 className="ty-h2 text-noor-black mb-3">Check your email</h1>
            <p className="ty-body-sm text-noor-gray mb-2">
              We&apos;ve sent a verification link to
            </p>
            <p className="ty-body font-medium text-noor-black mb-6">{form.email}</p>
            <p className="ty-body-sm text-noor-gray mb-8">
              Click the link in the email to verify your account. You can close this window.
            </p>
            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full bg-noor-black text-white py-4 ty-button hover:bg-noor-maroon transition-all duration-300 text-center"
              >
                Go to Sign in
              </Link>
              <Link
                href="/verify-email"
                className="block w-full border border-zinc-200 py-4 ty-button text-noor-black hover:bg-zinc-50 transition-all text-center"
              >
                Enter verification code
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
        <GuestGuard>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center mb-8"
          >
            <h1 className="ty-h2 text-noor-black">Create account</h1>
            <p className="ty-body-sm text-noor-gray mt-2">Join AA Neddles for exclusive access</p>
          </motion.div>

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

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="First name"
                  className={`w-full px-4 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 transition-all ${errors.firstName && touched.firstName ? 'border-red-300 focus:ring-red-200 bg-red-50' : 'focus:ring-noor-maroon/20 focus:border-noor-maroon'}`}
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-red-500 ty-caption mt-1.5" role="alert">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Last name"
                  className={`w-full px-4 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 transition-all ${errors.lastName && touched.lastName ? 'border-red-300 focus:ring-red-200 bg-red-50' : 'focus:ring-noor-maroon/20 focus:border-noor-maroon'}`}
                />
                {errors.lastName && touched.lastName && (
                  <p className="text-red-500 ty-caption mt-1.5" role="alert">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-noor-gray pointer-events-none" />
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Email address"
                  className={`w-full pl-14 pr-4 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 transition-all ${errors.email && touched.email ? 'border-red-300 focus:ring-red-200 bg-red-50' : 'focus:ring-noor-maroon/20 focus:border-noor-maroon'}`}
                />
              </div>
              {errors.email && touched.email && (
                <p className="text-red-500 ty-caption mt-1.5" role="alert">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="reg-phone" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">Phone (optional)</label>
              <div className="relative">
                <Phone size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-noor-gray pointer-events-none" />
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full pl-14 pr-4 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-noor-maroon/20 focus:border-noor-maroon transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-noor-gray pointer-events-none" />
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Create a password"
                  className={`w-full pl-14 pr-11 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 transition-all ${errors.password && touched.password ? 'border-red-300 focus:ring-red-200 bg-red-50' : 'focus:ring-noor-maroon/20 focus:border-noor-maroon'}`}
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
                <p className="text-red-500 ty-caption mt-1.5" role="alert">{errors.password}</p>
              )}
              <PasswordStrength password={form.password} />
              <PasswordRequirements password={form.password} />
            </div>

            <div>
              <label htmlFor="reg-confirm" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-noor-gray pointer-events-none" />
                <input
                  id="reg-confirm"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirm your password"
                  className={`w-full pl-14 pr-11 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword && touched.confirmPassword ? 'border-red-300 focus:ring-red-200 bg-red-50' : 'focus:ring-noor-maroon/20 focus:border-noor-maroon'}`}
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
                <p className="text-red-500 ty-caption mt-1.5" role="alert">{errors.confirmPassword}</p>
              )}
              {form.confirmPassword && form.password === form.confirmPassword && form.password.length > 0 && (
                <p className="ty-micro text-green-600 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-noor-black text-white py-4 ty-button hover:bg-noor-maroon transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="ty-body-sm text-noor-gray">
              Already have an account?{' '}
              <Link href="/login" className="text-noor-maroon font-medium hover:text-noor-black transition-colors">
                Sign in
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
            <SocialLoginButton
              provider="google"
              onClick={() => handleSocialSignup('Google')}
              loading={socialLoading === 'Google'}
              disabled={loading}
            />
            <SocialLoginButton
              provider="facebook"
              onClick={() => handleSocialSignup('Facebook')}
              loading={socialLoading === 'Facebook'}
              disabled={loading}
            />
          </div>
        </GuestGuard>
      </div>
    </div>
  );
}
