'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowLeft, CheckCircle2, AlertCircle, ShieldCheck, RefreshCw, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import GuestGuard from '@/components/GuestGuard';

function OtpVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailParam = searchParams.get('email') || '';
  const typeParam = searchParams.get('type') || 'register'; // 'register', 'login', or 'reset'

  const {
    verifyOtpRequest,
    resendOtpRequest,
    verifyPasswordResetOtpRequest,
    resetOtpVerification,
  } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '']);
  const [email, setEmail] = useState(emailParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const [resending, setResending] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const inputRefs = useRef([]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (emailParam) {
      const timer = setTimeout(() => setEmail(emailParam), 0);
      return () => clearTimeout(timer);
    }
  }, [emailParam]);

  useEffect(() => {
    return () => resetOtpVerification();
  }, [resetOtpVerification]);

  // Focus first box on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only accept numeric inputs
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];

    // Handle paste of 4 digits
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 4).split('');
      for (let i = 0; i < 4; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pasted.length, 3);
      inputRefs.current[nextIndex]?.focus();

      // Auto submit if complete
      if (pasted.length === 4) {
        handleAutoSubmit(pasted.join(''));
      }
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);
    setErrorMsg('');

    // Move to next input box
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 4 filled
    if (newOtp.every((digit) => digit !== '')) {
      handleAutoSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoSubmit = (code) => {
    if (typeParam === 'reset') return; // For reset, user needs to fill new password too
    executeVerification(code);
  };

  const executeVerification = async (codeOverride) => {
    const code = codeOverride || otp.join('');
    if (code.length !== 4) {
      setErrorMsg('Please enter all 4 digits of the verification code.');
      return;
    }

    if (!email.trim()) {
      setErrorMsg('Email address is missing.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (typeParam === 'reset') {
      if (!newPassword) {
        setErrorMsg('Please enter a new password.');
        setSubmitting(false);
        return;
      }
      if (newPassword.length < 8) {
        setErrorMsg('Password must be at least 8 characters long.');
        setSubmitting(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        setSubmitting(false);
        return;
      }

      const res = await verifyPasswordResetOtpRequest(email, code, newPassword);
      setSubmitting(false);

      if (res.success) {
        setSuccessMsg('Password reset successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setErrorMsg(res.error || 'Failed to reset password.');
      }
    } else {
      // Registration / Login flow verification
      const res = await verifyOtpRequest(email, code);
      setSubmitting(false);

      if (res.success) {
        setSuccessMsg('Email verified successfully! Redirecting...');
        setTimeout(() => router.replace('/'), 1500);
      } else {
        setErrorMsg(res.error || 'Invalid verification code.');
      }
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending || !email) return;

    setResending(true);
    setErrorMsg('');

    const res = await resendOtpRequest(email);
    setResending(false);

    if (res.success) {
      setSuccessMsg(`A new code has been sent to ${email}`);
      setCooldown(res.cooldownSeconds || 60);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(res.error || 'Failed to resend code.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeVerification();
  };

  const isReset = typeParam === 'reset';
  const allFilled = otp.every((d) => d !== '');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── LEFT PANEL — Dark brand panel (desktop only) ── */}
      <div
        className="hidden lg:flex lg:w-[42%] xl:w-[38%] flex-col justify-between relative overflow-hidden"
        style={{ background: '#111111' }}
      >
        {/* Diagonal texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(201,169,110,0.04) 0px, rgba(201,169,110,0.04) 1px, transparent 1px, transparent 50px)',
          }}
        />
        {/* Gold top bar */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #C9A96E, #e8c98a, #C9A96E)' }} />

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-10 xl:px-14 text-center">
          {/* Brand wordmark */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mb-12"
          >
            <p className="text-xs tracking-[0.45em] uppercase mb-3" style={{ color: '#C9A96E', fontFamily: 'Inter, sans-serif' }}>
              Premium Fashion
            </p>
            <h2 className="text-4xl xl:text-5xl font-light tracking-[0.18em] uppercase text-white mb-3"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
              AA Neddles
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-14" style={{ background: 'rgba(201,169,110,0.5)' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C9A96E' }} />
              <div className="h-px w-14" style={{ background: 'rgba(201,169,110,0.5)' }} />
            </div>
          </motion.div>

          {/* Shield */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
            style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.25)' }}
          >
            <ShieldCheck size={42} style={{ color: '#C9A96E' }} strokeWidth={1} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-2xl xl:text-3xl font-light text-white mb-4 leading-snug"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {isReset ? 'Secure Your Account' : 'Almost There'}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#888', maxWidth: '240px', margin: '0 auto' }}>
              {isReset
                ? 'Enter your 4-digit reset code and create a strong new password.'
                : "We've sent a 4-digit code to your email. Please check your inbox and enter it below."}
            </p>
          </motion.div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-col gap-2 w-full max-w-xs">
            {['256-bit SSL Encryption', 'One-Time Code Security', 'Expires in 10 minutes'].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 px-4 py-2.5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#C9A96E' }} />
                <span className="text-xs tracking-wider" style={{ color: '#777', fontFamily: 'Inter, sans-serif' }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-center pb-8">
          <p className="text-xs tracking-widest" style={{ color: '#3a3a3a', fontFamily: 'Inter, sans-serif' }}>
            © {new Date().getFullYear()} AA NEDDLES
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div className="flex-1 flex flex-col min-h-screen bg-white">
        {/* Mobile top bar */}
        <div className="lg:hidden px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #F0F0F0' }}>
          <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: '#C9A96E', fontFamily: 'Inter, sans-serif' }}>AA Neddles</span>
          <div className="flex items-center gap-2" style={{ color: '#9A9A9A' }}>
            <ShieldCheck size={14} />
            <span className="text-xs tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>Secure Verification</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-12 xl:px-16 py-10 lg:py-0">
          <GuestGuard>
            <div className="w-full max-w-sm">

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="mb-8"
              >
                <p className="text-xs tracking-[0.28em] uppercase mb-3" style={{ color: '#C9A96E', fontFamily: 'Inter, sans-serif' }}>
                  {isReset ? 'Password Reset' : 'Email Verification'}
                </p>
                <h1 className="text-3xl sm:text-[2.2rem] font-light leading-tight mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1A1A1A' }}>
                  {isReset ? 'Reset Password' : 'Verify Your Email'}
                </h1>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#6E6E6E' }}>
                  <Mail size={13} style={{ color: '#C9A96E', flexShrink: 0 }} />
                  <span>
                    Code sent to{' '}
                    <strong className="font-semibold" style={{ color: '#1A1A1A' }}>{email || 'your email'}</strong>
                  </span>
                </div>
              </motion.div>

              {/* Alert messages */}
              <AnimatePresence mode="wait">
                {successMsg && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-3 px-4 py-3 mb-6 text-sm"
                    style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534' }}
                  >
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                    <span>{successMsg}</span>
                  </motion.div>
                )}
                {errorMsg && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-3 px-4 py-3 mb-6 text-sm"
                    style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B' }}
                    role="alert"
                  >
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-8">

                {/* OTP boxes */}
                <div>
                  <p className="text-xs tracking-[0.22em] uppercase text-center mb-5"
                    style={{ color: '#AAAAAA', fontFamily: 'Inter, sans-serif' }}>
                    Enter 4-Digit Code
                  </p>

                  <div className="flex justify-center gap-3 sm:gap-4">
                    {otp.map((digit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.07 }}
                      >
                        <input
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={4}
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onFocus={() => setFocusedIndex(index)}
                          onBlur={() => setFocusedIndex(null)}
                          className="text-center font-mono font-bold text-noor-black bg-white outline-none transition-all duration-200"
                          style={{
                            width: '72px',
                            height: '80px',
                            fontSize: '2rem',
                            borderRadius: 0,
                            border: focusedIndex === index
                              ? '2px solid #1A1A1A'
                              : digit
                              ? '2px solid #C9A96E'
                              : '1.5px solid #E0E0E0',
                            background: digit ? '#FDFAF6' : '#FFFFFF',
                            boxShadow: focusedIndex === index ? '0 6px 20px rgba(0,0,0,0.08)' : 'none',
                          }}
                          aria-label={`Digit ${index + 1}`}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Animated progress bars */}
                  <div className="flex justify-center gap-2 mt-4">
                    {otp.map((digit, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          width: digit ? 22 : 7,
                          backgroundColor: digit ? '#C9A96E' : '#E5E5E5',
                        }}
                        transition={{ duration: 0.25 }}
                        style={{ height: '3px', borderRadius: '2px' }}
                      />
                    ))}
                  </div>

                  {/* Helper text */}
                  <p className="text-center text-xs mt-3" style={{ color: '#BBBBBB', fontFamily: 'Inter, sans-serif' }}>
                    {allFilled ? '✓ Code complete' : 'Type or paste your code'}
                  </p>
                </div>

                {/* Password reset fields */}
                {isReset && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pt-6"
                    style={{ borderTop: '1px solid #F0F0F0' }}
                  >
                    <div>
                      <label htmlFor="otp-new-password"
                        className="block text-xs tracking-[0.15em] uppercase mb-2"
                        style={{ color: '#9A9A9A', fontFamily: 'Inter, sans-serif' }}>
                        New Password
                      </label>
                      <div className="relative">
                        <Lock size={14} strokeWidth={1.5}
                          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: '#CCCCCC' }} />
                        <input
                          id="otp-new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimum 8 characters"
                          className="w-full outline-none transition-all duration-200"
                          style={{
                            paddingLeft: '42px', paddingRight: '16px',
                            paddingTop: '13px', paddingBottom: '13px',
                            fontSize: '0.875rem', color: '#1A1A1A',
                            border: '1.5px solid #E5E5E5', borderRadius: 0,
                          }}
                          onFocus={(e) => { e.target.style.borderColor = '#1A1A1A'; e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; }}
                          onBlur={(e) => { e.target.style.borderColor = '#E5E5E5'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="otp-confirm-password"
                        className="block text-xs tracking-[0.15em] uppercase mb-2"
                        style={{ color: '#9A9A9A', fontFamily: 'Inter, sans-serif' }}>
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock size={14} strokeWidth={1.5}
                          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: '#CCCCCC' }} />
                        <input
                          id="otp-confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className="w-full outline-none transition-all duration-200"
                          style={{
                            paddingLeft: '42px', paddingRight: '16px',
                            paddingTop: '13px', paddingBottom: '13px',
                            fontSize: '0.875rem', color: '#1A1A1A',
                            border: '1.5px solid #E5E5E5', borderRadius: 0,
                          }}
                          onFocus={(e) => { e.target.style.borderColor = '#1A1A1A'; e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; }}
                          onBlur={(e) => { e.target.style.borderColor = '#E5E5E5'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={submitting || otp.some((d) => !d)}
                  whileHover={submitting ? {} : { backgroundColor: '#c9a96e' }}
                  whileTap={submitting ? {} : { scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2.5 text-white transition-colors duration-300"
                  style={{
                    background: submitting || otp.some((d) => !d) ? '#CCCCCC' : '#1A1A1A',
                    padding: '16px 24px',
                    fontSize: '0.7rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: '600',
                    borderRadius: 0,
                    cursor: submitting || otp.some((d) => !d) ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {submitting ? (
                    <><Loader2 size={15} className="animate-spin" />{isReset ? 'Resetting...' : 'Verifying...'}</>
                  ) : (
                    isReset ? 'Reset Password' : 'Verify Code'
                  )}
                </motion.button>

                {/* Gold underline on fill */}
                <AnimatePresence>
                  {allFilled && !isReset && !submitting && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      transition={{ duration: 0.4 }}
                      className="-mt-7 h-0.5 origin-left"
                      style={{ background: 'linear-gradient(90deg, #C9A96E, #e8c98a)' }}
                    />
                  )}
                </AnimatePresence>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-7">
                <div className="flex-1 h-px" style={{ background: '#F2F2F2' }} />
                <span className="text-xs tracking-widest uppercase" style={{ color: '#CCCCCC', fontFamily: 'Inter, sans-serif' }}>or</span>
                <div className="flex-1 h-px" style={{ background: '#F2F2F2' }} />
              </div>

              {/* Resend */}
              <div className="text-center space-y-3">
                <p className="text-xs" style={{ color: '#999', fontFamily: 'Inter, sans-serif' }}>
                  Didn&apos;t receive the code?
                </p>
                {cooldown > 0 ? (
                  <div
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs"
                    style={{ background: '#F8F8F8', border: '1px solid #EEEEEE', color: '#AAAAAA', fontFamily: 'Inter, sans-serif' }}
                  >
                    <RefreshCw size={11} />
                    Resend in{' '}
                    <span className="font-bold tabular-nums" style={{ color: '#1A1A1A' }}>{cooldown}s</span>
                  </div>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={resending}
                    className="inline-flex items-center gap-2 text-xs tracking-wider uppercase font-semibold transition-opacity duration-200 hover:opacity-60"
                    style={{ color: '#8b1a1a', fontFamily: 'Inter, sans-serif' }}
                  >
                    {resending ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                    Resend Verification Code
                  </button>
                )}
              </div>

              {/* Back link */}
              <div className="text-center mt-8 pt-6" style={{ borderTop: '1px solid #F5F5F5' }}>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs tracking-wider uppercase transition-opacity duration-200 hover:opacity-60"
                  style={{ color: '#6E6E6E', fontFamily: 'Inter, sans-serif' }}
                >
                  <ArrowLeft size={11} />
                  Back to Sign In
                </Link>
              </div>

            </div>
          </GuestGuard>
        </div>

        {/* Mobile footer */}
        <div className="lg:hidden text-center py-5" style={{ borderTop: '1px solid #F5F5F5' }}>
          <p className="text-xs tracking-widest uppercase" style={{ color: '#CCCCCC', fontFamily: 'Inter, sans-serif' }}>
            © {new Date().getFullYear()} AA Neddles
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OtpVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#1A1A1A', borderTopColor: 'transparent' }}
          />
        </div>
      }
    >
      <OtpVerificationForm />
    </Suspense>
  );
}
