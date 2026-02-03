import { useContext } from 'react';
import { WishlistContext } from '@/context/WishlistContext';
import type { WishlistContextType } from '@/context/wishlist.types';

// Default values when context is not available
const DEFAULT_CONTEXT: WishlistContextType = {
  wishlistCount: 0,
  ordersCount: 0,
  pathname: '',
  lastUpdate: 0,
  updateCounts: async () => {},
  refreshWishlist: async () => 0,
  updatePathname: () => {},
  triggerWishlistUpdate: () => {}
};

/**
 * Custom hook to access the wishlist context
 * @returns Wishlist context with wishlistCount and refreshWishlist
 */
export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  
  // Return default values if context is not available instead of throwing an error
  if (!context) {
    console.warn('useWishlist used outside of WishlistProvider - using default values');
    return DEFAULT_CONTEXT;
  }

  return context;
};