// src/hooks/useResorts.ts
import { useState, useEffect } from 'react';
import { Resort } from '../types/Resort';
import { fetchResorts, fetchResortById } from '../services/resortService';

interface UseResortsReturn {
  resorts: Resort[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing resort data
 * @param limit Maximum number of resorts to fetch (default: 10)
 */
export const useResorts = (limit: number = 10): UseResortsReturn => {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadResorts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchResorts(limit);
      setResorts(data);
    } catch (err) {
      console.error('Failed to fetch resorts:', err);
      setError('Unable to load resort data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load resorts on mount
  useEffect(() => {
    loadResorts();
  }, [limit]);

  return {
    resorts,
    isLoading,
    error,
    refetch: loadResorts
  };
};

interface UseResortReturn {
  resort: Resort | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for fetching and managing a single resort by ID
 * @param resortId ID of the resort to fetch
 */
export const useResort = (resortId: string): UseResortReturn => {
  const [resort, setResort] = useState<Resort | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResort = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchResortById(resortId);
        setResort(data);
      } catch (err) {
        console.error(`Failed to fetch resort with ID ${resortId}:`, err);
        setError('Unable to load resort data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (resortId) {
      loadResort();
    }
  }, [resortId]);

  return {
    resort,
    isLoading,
    error
  };
};