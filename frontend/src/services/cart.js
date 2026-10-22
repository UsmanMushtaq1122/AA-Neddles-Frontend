import { api } from './index';

export const cartApi = {
  get: () => api.get('/cart'),
  addItem: (productId, quantity = 1, selectedSize = '') => api.post('/cart/items', { productId, quantity, selectedSize }),
  updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clear: () => api.delete('/cart'),
};
