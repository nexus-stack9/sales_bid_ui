import { Link } from 'react-router-dom';
import { Home, Package, ShoppingCart, User, LogIn, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWishlist } from '@/hooks/use-wishlist';
import Cookies from 'js-cookie';

const BottomNav = () => {
  const isMobile = useIsMobile();
  const isAuthenticated = !!Cookies.get('authToken');
  const { bidsCount, wishlistCount } = useWishlist();
  
  if (!isMobile) return null;
  
  return (
    <div className="bottom-nav fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-border flex items-center justify-around">
      <Link to="/" className="flex flex-col items-center justify-center w-1/4 text-muted-foreground hover:text-primary">
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <Link 
        to="/auctions" 
        className="flex flex-col items-center justify-center w-1/4 text-muted-foreground hover:text-primary"
      >
        <Package className="h-5 w-5" />
        <span className="text-xs mt-1">Marketplace</span>
      </Link>
      <Link 
        to="/user/wishlist" 
        className="flex flex-col items-center justify-center w-1/4 text-muted-foreground hover:text-primary relative"
      >
        <div className="relative">
          <Heart className="h-5 w-5" />
          {isAuthenticated && wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {wishlistCount > 9 ? '9+' : wishlistCount}
            </span>
          )}
        </div>
        <span className="text-xs mt-1">Wishlist</span>
      </Link>
      {/* <Link 
        to="/my-bids" 
        className="flex flex-col items-center justify-center w-1/4 text-muted-foreground hover:text-primary relative"
      >
        <div className="relative">
          <ShoppingCart className="h-5 w-5" />
          {isAuthenticated && bidsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {bidsCount > 9 ? '9+' : bidsCount}
            </span>
          )}
        </div>
        <span className="text-xs mt-1">My Bids</span>
      </Link> */}
      <Link 
        to={isAuthenticated ? "/user/profile" : "/signin"} 
        className="flex flex-col items-center justify-center w-1/4 text-muted-foreground hover:text-primary"
      >
        {isAuthenticated ? (
          <>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5" />
            <span className="text-xs mt-1">Sign In</span>
          </>
        )}
      </Link>
    </div>
  );
};

export default BottomNav;