'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Loader2, CreditCard, Truck, Shield, ChevronRight, MapPin, Phone, Mail, User } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';
import PageLayout from '@/components/PageLayout';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

function CheckoutContent() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [step, setStep] = useState('shipping');
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'Pakistan',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (items.length === 0 && step !== 'confirmed') {
      setStep('empty');
    }
  }, [items, step]);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone.trim()) errs.phone = 'Required';
    else if (!/^(\+92|0)3[0-9]{9}$/.test(form.phone.replace(/[\s\-()]/g, ''))) errs.phone = 'Invalid phone number';
    if (!form.address.trim()) errs.address = 'Required';
    if (!form.city.trim()) errs.city = 'Required';
    return errs;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setPlacing(true);
    await new Promise((r) => setTimeout(r, 2000));
    clearCart();
    setPlacing(false);
    setStep('confirmed');
    addToast('Order placed successfully!', 'success');
  };

  if (step === 'empty') {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-noor-cream rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard size={28} className="text-noor-maroon" />
          </div>
          <h2 className="ty-h3 text-noor-black mb-3">Your cart is empty</h2>
          <p className="ty-body-sm text-noor-gray leading-relaxed mb-6">
            Add some items to your cart before checking out.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-noor-black text-white ty-button hover:bg-noor-maroon transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'confirmed') {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="ty-h3 text-noor-black mb-3">Order Confirmed!</h2>
          <p className="ty-body-sm text-noor-gray leading-relaxed mb-2">
            Thank you for your purchase. You will receive an order confirmation email shortly.
          </p>
          <p className="ty-caption text-zinc-400 mb-6">Order #: AA-{Date.now().toString(36).toUpperCase()}</p>
          <Link
            href="/orders"
            className="inline-block px-8 py-3 bg-noor-black text-white ty-button hover:bg-noor-maroon transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = subtotal >= 5000 ? 0 : 299;
  const total = subtotal + shippingCost;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      <div className="lg:col-span-3">
        <div className="flex items-center gap-3 mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 'shipping' ? 'bg-noor-black text-white' : 'bg-noor-maroon text-white'}`}>
            1
          </div>
          <div>
            <p className="ty-body-sm font-medium text-noor-black">Shipping</p>
            <p className="ty-caption text-zinc-400">Delivery address</p>
          </div>
          <div className="flex-1 h-px bg-zinc-200 mx-4" />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 'confirmed' ? 'bg-noor-maroon text-white' : 'bg-zinc-200 text-zinc-400'}`}>
            2
          </div>
          <div>
            <p className="ty-body-sm font-medium text-zinc-400">Payment</p>
            <p className="ty-caption text-zinc-300">Pay on delivery</p>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">First Name</label>
              <input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className={`w-full px-4 py-3 border ty-body focus:outline-none focus:ring-2 ${errors.firstName ? 'border-red-300 focus:ring-red-200' : 'border-zinc-200 focus:ring-noor-maroon/20'}`}
              />
              {errors.firstName && <p className="text-red-500 ty-caption mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className={`w-full px-4 py-3 border ty-body focus:outline-none focus:ring-2 ${errors.lastName ? 'border-red-300 focus:ring-red-200' : 'border-zinc-200 focus:ring-noor-maroon/20'}`}
              />
              {errors.lastName && <p className="text-red-500 ty-caption mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full px-4 py-3 border ty-body focus:outline-none focus:ring-2 ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-zinc-200 focus:ring-noor-maroon/20'}`}
            />
            {errors.email && <p className="text-red-500 ty-caption mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">Phone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`w-full px-4 py-3 border ty-body focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-zinc-200 focus:ring-noor-maroon/20'}`}
            />
            {errors.phone && <p className="text-red-500 ty-caption mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="address" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">Address</label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={`w-full px-4 py-3 border ty-body focus:outline-none focus:ring-2 ${errors.address ? 'border-red-300 focus:ring-red-200' : 'border-zinc-200 focus:ring-noor-maroon/20'}`}
            />
            {errors.address && <p className="text-red-500 ty-caption mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">City</label>
              <input
                id="city"
                name="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={`w-full px-4 py-3 border ty-body focus:outline-none focus:ring-2 ${errors.city ? 'border-red-300 focus:ring-red-200' : 'border-zinc-200 focus:ring-noor-maroon/20'}`}
              />
              {errors.city && <p className="text-red-500 ty-caption mt-1">{errors.city}</p>}
            </div>
            <div>
              <label htmlFor="state" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">State</label>
              <input
                id="state"
                name="state"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full px-4 py-3 border border-zinc-200 ty-body focus:outline-none focus:ring-2 focus:ring-noor-maroon/20"
              />
            </div>
            <div>
              <label htmlFor="zip" className="ty-caption uppercase tracking-wider text-zinc-500 font-medium mb-1.5 block">ZIP Code</label>
              <input
                id="zip"
                name="zip"
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                className="w-full px-4 py-3 border border-zinc-200 ty-body focus:outline-none focus:ring-2 focus:ring-noor-maroon/20"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100">
            <div className="flex items-center gap-3 p-4 bg-zinc-50 ty-body-sm text-zinc-600">
              <CreditCard size={20} className="text-noor-maroon shrink-0" />
              <span>Cash on delivery — Pay when you receive your order</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={placing}
              className="w-full py-4 bg-noor-maroon text-white ty-button hover:bg-noor-maroon/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {placing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Placing Order...
              </>
            ) : (
              <>
                <Shield size={18} />
                Place Order — Rs.{total.toLocaleString()}
              </>
            )}
          </motion.button>
        </form>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-zinc-50 p-6 sticky top-28">
          <h3 className="ty-label text-noor-black mb-4">Order Summary</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {items.map((item) => (
              <div key={item.cartItemId || item.id} className="flex gap-3">
                <div className="w-14 h-16 bg-white overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.title} width={56} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="ty-caption font-medium text-noor-black line-clamp-1">{item.title}</p>
                  <p className="ty-caption text-zinc-400">Qty: {item.quantity}</p>
                  <p className="ty-caption font-semibold text-noor-maroon mt-0.5">Rs.{item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Subtotal</span>
              <span className="font-medium">Rs.{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Shipping</span>
              <span className="font-medium">{shippingCost === 0 ? 'Free' : `Rs.${shippingCost}`}</span>
            </div>
            {subtotal < 5000 && subtotal > 0 && (
              <p className="ty-caption text-noor-maroon">Add Rs.{(5000 - subtotal).toLocaleString()} more for free shipping</p>
            )}
            <div className="flex justify-between text-sm font-semibold text-noor-black pt-2 border-t border-zinc-200">
              <span>Total</span>
              <span>Rs.{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <PageLayout
        title="Checkout"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Cart' },
          { label: 'Checkout' },
        ]}
      >
        <CheckoutContent />
      </PageLayout>
    </AuthGuard>
  );
}
