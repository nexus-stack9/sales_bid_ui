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
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if the click was on a button or link
    const target = e.target as HTMLElement;
    if (target.closest('button, a, [role="button"]')) {
      return;
    }
    navigate(`/auctions/${product.id}`);
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
    <motion.div className="group relative overflow-hidden">
      <Card 
        onClick={handleCardClick}
        className="relative overflow-hidden group h-auto w-full max-w-[380px] flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      >
        {viewMode === 'grid' ? (
          <div className="flex flex-col h-full">
            {/* Image Container */}
            <div className="relative w-full pt-[75%] overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />

              {/* Ribbon for Condition */}
              <div className="absolute top-3 left-0 bg-primary text-white text-xs font-semibold px-2 py-1 shadow-sm">
                <div className="absolute left-0 bottom-0 w-0 h-0 border-b-[8px] border-b-transparent border-r-[8px] border-r-primary -mb-1 -ml-1"></div>
                {product.condition}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col">
              <div className="space-y-2"> {/* Reduced space-y from 3 to 2 */}
                {/* Title with tooltip */}
                <div className="relative group/title">
                  <h3 
                    className="font-semibold text-card-foreground group-hover:text-primary transition-colors duration-200 text-base leading-tight whitespace-nowrap overflow-hidden text-ellipsis"
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

                {/* Location Tag */}
                <div className="inline-flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 transition-colors duration-200 rounded-full px-3 py-1 max-w-full border border-blue-200">
                  <MapPin className="h-3 w-3 text-blue-700 flex-shrink-0" />
                  <span className="text-xs font-semibold text-blue-900 truncate" title={product.location}>
                    {product.location}
                  </span>
                </div>

                {/* Current Bid and Price */}
                <div className="flex items-center justify-between pt-1"> 
                  {product.retail_value !== undefined ? (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.retail_value)}
                    </span>
                  ) : (
                    <span className="text-base font-medium text-foreground">Current Bid</span>
                  )}
                  <div className="text-base font-semibold text-primary">
                    {formatPrice(product.currentBid)}
                  </div>
                </div>

                {/* Total Bids and Time Left */}
                <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
                  <div className="flex items-center gap-1 text-primary">
                    <Gavel className="h-3 w-3" />
                    <span>{product.totalBids} bids</span>
                  </div>
                  {timeRemaining > 0 ? (
                    <div className="flex items-center gap-1 text-primary">
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
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Ended</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-4 h-full flex flex-col"> {/* Reduced space-y from 4 to 3 */}
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full rounded-lg"
                />
                {/* Ribbon for List View */}
                <div className="absolute top-0 left-0 bg-primary text-white text-xs font-semibold px-2 py-1 shadow-sm">
                  <div className="absolute left-0 bottom-0 w-0 h-0 border-b-[8px] border-b-transparent border-r-[8px] border-r-primary -mb-1 -ml-1"></div>
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