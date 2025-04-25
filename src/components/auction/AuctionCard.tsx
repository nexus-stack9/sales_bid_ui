
import { Link } from 'react-router-dom';
import { Clock, Eye, Star, Heart, ArrowUpRight, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface AuctionCardProps {
  id: string;
  title: string;
  imageUrl: string;
  currentBid: number;
  timeLeft: string;
  watchers: number;
  featured?: boolean;
  category: string;
}

const AuctionCard = ({
  id,
  title,
  imageUrl,
  currentBid,
  timeLeft,
  watchers,
  featured = false,
  category,
}: AuctionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Parse time left for visual styling
  const isEndingSoon = timeLeft.includes('h') && !timeLeft.includes('d');
  
  // Handle favorite toggle
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link to={`/auctions/${id}`}>
      <motion.div
        className={cn(
          "group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-lg",
          featured && "ring-2 ring-amber-400"
        )}
        whileHover={{ 
          y: -5,
          transition: { duration: 0.2 }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Favorite Button */}
        <motion.button
          className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          onClick={handleFavoriteClick}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered || isFavorite ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-colors", 
              isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
            )} 
          />
        </motion.button>
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute left-3 top-3 z-10">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 flex items-center gap-1 px-2 py-1">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              Featured
            </Badge>
          </div>
        )}
        
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Category Badge */}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3">
            <Badge variant="outline" className="bg-white/20 text-white backdrop-blur-sm border-none flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {category}
            </Badge>
          </div>
          
          {/* Time Left Indicator */}
          {isEndingSoon && (
            <div className="absolute right-3 top-3 z-10">
              <Badge variant="destructive" className="animate-pulse">Ending Soon</Badge>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-lg font-medium group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <div className="mb-3 flex items-baseline justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Current Bid</p>
              <p className="text-xl font-bold text-primary">${currentBid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="flex items-center space-x-1 rounded-full bg-muted px-2 py-1 text-sm">
              <Clock className={cn("h-4 w-4", isEndingSoon ? "text-destructive" : "text-muted-foreground")} />
              <span className={cn(isEndingSoon ? "text-destructive font-medium" : "text-muted-foreground")}>{timeLeft}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{watchers} watching</span>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
            >
              <Button size="sm" variant="ghost" className="text-primary">
                View Details <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default AuctionCard;
