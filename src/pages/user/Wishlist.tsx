import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, X as XIcon } from 'lucide-react';
import { placeBid, getUserWishlist, getUserIdFromToken, removeFromWishlist as removeFromWishlistAPI } from '@/services/crudService';
import { useWishlist } from '@/hooks/use-wishlist';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';

interface WishlistItem {
  id: number;
  product_id: number;
  name: string;
  description: string;
  image_path: string;
  category_id: number;
  status: string;
  bid_amount: string;
  retail_value: string;
  auction_end: string;
  location?: string;
  quantity?: number;
}

// Format price helper function
const formatPrice = (price: number | string): string => {
  let priceNumber: number;
  if (typeof price === 'string') {
    priceNumber = parseFloat(price);
    if (isNaN(priceNumber)) return '₹ 0';
  } else {
    priceNumber = price;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(priceNumber).replace('₹', '₹ ');
};

import BidModal from './BidModal';

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { triggerWishlistUpdate } = useWishlist();
  const [bidModal, setBidModal] = useState({
    isOpen: false,
    productId: 0,
    currentBid: 0,
    loading: false,
    error: null as string | null,
  });

  // Track initial load with a ref
  const hasFetched = React.useRef(false);

  // Fetch wishlist items only once on component mount
  useEffect(() => {
    // Skip if we've already fetched
    if (hasFetched.current) return;
    
    const fetchWishlistItems = async () => {
      try {
        setIsLoading(true);
        const userId = getUserIdFromToken();
        if (!userId) {
          throw new Error('User not authenticated');
        }
        const response = await getUserWishlist(userId);
        // Assuming the API returns an object with a 'data' property containing the array
        const items = Array.isArray(response.data) ? response.data : [];
        setWishlistItems(items);
        setError(null);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist. Please try again.');
        setWishlistItems([]);
        // Only show toast on initial load if there's an error
        if (!hasFetched.current) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to load wishlist. Please try again.',
          });
        }
      } finally {
        setIsLoading(false);
        hasFetched.current = true;
      }
    };

    fetchWishlistItems();
    
    // This effect should only run once on mount
    // We're intentionally not including toast in the dependencies
    // because we only want to run this effect once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This function is used by other handlers that need to refresh the wishlist
  const refreshWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const response = await getUserWishlist(userId);
      const items = Array.isArray(response.data) ? response.data : [];
      setWishlistItems(items);
      setError(null);
    } catch (err) {
      console.error('Error refreshing wishlist:', err);
      setError('Failed to refresh wishlist. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to refresh wishlist. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const removeFromWishlist = async (e: React.MouseEvent, itemId: number) => {
    e.stopPropagation();
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Find the item to get the product_id
      const itemToRemove = wishlistItems.find(item => item.id === itemId);
      if (!itemToRemove) {
        throw new Error('Item not found in wishlist');
      }
      
      await removeFromWishlistAPI(itemToRemove.product_id.toString(), userId);
      
      // Update UI optimistically
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      
      // Update wishlist count in Navbar
      triggerWishlistUpdate();
      
      toast({
        title: 'Success',
        description: 'Item removed from wishlist.',
      });
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to remove item from wishlist.',
      });
    }
  };

  const handlePlaceBid = async (amount: number) => {
    try {
      setBidModal(prev => ({ ...prev, loading: true, error: null }));
      
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      await placeBid(bidModal.productId.toString(), amount);
      
      // Close the modal and refresh data
      setBidModal(prev => ({ ...prev, isOpen: false, loading: false }));
      
      // Show success message
      toast({
        title: 'Bid Placed!',
        description: `Your bid of ₹${amount.toLocaleString('en-IN')} has been placed successfully.`,
      });
      
      // Refresh wishlist and trigger any necessary updates
      refreshWishlist();
      triggerWishlistUpdate();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to place bid';
      setBidModal(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    }
  };

  const openBidModal = (productId: number, currentBid: number) => {
    setBidModal({
      isOpen: true,
      productId,
      currentBid,
      loading: false,
      error: null
    });
  };

  const getTimeRemaining = (endDate: string): string => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const isAuctionEnded = (endDate: string): boolean => {
    return new Date(endDate).getTime() < new Date().getTime();
  };

  const getFirstImage = (imagePath: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop";
    
    const images = imagePath.split(',');
    return images[0] || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="bg-gray-200 w-full h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XIcon className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Browse our luxury auctions and add items to your wishlist to keep track of what you love.
              </p>
              <button 
                onClick={() => navigate('/auctions')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
              >
                Browse Auctions
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow w-[320px] sm:w-auto sm:max-w-[280px] mx-auto"
                >
                  <div className="relative pt-[75%] overflow-hidden">
                    <img
                      src={getFirstImage(item.image_path)}
                      alt={item.name}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => removeFromWishlist(e, item.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-300 shadow-sm"
                      aria-label="Remove from wishlist"
                    >
                      <XIcon className="w-3 h-3 text-gray-700" />
                    </button>
                  </div>

                  <div className="p-5 border-t border-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-600">Current Bid</span>
                      <span className="text-sm font-bold text-primary">
                        {formatPrice(parseFloat(item.bid_amount))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-600">Retail Value</span>
                      <span className="text-sm font-bold text-gray-700">
                        {item.retail_value ? formatPrice(parseFloat(item.retail_value)) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-600">Time Remaining</span>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4" />
                        {isAuctionEnded(item.auction_end) ? (
                          <span className="text-red-500 font-medium">Ended</span>
                        ) : (
                          <span>{getTimeRemaining(item.auction_end)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/auctions/${item.product_id}`)}
                        className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-bold text-sm"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => !isAuctionEnded(item.auction_end) && openBidModal(item.product_id, parseFloat(item.bid_amount) || 0)}
                        className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                          isAuctionEnded(item.auction_end)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-lg'
                        }`}
                        disabled={isAuctionEnded(item.auction_end)}
                      >
                        {isAuctionEnded(item.auction_end) ? 'Ended' : 'Bid Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {bidModal.isOpen && (
          <BidModal
            isOpen={bidModal.isOpen}
            onClose={() => setBidModal(prev => ({ ...prev, isOpen: false }))}
            currentBid={bidModal.currentBid}
            productId={bidModal.productId}
            onBidSuccess={async () => {
              await refreshWishlist();
              triggerWishlistUpdate();
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;