import { api } from './index';

export const collectionsApi = {
  async getAll() {
    try {
      const res = await api.get('/editorial');
      const items = res?.data || res || [];
      return Array.isArray(items)
        ? items
            .map((item) => ({
              id: item.id,
              name: item.name || item.title,
              slug: item.slug || item.subtitle || item.id,
              description: item.description || '',
              image: item.image || item.imageUrl || '',
              isActive: item.isActive ?? item.active ?? true,
              sortOrder: item.sortOrder ?? item.order ?? 0,
            }))
            .filter((c) => c.isActive)
        : [];
    } catch {
      return [];
    }
  },

  async getById(id) {
    const res = await api.get(`/editorial/${encodeURIComponent(id)}`);
    const item = res?.data || res;
    return {
      id: item.id,
      name: item.name || item.title,
      slug: item.slug || item.subtitle || item.id,
      description: item.description || '',
      image: item.image || item.imageUrl || '',
      isActive: item.isActive ?? item.active ?? true,
      sortOrder: item.sortOrder ?? item.order ?? 0,
    };
  },
};

