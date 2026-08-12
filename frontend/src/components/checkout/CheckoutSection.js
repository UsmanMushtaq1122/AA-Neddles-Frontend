'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

export default function CheckoutSection({ number, title, subtitle, completed, active, onClick, children }) {
  return (
    <div className={`border-b border-zinc-100 transition-colors ${active ? 'bg-white' : ''}`}>
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center gap-4 py-5 px-1 text-left group"
        aria-expanded={active}
      >
        <span
          className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all duration-300 ${
            completed ? 'bg-emerald-500 text-white' : active ? 'bg-noor-black text-white' : 'bg-zinc-200 text-zinc-400 group-hover:bg-zinc-300'
          }`}
        >
          {completed ? <Check size={13} strokeWidth={3} /> : number}
        </span>
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-semibold tracking-wide ${active || completed ? 'text-noor-black' : 'text-zinc-400'}`}>
            {title}
          </p>
          {subtitle && !active && (
            <p className="text-[11px] text-zinc-400 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-zinc-300 transition-transform duration-300 shrink-0 ${active ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-1 pb-6 pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
