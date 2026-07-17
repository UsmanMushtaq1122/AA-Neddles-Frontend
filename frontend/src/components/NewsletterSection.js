'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      addToast('Please enter your email address.', 'error');
      return;
    }
    setSubmitted(true);
    setEmail('');
    addToast('Thank you for subscribing!', 'success');
  };

  return (
    <section className="border-t border-b border-zinc-100 bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-xl md:text-[22px] font-semibold tracking-tight text-noor-black" style={{ fontFamily: 'var(--font-body)' }}>
              Join our newsletter
            </h2>
            <p className="mt-1.5 text-[13px] text-zinc-400 tracking-normal font-light">
              We&apos;ll send you updates once per week.
            </p>
          </div>

          {submitted ? (
            <div className="flex w-full max-w-xl h-11 items-center justify-center bg-zinc-50 border border-zinc-100 rounded-lg px-6 text-sm font-semibold text-noor-black">
              Thank you for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-3 flex-row items-center">
              <label className="sr-only" htmlFor="newsletter-email">
                Enter your email
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-11 flex-1 border border-zinc-200 bg-white px-4 text-[13px] rounded-lg text-noor-black placeholder:text-zinc-400 outline-none focus:border-zinc-400 transition-colors font-light"
              />
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center bg-black px-6 text-[11px] font-bold tracking-widest text-white rounded-lg hover:bg-zinc-800 transition-colors uppercase"
              >
                SUBSCRIBE
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

