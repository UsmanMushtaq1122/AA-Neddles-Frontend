import { api } from './index';

export const DEFAULT_SHIPPING = {
  shippingCost: 199,
  expressShippingCost: 399,
  freeShippingThreshold: 5000,
  codFee: 0,
  codEnabled: true,
};

export const settingsApi = {
  getShipping: async () => {
    try {
      const res = await api.get('/settings/shipping');
      if (res.success && res.data && res.data.shipping) {
        return { ...DEFAULT_SHIPPING, ...res.data.shipping };
      }
    } catch {
      // setting not configured yet — use defaults
    }
    return { ...DEFAULT_SHIPPING };
  },
};
