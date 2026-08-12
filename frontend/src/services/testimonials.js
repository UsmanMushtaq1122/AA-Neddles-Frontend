import { api } from './index';

export const testimonialsApi = {
  getAll: () => api.get('/testimonials'),
};
