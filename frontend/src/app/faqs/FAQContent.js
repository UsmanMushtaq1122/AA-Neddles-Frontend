'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Minus, Plus } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'FAQs' },
];

const categories = ['All', 'Orders', 'Shipping', 'Returns', 'Payments', 'Account', 'Products'];

const faqData = [
  {
    category: 'Orders',
    q: 'How do I place an order?',
    a: 'Browse our collections, select your preferred size and quantity, and click "Add to Cart." Review your cart, proceed to checkout, enter your shipping details, choose a payment method, and confirm your order. You will receive an order confirmation email shortly after.',
  },
  {
    category: 'Orders',
    q: 'Can I modify or cancel my order after placing it?',
    a: 'Orders can be modified or canceled within 1 hour of placement. Please contact our support team immediately via email or WhatsApp. After this period, the order enters processing and cannot be changed.',
  },
  {
    category: 'Orders',
    q: 'Will I receive an order confirmation?',
    a: 'Yes, you will receive an order confirmation email immediately after successfully placing your order. If you do not receive it, please check your spam folder or contact our support team.',
  },
  {
    category: 'Orders',
    q: 'How do I know if my order went through?',
    a: 'After placing your order, you will be redirected to an order confirmation page with your order number. You will also receive a confirmation email with your order details and tracking information once shipped.',
  },
  {
    category: 'Shipping',
    q: 'How can I track my shipment?',
    a: 'Once your order is shipped, you will receive a tracking number via email and SMS. You can use this number on our tracking page or the courier\'s website to monitor your delivery in real-time.',
  },
  {
    category: 'Shipping',
    q: 'How long does delivery take?',
    a: 'Domestic standard delivery takes 3–5 business days, express delivery takes 1–2 business days. International standard delivery takes 7–14 business days, and express takes 3–5 business days. Processing time is 1–2 business days.',
  },
  {
    category: 'Shipping',
    q: 'Do you ship internationally?',
    a: 'Yes, we ship worldwide to over 50 countries. International shipping costs vary by destination and shipping method. Customs duties and taxes are the responsibility of the customer.',
  },
  {
    category: 'Shipping',
    q: 'What is the shipping cost?',
    a: 'Domestic shipping is free on orders above Rs. 5,000. For orders below Rs. 5,000, standard shipping is Rs. 150. Express domestic shipping is Rs. 350. International shipping starts at $15 USD.',
  },
  {
    category: 'Returns',
    q: 'How do returns work?',
    a: 'You can return unworn, unused items within 14 days of delivery. Simply email your return request to returns@aaneddles.com with your order number and reason for return. Our team will guide you through the process.',
  },
  {
    category: 'Returns',
    q: 'How long does it take to process a refund?',
    a: 'Refunds are processed within 5–7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method or via bank transfer for COD orders.',
  },
  {
    category: 'Returns',
    q: 'Can I exchange an item for a different size?',
    a: 'Yes, exchanges for a different size are welcome within 7 days of delivery, subject to availability. Please contact our support team to initiate the exchange process.',
  },
  {
    category: 'Returns',
    q: 'Are there items that cannot be returned?',
    a: 'Yes, earrings, custom-made items, final sale items, intimate apparel, and gift cards are non-returnable. Please review our full Return & Exchange Policy for details.',
  },
  {
    category: 'Payments',
    q: 'What payment methods do you accept?',
    a: 'We accept Visa, Mastercard, PayPal, and Cash on Delivery (COD) for domestic orders. All payments are processed through secure, encrypted payment gateways.',
  },
  {
    category: 'Payments',
    q: 'Is it safe to use my credit card on your website?',
    a: 'Absolutely. We use 256-bit SSL encryption and PCI DSS compliant payment gateways. Your payment information is securely transmitted and we do not store full card details on our servers.',
  },
  {
    category: 'Payments',
    q: 'Do you offer Cash on Delivery?',
    a: 'Yes, we offer Cash on Delivery for all domestic orders within Pakistan. COD orders are subject to a nominal processing fee of Rs. 50.',
  },
  {
    category: 'Account',
    q: 'How do I create an account?',
    a: 'Click on the user icon in the top right corner of our website and select "Create Account." Enter your name, email address, and a secure password. You can also sign up during checkout.',
  },
  {
    category: 'Account',
    q: 'I forgot my password. What should I do?',
    a: 'Click on the user icon, select "Sign In," and then click "Forgot Password." Enter your email address and we will send you a password reset link.',
  },
  {
    category: 'Account',
    q: 'How do I update my account information?',
    a: 'Sign in to your account and navigate to the account settings section. You can update your personal details, shipping addresses, and communication preferences there.',
  },
  {
    category: 'Products',
    q: 'How do I find the right size?',
    a: 'Each product page includes a size guide. You can refer to our detailed size chart which includes measurements in inches and centimeters. If you need further assistance, our customer support team is happy to help.',
  },
  {
    category: 'Products',
    q: 'Are your products true to size?',
    a: 'Our products are designed to follow standard sizing, but we recommend checking the size guide on each product page for the most accurate fit. Customer reviews can also provide helpful insights.',
  },
  {
    category: 'Products',
    q: 'How should I care for my garments?',
    a: 'Care instructions are provided on each product page. Generally, we recommend dry cleaning for formal and bridal wear. Ready-to-wear pieces can be gently hand-washed or dry cleaned as specified.',
  },
  {
    category: 'Products',
    q: 'Do you offer customization?',
    a: 'We offer limited customization for select pieces. Please contact our customer support team to inquire about bespoke options and tailoring services.',
  },
];

export default function FAQContent() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [allExpanded, setAllExpanded] = useState(false);

  const filtered = useMemo(() => {
    return faqData.filter((faq) => {
      const matchCategory = activeCategory === 'All' || faq.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggle = (idx) => {
    if (allExpanded) setAllExpanded(false);
    setExpanded(expanded === idx ? null : idx);
  };

  const toggleAll = () => {
    if (allExpanded) {
      setAllExpanded(false);
      setExpanded(null);
    } else {
      setAllExpanded(true);
    }
  };

  const results = allExpanded && activeCategory === 'All' && !searchQuery ? faqData : filtered;

  return (
    <PageLayout title="Frequently Asked Questions" breadcrumbs={breadcrumbs}>
      {/* Search */}
      <div className="relative max-w-xl mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions..."
          className="w-full pl-12 pr-4 py-3.5 border border-zinc-200 text-sm text-noor-black placeholder-zinc-400 focus:outline-none focus:border-noor-maroon focus:ring-1 focus:ring-noor-maroon/20 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category Filters + Toggle All */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setExpanded(null); setAllExpanded(false); }}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium border transition-all ${
                activeCategory === cat
                  ? 'bg-noor-black text-white border-noor-black'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-noor-black hover:text-noor-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={toggleAll}
          className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-zinc-500 hover:text-noor-black transition-colors"
        >
          {allExpanded ? <Minus size={14} /> : <Plus size={14} />}
          {allExpanded ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className="text-sm text-zinc-500 mb-6">
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* FAQ Accordions */}
      {results.length === 0 ? (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-zinc-200 mb-4" />
          <h3 className="text-lg font-medium text-noor-black mb-2">No results found</h3>
          <p className="text-sm text-zinc-400">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100 border-t border-zinc-100 overflow-hidden">
          {results.map((faq, idx) => {
            const isExpanded = allExpanded || expanded === idx;
            return (
              <div key={idx}>
                <button
                  onClick={() => toggle(idx)}
                  aria-expanded={isExpanded}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-zinc-50/50 transition-colors"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-noor-maroon font-medium">
                      {faq.category}
                    </span>
                    <span className="block text-sm font-medium text-noor-black mt-0.5">
                      {faq.q}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronDown size={16} className="text-zinc-400" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-sm text-zinc-600 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Still have questions */}
      <section className="mt-14 md:mt-20 bg-noor-black p-8 md:p-12 text-center">
        <h2 className="ty-h2 text-white mb-3">
          Still Have Questions?
        </h2>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-6">
          Our customer support team is here to help. Reach out to us and we&apos;ll get back to you promptly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:hello@aaneddles.com"
            className="inline-flex items-center justify-center px-8 py-3 bg-noor-maroon text-white ty-button hover:bg-noor-maroon/90 transition-colors"
          >
            Email Us
          </a>
          <a
            href="https://wa.me/9242111222333"
            className="inline-flex items-center justify-center px-8 py-3 border border-zinc-600 text-white ty-button hover:bg-white/10 transition-colors"
          >
            WhatsApp Us
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
