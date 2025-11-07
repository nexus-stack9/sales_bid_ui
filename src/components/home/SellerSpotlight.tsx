import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample seller data based on the images
const sellers = [
  {
    id: 1,
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png",
    bgColor: "bg-white"
  },
  {
    id: 2,
    name: "Target",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Target_Corporation_logo_%28vector%29.svg/1024px-Target_Corporation_logo_%28vector%29.svg.png",
    bgColor: "bg-white"
  },
  {
    id: 3,
    name: "Mobile Carrier",
    logo: "https://cdn-icons-png.flaticon.com/512/3800/3800024.png",
    bgColor: "bg-white"
  },
  {
    id: 4,
    name: "Costco Appliances",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Costco_logo.svg/1024px-Costco_logo.svg.png",
    bgColor: "bg-white"
  },
  {
    id: 5,
    name: "Unilever",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Unilever_logo.svg/1024px-Unilever_logo.svg.png",
    bgColor: "bg-white"
  },
  {
    id: 6,
    name: "BJ's",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/BJ%27s_Wholesale_Club_logo.svg/1024px-BJ%27s_Wholesale_Club_logo.svg.png",
    bgColor: "bg-white"
  },
  {
    id: 7,
    name: "GE",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/General_Electric_logo.svg/1024px-General_Electric_logo.svg.png",
    bgColor: "bg-white"
  },
  {
    id: 8,
    name: "Walmart",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Walmart_logo.svg/1024px-Walmart_logo.svg.png",
    bgColor: "bg-white"
  },
  {
    id: 9,
    name: "Flipkart",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Flipkart_logo.svg/1024px-Flipkart_logo.svg.png",
    bgColor: "bg-white"
  },
  {
    id: 10,
    name: "Croma",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Croma_Logo.svg/1024px-Croma_Logo.svg.png",
    bgColor: "bg-white"
  }
];

const SellerSpotlight = () => {
  const [startIndex, setStartIndex] = useState(0);
  const isMobile = useIsMobile();
  const visibleSellers = isMobile ? 1 : 4; // Show only 1 seller on mobile, 4 on desktop
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handlePrevious = () => {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setStartIndex((prev) => 
      prev + visibleSellers < sellers.length ? prev + 1 : prev
    );
  };

  // Handle touch events for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && startIndex < sellers.length - visibleSellers) {
      handleNext();
    }
    
    if (isRightSwipe && startIndex > 0) {
      handlePrevious();
    }
    
    // Reset values
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-1">
              Seller Spotlight
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Trusted brands and retailers
            </p>
          </div>
          <Link 
            to="/sellers" 
            className="text-primary hover:text-primary/80 font-medium text-sm sm:text-base transition-colors flex items-center gap-1 group"
          >
            View All
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative">
          {/* Navigation buttons - only visible on desktop */}
          {!isMobile && (
            <>
              <button 
                onClick={handlePrevious}
                disabled={startIndex === 0}
                className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
                aria-label="Previous sellers"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>

              <button 
                onClick={handleNext}
                disabled={startIndex + visibleSellers >= sellers.length}
                className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
                aria-label="Next sellers"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </>
          )}

          <div 
            className={`overflow-hidden ${!isMobile ? 'px-2' : ''}`}
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex gap-4 sm:gap-6 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${startIndex * (100 / visibleSellers)}%)` }}
            >
              {sellers.map((seller) => (
                <div 
                  key={seller.id}
                  className={`flex-shrink-0 ${isMobile ? 'w-full' : 'w-full sm:w-1/2 md:w-1/3 lg:w-1/4'}`}
                >
                  <div className={`${seller.bgColor} rounded-2xl border border-gray-100 p-8 sm:p-10 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 cursor-pointer group h-full`}>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-5 flex items-center justify-center">
                      <img 
                        src={seller.logo} 
                        alt={seller.name} 
                        className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="text-center font-semibold text-gray-800 text-base sm:text-lg">
                      {seller.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile pagination indicators */}
          {isMobile && (
            <div className="flex justify-center mt-6 gap-2">
              {sellers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setStartIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === startIndex 
                      ? 'w-8 bg-primary' 
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SellerSpotlight;