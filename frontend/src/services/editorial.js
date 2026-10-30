import { api } from './index';

export const editorialApi = {
  getAll: (params) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.request(`/editorial${query}`, { method: 'GET', cache: 'no-store' });
  },
  getById: (id) => api.get(`/editorial/${id}`),
};
