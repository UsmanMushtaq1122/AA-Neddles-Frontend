import { api } from './index';

export const bannersApi = {
  getAll: () => api.get('/banners'),
};
