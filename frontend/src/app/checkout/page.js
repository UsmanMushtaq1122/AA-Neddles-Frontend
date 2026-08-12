'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, CreditCard, Truck, Shield, ChevronRight, ChevronDown, MapPin, Phone,
  Mail, User, Check, Store, Clock, Lock, Package, Tag, X, AlertCircle,
  Gift, MessageSquare, Banknote, Eye, EyeOff, Info, ArrowLeft,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ordersApi } from '@/services/orders';
import { api } from '@/services';
import FloatingInput from '@/components/checkout/FloatingInput';
import CheckoutSection from '@/components/checkout/CheckoutSection';
import PaymentCard from '@/components/checkout/PaymentCard';
import { VisaIcon, MastercardIcon, UnionPayIcon, EasypaisaIcon, JazzCashIcon } from '@/components/checkout/PaymentIcons';
import OrderSummaryContent, { CheckoutSkeleton } from '@/components/checkout/OrderSummaryContent';
import EmptyCart from '@/components/checkout/EmptyCart';
import OrderConfirmed from '@/components/checkout/OrderConfirmed';
import {
  EXPRESS_DAYS, STANDARD_DAYS, PAKISTAN_PROVINCES, CITIES_BY_PROVINCE,
  getEstimatedDelivery,
} from '@/components/checkout/constants';
import { settingsApi, DEFAULT_SHIPPING } from '@/services/settings';

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
  const [shipping, setShipping] = useState(DEFAULT_SHIPPING);
  const [openSection, setOpenSection] = useState('customer');
  const [customer, setCustomer] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [address, setAddress] = useState({ country: 'Pakistan', province: '', city: '', area: '', line1: '', line2: '', postalCode: '' });
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [easypaisaNumber, setEasypaisaNumber] = useState('');
  const [jazzcashNumber, setJazzcashNumber] = useState('');
  const [showCvv, setShowCvv] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponState, setCouponState] = useState('idle');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => setHydrated(true), 0);
    setTimeout(() => firstNameRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    settingsApi.getShipping().then(setShipping);
  }, []);

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

  useEffect(() => {
    if (hydrated && items.length === 0 && step !== 'confirmed') {
      const timer = setTimeout(() => setStep('empty'), 0);
      return () => clearTimeout(timer);
    }
  }, [hydrated, items, step]);

  const shippingCost = useMemo(() => {
    if (deliveryMethod === 'express') return Number(shipping.expressShippingCost) || 0;
    return Number(shipping.freeShippingThreshold) > 0 && subtotal >= Number(shipping.freeShippingThreshold) ? 0 : Number(shipping.shippingCost) || 0;
  }, [deliveryMethod, subtotal, shipping]);

  const codFee = useMemo(
    () => (paymentMethod === 'cod' && shipping.codEnabled ? Number(shipping.codFee) || 0 : 0),
    [paymentMethod, shipping]
  );

  const total = useMemo(() => Math.max(0, subtotal - discountAmount + shippingCost + codFee), [subtotal, discountAmount, shippingCost, codFee]);

  const estimatedDelivery = useMemo(() => {
    const days = deliveryMethod === 'express' ? EXPRESS_DAYS : STANDARD_DAYS;
    return getEstimatedDelivery(days);
  }, [deliveryMethod]);

  const availableCities = useMemo(() => {
    if (!address.province) return [];
    return CITIES_BY_PROVINCE[address.province] || [];
  }, [address.province]);

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
        if (!/^(\+92|0)?3[0-9]{9}$/.test(value.replace(/[\s\-()]/g, '')))
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

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponState('loading');
    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode.trim(),
        orderTotal: subtotal,
      });
      if (res.success && res.data) {
        setDiscountAmount(res.data.discountAmount);
        setCouponState('success');
        setCouponMessage(res.data.message || 'Coupon applied!');
        addToast('Coupon applied successfully!', 'success');
      }
    } catch (err) {
      setDiscountAmount(0);
      setCouponState('error');
      setCouponMessage(err.message || 'Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponState('idle');
    setDiscountAmount(0);
    setCouponMessage('');
  };

  const formatCardNumber = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 16);
    return d.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

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
    try {
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          firstName: customer.firstName, lastName: customer.lastName, email: customer.email, phone: customer.phone,
          addressLine1: address.line1, addressLine2: address.line2 || '', city: address.city, province: address.province, country: 'Pakistan', postalCode: address.postalCode || '',
        },
        paymentMethod,
        deliveryMethod,
        ...(couponState === 'success' && couponCode.trim() ? { couponCode: couponCode.trim() } : {}),
        ...(giftNote.trim() ? { giftNote: giftNote.trim() } : {}),
        ...(orderNotes.trim() ? { notes: orderNotes.trim(), orderNotes: orderNotes.trim() } : {}),
        ...(paymentMethod === 'easypaisa' ? { mobileNumber: easypaisaNumber } : {}),
        ...(paymentMethod === 'jazzcash' ? { mobileNumber: jazzcashNumber } : {}),
        ...(paymentMethod === 'card' ? { cardLast4: card.number.replace(/\s/g, '').slice(-4) } : {}),
      };
      const res = await ordersApi.create(orderPayload);
      if (res.success) {
        clearCart();
        setPlacing(false);
        setStep('confirmed');
        addToast('Order placed successfully!', 'success');
      } else {
        throw new Error(res.message || 'Failed to place order');
      }
    } catch (err) {
      addToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setPlacing(false);
    }
  };

  if (!hydrated) return <CheckoutSkeleton />;
  if (step === 'empty') return <EmptyCart />;
  if (step === 'confirmed') return <OrderConfirmed email={customer.email} />;

  return (
    <div>
      <div style={{ height: '88px' }} aria-hidden="true" />

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
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h1 className="ty-h2 text-noor-black">Checkout</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <Lock size={12} className="text-zinc-400" />
              <span className="ty-caption text-zinc-400">Secure checkout • SSL encrypted</span>
            </div>
          </div>
          <Link href="/" className="hidden sm:flex items-center gap-1.5 text-[12px] text-zinc-400 hover:text-noor-black transition-colors">
            <ArrowLeft size={14} /> Back to shop
          </Link>
        </div>

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

        <form onSubmit={handlePlaceOrder} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3">
              <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
                <CheckoutSection
                  number={1} title="CUSTOMER INFORMATION"
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
                  <button type="button" onClick={() => advanceSection('customer', 'shipping')} className="w-full py-3.5 bg-noor-black text-white text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-noor-gold transition-colors duration-300">
                    CONTINUE TO SHIPPING
                  </button>
                </CheckoutSection>

                <CheckoutSection
                  number={2} title="SHIPPING ADDRESS"
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
                  <button type="button" onClick={() => advanceSection('shipping', 'delivery')} className="mt-5 w-full py-3.5 bg-noor-black text-white text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-noor-gold transition-colors duration-300">
                    CONTINUE TO DELIVERY
                  </button>
                </CheckoutSection>

                <CheckoutSection
                  number={3} title="DELIVERY METHOD"
                  subtitle={`${deliveryMethod === 'express' ? 'Express' : 'Standard'} • ${estimatedDelivery}`}
                  completed={false}
                  active={openSection === 'delivery'}
                  onClick={() => setOpenSection('delivery')}
                >
                  <div className="space-y-3">
                    {[
                      { id: 'standard', label: 'Standard Delivery', sub: '3\u20135 Business Days', cost: Number(shipping.freeShippingThreshold) > 0 && subtotal >= Number(shipping.freeShippingThreshold) ? 'Free' : `Rs.${shipping.shippingCost}`, icon: <Truck size={20} className="text-zinc-400" /> },
                      { id: 'express', label: 'Express Delivery', sub: '1\u20132 Business Days', cost: `Rs.${shipping.expressShippingCost}`, icon: <Clock size={20} className="text-zinc-400" /> },
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
                    {deliveryMethod === 'standard' && Number(shipping.freeShippingThreshold) > 0 && subtotal < Number(shipping.freeShippingThreshold) && subtotal > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-noor-gold/5 border border-noor-gold/20 rounded-lg">
                        <Info size={14} className="text-noor-gold shrink-0" />
                        <p className="text-[11px] text-amber-700 font-medium">
                          Add Rs.{(Number(shipping.freeShippingThreshold) - subtotal).toLocaleString()} more for free standard shipping
                        </p>
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => setOpenSection('payment')} className="mt-5 w-full py-3.5 bg-noor-black text-white text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-noor-gold transition-colors duration-300">
                    CONTINUE TO PAYMENT
                  </button>
                </CheckoutSection>

                <CheckoutSection
                  number={4} title="PAYMENT METHOD"
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
                            <span className="text-[10px] text-zinc-400">256-bit SSL encryption • Your card info is secure</span>
                          </div>
                        </div>
                      )}
                    </PaymentCard>
                    <PaymentCard id="pay-easypaisa" selected={paymentMethod === 'easypaisa'} onSelect={() => setPaymentMethod('easypaisa')} icon={<EasypaisaIcon />} label="Easypaisa" description="Pay via Easypaisa mobile wallet" badges={<EasypaisaIcon />}>
                      {paymentMethod === 'easypaisa' && (
                        <div className="space-y-3 pt-2">
                          <FloatingInput label="Easypaisa Mobile Number" id="easypaisaNum" type="tel" required value={easypaisaNumber} onChange={(e) => setEasypaisaNumber(e.target.value)} error={errors.easypaisa} data-field="easypaisa" placeholder="03XX XXXXXXX" inputMode="tel" />
                          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                            <p className="text-[11px] text-zinc-500 leading-relaxed">You will receive a payment confirmation on your mobile after placing the order. Complete the payment via Easypaisa app or USSD dial *786#.</p>
                          </div>
                        </div>
                      )}
                    </PaymentCard>
                    <PaymentCard id="pay-jazzcash" selected={paymentMethod === 'jazzcash'} onSelect={() => setPaymentMethod('jazzcash')} icon={<JazzCashIcon />} label="JazzCash" description="Pay via JazzCash mobile wallet" badges={<JazzCashIcon />}>
                      {paymentMethod === 'jazzcash' && (
                        <div className="space-y-3 pt-2">
                          <FloatingInput label="JazzCash Mobile Number" id="jazzcashNum" type="tel" required value={jazzcashNumber} onChange={(e) => setJazzcashNumber(e.target.value)} error={errors.jazzcash} data-field="jazzcash" placeholder="03XX XXXXXXX" inputMode="tel" />
                          <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-[11px] text-zinc-500 leading-relaxed">You will receive a payment prompt on your JazzCash registered mobile. Complete the payment by entering your MPIN.</p>
                          </div>
                        </div>
                      )}
                    </PaymentCard>
                  </div>

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

              <div className="hidden lg:block mt-6">
                <motion.button whileTap={{ scale: 0.985 }} type="submit" disabled={placing} className="w-full py-4 bg-noor-black text-white text-[12px] font-semibold uppercase tracking-[0.14em] hover:bg-noor-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 rounded-lg">
                  {placing ? (<><Loader2 size={18} className="animate-spin" /> Processing Your Order...</>) : (<><Lock size={15} /> Place Secure Order — Rs.{total.toLocaleString()}</>)}
                </motion.button>
                <p className="text-center text-[10px] text-zinc-300 mt-3">
                  By placing your order, you agree to our{' '}
                  <Link href="/terms" className="underline hover:text-zinc-500">Terms & Conditions</Link>
                  {' '}and{' '}
                  <Link href="/privacy-policy" className="underline hover:text-zinc-500">Privacy Policy</Link>.
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <OrderSummaryContent items={items} subtotal={subtotal} shippingCost={shippingCost} discountAmount={discountAmount} total={total} codFee={codFee} couponCode={couponCode} setCouponCode={setCouponCode} couponState={couponState} couponMessage={couponMessage} applyCoupon={applyCoupon} removeCoupon={removeCoupon} mobile />

              <div className="hidden lg:block sticky top-28">
                <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
                  <OrderSummaryContent items={items} subtotal={subtotal} shippingCost={shippingCost} discountAmount={discountAmount} total={total} codFee={codFee} couponCode={couponCode} setCouponCode={setCouponCode} couponState={couponState} couponMessage={couponMessage} applyCoupon={applyCoupon} removeCoupon={removeCoupon} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 p-4 lg:hidden z-40">
        <motion.button whileTap={{ scale: 0.985 }} type="submit" disabled={placing} onClick={handlePlaceOrder} className="w-full py-4 bg-noor-black text-white text-[12px] font-semibold uppercase tracking-[0.14em] hover:bg-noor-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 rounded-lg">
          {placing ? (<><Loader2 size={18} className="animate-spin" /> Processing...</>) : (<><Lock size={15} /> Place Secure Order — Rs.{total.toLocaleString()}</>)}
        </motion.button>
        <p className="text-center text-[9px] text-zinc-300 mt-2">By placing your order you agree to our Terms & Privacy Policy</p>
      </div>
      <div className="h-28 lg:hidden" />
    </div>
  );
}
