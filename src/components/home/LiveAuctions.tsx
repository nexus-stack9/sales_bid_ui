import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaginatedProducts } from "@/services/productService";
import { differenceInHours, differenceInMinutes } from "date-fns";

// Base64 encoded 1x1 transparent pixel as fallback
const fallbackImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

interface ApiProduct {
  product_id?: string | number;
  name?: string;
  category_name?: string;
  image_path?: string;
  total_bids?: string | number;
  auction_end?: string;
}

interface AuctionItem {
  id: string;
  category: string;
  title: string;
  image: string;
  bids: number;
  endsIn: string;
}

const LiveAuctions = () => {
  const {
    products: apiProducts,
    loading,
    error,
    loadProducts
  } = usePaginatedProducts();
  const navigate = useNavigate();

  const handleCardClick = (productId: string) => {
    // Scroll to top before navigation
    window.scrollTo(0, 0);
    navigate(`/auctions/${productId}`);
  };

  // Load products when component mounts
  React.useEffect(() => {
    loadProducts(1, 10); // Load first page with 10 items
  }, [loadProducts]);

  // Transform API products to match the component's expected format
  const auctionItems = useMemo<AuctionItem[]>(() => {
    if (!apiProducts) return [];
    
    return (apiProducts as ApiProduct[]).map((product) => {
      // Safely parse total_bids which could be string or number
      const bids = typeof product.total_bids === 'string' 
        ? parseInt(product.total_bids, 10) || 0 
        : (product.total_bids || 0);
      
      // Get first image from comma-separated string
      const firstImage = product.image_path?.split(',')[0]?.trim() || "";
      
      // Format time remaining
      let endsIn = "N/A";
      if (product.auction_end) {
        try {
          const end = new Date(product.auction_end);
          const now = new Date();
          const diffMs = end.getTime() - now.getTime();
          
          if (diffMs > 0) {
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            endsIn = `${hours}h ${minutes}m`;
          } else {
            endsIn = "Ended";
          }
        } catch (error) {
          console.error("Error formatting time:", error);
        }
      }
        
      return {
        id: product.product_id?.toString() || Math.random().toString(36).substr(2, 9),
        category: product.category_name || "Electronics / Appliance",
        title: product.name || "No title available",
        image: firstImage,
        bids: bids,
        endsIn: endsIn
      };
    });
  }, [apiProducts]);

  // Helper function to format time remaining
  function formatTimeRemaining(endDate: string): string {
    try {
      if (!endDate) return "N/A";
      
      // If already in the format we want, return it
      if (endDate.match(/\d+h\s\d+m/)) {
        return endDate;
      }
      
      // Try to parse as date string
      const end = new Date(endDate);
      if (isNaN(end.getTime())) return "N/A";
      
      const now = new Date();
      if (end <= now) return "Ended";
      
      const hours = differenceInHours(end, now);
      const minutes = differenceInMinutes(end, now) % 60;
      
      return `${hours}h ${minutes}m`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "N/A";
    }
  }
  return (
    <section className="py-10 bg-gradient-to-r from-white via-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-gray-900">
            Live Auctions
          </h2>
        </div>
        <Carousel opts={{ loop: true }}>
          <div className="flex gap-2 mb-4 justify-between md:justify-end w-full">
            <CarouselPrevious className="rounded-full shadow bg-white/80 hover:bg-blue-100 transition" />
            <CarouselNext className="rounded-full shadow bg-white/80 hover:bg-blue-100 transition" />
          </div>
          <CarouselContent>
            {loading ? (
              // Show skeleton loaders while loading
              Array(5).fill(0).map((_, idx) => (
                <CarouselItem
                  key={`skeleton-${idx}`}
                  className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 p-2"
                >
                  <div className="bg-white rounded-xl shadow-md transition overflow-hidden flex flex-col h-full border border-gray-200">
                    <Skeleton className="h-6 w-3/4 mx-auto my-4" />
                    <Skeleton className="w-full h-40 bg-gray-200" />
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-1/2 mx-auto" />
                    </div>
                  </div>
                </CarouselItem>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-10">
                <p className="text-red-500">Error loading auctions. Please try again later.</p>
              </div>
            ) : auctionItems.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No live auctions available at the moment.</p>
              </div>
            ) : (
              auctionItems.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 p-2"
                >
                  <div 
                    className="bg-white rounded-xl shadow-md transition overflow-hidden flex flex-col h-full border border-gray-200 hover:border-black cursor-pointer"
                    onClick={() => handleCardClick(item.id)}
                  >
                    <div className="px-4 pt-4 pb-2 flex flex-col items-center">
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 text-center">
                        {item.category}
                      </span>
                      <hr className="w-full border-t border-gray-200 mb-2" />
                    </div>
                    <div className="w-full h-48 bg-white flex items-center justify-center p-0 m-0">
                      <img
                        src={item.image || fallbackImage}
                        alt={item.title}
                        className="w-full h-full object-cover p-0 m-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = fallbackImage;
                        }}
                        style={{
                          objectPosition: 'center',
                          aspectRatio: '1/1'
                        }}
                      />
                    </div>
                    <hr className="w-full border-t border-gray-200 mt-2" />
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <h3 className="font-semibold text-base text-gray-800 mb-2 line-clamp-2 text-center min-h-[48px]">
                        {item.title}
                      </h3>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm font-medium text-gray-500">
                          {item.bids} {item.bids === 1 ? 'Bid' : 'Bids'}
                        </span>
                        <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                          Closes in{' '}
                          <span className="font-semibold">{item.endsIn}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))
            )}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default LiveAuctions;
