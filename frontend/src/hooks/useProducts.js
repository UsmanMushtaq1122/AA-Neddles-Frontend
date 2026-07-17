'use client';

import { useState, useEffect } from 'react';
import productsData from '@/features/products/products.json';

function useProductQuery(filterFn) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const filtered = productsData.filter(filterFn);
      setData(filtered);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error };
}

export function useFeaturedProducts() {
  return useProductQuery((p) => p.badge === 'featured' || p.isNew);
}

export function useTrendingProducts() {
  return useProductQuery((p) => p.isTrending);
}

export function useWornLovedProducts() {
  return useProductQuery((p) => p.category === 'ready-to-wear');
}
