'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowLeft, Mail, Lock, User, Phone, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error, isAuthenticated, clearError } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

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
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const errs = validate();
      setErrors((prev) => ({ ...prev, [name]: errs[name] || undefined }));
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
    setTouched({ firstName: true, lastName: true, email: true, password: true });
    if (Object.keys(errs).length > 0) return;

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    const success = await register({
      name: fullName,
      email: form.email,
      password: form.password,
      phone: form.phone,
    });
    if (success) {
      addToast('Account created successfully! Welcome to AA Neddles.', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center mb-8"
          >
            <h1 className="ty-h2 text-noor-black">Create account</h1>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="firstName" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="First name"
                  className={`w-full pl-4 pr-4 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 ${errors.firstName && touched.firstName ? 'border-red-300 focus:ring-red-200' : 'focus:ring-noor-maroon/20'}`}
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-red-500 ty-caption mt-1.5">{errors.firstName}</p>
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
                  className={`w-full pl-4 pr-4 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 ${errors.lastName && touched.lastName ? 'border-red-300 focus:ring-red-200' : 'focus:ring-noor-maroon/20'}`}
                />
                {errors.lastName && touched.lastName && (
                  <p className="text-red-500 ty-caption mt-1.5">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">Email</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email"
                  className={`w-full pl-4 pr-4 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 ${errors.email && touched.email ? 'border-red-300 focus:ring-red-200' : 'focus:ring-noor-maroon/20'}`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 ty-caption mt-1.5">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="reg-phone" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">Phone (optional)</label>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="w-full pl-4 pr-4 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-noor-maroon/20"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Password"
                  className={`w-full pl-4 pr-11 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 ${errors.password && touched.password ? 'border-red-300 focus:ring-red-200' : 'focus:ring-noor-maroon/20'}`}
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
                <p className="text-red-500 ty-caption mt-1.5">{errors.password}</p>
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
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/login"
              className="text-noor-maroon font-medium hover:text-noor-black transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center ty-caption uppercase tracking-[0.1em]">
              <span className="bg-white px-4 text-noor-gray">OR</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => addToast('Google sign-up coming soon.', 'info')}
            className="w-full flex items-center justify-center gap-3 py-3 border border-zinc-200 ty-body text-noor-black hover:bg-zinc-50 transition-all duration-300"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>
          <button
            type="button"
            onClick={() => addToast('Facebook sign-up coming soon.', 'info')}
            className="w-full mt-3 flex items-center justify-center gap-3 py-3 ty-body font-medium text-white"
            style={{ backgroundColor: '#3b5998' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07C1.86 17.08 5.86 21.08 10.63 21.93v-6.99H8.08v-2.88h2.55V10c0-2.52 1.5-3.9 3.78-3.9 1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.78-1.64 1.58v1.87h2.79l-.45 2.88h-2.34v6.99C18.14 21.08 22 17.08 22 12.07z" fill="#fff"/>
            </svg>
            Sign up with Facebook
          </button>
        </div>
      </div>
  );
}
