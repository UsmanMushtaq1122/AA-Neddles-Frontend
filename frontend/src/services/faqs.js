import { api } from './index';

export const faqsApi = {
  getAll: () => api.get('/faqs'),
};
