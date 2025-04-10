
import { Link } from 'react-router-dom';
import { Home, Package, Heart, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const BottomNav = () => {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-border flex items-center justify-around">
      <Link to="/" className="flex flex-col items-center justify-center w-1/4 text-muted-foreground hover:text-primary">
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <Link to="/auctions" className="flex flex-col items-center justify-center w-1/4 text-muted-foreground hover:text-primary">
        <Package className="h-5 w-5" />
        <span className="text-xs mt-1">Auctions</span>
      </Link>
      <Link to="/user/watchlist" className="flex flex-col items-center justify-center w-1/4 text-muted-foreground hover:text-primary">
        <Heart className="h-5 w-5" />
        <span className="text-xs mt-1">Watchlist</span>
      </Link>
      <Link to="/user/profile" className="flex flex-col items-center justify-center w-1/4 text-muted-foreground hover:text-primary">
        <User className="h-5 w-5" />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </div>
  );
};

export default BottomNav;
