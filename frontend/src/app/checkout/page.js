'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, CreditCard, Truck, Shield, ChevronRight, ChevronDown, MapPin, Phone,
  Mail, User, Check, Store, Clock, Lock, Package, Tag, X, AlertCircle,
  Gift, MessageSquare, Banknote, Eye, EyeOff, Info, ArrowLeft,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

const STANDARD_SHIPPING = 199;
const EXPRESS_SHIPPING = 399;
const FREE_SHIPPING_THRESHOLD = 5000;
const EXPRESS_DAYS = { min: 1, max: 2 };
const STANDARD_DAYS = { min: 3, max: 5 };

const PAKISTAN_PROVINCES = [
  { value: 'punjab', label: 'Punjab' },
  { value: 'sindh', label: 'Sindh' },
  { value: 'kpk', label: 'Khyber Pakhtunkhwa' },
  { value: 'balochistan', label: 'Balochistan' },
  { value: 'gilgit-baltistan', label: 'Gilgit Baltistan' },
  { value: 'ajk', label: 'Azad Jammu & Kashmir' },
  { value: 'islamabad', label: 'Islamabad Capital Territory' },
];

const CITIES_BY_PROVINCE = {
  punjab: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Sargodha', 'Bahawalpur', 'Gujrat'],
  sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Thatta', 'Jacobabad'],
  kpk: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat', 'Dera Ismail Khan', 'Bannu'],
  balochistan: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi', 'Zhob'],
  'gilgit-baltistan': ['Gilgit', 'Skardu', 'Hunza', 'Chilas', 'Ghizer'],
  ajk: ['Muzaffarabad', 'Mirpur', 'Rawalakot', 'Bagh', 'Bhimber'],
  islamabad: ['Islamabad'],
};

function formatDate(d) {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

function getEstimatedDelivery(days) {
  const start = new Date();
  start.setDate(start.getDate() + days.min);
  const end = new Date();
  end.setDate(end.getDate() + days.max);
  return `${formatDate(start)}\u2013${formatDate(end)}, ${end.getFullYear()}`;
}

/* ================================================================
   FLOATING LABEL INPUT
   ================================================================ */
function FloatingInput({ label, id, error, required, type = 'text', className, as, children, ...props }) {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value != null && String(props.value).length > 0;
  const isFloating = focused || hasValue;

  const baseClass = `peer w-full px-4 pt-5 pb-2 border bg-white text-noor-black placeholder-transparent focus:outline-none focus:ring-1 transition-all duration-200 ${
    error
      ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
      : 'border-zinc-200 focus:ring-noor-gold/30 focus:border-noor-gold hover:border-zinc-300'
  }`;

  return (
    <div className={`relative ${className || ''}`}>
      {as === 'select' ? (
        <select
          id={id}
          className={`${baseClass} appearance-none cursor-pointer`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        >
          {children}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          id={id}
          rows={3}
          className={`${baseClass} resize-none`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={baseClass}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      )}
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
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
}

/* ================================================================
   CHECKOUT SECTION (Accordion)
   ================================================================ */
function CheckoutSection({ number, title, subtitle, completed, active, onClick, children }) {
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

/* ================================================================
   PAYMENT METHOD CARD
   ================================================================ */
function PaymentCard({ selected, onSelect, icon, label, description, badges, popular, children, id }) {
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

/* ================================================================
   PAYMENT ICONS
   ================================================================ */
function VisaIcon() {
  return <span className="inline-flex items-center justify-center h-6 px-2 bg-[#1A1F71] text-white text-[8px] font-black tracking-[0.1em] rounded">VISA</span>;
}
function MastercardIcon() {
  return <span className="inline-flex items-center justify-center h-6 px-2 bg-[#EB001B] text-white text-[8px] font-black tracking-[0.1em] rounded">MC</span>;
}
function UnionPayIcon() {
  return <span className="inline-flex items-center justify-center h-6 px-1.5 bg-[#00447C] text-white text-[7px] font-black rounded">UNION</span>;
}
function EasypaisaIcon() {
  return <span className="inline-flex items-center justify-center h-6 px-2 bg-[#00A651] text-white text-[8px] font-black tracking-wider rounded">EP</span>;
}
function JazzCashIcon() {
  return <span className="inline-flex items-center justify-center h-6 px-2 bg-[#D91C22] text-white text-[8px] font-black tracking-wider rounded">JC</span>;
}

/* ================================================================
   SKELETON LOADER
   ================================================================ */
function SkeletonLine({ className }) {
  return <div className={`bg-zinc-100 rounded animate-pulse ${className}`} />;
}

function CheckoutSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <SkeletonLine className="h-8 w-48 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-4">
          <SkeletonLine className="h-14 w-full" />
          <SkeletonLine className="h-14 w-full" />
          <SkeletonLine className="h-14 w-3/4" />
          <SkeletonLine className="h-14 w-full" />
          <SkeletonLine className="h-12 w-full mt-4" />
        </div>
        <div className="lg:col-span-2">
          <SkeletonLine className="h-80 w-full" />
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   ORDER SUMMARY CONTENT
   ================================================================ */
function OrderSummaryContent({ items, subtotal, shippingCost, discountAmount, total, couponCode, setCouponCode, couponState, couponMessage, applyCoupon, removeCoupon }) {
  return (
    <div className="p-5">
      <h3 className="text-[11px] font-bold text-noor-black uppercase tracking-[0.12em] mb-4">Order Summary</h3>
      <div className="space-y-4 max-h-72 overflow-y-auto pr-1 mb-4">
        {items.map((item) => (
          <div key={`${item.id}-${item.selectedSize || ''}-${item.selectedColor || ''}`} className="flex gap-3">
            <div className="relative w-14 h-[72px] bg-zinc-100 overflow-hidden shrink-0 border border-zinc-100">
              <Image src={item.image} alt={item.title} width={56} height={72} className="w-full h-full object-cover" />
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-noor-black text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-noor-black line-clamp-1">{item.title}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {item.selectedSize && <span className="text-[10px] text-zinc-400">{item.selectedSize}</span>}
                {item.selectedColor && (
                  <>
                    <span className="text-[10px] text-zinc-300">\u2022</span>
                    <span className="text-[10px] text-zinc-400">{item.selectedColor}</span>
                  </>
                )}
              </div>
              <p className="text-[12px] font-semibold text-noor-black mt-0.5">
                Rs.{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="border-t border-zinc-200 pt-4 mb-4">
        {couponState === 'success' ? (
          <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-emerald-600" />
              <div>
                <p className="text-[11px] font-semibold text-emerald-700">{couponCode.toUpperCase()}</p>
                <p className="text-[10px] text-emerald-600">{couponMessage}</p>
              </div>
            </div>
            <button type="button" onClick={removeCoupon} className="text-zinc-400 hover:text-red-500 transition-colors" aria-label="Remove coupon">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div>
            <label className="text-[10px] uppercase tracking-[0.1em] font-medium text-zinc-400 mb-2 block">Discount Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => { setCouponCode(e.target.value); }}
                placeholder="Enter code"
                className="flex-1 px-3 py-2.5 border border-zinc-200 text-[12px] focus:outline-none focus:ring-1 focus:ring-noor-gold/30 focus:border-noor-gold transition-all placeholder:text-zinc-300"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } }}
              />
              <button
                type="button"
                onClick={applyCoupon}
                disabled={couponState === 'loading' || !couponCode.trim()}
                className="px-4 py-2.5 bg-noor-black text-white text-[10px] font-semibold uppercase tracking-wider hover:bg-noor-maroon transition-colors disabled:opacity-40 flex items-center gap-1.5"
              >
                {couponState === 'loading' ? <Loader2 size={12} className="animate-spin" /> : null}
                Apply
              </button>
            </div>
            {couponState === 'error' && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle size={11} /> {couponMessage}
              </motion.p>
            )}
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-zinc-200 pt-4 space-y-2.5">
        <div className="flex justify-between text-[12px]">
          <span className="text-zinc-400">Subtotal</span>
          <span className="font-medium text-noor-black">Rs.{subtotal.toLocaleString()}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-[12px]">
            <span className="text-emerald-600">Discount</span>
            <span className="font-medium text-emerald-600">-Rs.{discountAmount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-[12px]">
          <span className="text-zinc-400">Shipping</span>
          <span className={`font-medium ${shippingCost === 0 ? 'text-emerald-600' : 'text-noor-black'}`}>
            {shippingCost === 0 ? 'Free' : `Rs.${shippingCost}`}
          </span>
        </div>
        <div className="flex justify-between text-[15px] font-bold text-noor-black pt-3 border-t border-zinc-200">
          <span>Total</span>
          <span>Rs.{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Trust */}
      <div className="mt-5 pt-4 border-t border-zinc-200 grid grid-cols-3 gap-2">
        {[
          { icon: <Lock size={14} />, label: 'Secure' },
          { icon: <Truck size={14} />, label: 'Fast Delivery' },
          { icon: <Package size={14} />, label: 'Easy Returns' },
        ].map((b) => (
          <div key={b.label} className="flex flex-col items-center gap-1 text-center">
            <span className="text-zinc-300">{b.icon}</span>
            <span className="text-[9px] text-zinc-400 font-medium">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   MAIN CHECKOUT PAGE
   ================================================================ */
export default function CheckoutPage() {
  return <CheckoutContent />;
}

function CheckoutContent() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const firstNameRef = useRef(null);

  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState('checkout');
  const [placing, setPlacing] = useState(false);

  /* ── Section State ── */
  const [openSection, setOpenSection] = useState('customer');

  /* ── Customer Info ── */
  const [customer, setCustomer] = useState({
    firstName: '', lastName: '', email: '', phone: '',
  });

  /* ── Shipping Address ── */
  const [address, setAddress] = useState({
    country: 'Pakistan', province: '', city: '', area: '',
    line1: '', line2: '', postalCode: '',
  });

  /* ── Delivery ── */
  const [deliveryMethod, setDeliveryMethod] = useState('standard');

  /* ── Payment ── */
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [easypaisaNumber, setEasypaisaNumber] = useState('');
  const [jazzcashNumber, setJazzcashNumber] = useState('');
  const [showCvv, setShowCvv] = useState(false);

  /* ── Notes ── */
  const [giftNote, setGiftNote] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  /* ── Coupon ── */
  const [couponCode, setCouponCode] = useState('');
  const [couponState, setCouponState] = useState('idle');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  /* ── Validation ── */
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* ── Mobile summary ── */
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  /* ── Hydration ── */
  useEffect(() => {
    setHydrated(true);
    setTimeout(() => firstNameRef.current?.focus(), 300);
  }, []);

  /* ── Pre-fill from auth ── */
  useEffect(() => {
    if (isAuthenticated && user) {
      setCustomer((prev) => ({
        ...prev,
        firstName: prev.firstName || user.name?.split(' ')[0] || '',
        lastName: prev.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [isAuthenticated, user]);

  /* ── Empty cart redirect ── */
  useEffect(() => {
    if (hydrated && items.length === 0 && step !== 'confirmed') {
      setStep('empty');
    }
  }, [hydrated, items, step]);

  /* ── Derived values ── */
  const shippingCost = useMemo(() => {
    if (deliveryMethod === 'express') return EXPRESS_SHIPPING;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  }, [deliveryMethod, subtotal]);

  const total = useMemo(() => Math.max(0, subtotal - discountAmount + shippingCost), [subtotal, discountAmount, shippingCost]);

  const estimatedDelivery = useMemo(() => {
    const days = deliveryMethod === 'express' ? EXPRESS_DAYS : STANDARD_DAYS;
    return getEstimatedDelivery(days);
  }, [deliveryMethod]);

  const availableCities = useMemo(() => {
    if (!address.province) return [];
    return CITIES_BY_PROVINCE[address.province] || [];
  }, [address.province]);

  /* ── Real-time field validation ── */
  const validateField = useCallback((field, value) => {
    switch (field) {
      case 'firstName': return !value.trim() ? 'First name is required' : '';
      case 'lastName': return !value.trim() ? 'Last name is required' : '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^(\+92|0)3[0-9]{8,9}$/.test(value.replace(/[\s\-()]/g, '')))
          return 'Enter a valid PK phone (03XX XXXXXXX)';
        return '';
      case 'line1': return !value.trim() ? 'Address is required' : '';
      case 'province': return !value ? 'Province is required' : '';
      case 'city': return !value ? 'City is required' : '';
      default: return '';
    }
  }, []);

  const handleBlur = useCallback((field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[field] = err;
      else delete next[field];
      return next;
    });
  }, [validateField]);

  /* ── Full validation ── */
  const validate = useCallback(() => {
    const e = {};
    e.firstName = validateField('firstName', customer.firstName);
    e.lastName = validateField('lastName', customer.lastName);
    e.email = validateField('email', customer.email);
    e.phone = validateField('phone', customer.phone);
    e.line1 = validateField('line1', address.line1);
    e.province = validateField('province', address.province);
    e.city = validateField('city', address.city);
    if (paymentMethod === 'card') {
      if (!card.number.trim() || card.number.replace(/\s/g, '').length < 15) e.cardNumber = 'Valid card number required';
      if (!card.name.trim()) e.cardName = 'Cardholder name required';
      if (!card.expiry.trim() || !/^\d{2}\/\d{2}$/.test(card.expiry)) e.cardExpiry = 'MM/YY required';
      if (!card.cvv.trim() || card.cvv.length < 3) e.cardCvv = 'Valid CVV required';
    }
    if (paymentMethod === 'easypaisa') {
      if (!easypaisaNumber.trim() || !/^(\+92|0)3[0-9]{8,9}$/.test(easypaisaNumber.replace(/[\s\-()]/g, '')))
        e.easypaisa = 'Valid mobile number required';
    }
    if (paymentMethod === 'jazzcash') {
      if (!jazzcashNumber.trim() || !/^(\+92|0)3[0-9]{8,9}$/.test(jazzcashNumber.replace(/[\s\-()]/g, '')))
        e.jazzcash = 'Valid mobile number required';
    }
    Object.keys(e).forEach((k) => { if (!e[k]) delete e[k]; });
    return e;
  }, [customer, address, paymentMethod, card, easypaisaNumber, jazzcashNumber, validateField]);

  const scrollToError = (errs) => {
    const firstKey = Object.keys(errs)[0];
    if (!firstKey) return;
    const el = document.querySelector(`[data-field="${firstKey}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  /* ── Section advance with validation ── */
  const advanceSection = useCallback((from, to) => {
    let sectionErrors = {};
    if (from === 'customer') {
      ['firstName', 'lastName', 'email', 'phone'].forEach((f) => {
        const val = f === 'firstName' ? customer.firstName : f === 'lastName' ? customer.lastName : f === 'email' ? customer.email : customer.phone;
        const err = validateField(f, val);
        if (err) sectionErrors[f] = err;
      });
    } else if (from === 'shipping') {
      ['line1', 'province', 'city'].forEach((f) => {
        const val = f === 'line1' ? address.line1 : f === 'province' ? address.province : address.city;
        const err = validateField(f, val);
        if (err) sectionErrors[f] = err;
      });
    }
    setTouched((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(sectionErrors).map((k) => [k, true])) }));
    setErrors((prev) => ({ ...prev, ...sectionErrors }));
    if (Object.keys(sectionErrors).length === 0) setOpenSection(to);
  }, [customer, address, validateField]);

  /* ── Coupon ── */
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponState('loading');
    await new Promise((r) => setTimeout(r, 1200));
    if (couponCode.trim().toUpperCase() === 'SAVE10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscountAmount(disc);
      setCouponState('success');
      setCouponMessage('10% discount applied!');
      addToast('Coupon applied successfully!', 'success');
    } else {
      setDiscountAmount(0);
      setCouponState('error');
      setCouponMessage('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponState('idle');
    setDiscountAmount(0);
    setCouponMessage('');
  };

  /* ── Card formatting ── */
  const formatCardNumber = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 16);
    return d.replace(/(.{4})/g, '$1 ').trim();
  };
  const formatExpiry = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  /* ── Place Order ── */
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const allErrors = validate();
    setErrors(allErrors);
    setTouched(Object.fromEntries(Object.keys(allErrors).map((k) => [k, true])));
    if (Object.keys(allErrors).length > 0) {
      scrollToError(allErrors);
      return;
    }
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 2500));
    clearCart();
    setPlacing(false);
    setStep('confirmed');
    addToast('Order placed successfully!', 'success');
  };

  if (!hydrated) return <CheckoutSkeleton />;

  /* ── Empty Cart ── */
  if (step === 'empty') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-noor-cream rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-noor-maroon" />
          </div>
          <h2 className="ty-h3 text-noor-black mb-2">Your cart is empty</h2>
          <p className="ty-body-sm text-zinc-400 leading-relaxed mb-8">
            Looks like you haven&apos;t added any items yet. Explore our collection to find something you love.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-3.5 bg-noor-black text-white ty-button hover:bg-noor-maroon transition-colors">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  /* ── Order Confirmed ── */
  if (step === 'confirmed') {
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
              A confirmation email has been sent to <span className="text-noor-black font-medium">{customer.email}</span>
            </p>
            <p className="ty-caption text-zinc-300 mb-10">
              Order #AA-{Date.now().toString(36).toUpperCase().slice(0, 8)}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/orders" className="w-full sm:w-auto px-8 py-3.5 bg-noor-black text-white ty-button hover:bg-noor-maroon transition-colors text-center">
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

  /* ── Main Checkout ── */
  return (
    <div>
      <div style={{ height: '62px' }} aria-hidden="true" />

      {/* Trust Bar */}
      <div className="bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
            {[
              { icon: <Check size={12} strokeWidth={3} />, text: 'Secure Checkout' },
              { icon: <Banknote size={12} />, text: 'Cash On Delivery' },
              { icon: <Package size={12} />, text: 'Easy Returns' },
              { icon: <Check size={12} strokeWidth={3} />, text: '100% Original' },
              { icon: <Shield size={12} />, text: 'Secure Payment' },
            ].map((item) => (
              <span key={item.text} className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-zinc-500 uppercase tracking-[0.06em]">
                <span className="text-emerald-500">{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

        {/* Header with back link */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h1 className="ty-h2 text-noor-black">Checkout</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <Lock size={12} className="text-zinc-400" />
              <span className="ty-caption text-zinc-400">Secure checkout \u2022 SSL encrypted</span>
            </div>
          </div>
          <Link href="/" className="hidden sm:flex items-center gap-1.5 text-[12px] text-zinc-400 hover:text-noor-black transition-colors">
            <ArrowLeft size={14} />
            Back to shop
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
          {[
            { label: 'Cart', idx: 0 },
            { label: 'Information', idx: 1 },
            { label: 'Shipping', idx: 2 },
            { label: 'Payment', idx: 3 },
            { label: 'Confirmation', idx: 4 },
          ].map((s, i) => {
            const currentMap = { customer: 1, shipping: 2, delivery: 2, payment: 3 };
            const currentIdx = currentMap[openSection] || 0;
            const isActive = s.idx === currentIdx;
            const isCompleted = s.idx < currentIdx;
            return (
              <span key={s.label} className="flex items-center shrink-0">
                <span className={`text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.08em] transition-colors ${isActive ? 'text-noor-black font-bold' : isCompleted ? 'text-emerald-500' : 'text-zinc-300'}`}>
                  {s.label}
                </span>
                {i < 4 && <ChevronRight size={12} className="mx-1.5 sm:mx-2 text-zinc-200 shrink-0" />}
              </span>
            );
          })}
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

            {/* ── LEFT: Form ── */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">

                {/* 1. Customer Information */}
                <CheckoutSection
                  number={1}
                  title="CUSTOMER INFORMATION"
                  subtitle={customer.email || 'Name, email, phone'}
                  completed={customer.firstName && customer.lastName && customer.email && customer.phone && !errors.firstName}
                  active={openSection === 'customer'}
                  onClick={() => setOpenSection('customer')}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FloatingInput ref={firstNameRef} label="First Name" id="firstName" required value={customer.firstName} onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })} onBlur={() => handleBlur('firstName', customer.firstName)} error={touched.firstName ? errors.firstName : undefined} data-field="firstName" autoComplete="given-name" />
                    <FloatingInput label="Last Name" id="lastName" required value={customer.lastName} onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })} onBlur={() => handleBlur('lastName', customer.lastName)} error={touched.lastName ? errors.lastName : undefined} data-field="lastName" autoComplete="family-name" />
                    <FloatingInput label="Email Address" id="email" type="email" required value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} onBlur={() => handleBlur('email', customer.email)} error={touched.email ? errors.email : undefined} data-field="email" autoComplete="email" />
                    <FloatingInput label="Phone Number" id="phone" type="tel" required value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} onBlur={() => handleBlur('phone', customer.phone)} error={touched.phone ? errors.phone : undefined} data-field="phone" placeholder="03XX XXXXXXX" autoComplete="tel" />
                  </div>
                  {!isAuthenticated && (
                    <p className="text-[12px] text-zinc-400 mt-4">
                      Already have an account?{' '}
                      <Link href="/login?redirect=/checkout" className="text-noor-maroon font-semibold hover:underline">Sign in</Link>
                    </p>
                  )}
                  <label className="flex items-center gap-3 cursor-pointer py-3 mt-1">
                    <input type="checkbox" className="w-4 h-4 accent-noor-black border-zinc-300 rounded" />
                    <span className="text-[12px] text-zinc-500">Email me with news and offers</span>
                  </label>
                  <button type="button" onClick={() => advanceSection('customer', 'shipping')} className="w-full py-3.5 bg-noor-black text-white text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-noor-maroon transition-colors duration-300">
                    CONTINUE TO SHIPPING
                  </button>
                </CheckoutSection>

                {/* 2. Shipping Address */}
                <CheckoutSection
                  number={2}
                  title="SHIPPING ADDRESS"
                  subtitle={address.line1 ? `${address.line1}, ${address.city}` : 'Where should we deliver?'}
                  completed={address.line1 && address.province && address.city && !errors.line1}
                  active={openSection === 'shipping'}
                  onClick={() => setOpenSection('shipping')}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-[0.1em] font-medium text-zinc-400 mb-1.5 block">Country / Region</label>
                      <div className="w-full px-4 py-3.5 border border-zinc-200 bg-zinc-50 text-[13px] text-noor-black font-medium">Pakistan</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FloatingInput as="select" label="Province" id="province" required value={address.province} onChange={(e) => setAddress({ ...address, province: e.target.value, city: '' })} onBlur={() => handleBlur('province', address.province)} error={touched.province ? errors.province : undefined} data-field="province">
                        <option value="">Select Province</option>
                        {PAKISTAN_PROVINCES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </FloatingInput>
                      <FloatingInput as="select" label="City" id="city" required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} onBlur={() => handleBlur('city', address.city)} error={touched.city ? errors.city : undefined} data-field="city">
                        <option value="">{address.province ? 'Select City' : 'Select province first'}</option>
                        {availableCities.map((c) => <option key={c} value={c}>{c}</option>)}
                      </FloatingInput>
                    </div>
                    <FloatingInput label="Area / Locality" id="area" value={address.area} onChange={(e) => setAddress({ ...address, area: e.target.value })} placeholder="e.g. DHA Phase 5" />
                    <FloatingInput label="Address Line 1" id="line1" required value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} onBlur={() => handleBlur('line1', address.line1)} error={touched.line1 ? errors.line1 : undefined} data-field="line1" placeholder="Street address, house no." autoComplete="address-line1" />
                    <FloatingInput label="Address Line 2" id="line2" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} placeholder="Apartment, suite, floor (optional)" autoComplete="address-line2" />
                    <FloatingInput label="Postal Code" id="postalCode" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} placeholder="Optional" autoComplete="postal-code" />
                  </div>
                  <button type="button" onClick={() => advanceSection('shipping', 'delivery')} className="mt-5 w-full py-3.5 bg-noor-black text-white text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-noor-maroon transition-colors duration-300">
                    CONTINUE TO DELIVERY
                  </button>
                </CheckoutSection>

                {/* 3. Delivery Method */}
                <CheckoutSection
                  number={3}
                  title="DELIVERY METHOD"
                  subtitle={`${deliveryMethod === 'express' ? 'Express' : 'Standard'} \u2022 ${estimatedDelivery}`}
                  completed={false}
                  active={openSection === 'delivery'}
                  onClick={() => setOpenSection('delivery')}
                >
                  <div className="space-y-3">
                    {[
                      { id: 'standard', label: 'Standard Delivery', sub: '3\u20135 Business Days', cost: subtotal >= FREE_SHIPPING_THRESHOLD ? 'Free' : `Rs.${STANDARD_SHIPPING}`, icon: <Truck size={20} className="text-zinc-400" /> },
                      { id: 'express', label: 'Express Delivery', sub: '1\u20132 Business Days', cost: `Rs.${EXPRESS_SHIPPING}`, icon: <Clock size={20} className="text-zinc-400" /> },
                    ].map((opt) => (
                      <label key={opt.id} className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${deliveryMethod === opt.id ? 'border-noor-black bg-white shadow-sm' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}>
                        <input type="radio" name="deliveryMethod" value={opt.id} checked={deliveryMethod === opt.id} onChange={() => setDeliveryMethod(opt.id)} className="sr-only" />
                        <span className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${deliveryMethod === opt.id ? 'border-noor-black' : 'border-zinc-300'}`}>
                          {deliveryMethod === opt.id && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-noor-black" />}
                        </span>
                        <span className="shrink-0">{opt.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-noor-black">{opt.label}</p>
                          <p className="text-[11px] text-zinc-400">{opt.sub}</p>
                          <p className="text-[10px] text-zinc-300 mt-0.5">Expected: {getEstimatedDelivery(opt.id === 'express' ? EXPRESS_DAYS : STANDARD_DAYS)}</p>
                        </div>
                        <span className={`text-[13px] font-semibold shrink-0 ${opt.cost === 'Free' ? 'text-emerald-600' : 'text-noor-black'}`}>{opt.cost}</span>
                      </label>
                    ))}
                    {deliveryMethod === 'standard' && subtotal < FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-noor-gold/5 border border-noor-gold/20 rounded-lg">
                        <Info size={14} className="text-noor-gold shrink-0" />
                        <p className="text-[11px] text-amber-700 font-medium">
                          Add Rs.{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for free standard shipping
                        </p>
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => setOpenSection('payment')} className="mt-5 w-full py-3.5 bg-noor-black text-white text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-noor-maroon transition-colors duration-300">
                    CONTINUE TO PAYMENT
                  </button>
                </CheckoutSection>

                {/* 4. Payment Method */}
                <CheckoutSection
                  number={4}
                  title="PAYMENT METHOD"
                  subtitle={paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'card' ? 'Credit / Debit Card' : paymentMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash'}
                  completed={false}
                  active={openSection === 'payment'}
                  onClick={() => setOpenSection('payment')}
                >
                  <div className="space-y-3">
                    <PaymentCard id="pay-cod" selected={paymentMethod === 'cod'} onSelect={() => setPaymentMethod('cod')} icon={<Banknote size={20} className="text-zinc-400" />} label="Cash on Delivery (COD)" description="Pay when your order is delivered to your doorstep" popular />
                    <PaymentCard id="pay-card" selected={paymentMethod === 'card'} onSelect={() => setPaymentMethod('card')} icon={<CreditCard size={20} className="text-zinc-400" />} label="Credit / Debit Card" description="Pay securely with your bank card" badges={<><VisaIcon /><MastercardIcon /><UnionPayIcon /></>}>
                      {paymentMethod === 'card' && (
                        <div className="space-y-3 pt-2">
                          <FloatingInput label="Card Number" id="cardNumber" required value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })} error={errors.cardNumber} data-field="cardNumber" placeholder="1234 5678 9012 3456" autoComplete="cc-number" inputMode="numeric" />
                          <FloatingInput label="Cardholder Name" id="cardName" required value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} error={errors.cardName} data-field="cardName" autoComplete="cc-name" />
                          <div className="grid grid-cols-2 gap-3">
                            <FloatingInput label="Expiry Date" id="cardExpiry" required value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} error={errors.cardExpiry} data-field="cardExpiry" placeholder="MM/YY" autoComplete="cc-exp" inputMode="numeric" />
                            <div className="relative">
                              <FloatingInput label="CVV" id="cardCvv" type={showCvv ? 'text' : 'password'} required value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} error={errors.cardCvv} data-field="cardCvv" placeholder="123" autoComplete="cc-csc" inputMode="numeric" />
                              <button type="button" onClick={() => setShowCvv(!showCvv)} className="absolute right-3 top-3.5 text-zinc-400 hover:text-zinc-600 transition-colors" aria-label={showCvv ? 'Hide CVV' : 'Show CVV'}>
                                {showCvv ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <Lock size={11} className="text-zinc-300" />
                            <span className="text-[10px] text-zinc-400">256-bit SSL encryption \u2022 Your card info is secure</span>
                          </div>
                        </div>
                      )}
                    </PaymentCard>
                    <PaymentCard id="pay-easypaisa" selected={paymentMethod === 'easypaisa'} onSelect={() => setPaymentMethod('easypaisa')} icon={<EasypaisaIcon />} label="Easypaisa" description="Pay via Easypaisa mobile wallet" badges={<EasypaisaIcon />}>
                      {paymentMethod === 'easypaisa' && (
                        <div className="space-y-3 pt-2">
                          <FloatingInput label="Easypaisa Mobile Number" id="easypaisaNum" type="tel" required value={easypaisaNumber} onChange={(e) => setEasypaisaNumber(e.target.value)} error={errors.easypaisa} data-field="easypaisa" placeholder="03XX XXXXXXX" inputMode="tel" />
                          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                            <p className="text-[11px] text-zinc-500 leading-relaxed">
                              You will receive a payment confirmation on your mobile after placing the order. Complete the payment via Easypaisa app or USSD dial *786#.
                            </p>
                          </div>
                        </div>
                      )}
                    </PaymentCard>
                    <PaymentCard id="pay-jazzcash" selected={paymentMethod === 'jazzcash'} onSelect={() => setPaymentMethod('jazzcash')} icon={<JazzCashIcon />} label="JazzCash" description="Pay via JazzCash mobile wallet" badges={<JazzCashIcon />}>
                      {paymentMethod === 'jazzcash' && (
                        <div className="space-y-3 pt-2">
                          <FloatingInput label="JazzCash Mobile Number" id="jazzcashNum" type="tel" required value={jazzcashNumber} onChange={(e) => setJazzcashNumber(e.target.value)} error={errors.jazzcash} data-field="jazzcash" placeholder="03XX XXXXXXX" inputMode="tel" />
                          <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-[11px] text-zinc-500 leading-relaxed">
                              You will receive a payment prompt on your JazzCash registered mobile. Complete the payment by entering your MPIN.
                            </p>
                          </div>
                        </div>
                      )}
                    </PaymentCard>
                  </div>

                  {/* Gift Note */}
                  <div className="mt-6 pt-5 border-t border-zinc-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Gift size={14} className="text-noor-gold" />
                      <span className="text-[11px] font-semibold text-noor-black uppercase tracking-[0.08em]">Gift Note (Optional)</span>
                    </div>
                    <div className="relative">
                      <textarea
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value.slice(0, 200))}
                        rows={3}
                        placeholder="Write a special message for your loved one..."
                        className="w-full px-4 py-3 border border-zinc-200 bg-white text-[13px] text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-noor-gold/30 focus:border-noor-gold transition-all resize-none"
                      />
                      <span className="absolute bottom-2 right-3 text-[10px] text-zinc-300">{giftNote.length}/200</span>
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div className="mt-5">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare size={14} className="text-zinc-400" />
                      <span className="text-[11px] font-semibold text-noor-black uppercase tracking-[0.08em]">Order Notes (Optional)</span>
                    </div>
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      rows={2}
                      placeholder="Any special delivery instructions? e.g. Call before delivery, leave at reception..."
                      className="w-full px-4 py-3 border border-zinc-200 bg-white text-[13px] text-noor-black placeholder:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-noor-gold/30 focus:border-noor-gold transition-all resize-none"
                    />
                  </div>
                </CheckoutSection>
              </div>

              {/* Desktop CTA */}
              <div className="hidden lg:block mt-6">
                <motion.button whileTap={{ scale: 0.985 }} type="submit" disabled={placing} className="w-full py-4 bg-noor-black text-white text-[12px] font-semibold uppercase tracking-[0.14em] hover:bg-noor-maroon transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 rounded-lg">
                  {placing ? (<><Loader2 size={18} className="animate-spin" /> Processing Your Order...</>) : (<><Lock size={15} /> Place Secure Order \u2014 Rs.{total.toLocaleString()}</>)}
                </motion.button>
                <p className="text-center text-[10px] text-zinc-300 mt-3">
                  By placing your order, you agree to our{' '}
                  <Link href="/terms" className="underline hover:text-zinc-500">Terms & Conditions</Link>
                  {' '}and{' '}
                  <Link href="/privacy-policy" className="underline hover:text-zinc-500">Privacy Policy</Link>.
                </p>
              </div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="lg:col-span-2">
              {/* Mobile Collapsible */}
              <div className="lg:hidden mb-4">
                <button type="button" onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)} className="w-full bg-white border border-zinc-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package size={18} className="text-zinc-400" />
                    <span className="text-[13px] font-semibold text-noor-black">Order Summary ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-noor-black">Rs.{total.toLocaleString()}</span>
                    <ChevronDown size={16} className={`text-zinc-400 transition-transform ${mobileSummaryOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {mobileSummaryOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <OrderSummaryContent items={items} subtotal={subtotal} shippingCost={shippingCost} discountAmount={discountAmount} total={total} couponCode={couponCode} setCouponCode={setCouponCode} couponState={couponState} couponMessage={couponMessage} applyCoupon={applyCoupon} removeCoupon={removeCoupon} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop Sticky */}
              <div className="hidden lg:block sticky top-28">
                <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
                  <OrderSummaryContent items={items} subtotal={subtotal} shippingCost={shippingCost} discountAmount={discountAmount} total={total} couponCode={couponCode} setCouponCode={setCouponCode} couponState={couponState} couponMessage={couponMessage} applyCoupon={applyCoupon} removeCoupon={removeCoupon} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 p-4 lg:hidden z-40">
        <motion.button whileTap={{ scale: 0.985 }} type="submit" disabled={placing} onClick={handlePlaceOrder} className="w-full py-4 bg-noor-black text-white text-[12px] font-semibold uppercase tracking-[0.14em] hover:bg-noor-maroon transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 rounded-lg">
          {placing ? (<><Loader2 size={18} className="animate-spin" /> Processing...</>) : (<><Lock size={15} /> Place Secure Order \u2014 Rs.{total.toLocaleString()}</>)}
        </motion.button>
        <p className="text-center text-[9px] text-zinc-300 mt-2">
          By placing your order you agree to our Terms & Privacy Policy
        </p>
      </div>
      <div className="h-28 lg:hidden" />
    </div>
  );
}
