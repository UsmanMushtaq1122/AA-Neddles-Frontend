import { api } from './index';

export const careersApi = {
  getAll: () => api.get('/careers'),
  apply: (id, payload) => api.post(`/careers/${id}/apply`, payload),
};
