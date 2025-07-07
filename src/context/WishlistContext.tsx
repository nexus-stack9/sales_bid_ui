import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react';
import Cookies from 'js-cookie';
import { getUserIdFromToken } from '@/services/crudService';
import { getWishlist, getUserProductCounts } from '@/services/productService';
import { handleApiError } from '@/utils/auth';
import { WishlistContextType, WISHLIST_UPDATE_EVENT } from './wishlist.types';
import { UserProductCounts } from '@/services/productService';

// Create a stable reference for the context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// This component manages the wishlist state and provides it to the app
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [bidsCount, setBidsCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [pathname, setPathname] = useState('');

  // Update pathname when it changes (this will be set by the RouterWrapper)
  const updatePathname = useCallback((newPathname: string) => {
    setPathname(newPathname);
  }, []);

  // Update both wishlist and bids counts
  const updateCounts = useCallback(async () => {
    try {
      const userId = Cookies.get('userId');
      if (!userId) {
        setWishlistCount(0);
        setBidsCount(0);
        return;
      }

      // Always fetch the latest counts regardless of the current route
      const response = await getUserProductCounts(userId);
      if (response.success && response.data) {
        setWishlistCount(response.data.wishlist_count || 0);
        setBidsCount(response.data.bids_count || 0);
      }
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  const fetchWishlistCount = useCallback(async (): Promise<number> => {
    const token = Cookies.get('authToken');
    if (!token) {
      setWishlistCount(0);
      return 0;
    }

    try {
      const response = await getWishlist();
      let count = 0;
      
      if (response && typeof response === 'object') {
        if ('count' in response && typeof response.count === 'number') {
          count = response.count;
        } else if (Array.isArray(response)) {
          count = response.length;
        } else if ('data' in response && Array.isArray(response.data)) {
          count = response.data.length;
        }
      }
      
      // Only update if the count has actually changed
      setWishlistCount(prevCount => {
        if (prevCount !== count) {
          return count;
        }
        return prevCount;
      });
      return count;
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
      setWishlistCount(0);
      return 0;
    }
  }, []);

  const refreshWishlist = useCallback(async (): Promise<number> => {
    setLastUpdate(Date.now());
    return fetchWishlistCount();
  }, [fetchWishlistCount]);

  // Initial fetch and auth change handler
  useEffect(() => {
    const initialize = async () => {
      await updateCounts();
      setIsInitialized(true);
    };
    
    initialize();
    
    // Also update counts when auth token changes
    const handleAuthChange = () => {
      updateCounts();
    };
    
    // Listen for auth changes
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [updateCounts]);

  // Only fetch wishlist count when needed
  useEffect(() => {
    if (isInitialized) {
      const currentPath = window.location.pathname;
      const shouldFetch = currentPath.startsWith('/user/wishlist') || 
                        currentPath === '/my-bids' || 
                        currentPath === '/';
      
      if (shouldFetch) {
        fetchWishlistCount();
      }
    }
  }, [pathname, isInitialized, lastUpdate, fetchWishlistCount]);



  // Update counts on mount and when auth state changes
  useEffect(() => {
    const checkAuthAndUpdateCounts = async () => {
      const userId = getUserIdFromToken();
      console.log('Auth state changed, userId:', userId);
      if (userId) {
        try {
          const response = await getUserProductCounts(userId);
          console.log('Counts updated:', response);
          if (response.success && response.data) {
            setWishlistCount(response.data.wishlist_count || 0);
            setBidsCount(response.data.bids_count || 0);
          }
        } catch (error) {
          console.error('Error updating counts:', error);
        }
      } else {
        setWishlistCount(0);
        setBidsCount(0);
      }
    };

    // Initial load
    checkAuthAndUpdateCounts();
    
    // Set up event listener for manual updates
    const handleWishlistUpdate = () => {
      checkAuthAndUpdateCounts();
    };
    
    window.addEventListener('wishlist-update', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlist-update', handleWishlistUpdate);
    };
  }, []);

  // Create a stable context value that includes the updatePathname function
  const contextValue = useMemo(() => ({
    wishlistCount,
    bidsCount,
    refreshWishlist: fetchWishlistCount,
    updatePathname,
    pathname,
    lastUpdate,
    triggerWishlistUpdate: () => {
      fetchWishlistCount();
      updateCounts();
      setLastUpdate(Date.now());
      // Dispatch a custom event that other components can listen to
      window.dispatchEvent(new Event(WISHLIST_UPDATE_EVENT));
    },
    updateCounts,
  }), [wishlistCount, bidsCount, fetchWishlistCount, updatePathname, pathname, lastUpdate, updateCounts]);

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

// Export the context for direct usage
export const WishlistContextExport = WishlistContext;
export { WishlistContext };
