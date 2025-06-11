import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, Clock, Eye, Gavel, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getAllProductsWS } from "@/services/crudService";

// Trending auction items
const trendingItems = [
  {
    id: "1",
    title: "Apple MacBook Pro M2 - Sealed Box",
    category: "Electronics",
    currentBid: 98500,
    msrp: 129900,
    watchers: 45,
    bidsPlaced: 12,
    timeLeft: "3h 45m",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Vintage Rolex Submariner - Limited Edition",
    category: "Jewelry",
    currentBid: 245000,
    msrp: 350000,
    watchers: 78,
    bidsPlaced: 23,
    timeLeft: "5h 20m",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1780&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Sony PlayStation 5 Pro Bundle with 3 Games",
    category: "Gaming",
    currentBid: 42500,
    msrp: 54990,
    watchers: 62,
    bidsPlaced: 18,
    timeLeft: "2h 15m",
    image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=1964&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Louis Vuitton Neverfull MM Tote - Authentic",
    category: "Fashion",
    currentBid: 78900,
    msrp: 120000,
    watchers: 53,
    bidsPlaced: 15,
    timeLeft: "4h 10m",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop"
  }
];

const TrendingNow = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [trendingProducts, setTrendingProducts] = useState(trendingItems);
  const [error, setError] = useState<string | null>(null);

  // Fetch trending products using WebSocket
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Try to fetch from WebSocket API
    getAllProductsWS()
      .then(products => {
        // Sort by watchers to get trending items
        const trending = [...products]
          .sort((a, b) => (b.watchers || 0) - (a.watchers || 0))
          .slice(0, 4)
         .map(product => {
  const now = new Date();
  const endDate = new Date(product.endDate);
  const timeRemaining = Math.max(0, endDate.getTime() - now.getTime());

  const totalSeconds = Math.floor(timeRemaining / 1000);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const timeLeft = `${hours}h ${minutes}m`;

  return {
    id: product.id,
    title: product.title,
    category: product.category,
    currentBid: product.currentBid,
    msrp: product.msrp ?? 0, // default if undefined
    watchers: product.watchers,
    bidsPlaced: product.bidsPlaced ?? 0,
    timeLeft,
    image: product.imageUrl // 👈 transform to `image`
  };
})
          
        if (trending.length > 0) {
          setTrendingProducts(trending);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching trending products:', err);
        // Fallback to static data
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-lg mr-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Trending Now</h2>
              <p className="text-gray-600 text-sm md:text-base">Hot items with the most watchers right now</p>
            </div>
          </div>
          <Button asChild variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">
            <Link to="/auctions?sort=trending" className="flex items-center">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-[350px] animate-pulse shadow-md">
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link to={`/auctions/${item.id}`}>
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative">
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                          <TrendingUp className="h-3 w-3 mr-1" /> Trending
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-white/80 backdrop-blur-sm text-gray-700 text-xs px-2 py-1 rounded-full flex items-center shadow-sm">
                          <Clock className="h-3 w-3 mr-1 text-pink-500" />
                          {item.timeLeft}
                        </div>
                      </div>
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className={cn(
                            "w-full h-full object-cover transition-transform duration-500",
                            "group-hover:scale-110"
                          )}
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/90 to-transparent"></div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="mb-2">
                        <span className="text-xs text-pink-600 font-medium bg-pink-50 px-2 py-1 rounded-full">{item.category}</span>
                        <h3 className="font-semibold text-gray-800 mt-2 line-clamp-2 h-12 group-hover:text-pink-600 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Current Bid</p>
                            <p className="text-lg font-bold text-pink-600">
                              ₹{item.currentBid.toLocaleString('en-IN')}
                            </p>
                            {item.msrp && (
                              <p className="text-xs text-gray-500 line-through">
                                MRP ₹{item.msrp.toLocaleString('en-IN')}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center text-xs text-gray-600">
                              <Eye className="h-3 w-3 mr-1 text-gray-500" />
                              <span>{item.watchers} watching</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600 mt-1">
                              <Gavel className="h-3 w-3 mr-1 text-gray-500" />
                              <span>{item.bidsPlaced} bids</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-pink-400 to-rose-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, (item.currentBid / item.msrp) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Starting Bid</span>
                          <span>MSRP</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-center text-pink-600 text-sm font-medium group-hover:text-pink-700">
                          View Details <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingNow;