import { useContext } from 'react';
import { WishlistContext } from '@/context/WishlistContext';
import type { WishlistContextType } from '@/context/wishlist.types';

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
