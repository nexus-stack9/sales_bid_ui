import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCategories } from '@/context/useCategories';
import salesBidLogo from "@/assets/logo.png";
import { Search, Menu, X, ShoppingCart, Bell, User, ChevronDown, Heart, Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const isMobile = useIsMobile();
  const { wishlistCount, bidsCount } = useWishlist();
  const { categories, loading: categoriesLoading } = useCategories();
  const navigate = useNavigate();

  // Check for token in cookies
  const token = Cookies.get("authToken");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMobileSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleMobileSearchClose = () => {
    setIsMobileSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-sm border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo - Hidden when mobile search is open */}
        {!isMobileSearchOpen && (
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={salesBidLogo}
              alt="Sales Bid Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>
        )}

        {/* Mobile Search Form - Shown when search is active */}
        {isMobileSearchOpen && (
          <form 
            onSubmit={handleMobileSearchSubmit}
            className="flex-1 flex items-center"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search auctions..."
                className="pl-10 pr-4 py-2 h-10 w-full rounded-md border border-input bg-background text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleMobileSearchClose}
              className="ml-3 h-10 w-10 flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </Button>
          </form>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-6">
          <Link to="/auctions" className="font-bold text-gray-800 hover:text-gray-900 relative group antialiased text-[15px] tracking-wide subpixel-antialiased">
              All Auctions
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <div className="relative group">
              <button className="font-bold text-gray-800 hover:text-gray-900 relative group flex items-center antialiased text-[15px] tracking-wide subpixel-antialiased">
                Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 antialiased">
                {categoriesLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                  </div>
                ) : categories.length > 0 ? (
                  <div className="py-1 max-h-96 overflow-y-auto" role="menu" aria-orientation="vertical">
                    {categories.map((category) => (
                      <Link
                        key={category}
                        to={`/auctions?category=${encodeURIComponent(category)}`}
                        className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 font-semibold tracking-wide transition-colors relative group/item"
                        role="menuitem"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="relative">
                          {category}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 group-hover/item:w-full"></span>
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-sm text-gray-500">
                    No categories available
                  </div>
                )}
              </div>
            </div>
            <div className="relative group">
              <button className="font-bold text-gray-800 hover:text-gray-900 relative group flex items-center antialiased text-[15px] tracking-wide subpixel-antialiased">
                All Sellers
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 antialiased">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <Link
                    to="/allSellersPage"
                    className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 font-semibold tracking-wide transition-colors relative group/item"
                    role="menuitem"
                  >
                    <span className="relative">
                      Electronics
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 group-hover/item:w-full"></span>
                    </span>
                  </Link>
                  <Link
                    to="/categories/apparel"
                    className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 font-semibold tracking-wide transition-colors relative group/item"
                    role="menuitem"
                  >
                    <span className="relative">
                      Apparel
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 group-hover/item:w-full"></span>
                    </span>
                  </Link>
                  <Link
                    to="/categories/home-goods"
                    className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 font-semibold tracking-wide transition-colors relative group/item"
                    role="menuitem"
                  >
                    <span className="relative">
                      Home Goods
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 group-hover/item:w-full"></span>
                    </span>
                  </Link>
                  <Link
                    to="/categories/jewelry"
                    className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 font-semibold tracking-wide transition-colors relative group/item"
                    role="menuitem"
                  >
                    Jewelry
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/buyers" className="font-bold text-gray-800 hover:text-gray-900 relative group antialiased text-[15px] tracking-wide subpixel-antialiased">
              For Buyers
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/sellers" className="font-bold text-gray-800 hover:text-gray-900 relative group antialiased text-[15px] tracking-wide subpixel-antialiased">
              For Sellers
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </nav>

        {/* Search and User Actions */}
        <div className="flex items-center space-x-2">
          {isMobile ? (
            <div className="flex items-center space-x-3">
              {!isMobileSearchOpen && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsMobileSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
              <Link to="/my-bids" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                {bidsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                    {bidsCount > 9 ? '9+' : bidsCount}
                  </span>
                )}
              </Link>
            </div>
          ) : (
            <form 
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
              className="hidden md:flex items-center relative"
            >
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search auctions..."
                className="pl-10 h-9 w-64 rounded-md border border-input bg-background px-3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
              />
            </form>
          )}
          <div className="hidden md:flex items-center space-x-2">
            <Link to={"/user/wishlist"} className="relative">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              {wishlistCount > 0 && (
                <span className="absolute -top-0 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/my-bids" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {bidsCount > 0 && (
                <span className="absolute -top-0 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {bidsCount > 9 ? '9+' : bidsCount}
                </span>
              )}
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
          {!isMobileSearchOpen && (
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px] bg-white p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                  <Accordion type="single" collapsible className="w-full flex flex-col">
                    <AccordionItem value="categories" className="border-b border-gray-100">
                      <AccordionTrigger className="px-4 py-3 text-base font-medium hover:no-underline hover:text-amber-600">
                        Categories
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 max-h-48 overflow-y-auto">
                        {categoriesLoading ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                          </div>
                        ) : categories.length > 0 ? (
                          <div className="space-y-0">
                            {categories.map((category) => (
                              <Link
                                key={`mobile-${category}`}
                                to={`/auctions?category=${encodeURIComponent(category)}`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-600 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {category}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="px-4 text-sm text-gray-500">No categories available</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="auctions" className="border-b border-gray-100">
                      <Link 
                        to="/auctions" 
                        className="block px-4 py-3 text-base font-medium hover:text-amber-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        All Auctions
                      </Link>
                    </AccordionItem>

                    <AccordionItem value="sellers" className="border-b border-gray-100">
                      <Link 
                        to="/sellers" 
                        className="block px-4 py-3 text-base font-medium hover:text-amber-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        For Sellers
                      </Link>
                    </AccordionItem>

                    <AccordionItem value="how-it-works" className="border-b border-gray-100">
                      <Link 
                        to="/how-it-works" 
                        className="block px-4 py-3 text-base font-medium hover:text-amber-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        How It Works
                      </Link>
                    </AccordionItem>
                  </Accordion>
                  <div className="border-t border-gray-100">
                    {!token && (
                      <Link
                        to="/signin"
                        className="flex items-center px-4 py-3 text-base font-medium hover:text-amber-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="mr-3 h-5 w-5" />
                        Sign In
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;