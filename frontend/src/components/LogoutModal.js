'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, Loader2 } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm, loading = false }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-[100]"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Confirm logout">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-sm p-6 relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-noor-gray hover:text-noor-black transition-colors"
                aria-label="Close"
                disabled={loading}
              >
                <X size={18} strokeWidth={1.5} />
              </button>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-noor-cream flex items-center justify-center mx-auto mb-4">
                  <LogOut size={22} className="text-noor-maroon" strokeWidth={1.5} />
                </div>
                <h3 className="ty-h4 text-noor-black mb-2">Sign out?</h3>
                <p className="ty-body-sm text-noor-gray mb-6">
                  You will be signed out of your account and redirected to the homepage.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 py-3 border border-zinc-200 ty-button text-noor-black hover:bg-zinc-50 transition-all disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="flex-1 py-3 bg-noor-black text-white ty-button hover:bg-noor-gold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Signing out...
                      </>
                    ) : (
                      'Sign out'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
