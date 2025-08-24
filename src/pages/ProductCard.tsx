import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Tag, Clock, Gavel, Hourglass } from 'lucide-react';
import { FaClock as FaClockIcon } from 'react-icons/fa';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/auction';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import { addToWishlist, removeFromWishlist, checkWishlistItem, getUserIdFromToken } from "@/services/crudService";
import { toast } from '@/components/ui/use-toast';
import { useWishlist } from '@/hooks/use-wishlist';

dayjs.extend(relativeTime);
dayjs.extend(duration);

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const formatPrice = (amount: number): string => {
  return '₹' + amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const { triggerWishlistUpdate } = useWishlist();
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if the click was on a button or link
    const target = e.target as HTMLElement;
    if (target.closest('button, a, [role="button"]')) {
      return;
    }
    // Scroll to top before navigating
    window.scrollTo(0, 0);
    navigate(`/auctions/${product.id}`);
  };

  // Check wishlist status on component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const userId = getUserIdFromToken();
        if (!userId) return;
        
        const isInWishlist = await checkWishlistItem(product.id.toString(), userId);
        setIsInWishlist(isInWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [product.id]);

  // Toggle wishlist status
  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      setIsWishlistLoading(true);
      const userId = getUserIdFromToken();
      
      if (!userId) {
        toast({
          variant: 'default',
          title: 'Sign in required',
          description: 'Please sign in to add to wishlist',
          className: 'bg-white border border-gray-200 text-foreground shadow-lg'
        });
        return;
      }

      if (isInWishlist) {
        await removeFromWishlist(product.id.toString(), userId);
        setIsInWishlist(false);
        await triggerWishlistUpdate();
        toast({
          title: 'Success',
          description: 'Removed from wishlist',
          className: 'bg-white border border-green-200 text-foreground shadow-lg'
        });
      } else {
        await addToWishlist(product.id.toString(), userId);
        setIsInWishlist(true);
        await triggerWishlistUpdate();
        toast({
          title: 'Success',
          description: 'Added to wishlist',
          className: 'bg-white border border-green-200 text-foreground shadow-lg'
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        variant: 'default',
        title: 'Error',
        description: 'Failed to update wishlist',
        className: 'bg-white border border-red-200 text-foreground shadow-lg'
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = dayjs();
      const endTime = dayjs(product.timeLeft);
      const diffInSeconds = Math.max(0, Math.floor(endTime.diff(now) / 1000));
      
      setTimeRemaining(diffInSeconds);
      setIsUrgent(diffInSeconds <= 3600); // Less than 1 hour
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [product.timeLeft]);

  return (
    <motion.div className="group relative overflow-hidden w-full">
      <Card 
        onClick={handleCardClick}
        className="relative overflow-hidden group h-full w-full max-w-none sm:max-w-[280px] flex flex-col hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-primary/20 hover:shadow-primary/10"
      >
        {viewMode === 'grid' ? (
          <div className="flex flex-col h-full">
            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Condition Ribbon */}
              <div className="absolute left-0 top-2 w-auto overflow-hidden z-10">
                <div className="bg-primary text-white text-[10px] font-medium py-0.5 px-2 relative shadow-sm">
                  <div className="absolute -left-1 top-0 w-0 h-0 border-t-5 border-t-primary border-r-5 border-r-transparent"></div>
                  <div className="absolute -right-1 top-0 w-0 h-0 border-b-5 border-b-primary border-l-5 border-l-transparent"></div>
                  <div className="relative z-10 text-center whitespace-nowrap">
                    {product.condition}
                  </div>
                </div>
              </div>
              
              {/* Wishlist Button */}
              <button 
                className={`absolute top-2 right-2 p-2 rounded-full transition-colors z-10 ${
                  isInWishlist 
                    ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                    : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                }`}
                onClick={toggleWishlist}
                disabled={isWishlistLoading}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart 
                  className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} 
                />
              </button>
            </div>

            {/* Content */}
            <div className="p-3 flex-1 flex flex-col">
              {/* Title */}
              <div className="mb-2">
                <h3 
                  className="font-semibold text-gray-900 text-[15px] leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors"
                  title={product.name}
                >
                  {product.name}
                </h3>
                
                {/* Category and Location Row */}
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  {/* Category Tag */}
                  <span className="inline-flex items-center bg-blue-50/80 text-blue-800 text-[12px] font-bold px-2 py-0.5 rounded-md border border-blue-100 transition-colors">
                    <svg className="w-2 h-2 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    {product.category || 'Category'}
                  </span>
                  
                  {/* Location Tag */}
                  <div className="flex items-center gap-1 text-[12px] text-gray-800 bg-gray-200 px-2 py-0.5 rounded-md border border-gray-300">
                    <MapPin className="h-2.5 w-2.5 text-gray-900" />
                    <span className="truncate max-w-[90px] font-bold" title={product.location}>
                      {product.location}
                    </span>
                  </div>
                </div>
              </div>

                {/* Progress Bar */}
                {product.retail_value && (
                  <div className="space-y-1.5 mb-2">
                    <div className="flex items-center justify-between text-xs">
                    <span className="text-xs font-medium text-primary">
                      {Math.round((product.currentBid / product.retail_value) * 100)}% of MSRP
                    </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-500 shadow-sm" 
                        style={{ width: `${Math.min(100, (product.currentBid / product.retail_value) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Current Bid and Retail Price */}
                <div className="space-y-1.5 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Current Bid</span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatPrice(product.currentBid)}
                    </span>
                  </div>
                  {product.retail_value && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">MSRP</span>
                      <span className="text-xs text-gray-500">
                        {formatPrice(product.retail_value)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bids and Time Left */}
                <div className="flex items-center justify-center gap-4 text-xs pt-2.5 mt-auto border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Gavel className="h-3.5 w-3.5 text-gray-700" />
                    <span className="text-gray-800">{product.totalBids} Bids</span>
                  </div>
                  <div className="h-3 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-1.5">
                    <FaClockIcon className="h-3.5 w-3.5 text-gray-700" />
                    {timeRemaining > 0 ? (
                      <span className="text-gray-800">
                        {Math.floor(timeRemaining / 86400) > 0 && `${Math.floor(timeRemaining / 86400)}d `}
                        {Math.floor((timeRemaining % 86400) / 3600)}h {Math.floor((timeRemaining % 3600) / 60)}m left
                      </span>
                    ) : (
                      <span className="text-gray-800">Ended</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 p-4 h-full flex flex-col">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full rounded-lg"
                  />
                  {/* Condition Badge */}
                  <div className="absolute top-1 left-1 bg-primary text-white text-[10px] font-medium px-1.5 py-0.5 rounded-sm">
                    {product.condition}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                <div className="relative group/title">
                  <h3 
                    className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{
                      maxWidth: '100%',
                      display: 'block'
                    }}
                    title={product.name}
                  >
                    {product.name}
                  </h3>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/title:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap max-w-xs">
                    {product.name}
                  </div>
                </div>
                <div className="mt-1">
                  <div className="inline-flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 transition-colors duration-200 rounded-full px-3 py-1 max-w-full border border-blue-200">
                    <MapPin className="h-3 w-3 text-blue-700 flex-shrink-0" />
                    <span className="text-xs font-semibold text-blue-900 truncate" title={product.location}>
                      {product.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1"> {/* Added pt-1 for tighter spacing */}
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-foreground">{formatPrice(product.currentBid)}</span>
                {product.retail_value !== undefined ? (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.retail_value)}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Current bid</span>
                )}
              </div>
              {timeRemaining > 0 ? (
                <div className="flex items-center gap-1 text-xs bg-blue-50 px-2 py-1 rounded">
                  <FaClockIcon className="h-3 w-3" />
                  <div className="flex items-center">
                    {timeRemaining >= 86400 && (
                      <>
                        <span className="font-semibold">
                          {Math.floor(timeRemaining / 86400).toString().padStart(2, '0')}
                        </span>
                        <span className="font-semibold text-gray-600 ml-0.5">d</span>
                        <span className="mx-0.5 text-gray-400">:</span>
                      </>
                    )}
                    <span className="font-semibold">
                      {Math.floor((timeRemaining % 86400) / 3600).toString().padStart(2, '0')}
                    </span>
                    <span className="font-semibold text-gray-600 ml-0.5">h</span>
                    <span className="mx-0.5 text-gray-400">:</span>
                    <span className="font-semibold">
                      {Math.floor((timeRemaining % 3600) / 60).toString().padStart(2, '0')}
                    </span>
                    <span className="font-semibold text-gray-600 ml-0.5">m</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Ended</div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1"> {/* Added pt-1 for tighter spacing */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm text-primary border-primary/50">
                  <Gavel className="h-3 w-3 mr-1 text-primary" />
                  {product.totalBids} bids
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // if (wishlisted) {
                    //   removeFromWishlist(product.id);
                    // } else {
                    //   addToWishlist(product.id);
                    // }
                  }}
                  className="rounded-full hover:bg-gray-100 transition-colors p-1"
                >
                  <Heart className={`h-4 w-4 ${/* wishlisted ? 'text-red-500' : */ 'text-muted-foreground'}`} />
                </Button>
              </div>
            </div>

            {/* Action Buttons for List View */}
            <div className="flex gap-2 pt-2 mt-auto">
              <Button 
                className={`bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white border-0 text-sm font-semibold ${
                  product.buyNowPrice ? 'flex-1' : 'w-full'
                }`}
                size="sm"
              >
                Place Bid
              </Button>
              {product.buyNowPrice && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="px-3 border-black text-black hover:bg-black hover:text-white text-sm font-semibold"
                >
                  Buy {formatPrice(product.buyNowPrice)}
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ProductCard;