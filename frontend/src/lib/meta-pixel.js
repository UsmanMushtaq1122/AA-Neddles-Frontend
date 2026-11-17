'use client';

import { useEffect, useSyncExternalStore } from 'react';

const CONSENT_STORAGE_KEY = 'aa-marketing-consent';
const CONSENT_CHANGE_EVENT = 'aa:marketing-consent-change';
const OPEN_PREFERENCES_EVENT = 'aa:open-marketing-preferences';

export function getMarketingConsent() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) === 'granted';
  } catch {
    return false;
  }
}

export function getMarketingConsentChoice() {
  if (typeof window === 'undefined') return null;
  try {
    const choice = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return choice === 'granted' || choice === 'denied' ? choice : null;
  } catch {
    return null;
  }
}

export function setMarketingConsent(granted) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, granted ? 'granted' : 'denied');
  } catch (error) {
    console.error('Unable to save marketing consent preference', error);
    return false;
  }
  if (!granted) {
    const domain = window.location.hostname.endsWith('aaneedles.com')
      ? '; Domain=.aaneedles.com'
      : '';
    for (const name of ['_fbp', '_fbc']) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      if (domain) document.cookie = `${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax`;
    }
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: granted }));
  return true;
}

export function subscribeToMarketingConsent(listener) {
  if (typeof window === 'undefined') return () => {};
  const onConsentChange = (event) => listener(Boolean(event.detail));
  const onStorage = (event) => {
    if (event.key === CONSENT_STORAGE_KEY) listener(event.newValue === 'granted');
  };
  window.addEventListener(CONSENT_CHANGE_EVENT, onConsentChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, onConsentChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function subscribeToMarketingConsentChoice(listener) {
  if (typeof window === 'undefined') return () => {};
  const onConsentChange = () => listener(getMarketingConsentChoice());
  const onStorage = (event) => {
    if (event.key === CONSENT_STORAGE_KEY) listener(event.newValue);
  };
  window.addEventListener(CONSENT_CHANGE_EVENT, onConsentChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, onConsentChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function useMarketingConsent() {
  return useSyncExternalStore(subscribeToMarketingConsent, getMarketingConsent, () => false);
}

export function openMarketingPreferences() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
  }
}

export function subscribeToMarketingPreferences(listener) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(OPEN_PREFERENCES_EVENT, listener);
  return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, listener);
}

export function initializeMetaPixel(pixelId) {
  if (typeof window === 'undefined' || !pixelId || !/^\d+$/.test(pixelId)) return false;
  if (window.fbq) {
    window.fbq('consent', 'grant');
    return true;
  }

  const fbq = function (...args) {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, args);
    else fbq.queue.push(args);
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = '2.0';
  window.fbq = fbq;
  window._fbq = fbq;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  script.dataset.metaPixel = 'true';
  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript?.parentNode) firstScript.parentNode.insertBefore(script, firstScript);
  else document.head.appendChild(script);
  window.fbq('consent', 'grant');
  window.fbq('init', pixelId);
  return true;
}

export function trackMetaEvent(eventName, parameters = {}, eventId) {
  if (!getMarketingConsent() || typeof window === 'undefined') return null;
  if (!window.fbq && !initializeMetaPixel(process.env.NEXT_PUBLIC_META_PIXEL_ID)) return null;
  if (typeof window.fbq !== 'function') return null;
  const id = eventId || (typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  window.fbq('track', eventName, parameters, { eventID: id });
  return id;
}

export function getMetaTrackingContext() {
  if (!getMarketingConsent() || typeof window === 'undefined') return { marketingConsent: false };
  const readCookie = (key) => {
    const cookie = document.cookie.split('; ').find((entry) => entry.startsWith(`${key}=`));
    if (!cookie) return undefined;
    try {
      return decodeURIComponent(cookie.slice(key.length + 1));
    } catch {
      return undefined;
    }
  };
  return {
    marketingConsent: true,
    fbp: readCookie('_fbp'),
    fbc: readCookie('_fbc'),
    sourceUrl: `${window.location.origin}${window.location.pathname}`,
  };
}

function getProductFields(product) {
  const details = product?.product || product;
  const name = product?.title || product?.name || details?.name || '';
  const category = details?.category?.name || details?.category || details?.categoryName || '';
  const price = Number(product?.salePrice ?? product?.price ?? details?.salePrice ?? details?.price ?? 0);
  return {
    id: String(product?.id || product?.productId || details?.id || ''),
    name,
    category: typeof category === 'string' ? category : '',
    price: Number.isFinite(price) ? price : 0,
    quantity: Math.max(1, Number(product?.quantity) || 1),
  };
}

function getCartEventData(items = []) {
  const products = items.map(getProductFields).filter((product) => product.id);
  return {
    content_ids: products.map((product) => product.id),
    contents: products.map(({ id, quantity, price }) => ({ id, quantity, item_price: price })),
    content_name: products.map((product) => product.name).filter(Boolean).join(', '),
    content_type: 'product',
    num_items: products.reduce((sum, product) => sum + product.quantity, 0),
    value: Number(products.reduce((sum, product) => sum + product.price * product.quantity, 0).toFixed(2)),
    currency: 'PKR',
  };
}

export function trackViewContent(product) {
  const item = getProductFields(product);
  if (!item.id) return null;
  return trackMetaEvent('ViewContent', {
    content_ids: [item.id],
    content_name: item.name,
    content_type: 'product',
    content_category: item.category,
    value: item.price,
    currency: 'PKR',
  });
}

export function trackSearch(searchString) {
  const query = String(searchString || '').trim();
  return query ? trackMetaEvent('Search', { search_string: query }) : null;
}

export function trackAddToCart(product) {
  const item = getProductFields(product);
  if (!item.id) return null;
  return trackMetaEvent('AddToCart', {
    content_ids: [item.id],
    contents: [{ id: item.id, quantity: item.quantity, item_price: item.price }],
    content_name: item.name,
    content_type: 'product',
    value: Number((item.price * item.quantity).toFixed(2)),
    currency: 'PKR',
  });
}

export function trackAddToWishlist(product) {
  const item = getProductFields(product);
  if (!item.id) return null;
  return trackMetaEvent('AddToWishlist', {
    content_ids: [item.id],
    content_name: item.name,
    content_type: 'product',
    content_category: item.category,
    value: item.price,
    currency: 'PKR',
  });
}

export function trackInitiateCheckout(items) {
  trackMetaEvent('InitiateCheckout', getCartEventData(items));
}

export function trackAddPaymentInfo(items) {
  return trackMetaEvent('AddPaymentInfo', getCartEventData(items));
}

export function trackPurchase(order, eventId) {
  if (!order || !eventId) return;
  const purchaseStorageKey = `aa-meta-purchase:${eventId}`;
  if (getMarketingConsent()) {
    try {
      if (window.localStorage.getItem(purchaseStorageKey) === 'sent') return null;
    } catch (error) {
      console.error('Unable to read Meta purchase event state', error);
    }
  }
  const items = (order.items || []).map((item) => ({
    id: item.productId || item.product?.id,
    quantity: Number(item.quantity) || 0,
    price: Number(item.price ?? item.product?.price ?? 0),
    name: item.product?.name || item.product?.title || '',
  })).filter((item) => item.id && item.quantity > 0);
  const trackedEventId = trackMetaEvent('Purchase', {
    content_ids: items.map((item) => String(item.id)),
    contents: items.map(({ id, quantity, price }) => ({ id: String(id), quantity, item_price: price })),
    content_type: 'product',
    content_name: items.map((item) => item.name).filter(Boolean).join(', '),
    value: Number(order.total),
    discount: Number(order.discount || 0),
    shipping: Number(order.shippingCost || 0),
    currency: 'PKR',
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    order_id: order.orderNumber || order.id,
  }, eventId);
  if (trackedEventId) {
    try {
      window.localStorage.setItem(purchaseStorageKey, 'sent');
    } catch (error) {
      console.error('Unable to persist Meta purchase event state', error);
    }
  }
  return trackedEventId;
}

export function trackLead(eventId) {
  if (eventId) trackMetaEvent('Lead', {}, eventId);
}

export function trackContact(eventId) {
  if (eventId) trackMetaEvent('Contact', {}, eventId);
}

export function trackCompleteRegistration() {
  return trackMetaEvent('CompleteRegistration');
}
