import { api } from './index';

export const ordersApi = {
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  trackOrder: (orderNumber) => api.get(`/orders/track/${orderNumber}`),
};
