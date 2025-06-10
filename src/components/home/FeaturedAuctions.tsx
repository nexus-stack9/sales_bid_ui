import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Eye, Star, Sparkles, Gavel, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getAllProductsWS } from "@/services/crudService";

// Featured auctions data (fallback)
const featuredAuctionsData = [
  {
    id: "1",
    title: "Luxury Watch Collection - Limited Edition",
    imageUrl: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=2070&auto=format&fit=crop",
    currentBid: 4850,
    msrp: 7500,
    timeLeft: "2d 4h",
    watchers: 47,
    bidsPlaced: 18,
    category: "Luxury",
    featured: true
  },
  {
    id: "2",
    title: "Premium Electronics Bundle - Factory Sealed",
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=2070&auto=format&fit=crop",
    currentBid: 1275,
    msrp: 2100,
    timeLeft: "1d 6h",
    watchers: 32,
    bidsPlaced: 9,
    category: "Electronics",
    featured: true
  },
  {
    id: "3",
    title: "Designer Jewelry Collection - Gold & Silver",
    imageUrl: "https://images.unsplash.com/photo-1603974372039-adc49044b6bd?q=80&w=1974&auto=format&fit=crop",
    currentBid: 3200,
    msrp: 5000,
    timeLeft: "3d 12h",
    watchers: 28,
    bidsPlaced: 12,
    category: "Jewelry",
    featured: true
  },
  {
    id: "4",
    title: "Vintage Vinyl Records Collection - Rare Editions",
    imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1974&auto=format&fit=crop",
    currentBid: 850,
    msrp: 1200,
    timeLeft: "4d 8h",
    watchers: 19,
    bidsPlaced: 7,
    category: "Collectibles",
    featured: true
  }
];

const FeaturedAuctions = () => {
  const [featuredAuctions, setFeaturedAuctions] = useState(featuredAuctionsData);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch featured auctions using WebSocket
  useEffect(() => {
    setIsLoading(true);

    // Try to fetch from WebSocket API
    getAllProductsWS()
      .then(products => {
        // Filter featured products
        const featured = products
          .filter(product => product.featured)
          .slice(0, 4)
          .map(product => {
            // Calculate time left
            const now = new Date();
            const endDate = new Date(product.endDate);
            const timeRemaining = Math.max(0, endDate.getTime() - now.getTime());
            
            // Format time left
            const totalSeconds = Math.floor(timeRemaining / 1000);
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const timeLeft = `${days}d ${hours}h`;
            
            return {
              ...product,
              timeLeft
            };
          });
          
        if (featured.length > 0) {
          setFeaturedAuctions(featured);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching featured auctions:', err);
        // Fallback to static data
        setIsLoading(false);
      });
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const nextSlide = () => {
    setActiveIndex(prev => (prev + 1) % featuredAuctions.length);
  };

  const prevSlide = () => {
    setActiveIndex(prev => (prev - 1 + featuredAuctions.length) % featuredAuctions.length);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 text-amber-500 mr-3" />
            <div>
              <h2 className="text-3xl font-display font-bold mb-2 bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
                Featured Auctions
              </h2>
              <p className="text-gray-600 max-w-2xl">
                Discover our handpicked premium auctions with exceptional value and unique items
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0 border-amber-300 text-amber-700 hover:bg-amber-50">
            <Link to="/auctions?featured=true" className="flex items-center">
              View All Featured <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Desktop view - Grid layout */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md h-[400px] animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
                </div>
              </div>
            ))
          ) : (
            featuredAuctions.map((auction, index) => (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link to={`/auctions/${auction.id}`}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-amber-100 hover:shadow-amber-200/50 transition-all duration-300 h-full flex flex-col">
                    <div className="relative">
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white flex items-center gap-1 px-2 py-1">
                          <Star className="h-3 w-3 fill-white text-white" />
                          Featured
                        </Badge>
                      </div>
                      <div 
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
                        onClick={(e) => toggleFavorite(e, auction.id)}
                      >
                        <Heart 
                          className={cn(
                            "h-4 w-4 transition-colors", 
                            favorites.includes(auction.id) 
                              ? "fill-red-500 text-red-500" 
                              : "text-gray-500"
                          )} 
                        />
                      </div>
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={auction.imageUrl} 
                          alt={auction.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="absolute bottom-3 right-3 z-10">
                        <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {auction.timeLeft}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <Badge variant="outline" className="w-fit mb-2 text-xs">
                        {auction.category}
                      </Badge>
                      
                      <h3 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors flex-grow">
                        {auction.title}
                      </h3>
                      
                      <div className="mt-auto">
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Current Bid</p>
                            <p className="text-xl font-bold text-amber-600">
                              ₹{auction.currentBid.toLocaleString()}
                            </p>
                            {auction.msrp && (
                              <p className="text-xs text-gray-500 line-through">
                                MRP ₹{auction.msrp.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center text-xs text-gray-500">
                              <Eye className="h-3 w-3 mr-1" />
                              <span>{auction.watchers} watching</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Gavel className="h-3 w-3 mr-1" />
                              <span>{auction.bidsPlaced} bids</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full"
                            style={{ width: `${Math.min(100, (auction.currentBid / auction.msrp) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>

        {/* Mobile view - Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {isLoading ? (
                // Loading skeleton
                <div className="w-full flex-shrink-0 px-1">
                  <div className="bg-white rounded-xl overflow-hidden shadow-md h-[400px] animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
                    </div>
                  </div>
                </div>
              ) : (
                featuredAuctions.map((auction) => (
                  <div key={auction.id} className="w-full flex-shrink-0 px-1">
                    <Link to={`/auctions/${auction.id}`}>
                      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-amber-100 h-full flex flex-col">
                        <div className="relative">
                          <div className="absolute top-3 left-3 z-10">
                            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white flex items-center gap-1 px-2 py-1">
                              <Star className="h-3 w-3 fill-white text-white" />
                              Featured
                            </Badge>
                          </div>
                          <div 
                            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                            onClick={(e) => toggleFavorite(e, auction.id)}
                          >
                            <Heart 
                              className={cn(
                                "h-4 w-4", 
                                favorites.includes(auction.id) 
                                  ? "fill-red-500 text-red-500" 
                                  : "text-gray-500"
                              )} 
                            />
                          </div>
                          <div className="h-48 overflow-hidden">
                            <img 
                              src={auction.imageUrl} 
                              alt={auction.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute bottom-3 right-3 z-10">
                            <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {auction.timeLeft}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col">
                          <Badge variant="outline" className="w-fit mb-2 text-xs">
                            {auction.category}
                          </Badge>
                          
                          <h3 className="text-lg font-semibold mb-3 line-clamp-2 flex-grow">
                            {auction.title}
                          </h3>
                          
                          <div className="mt-auto">
                            <div className="flex justify-between items-end mb-3">
                              <div>
                                <p className="text-xs text-gray-500">Current Bid</p>
                                <p className="text-xl font-bold text-amber-600">
                                  ₹{auction.currentBid.toLocaleString()}
                                </p>
                                {auction.msrp && (
                                  <p className="text-xs text-gray-500 line-through">
                                    MRP ₹{auction.msrp.toLocaleString()}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col items-end">
                                <div className="flex items-center text-xs text-gray-500">
                                  <Eye className="h-3 w-3 mr-1" />
                                  <span>{auction.watchers} watching</span>
                                </div>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <Gavel className="h-3 w-3 mr-1" />
                                  <span>{auction.bidsPlaced} bids</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full"
                                style={{ width: `${Math.min(100, (auction.currentBid / auction.msrp) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Carousel controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
          
          {/* Carousel indicators */}
          <div className="flex justify-center mt-4">
            {featuredAuctions.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 mx-1 rounded-full ${
                  index === activeIndex ? 'bg-amber-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAuctions;