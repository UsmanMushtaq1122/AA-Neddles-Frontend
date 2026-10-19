'use client';

import { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertCircle } from 'lucide-react';

const FloatingInput = forwardRef(function FloatingInput(
  {
    label,
    id,
    error,
    required,
    type = 'text',
    className = '',
    as,
    children,
    placeholder,
    onFocus,
    onBlur,
    ...props
  },
  ref
) {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value != null && String(props.value).length > 0;
  const isFloating = as === 'select' || focused || hasValue;

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const baseClass = `peer w-full px-4 pt-5 pb-2 text-[16px] sm:text-[13px] border bg-white focus:outline-none focus:ring-1 transition-all duration-200 ${
    error
      ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
      : 'border-zinc-200 focus:ring-noor-gold/30 focus:border-noor-gold hover:border-zinc-300'
  }`;

  return (
    <div className={`relative ${className}`}>
      {as === 'select' ? (
        <select
          id={id}
          ref={ref}
          className={`${baseClass} appearance-none cursor-pointer pr-10 ${
            !hasValue ? 'text-zinc-400' : 'text-noor-black font-medium'
          } [&>option]:text-noor-black [&>option]:bg-white`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        >
          {children}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          id={id}
          ref={ref}
          rows={3}
          className={`${baseClass} resize-none text-noor-black ${
            !isFloating ? 'placeholder-transparent' : 'placeholder:text-zinc-400'
          }`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFloating ? (placeholder || '') : ''}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      ) : (
        <input
          id={id}
          ref={ref}
          type={type}
          className={`${baseClass} text-noor-black ${
            !isFloating ? 'placeholder-transparent' : 'placeholder:text-zinc-400'
          }`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFloating ? (placeholder || '') : ''}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      )}
      <label
        htmlFor={id || props.name}
        className={`absolute left-4 transition-all duration-200 pointer-events-none select-none ${
          isFloating
            ? 'top-1.5 text-[10px] tracking-wider uppercase font-medium text-zinc-400'
            : 'top-3.5 text-[13px] text-zinc-400'
        }`}
      >
        {label}{required && <span className="text-noor-maroon ml-0.5">*</span>}
      </label>
      {as === 'select' && (
        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            id={`${id}-error`}
            className="text-red-500 ty-caption mt-1 flex items-center gap-1"
            role="alert"
          >
            <AlertCircle size={12} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

export default FloatingInput;
