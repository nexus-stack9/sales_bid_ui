import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
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
  const [isInWishlist, setIsInWishlist] = useState(product.isWishlisted);
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

  // Update wishlist state when product prop changes
  useEffect(() => {
    setIsInWishlist(product.isWishlisted);
  }, [product.isWishlisted]);

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
    <motion.div className="group relative overflow-hidden w-full font-[Manrope,sans-serif]">
      <Card
        onClick={handleCardClick}
        className="relative overflow-hidden group h-full w-full flex flex-col hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-gray-400 rounded-2xl"
      >
        {viewMode === 'grid' ? (
          <div className="flex flex-col h-full" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {/* Image Container — full coverage, taller */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 rounded-t-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />

              {/* Condition Ribbon — top LEFT */}
              {product.condition && (
                <div className="absolute top-3 left-0 z-10">
                  <div
                    className="bg-gradient-to-r from-[#FF6B3D] to-[#FFB444] text-white text-[8px] font-black uppercase tracking-widest shadow-md pl-2 pr-3 py-[4px]"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)' }}
                  >
                    {product.condition}
                  </div>
                </div>
              )}

              {/* Wishlist Button — top RIGHT (swapped) */}
              <button
                className={`absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-full border transition-colors z-10 ${
                  isInWishlist
                    ? 'bg-white border-red-300 text-red-500 hover:bg-red-50'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500'
                }`}
                onClick={toggleWishlist}
                disabled={isWishlistLoading}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <span
                  className="material-symbols-outlined text-[15px] leading-none"
                  style={{ fontVariationSettings: isInWishlist ? `'FILL' 1` : `'FILL' 0` }}
                >
                  favorite
                </span>
              </button>

              {/* Live Badge */}
              {product.product_live_url && (
                <div className="absolute bottom-2.5 right-2.5 z-10">
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                    </span>
                    Live
                  </div>
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="p-3 flex-1 flex flex-col gap-2">

              {/* Category + Location */}
              <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 overflow-hidden">
                {/* Category */}
                <div title={product.category || 'Category'} className="flex items-center gap-1 pl-1.5 border-l-2 border-[#FF6B3D] min-w-0 flex-1 cursor-default">
                  <span className="material-symbols-outlined text-[11px] text-[#FF6B3D] leading-none shrink-0">category</span>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-600 truncate">
                    {product.category || 'Category'}
                  </span>
                </div>
                {product.location && (
                  <>
                    <span className="text-gray-300 text-[10px] shrink-0">·</span>
                    {/* Location */}
                    <div title={product.location} className="flex items-center gap-1 pl-1.5 border-l-2 border-indigo-400 min-w-0 flex-1 cursor-default">
                      <span className="material-symbols-outlined text-[11px] text-indigo-400 leading-none shrink-0">location_on</span>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-600 truncate">
                        {product.location}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Product Name */}
              <h3
                className="text-[13px] font-black text-gray-900 tracking-tight leading-snug line-clamp-2 group-hover:text-primary transition-colors"
                style={{ fontFamily: 'Manrope, sans-serif' }}
                title={product.name}
              >
                {product.name}
              </h3>

              {/* Bid + MSRP row */}
              <div className="flex items-end justify-between gap-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">Current Bid</span>
                  <span className="text-[13px] font-black text-gray-900 leading-none tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {formatPrice(product.currentBid)}
                  </span>
                </div>
                {product.retail_value && (
                  <div className="flex flex-col gap-0.5 items-end">
                    <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">MSRP</span>
                    <span className="text-[13px] font-bold text-gray-500 leading-none" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {formatPrice(product.retail_value)}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {product.retail_value && (
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF6B3D] to-[#FFB444] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((product.currentBid / product.retail_value) * 100))}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {Math.min(100, Math.round((product.currentBid / product.retail_value) * 100))}% of MSRP
                  </span>
                </div>
              )}

              {/* Divider */}
              <hr className="border-gray-100" />

              {/* Footer: ENDS IN | ACTIVE STATUS */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">Ends In</span>
                  <div className="flex items-center gap-1 text-gray-800">
                    <span className="material-symbols-outlined text-[15px] text-[#FF6B3D] leading-none">timer</span>
                    {timeRemaining > 0 ? (
                      <span className="text-[12px] font-extrabold tabular-nums">
                        {String(Math.floor((timeRemaining % 86400) / 3600)).padStart(2, '0')}:
                        {String(Math.floor((timeRemaining % 3600) / 60)).padStart(2, '0')}:
                        {String(timeRemaining % 60).padStart(2, '0')}
                      </span>
                    ) : (
                      <span className="text-[12px] font-extrabold text-gray-400">Ended</span>
                    )}
                  </div>
                </div>

                <div className="w-px h-6 bg-gray-100" />

                <div className="flex flex-col gap-0.5 items-end">
                  <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest">Active Status</span>
                  <div className="flex items-center gap-1 text-gray-800">
                    <span className="material-symbols-outlined text-[15px] text-gray-500 leading-none">gavel</span>
                    <span className="text-[12px] font-extrabold tabular-nums">{product.totalBids} Offers</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
          ) : (
            <div className="space-y-3 p-4 h-full flex flex-col rounded-lg">
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

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-foreground">{formatPrice(product.currentBid)}</span>
                {product.retail_value !== undefined ? (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.retail_value)}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Current price</span>
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

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm text-primary border-primary/50">
                  <span className="material-symbols-outlined text-[12px] mr-1 text-primary leading-none">gavel</span>
                  {product.totalBids} offers
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
                Place Offer
              </Button>
              {product.buyNowPrice && (
                <Button 
                  variant="outline" 
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