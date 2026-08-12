import { api } from './index';

export const locationsApi = {
  getAll: () => api.get('/locations'),
};
