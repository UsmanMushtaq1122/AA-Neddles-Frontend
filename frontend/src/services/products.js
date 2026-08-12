import { api } from './index';

export const productsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit);
    if (params.search) query.set('search', params.search);
    if (params.categoryId) query.set('categoryId', params.categoryId);
    if (params.minPrice) query.set('minPrice', params.minPrice);
    if (params.maxPrice) query.set('maxPrice', params.maxPrice);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);
    if (params.isFeatured !== undefined) query.set('isFeatured', params.isFeatured);
    if (params.status) query.set('status', params.status);
    const qs = query.toString();
    return api.get(`/products${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getFacets: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    const qs = query.toString();
    return api.get(`/products/facets${qs ? `?${qs}` : ''}`);
  },
  create: (formData) => api.upload('/products', formData),
  update: (id, formData) => api.uploadPut(`/products/${id}`, formData),
  delete: (id) => api.delete(`/products/${id}`),
};
