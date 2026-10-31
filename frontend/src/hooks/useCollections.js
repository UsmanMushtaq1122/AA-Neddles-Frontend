'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { collectionsApi } from '@/services/collections';

export function useCollections() {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const fetchCollections = useCallback(() => {
    const id = ++requestId.current;
    setIsLoading(true);
    setError(null);

    collectionsApi
      .getAll()
      .then((data) => {
        if (id === requestId.current) {
          setCollections(data);
        }
      })
      .catch((err) => {
        if (id === requestId.current) {
          setError(err instanceof Error ? err.message : 'Failed to load collections');
        }
      })
      .finally(() => {
        if (id === requestId.current) {
          setIsLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return { collections, isLoading, error, refetch: fetchCollections };
}

