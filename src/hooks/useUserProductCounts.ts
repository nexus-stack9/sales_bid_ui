import { useState, useEffect, useCallback } from 'react';
import { getUserProductCounts } from '../services/productService';
import { getUserIdFromToken } from '../services/crudService';

export const useUserProductCounts = () => {
  const [counts, setCounts] = useState({
    wishlist_count: 0,
    bids_count: 0,
    loading: true,
    error: null as string | null
  });

  const fetchCounts = useCallback(async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        setCounts(prev => ({ ...prev, loading: false, error: 'User not authenticated' }));
        return;
      }

      const response = await getUserProductCounts(userId);
      if (response.success && response.data) {
        setCounts(prev => ({
          ...prev,
          ...response.data,
          loading: false,
          error: null
        }));
      }
    } catch (error) {
      console.error('Error fetching user counts:', error);
      setCounts(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch user counts'
      }));
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Function to update counts after actions
  const updateCounts = useCallback(() => {
    fetchCounts();
  }, [fetchCounts]);

  return {
    ...counts,
    updateCounts
  };
};
