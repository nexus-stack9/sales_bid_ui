import { useState, useEffect } from 'react';
import { getWishlist } from '@/services/productService';
import Cookies from 'js-cookie';

export const useWishlist = () => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = !!Cookies.get('authToken');

  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (!isAuthenticated) {
        setWishlistCount(0);
        return;
      }

      try {
        setIsLoading(true);
        const wishlistItems = await getWishlist();
        setWishlistCount(wishlistItems.length);
        setError(null);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to fetch wishlist');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistCount();
  }, [isAuthenticated]);

  return { wishlistCount, isLoading, error };
};