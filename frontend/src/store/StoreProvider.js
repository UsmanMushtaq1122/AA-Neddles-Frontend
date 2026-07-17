'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer, { hydrateCartAction, loadCart } from './slices/cartSlice';
import wishlistReducer, { hydrateWishlistAction, loadWishlist } from './slices/wishlistSlice';
import toastReducer from './slices/toastSlice';

function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
      toast: toastReducer,
    },
  });
}

function HydrateStore({ store }) {
  useEffect(() => {
    store.dispatch(hydrateCartAction(loadCart()));
    store.dispatch(hydrateWishlistAction(loadWishlist()));
  }, [store]);
  return null;
}

export default function StoreProvider({ children }) {
  const [store] = useState(makeStore);
  return (
    <Provider store={store}>
      <HydrateStore store={store} />
      {children}
    </Provider>
  );
}
