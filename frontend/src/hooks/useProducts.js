'use client';

import { useState, useEffect } from 'react';
import { productsApi } from '@/services/products';

export function useFeaturedProducts() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    productsApi.getAll({ isFeatured: 'true', limit: 8 })
      .then((res) => {
        if (mounted) setData(res.data?.products || []);
      })
      .catch((err) => { if (mounted) setError(err); })
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; };
  }, []);

  return { data, isLoading, error };
}

export function useTrendingProducts() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    productsApi.getAll({ limit: 8, sortBy: 'createdAt', sortOrder: 'desc' })
      .then((res) => {
        if (mounted) setData(res.data?.products || []);
      })
      .catch((err) => { if (mounted) setError(err); })
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; };
  }, []);

  return { data, isLoading, error };
}

export function useProductsByCategory(categoryId) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(categoryId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) return;
    const loadingTimer = setTimeout(() => setIsLoading(true), 0);
    let mounted = true;
    productsApi.getAll({ categoryId, limit: 50 })
      .then((res) => {
        if (mounted) setData(res.data?.products || []);
      })
      .catch((err) => { if (mounted) setError(err); })
      .finally(() => { if (mounted) setIsLoading(false); clearTimeout(loadingTimer); });
    return () => { mounted = false; clearTimeout(loadingTimer); };
  }, [categoryId]);

  return { data, isLoading, error };
}

export function useProductBySlug(slug) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(slug));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const loadingTimer = setTimeout(() => setIsLoading(true), 0);
    let mounted = true;
    productsApi.getBySlug(slug)
      .then((res) => {
        if (mounted) setData(res.data);
      })
      .catch((err) => { if (mounted) setError(err); })
      .finally(() => { if (mounted) setIsLoading(false); clearTimeout(loadingTimer); });
    return () => { mounted = false; clearTimeout(loadingTimer); };
  }, [slug]);

  return { data, isLoading, error };
}
