import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Import local images
import electronicsImage from "@/assets/categories/electronics.jpeg";
import jewelleryImage from "@/assets/categories/jewellery.jpeg";
import fashionImage from "@/assets/categories/fashion.jpeg";
import homeImage from "@/assets/categories/home.jpeg";

const categories = [
  {
    id: 1,
    name: "Electronics",
    image: electronicsImage,
    count: 145,
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    name: "Jewelry & Watches",
    image: jewelleryImage,
    count: 98,
    color: "from-purple-500 to-pink-600"
  },
  {
    id: 3,
    name: "Fashion",
    image: fashionImage,
    count: 76,
    color: "from-amber-500 to-orange-600"
  },
  {
    id: 4,
    name: "Home & Garden",
    image: homeImage,
    count: 52,
    color: "from-green-500 to-emerald-600"
  }
];

// Preload images to prevent layout shifts
const preloadImages = () => {
  categories.forEach(category => {
    const img = new Image();
    img.src = category.image;
    img.decode().catch(() => {
      // Silent catch for any decoding errors
    });
  });
};

const TrendingCategories = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  useEffect(() => {
    // Preload images when component mounts
    preloadImages();
    
    // Set a timeout to ensure component renders even if images are slow
    const timer = setTimeout(() => {
      setImagesLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-display font-bold mb-3">Explore Popular Categories</h2>
        </div>
        
        <div 
          className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ${!imagesLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative h-48 sm:h-64 rounded-2xl overflow-hidden shadow-lg"
              style={{ contain: 'layout paint size' }}
            >
              <div className="absolute inset-0 z-10">
                <div className={`absolute inset-0 bg-gradient-to-b ${category.color} opacity-70 group-hover:opacity-90 transition-opacity duration-300`}></div>
              </div>
              
              <img 
                src={category.image} 
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                width="400"
                height="300"
                onLoad={() => setImagesLoaded(true)}
                style={{ willChange: 'transform' }}
              />
              
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-3 sm:p-6 text-white">
                <h3 
                  className="text-lg sm:text-2xl font-bold mb-1 transition-all duration-200 group-hover:text-xl sm:group-hover:text-3xl group-hover:text-white group-hover:drop-shadow-lg"
                >
                  {category.name}
                </h3>
                
                <p 
                  className="text-white/80 text-sm sm:text-base mb-2 sm:mb-3 transition-all duration-200 group-hover:text-white group-hover:font-medium"
                >
                  {category.count} active auctions
                </p>
                
                <div className="h-px bg-white/40 mb-2 sm:mb-4 w-0 group-hover:w-full transition-all duration-300"></div>
                
                <div
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <Link 
                    to={`/products?category=${category.name}`}
                    className="inline-flex items-center text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-white/30 transition-colors"
                  >
                    Explore <span className="hidden sm:inline">Category</span> <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(TrendingCategories);