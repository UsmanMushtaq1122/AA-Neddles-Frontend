'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function OrderConfirmed({ email }) {
  const [orderId] = useState(() => Date.now().toString(36).toUpperCase().slice(0, 8));

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-emerald-200"
        >
          <Check size={44} className="text-emerald-500" strokeWidth={2.5} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="ty-h2 text-noor-black mb-3">Thank You For Your Order!</h2>
          <p className="ty-body text-zinc-400 leading-relaxed mb-2">
            Your order has been placed successfully.
          </p>
          <p className="ty-body-sm text-zinc-400 mb-1">
            A confirmation email has been sent to <span className="text-noor-black font-medium">{email}</span>
          </p>
          <p className="ty-caption text-zinc-300 mb-10">
            Order #AA-{orderId}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/orders" className="w-full sm:w-auto px-8 py-3.5 bg-noor-black text-white ty-button hover:bg-noor-gold transition-colors text-center">
              VIEW ORDERS
            </Link>
            <Link href="/" className="w-full sm:w-auto px-8 py-3.5 border border-zinc-300 text-noor-black ty-button hover:border-noor-black transition-colors text-center">
              CONTINUE SHOPPING
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
