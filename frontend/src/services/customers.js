import { api } from './index';

export const customersApi = {
  getProfile: () => api.get('/customers/profile'),
  update: (id, data) => api.put(`/customers/${id}`, data),
};
