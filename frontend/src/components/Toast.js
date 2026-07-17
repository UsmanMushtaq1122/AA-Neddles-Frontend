'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const COLORS = {
  success: 'bg-noor-black text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-noor-gold text-white',
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  const timeouts = useRef({});

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
    timeouts.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timeouts.current[id];
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    if (timeouts.current[id]) {
      clearTimeout(timeouts.current[id]);
      delete timeouts.current[id];
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const { message, type, duration } = e.detail;
      addToast(message, type, duration);
    };
    window.addEventListener('aa-neddles-toast', handler);
    return () => {
      window.removeEventListener('aa-neddles-toast', handler);
      Object.values(timeouts.current).forEach(clearTimeout);
    };
  }, [addToast]);

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || Info;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`flex items-center gap-3 px-4 py-3 shadow-lg pointer-events-auto max-w-sm ${COLORS[toast.type] || COLORS.info}`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="ty-body-sm flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex items-center justify-center -mr-2 opacity-70 hover:opacity-100"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Expose addToast via a global hook for non-component usage
export function toast(message, type = 'info') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aa-neddles-toast', { detail: { message, type } }));
  }
}
