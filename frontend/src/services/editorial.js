import { api } from './index';

export const editorialApi = {
  getAll: (params) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.get(`/editorial${query}`);
  },
  getById: (id) => api.get(`/editorial/${id}`),
};
