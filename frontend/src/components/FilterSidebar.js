'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';

const PRICE_RANGES = [
  'Under Rs. 5,000',
  'Rs. 5,000 - Rs. 15,000',
  'Rs. 15,000 - Rs. 30,000',
  'Rs. 30,000 - Rs. 50,000',
  'Above Rs. 50,000',
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom', 'One Size'];

const FABRICS = [
  'Lawn',
  'Cotton',
  'Silk',
  'Velvet',
  'Chiffon',
  'Organza',
  'Georgette',
  'Linen',
  'Premium Lawn',
];

const COLLECTIONS = [
  'New Arrivals',
  'Luxury Pret',
  'Luxury Formals',
  'Couture',
  'Unstitched',
  'Kidswear',
  'Menswear',
];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-100">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3.5 text-left"
      >
        <span className="ty-body-sm font-semibold text-noor-black">{title}</span>
        <ChevronDown
          size={16}
          className={`text-noor-gray transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 space-y-2.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <span
        className={`flex items-center justify-center w-4 h-4 border transition-colors ${
          checked ? 'bg-noor-black border-noor-black' : 'border-zinc-300 group-hover:border-zinc-500'
        }`}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="ty-body-sm text-zinc-600 group-hover:text-noor-black transition-colors">{label}</span>
    </label>
  );
}

export default function FilterSidebar({ isOpen, onClose, filters, setFilters }) {
  const [localFilters, setLocalFilters] = useState(filters || {});

  useEffect(() => {
    setLocalFilters(filters || {});
  }, [filters]);

  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  const toggleFilter = (key, value) => {
    setLocalFilters((prev) => {
      const current = prev[key] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return next.length > 0 ? { ...prev, [key]: next } : (({ [key]: _, ...rest }) => rest)(prev);
    });
  };

  const clearFilters = () => {
    const cleared = {};
    setLocalFilters(cleared);
    setFilters?.(cleared);
  };

  const applyFilters = () => {
    setFilters?.(localFilters);
    onClose?.();
  };

  const activeCount = Object.values(localFilters).reduce(
    (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <h2 className="ty-h4">Filters</h2>
                {activeCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-noor-black text-white text-[10px] font-semibold">
                    {activeCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center hover:bg-zinc-100 transition-colors"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <FilterSection title="Price">
                {PRICE_RANGES.map((range) => (
                  <Checkbox
                    key={range}
                    label={range}
                    checked={(localFilters.price || []).includes(range)}
                    onChange={() => toggleFilter('price', range)}
                  />
                ))}
              </FilterSection>

              <FilterSection title="Size">
                {SIZES.map((size) => (
                  <Checkbox
                    key={size}
                    label={size}
                    checked={(localFilters.size || []).includes(size)}
                    onChange={() => toggleFilter('size', size)}
                  />
                ))}
              </FilterSection>

              <FilterSection title="Fabric">
                {FABRICS.map((fabric) => (
                  <Checkbox
                    key={fabric}
                    label={fabric}
                    checked={(localFilters.fabric || []).includes(fabric)}
                    onChange={() => toggleFilter('fabric', fabric)}
                  />
                ))}
              </FilterSection>

              <FilterSection title="Collection" defaultOpen={false}>
                {COLLECTIONS.map((col) => (
                  <Checkbox
                    key={col}
                    label={col}
                    checked={(localFilters.collection || []).includes(col)}
                    onChange={() => toggleFilter('collection', col)}
                  />
                ))}
              </FilterSection>
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 border text-sm hover:bg-noor-cream transition-colors"
                >
                  CLEAR ALL
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 py-3 bg-noor-black text-white text-sm hover:bg-noor-black/90 transition-colors"
                >
                  APPLY{activeCount > 0 ? ` (${activeCount})` : ''}
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
