import { api } from './index';

export const wishlistApi = {
  get: () => api.get('/wishlist'),
  toggle: (productId) => api.post('/wishlist', { productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};
