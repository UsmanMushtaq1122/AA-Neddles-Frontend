'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, CheckCircle2, AlertCircle, Mail, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import GuestGuard from '@/components/GuestGuard';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const {
    verifyEmailRequest,
    resendVerificationEmail,
    emailVerification,
    resetEmailVerification,
    user,
  } = useAuth();

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendEmail, setResendEmail] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmailRequest(token);
    }
  }, [token, verifyEmailRequest]);

  useEffect(() => {
    return () => resetEmailVerification();
  }, [resetEmailVerification]);

  useEffect(() => {
    if (user?.email) {
      const timer = setTimeout(() => setResendEmail(user.email), 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleResend = async () => {
    if (!resendEmail) return;
    setResendLoading(true);
    setResendSuccess(false);
    const success = await resendVerificationEmail(resendEmail);
    if (success) setResendSuccess(true);
    setResendLoading(false);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-md px-4 sm:px-6 lg:px-8 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 rounded-full bg-noor-cream flex items-center justify-center mx-auto mb-6">
              <Mail size={28} className="text-noor-maroon" strokeWidth={1.5} />
            </div>
            <h1 className="ty-h2 text-noor-black mb-3">Check your email</h1>
            <p className="ty-body-sm text-noor-gray mb-8">
              We&apos;ve sent a verification link to your email address. Please click the link to verify your account.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="resend-email" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block text-left">
                  Didn&apos;t receive the email?
                </label>
                <div className="flex gap-2">
                  <input
                    id="resend-email"
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-noor-maroon/20 focus:border-noor-maroon transition-all"
                  />
                  <button
                    onClick={handleResend}
                    disabled={resendLoading || !resendEmail}
                    className="px-4 py-3 bg-noor-black text-white ty-button hover:bg-noor-gold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {resendLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <RefreshCw size={16} />
                    )}
                    Resend
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {resendSuccess && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-green-600 ty-body-sm text-left"
                  >
                    Verification email sent! Check your inbox.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-8">
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
        <GuestGuard>
          <AnimatePresence mode="wait">
            {emailVerification.status === 'verifying' && (
              <motion.div
                key="verifying"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <Loader2 size={40} className="animate-spin text-noor-maroon mx-auto mb-6" />
                <h1 className="ty-h2 text-noor-black mb-3">Verifying your email</h1>
                <p className="ty-body-sm text-noor-gray">
                  Please wait while we verify your email address...
                </p>
              </motion.div>
            )}

            {emailVerification.status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h1 className="ty-h2 text-noor-black mb-3">Email verified!</h1>
                <p className="ty-body-sm text-noor-gray mb-8">
                  Your email has been successfully verified. You can now access all features of your account.
                </p>
                <Link
                  href="/login"
                  className="inline-block w-full bg-noor-black text-white py-4 ty-button hover:bg-noor-gold transition-all duration-300"
                >
                  Sign in
                </Link>
              </motion.div>
            )}

            {(emailVerification.status === 'failed' || emailVerification.status === 'expired') && (
              <motion.div
                key="failed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h1 className="ty-h2 text-noor-black mb-3">
                  {emailVerification.status === 'expired' ? 'Link expired' : 'Verification failed'}
                </h1>
                <p className="ty-body-sm text-noor-gray mb-8">
                  {emailVerification.status === 'expired'
                    ? 'This verification link has expired. Please request a new one.'
                    : 'We couldn\'t verify your email. The link may be invalid or already used.'}
                </p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="ve-resend-email" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block text-left">
                      Resend verification email
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="ve-resend-email"
                        type="email"
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 bg-white border border-zinc-200 ty-body text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-noor-maroon/20 focus:border-noor-maroon transition-all"
                      />
                      <button
                        onClick={handleResend}
                        disabled={resendLoading || !resendEmail}
                        className="px-4 py-3 bg-noor-black text-white ty-button hover:bg-noor-gold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {resendLoading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <RefreshCw size={16} />
                        )}
                        Resend
                      </button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {resendSuccess && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-green-600 ty-body-sm text-left"
                      >
                        Verification email sent! Check your inbox.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-8">
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-noor-maroon border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
