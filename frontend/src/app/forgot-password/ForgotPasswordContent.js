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
    <div className="bg-white flex items-center justify-center px-4 py-8 sm:py-14 min-h-[calc(100vh-140px)]">
      <div className="w-full max-w-[400px]">
        <GuestGuard>
          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-medium text-zinc-900">
              Forgot password?
            </h1>
            <p className="text-sm text-zinc-500 mt-2 font-normal">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {forgotPassword.success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={28} className="text-green-600" />
                </div>
                <h2 className="text-xl font-medium text-zinc-900 mb-2">Check your email</h2>
                <p className="text-sm text-zinc-500 mb-1">
                  We&apos;ve sent a password reset link to
                </p>
                <p className="text-sm font-medium text-zinc-900 mb-6">{email}</p>
                <p className="text-xs text-zinc-500 mb-6">
                  Didn&apos;t receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => resetForgotPassword()}
                    className="text-zinc-900 font-semibold hover:underline"
                  >
                    try again
                  </button>
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-zinc-900 font-medium hover:underline"
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
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 mb-4 rounded-lg flex items-center gap-2"
                      role="alert"
                    >
                      <AlertCircle size={15} className="text-red-500 shrink-0" />
                      <span>{forgotPassword.error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                  <div>
                    <input
                      id="fp-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Email"
                      className={`w-full px-4 py-3.5 bg-white border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 placeholder:font-light text-sm focus:outline-none focus:border-zinc-800 transition-colors ${
                        errors.email && touched ? 'border-red-400 bg-red-50/20' : ''
                      }`}
                      aria-invalid={!!(errors.email && touched)}
                      aria-describedby={errors.email ? 'fp-email-error' : undefined}
                    />
                    {errors.email && touched && (
                      <p id="fp-email-error" className="text-red-500 text-xs mt-1" role="alert">{errors.email}</p>
                    )}
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={forgotPassword.loading}
                      className="w-full bg-[#111111] hover:bg-black text-white py-3.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      {forgotPassword.loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send reset link'
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-zinc-800 hover:text-black underline underline-offset-2 transition-colors font-normal"
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
