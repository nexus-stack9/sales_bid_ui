import { Link } from 'react-router-dom';
import { Clock, Eye, Heart, Tag, Gavel } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { addToWishlist, removeFromWishlist, isInWishlist } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';
import Cookies from 'js-cookie';
import { checkWishlistItem, getUserIdFromToken } from '@/services/crudService';

interface AuctionCardProps {
  id: string | number;
  title: string;
  imageUrl: string;
  currentBid?: number;
  msrp?: number;
  timeLeft?: string; // optional override
  watchers: number;
  featured?: boolean;
  category: string;
  location?: string;
  condition?: string;
  bidsPlaced?: number;
  startDate: string; // ISO date
  endDate: string;   // ISO date
  tags?: string[];
}

const AuctionCard = ({
  id,
  title,
  imageUrl,
  currentBid = 0,
  msrp,
  watchers,
  featured = false,
  category,
  location,
  condition,
  bidsPlaced = 0,
  startDate,
  endDate,
}: AuctionCardProps) => {
  const [now, setNow] = useState(new Date());
  const [inWishlist, setInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const { toast } = useToast();
  const isAuthenticated = !!Cookies.get('authToken');

  // India timezone logic
  const getISTDate = (date: string) =>
    new Date(new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

  const isLive = now >= getISTDate(startDate) && now <= getISTDate(endDate);
  const timeRemaining = Math.max(0, getISTDate(endDate).getTime() - now.getTime());

  const formatTimeLeft = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if product is in wishlist on component mount
  useEffect(() => {
    if (isAuthenticated) {
      const checkWishlist = async () => {
        try {
          const result = await checkWishlistItem(String(id), getUserIdFromToken());
          setInWishlist(result);
        } catch (error) {
          console.error('Error checking wishlist status:', error);
        }
      };
      
      checkWishlist();
    }
  }, [id, isAuthenticated]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add items to your wishlist.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsWishlistLoading(true);
    
    try {
      if (inWishlist) {
        await removeFromWishlist(Number(id));
        setInWishlist(false);
        toast({
          title: 'Removed from wishlist',
          description: 'The item has been removed from your wishlist.',
          variant: 'default',
        });
      } else {
        await addToWishlist(Number(id));
        setInWishlist(true);
        toast({
          title: 'Added to wishlist',
          description: 'The item has been added to your wishlist.',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to update wishlist. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <Link to={`/auctions/${id}`}>
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border shadow-sm hover:shadow-md bg-white',
          featured && 'ring-2 ring-amber-400'
        )}
      >
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {featured && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              Featured
            </Badge>
          )}
          {isLive ? (
            <Badge variant="destructive">Live</Badge>
          ) : (
            <Badge className="bg-gray-200 text-gray-700">Upcoming</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm hover:bg-white",
            inWishlist ? "text-red-500 border-red-500" : "text-gray-500 border-gray-300"
          )}
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
        >
          <Heart className={cn("h-4 w-4", inWishlist && "fill-red-500")} />
        </Button>

        {/* Image */}
        <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <img src={imageUrl} alt={title} className="object-cover w-full h-full" />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-md font-semibold leading-tight line-clamp-2 text-gray-800">
            {title}
          </h3>

          {/* Category + Condition */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Badge variant="outline" className="text-gray-700">
              <Tag className="h-3 w-3 mr-1" />
              {category}
            </Badge>
            {condition && (
              <Badge variant="outline" className="text-gray-700">
                {condition}
              </Badge>
            )}
          </div>

          {/* Price and Time */}
          <div className="flex justify-between items-end mt-2">
            <div>
              <p className="text-xs text-gray-500">Current Bid</p>
              <p className="text-lg font-bold text-green-700">
                ₹{typeof currentBid === 'number' ? currentBid.toLocaleString('en-IN') : 'N/A'}
              </p>
              {typeof msrp === 'number' && (
                <p className="text-xs text-gray-400 line-through">
                  MRP ₹{msrp.toLocaleString('en-IN')}
                </p>
              )}
            </div>

            {/* Time left */}
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Ends in: {formatTimeLeft(timeRemaining)}</span>
            </div>
          </div>

          {/* Bottom Info Row */}
          <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{watchers} watching</span>
            </div>
            <div className="flex items-center gap-1">
              <Gavel className="h-4 w-4" />
              <span>{bidsPlaced} bids</span>
            </div>
          </div>

          {/* Action */}
          <Button variant="outline" className="w-full mt-3 text-blue-600 border-blue-600">
            View Auction
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;
