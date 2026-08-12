'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Minus, Plus } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { faqsApi } from '@/services/faqs';

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'FAQs' },
];

const CATEGORIES = ['All', 'Orders', 'Shipping', 'Returns', 'Payments', 'Account', 'Products'];

export default function FAQContent() {
  const [apiFaqs, setApiFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [allExpanded, setAllExpanded] = useState(false);

  useEffect(() => {
    faqsApi.getAll()
      .then((res) => {
        const items = res.data || [];
        if (Array.isArray(items)) setApiFaqs(items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const faqData = useMemo(() => {
    return apiFaqs.map((f) => ({
      category: f.category || 'General',
      q: f.question,
      a: f.answer,
    }));
  }, [apiFaqs]);

  const filtered = useMemo(() => {
    return faqData.filter((faq) => {
      const matchCategory = activeCategory === 'All' || faq.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery, faqData]);

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

      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
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

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-noor-maroon border-t-transparent rounded-full animate-spin" />
        </div>
      ) : searchQuery ? (
        <p className="text-sm text-zinc-500 mb-6">
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </p>
      ) : null}

      {!loading && results.length === 0 ? (
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

      <section className="mt-14 md:mt-20 bg-gradient-to-br from-noor-gold via-noor-gold/90 to-noor-gold/75 p-8 md:p-12 text-center">
        <h2 className="ty-h2 text-noor-black mb-3">
          Still Have Questions?
        </h2>
        <p className="text-noor-black/75 text-sm max-w-lg mx-auto mb-6">
          Our customer support team is here to help. Reach out to us and we&apos;ll get back to you promptly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:hello@aaneddles.com"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-noor-black ty-button hover:bg-zinc-100 transition-colors"
          >
            Email Us
          </a>
          <a
            href="https://wa.me/9242111222333"
            className="inline-flex items-center justify-center px-8 py-3 border border-noor-black/20 text-noor-black ty-button hover:bg-noor-black/5 transition-colors"
          >
            WhatsApp Us
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
