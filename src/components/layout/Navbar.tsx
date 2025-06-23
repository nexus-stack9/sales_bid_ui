import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWishlist } from "@/hooks/use-wishlist";
import salesBidLogo from "@/assets/logo.png";
import {
  Search,
  Menu,
  X,
  ShoppingCart,
  Bell,
  User,
  ChevronDown,
  Heart,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Cookies from "js-cookie";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { wishlistCount } = useWishlist();

  // Check for token in cookies
  const token = Cookies.get("authToken");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-sm border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src={salesBidLogo}
            alt="Sales Bid Logo"
            className="h-12 w-auto object-contain"
          />
          {/* <span className="font-display text-2xl font-bold">Sales Bid</span> */}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <button className="nav-link flex items-center">
                Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <Link
                    to="/categories/electronics"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Electronics
                  </Link>
                  <Link
                    to="/categories/apparel"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Apparel
                  </Link>
                  <Link
                    to="/categories/home-goods"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Home Goods
                  </Link>
                  <Link
                    to="/categories/jewelry"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Jewelry
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/auctions" className="nav-link">
              All Auctions
            </Link>
            <Link to="/how-it-works" className="nav-link">
              How It Works
            </Link>
          </div>
        </nav>

        {/* Search and User Actions */}
        <div className="flex items-center space-x-2">
          {isMobile ? (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Link to="/cart">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search auctions..."
                className="pl-10 h-9 w-64 rounded-md border border-input bg-background px-3"
              />
            </div>
          )}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Link to={token ? "/user/wishlist" : "/signin"}>
              <Button variant="ghost" size="icon" className="relative">
                <Heart className={`h-5 w-5 ${token ? "text-primary fill-primary" : ""}`} />
                {token && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            {token ? (
              <Link to="/user/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/signin">
                <Button
                  variant="default"
                  className="bg-primary hover:bg-primary-600 text-white"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px] bg-white">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="flex flex-col space-y-4">
                  <Link to="/categories" className="text-lg font-medium">
                    Categories
                  </Link>
                  <Link to="/auctions" className="text-lg font-medium">
                    All Auctions
                  </Link>
                  <Link to="/how-it-works" className="text-lg font-medium">
                    How It Works
                  </Link>
                  <hr className="my-2" />
                  <Link
                    to="/cart"
                    className="text-lg font-medium flex items-center"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Cart
                  </Link>
                  <Link
                    to={token ? "/user/wishlist" : "/signin"}
                    className="text-lg font-medium flex items-center"
                  >
                    <Heart className={`mr-2 h-5 w-5 ${token ? "text-primary fill-primary" : ""}`} /> 
                    Wishlist {!token && "(Sign in required)"}
                  </Link>
                  {token ? (
                    <Link
                      to="/user/profile"
                      className="text-lg font-medium flex items-center"
                    >
                      <User className="mr-2 h-5 w-5" /> Profile
                    </Link>
                  ) : (
                    <Link
                      to="/signin"
                      className="text-lg font-medium flex items-center"
                    >
                      <User className="mr-2 h-5 w-5" /> Sign In
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
