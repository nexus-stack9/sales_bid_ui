import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Tag, Clock, Gavel, Hourglass } from 'lucide-react';
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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = dayjs();
      const endTime = dayjs(product.timeLeft);
      const diff = endTime.diff(now);

      if (diff <= 0) {
        setTimeLeft('Ended');
        return;
      }

      const duration = dayjs.duration(diff);
      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }

      setIsUrgent(diff <= 3600000); // Less than 1 hour
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [product.timeLeft]);

//   const handleWishlistClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (wishlisted) {
//       removeFromWishlist(product.id);
//     } else {
//       addToWishlist(product.id);
//     }
//   };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div className="group relative overflow-hidden">
      <Card className="relative overflow-hidden group h-[400px] flex flex-col">
        {viewMode === 'grid' ? (
          <div className="flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gradient-surface">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Condition Badge */}
              <Badge 
                variant="secondary" 
                className="absolute top-3 left-3 bg-white/90 text-foreground backdrop-blur-sm"
              >
                {product.condition}
              </Badge>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Title with tooltip */}
                <div className="relative group/title">
                  <h3 
                    className="font-semibold text-card-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 overflow-hidden"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: '1.4',
                      maxHeight: '2.8em'
                    }}
                    title={product.name}
                  >
                    {product.name}
                  </h3>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover/title:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap max-w-xs">
                    {product.name}
                  </div>
                </div>

                {/* Location */}
                {/* <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{product.location}</span>
                </div> */}

                {/* Current Bid and Price */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Bid</span>
                  <div className="text-xl font-bold text-black">
                    {formatPrice(product.currentBid)}
                  </div>
                </div>

                {/* Total Bids and Time Left */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Gavel className="h-3 w-3" />
                    <span>{product.totalBids} bids</span>
                  </div>
                  <div className="flex items-center gap-1 text-foreground font-medium">
                    <Hourglass className="h-3 w-3" />
                    <span>{timeLeft}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 mt-auto">
                <Button 
                  className={`bg-blue-600 hover:bg-blue-700 text-white border-0 ${
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
                    className="px-4 border-gold text-gold hover:bg-gold hover:text-gold-foreground"
                  >
                    Buy {formatPrice(product.buyNowPrice)}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-4 h-full flex flex-col">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              <div className="flex-1">
                <div className="relative group/title">
                  <h3 
                    className="text-lg font-semibold line-clamp-2 overflow-hidden"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: '1.4',
                      maxHeight: '2.8em'
                    }}
                    title={product.name}
                  >
                    {product.name}
                  </h3>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover/title:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap max-w-xs">
                    {product.name}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{product.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-black">${formatPrice(product.currentBid)}</span>
                <span className="text-sm text-muted-foreground">Starting bid</span>
              </div>
              <div className="flex items-center gap-2">
                <Hourglass className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{timeLeft}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20">
                  {product.condition}
                </Badge>
                <Badge variant="destructive">
                  <Gavel className="h-4 w-4 mr-1" />
                  {product.totalBids} bids
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    // if (wishlisted) {
                    //   removeFromWishlist(product.id);
                    // } else {
                    //   addToWishlist(product.id);
                    // }
                  }}
                  className="rounded-full hover:bg-gold/10 transition-colors"
                >
                  <Heart className={`h-5 w-5 ${/* wishlisted ? 'text-gold' : */ 'text-muted-foreground'}`} />
                </Button>
              </div>
            </div>

            {/* Action Buttons for List View */}
            <div className="flex gap-2 pt-2 mt-auto">
              <Button 
                className={`bg-blue-600 hover:bg-blue-700 text-white border-0 ${
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
                  className="px-4 border-gold text-gold hover:bg-gold hover:text-gold-foreground"
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