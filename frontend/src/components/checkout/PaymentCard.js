'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentCard({ selected, onSelect, icon, label, description, badges, popular, children, id }) {
  return (
    <div
      className={`border-2 rounded-lg transition-all duration-200 ${
        selected
          ? 'border-noor-black bg-white shadow-sm'
          : 'border-zinc-200 bg-white hover:border-zinc-300'
      }`}
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
    >
      <label className="flex items-start gap-3 p-4 cursor-pointer" htmlFor={id}>
        <span className="mt-0.5 shrink-0">
          <span className={`block w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all duration-200 ${selected ? 'border-noor-black' : 'border-zinc-300'}`}>
            {selected && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="block w-2 h-2 rounded-full bg-noor-black" />}
          </span>
        </span>
        <input type="radio" name="paymentMethod" id={id} checked={selected} onChange={onSelect} className="sr-only" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-semibold text-noor-black">{label}</span>
            {badges && <span className="flex items-center gap-1">{badges}</span>}
            {popular && (
              <span className="text-[9px] font-bold tracking-wider uppercase bg-noor-gold/10 text-noor-gold px-2 py-0.5 rounded-full">
                Most Popular
              </span>
            )}
          </div>
          {description && <p className="text-[11px] text-zinc-400 mt-0.5">{description}</p>}
        </div>
        {icon && <span className="shrink-0 mt-0.5">{icon}</span>}
      </label>
      <AnimatePresence>
        {selected && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-zinc-100">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
