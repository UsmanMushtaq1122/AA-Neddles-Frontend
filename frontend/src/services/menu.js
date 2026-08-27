import { api } from './index';

export const menuApi = {
  /**
   * Fetch the full nested menu tree by menu name/slug.
   * Used by the frontend hamburger drawer.
   * @param {string} menuName - e.g. "main-mobile-menu"
   */
  getTree: (menuName) => api.get(`/menus/by-name/${menuName}/tree`),
};
