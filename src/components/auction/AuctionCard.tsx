
import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  return (
    <Link to={`/auctions/${id}`} className="block">
      <div
        className={cn(
          "auction-card group",
          featured && "ring-2 ring-secondary"
        )}
      >
        {featured && (
          <div className="absolute top-2 right-2 z-10">
            <span className="badge badge-secondary">Featured</span>
          </div>
        )}
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="auction-image transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
            <span className="badge badge-primary">{category}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-lg font-medium">{title}</h3>
          <div className="mb-2 flex items-baseline justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Bid</p>
              <p className="text-lg font-semibold">${currentBid.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{timeLeft}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{watchers} watching</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;
