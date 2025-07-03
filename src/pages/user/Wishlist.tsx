import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, Clock } from 'lucide-react';
import { placeBid, getUserWishlist, getUserIdFromToken } from '@/services/crudService';
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

// Bid Modal Component
interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBid: number;
  onPlaceBid: (amount: number) => Promise<void>;
  loading: boolean;
}

const BidModal: React.FC<BidModalProps> = ({ isOpen, onClose, currentBid, onPlaceBid, loading }) => {
  const [bidAmount, setBidAmount] = useState<string>("");
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);
    
    if (isNaN(amount)) {
      setError("Please enter a valid number");
      return;
    }
    
    if (amount <= currentBid) {
      setError(`Bid amount must be higher than ${formatPrice(currentBid)}`);
      return;
    }
    
    setError("");
    onPlaceBid(amount);
    setBidAmount(""); // Clear input after submission
  };

  // Ensure only numbers are entered
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and empty string
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setBidAmount(value);
      setError("");
    }
  };

  return (
    <Layout>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center wellcome mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Place Your Bid</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-amber-800">
                  Minimum bid: {formatPrice(currentBid + 50)}
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Your Bid Amount
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="text"
                  id="bidAmount"
                  value={bidAmount}
                  onChange={handleInputChange}
                  className="focus:ring-2 focus:ring-amber-500 focus:border-amber-500 block w-full pl-8 pr-12 py-3 sm:text-sm border-gray-300 rounded-lg"
                  placeholder="0.00"
                  min={currentBid + 1}
                  step="1"
                  required
                  pattern="\d*\.?\d*"
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Current Bid</span>
                <span className="text-sm font-medium text-gray-900">{formatPrice(currentBid)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-gray-900">Your Bid</span>
                <span className="text-amber-600">
                  {bidAmount ? formatPrice(parseFloat(bidAmount)) : '--'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 font-semibold transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Placing Bid...
                  </span>
                ) : 'Place Bid'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
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
      // TODO: Implement API call to remove item from wishlist
      // await removeWishlistItem(itemId);
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: 'Success',
        description: 'Item removed from wishlist.',
      });
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove item from wishlist.',
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
      
      setBidModal({ isOpen: false, productId: 0, currentBid: 0, loading: false, error: null });
      
      // Use refreshWishlist instead of fetchWishlistItems
      await refreshWishlist();
      
      toast({
        title: 'Bid Placed!',
        description: `Your bid of ${formatPrice(amount)} has been placed successfully.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to place bid';
      setBidModal(prev => ({ ...prev, error: errorMessage, loading: false }));
      
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
            <X className="w-12 h-12 text-red-500" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={getFirstImage(item.image_path)}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={(e) => removeFromWishlist(e, item.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-300 shadow-sm"
                      aria-label="Remove from wishlist"
                    >
                      <X className="w-3 h-3 text-gray-700" />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-500">Current Bid</span>
                      <span className="text-xl font-bold text-orange-500">
                        {formatPrice(parseFloat(item.bid_amount))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-500">Retail Value</span>
                      <span className="text-sm font-bold text-gray-700">
                        {item.retail_value ? formatPrice(parseFloat(item.retail_value)) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-500">Time Remaining</span>
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
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => !isAuctionEnded(item.auction_end) && openBidModal(item.product_id, parseFloat(item.bid_amount) || 0)}
                        className={`px-6 py-2 rounded-lg font-semibold transition-all ${
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
        
        <BidModal
          isOpen={bidModal.isOpen}
          onClose={() => setBidModal(prev => ({ ...prev, isOpen: false }))}
          currentBid={bidModal.currentBid}
          onPlaceBid={handlePlaceBid}
          loading={bidModal.loading}
        />
      </div>
    </Layout>
  );
};

export default Wishlist;