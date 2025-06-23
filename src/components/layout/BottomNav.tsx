
import { Link } from 'react-router-dom';
import { Home, Package, Heart, User, LogIn } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import Cookies from 'js-cookie';

const BottomNav = () => {
  const isMobile = useIsMobile();
  const isAuthenticated = !!Cookies.get('authToken');
  
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
      <Link 
        to={isAuthenticated ? "/user/wishlist" : "/signin"} 
        className="flex flex-col items-center justify-center w-1/4 text-muted-foreground hover:text-primary"
      >
        <div className="relative">
          <Heart className={`h-5 w-5 ${isAuthenticated ? "text-primary" : ""}`} />
          {isAuthenticated && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[10px] text-white"></span>
          )}
        </div>
        <span className="text-xs mt-1">Wishlist</span>
      </Link>
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
