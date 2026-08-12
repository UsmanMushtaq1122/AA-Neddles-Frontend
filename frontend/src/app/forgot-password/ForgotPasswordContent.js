'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import GuestGuard from '@/components/GuestGuard';

export default function ForgotPasswordContent() {
  const router = useRouter();
  const { forgotPasswordRequest, forgotPassword, resetForgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    return () => resetForgotPassword();
  }, [resetForgotPassword]);

  const validate = () => {
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email';
    return null;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (touched) {
      const err = validate();
      setErrors(err ? { email: err } : {});
    }
  };

  const handleBlur = () => {
    setTouched(true);
    const err = validate();
    setErrors(err ? { email: err } : {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    const err = validate();
    if (err) {
      setErrors({ email: err });
      return;
    }
    const res = await forgotPasswordRequest(email);
    if (res?.success) {
      router.push(`/verify-otp?type=reset&email=${encodeURIComponent(email)}`);
    }
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
            <h1 className="ty-h2 text-noor-black">Forgot password?</h1>
            <p className="ty-body-sm text-noor-gray mt-2">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {forgotPassword.success ? (
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
                <h2 className="ty-h3 text-noor-black mb-3">Check your email</h2>
                <p className="ty-body-sm text-noor-gray mb-2">
                  We&apos;ve sent a password reset link to
                </p>
                <p className="ty-body font-medium text-noor-black mb-6">{email}</p>
                <p className="ty-caption text-noor-gray mb-8">
                  Didn&apos;t receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => resetForgotPassword()}
                    className="text-noor-maroon font-medium hover:text-noor-black transition-colors"
                  >
                    try again
                  </button>
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 ty-body-sm text-noor-maroon hover:text-noor-black transition-colors font-medium"
                >
                  <ArrowLeft size={16} />
                  Back to login
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
                  {forgotPassword.error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6 flex items-center gap-2"
                      role="alert"
                    >
                      <AlertCircle size={16} />
                      {forgotPassword.error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div>
                    <label htmlFor="fp-email" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-noor-gray pointer-events-none" />
                      <input
                        id="fp-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your email"
                        className={`w-full pl-14 pr-4 py-4 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 transition-all ${
                          errors.email && touched
                            ? 'border-red-300 focus:ring-red-200 bg-red-50'
                            : 'focus:ring-noor-maroon/20 focus:border-noor-maroon'
                        }`}
                        aria-invalid={!!(errors.email && touched)}
                        aria-describedby={errors.email ? 'fp-email-error' : undefined}
                      />
                    </div>
                    {errors.email && touched && (
                      <p id="fp-email-error" className="text-red-500 ty-caption mt-1.5" role="alert">{errors.email}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={forgotPassword.loading}
                    className="w-full bg-noor-black text-white py-4 ty-button hover:bg-noor-gold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {forgotPassword.loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send reset link'
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
        </GuestGuard>
      </div>
    </div>
  );
}
