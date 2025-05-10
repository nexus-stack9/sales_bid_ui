import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
    count: 145,
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    name: "Jewelry & Watches",
    image: "https://images.unsplash.com/photo-1603974372039-adc49044b6bd",
    count: 98,
    color: "from-purple-500 to-pink-600"
  },
  {
    id: 3,
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1587467512961-120760940315",
    count: 76,
    color: "from-amber-500 to-orange-600"
  },
  {
    id: 4,
    name: "Home & Garden",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea",
    count: 52,
    color: "from-green-500 to-emerald-600"
  }
];

const TrendingCategories = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-display font-bold mb-3">Explore Popular Categories</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative h-48 sm:h-64 rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="absolute inset-0 z-10">
                <div className={`absolute inset-0 bg-gradient-to-b ${category.color} opacity-70 group-hover:opacity-90 transition-opacity duration-500`}></div>
              </div>
              
              <img 
                src={category.image} 
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-3 sm:p-6 text-white">
                <h3 
                  className="text-lg sm:text-2xl font-bold mb-1 transition-all duration-300 group-hover:text-xl sm:group-hover:text-3xl group-hover:text-white group-hover:drop-shadow-lg"
                >
                  {category.name}
                </h3>
                
                <p 
                  className="text-white/80 text-sm sm:text-base mb-2 sm:mb-3 transition-all duration-300 group-hover:text-white group-hover:font-medium"
                >
                  {category.count} active auctions
                </p>
                
                <div className="h-px bg-white/40 mb-2 sm:mb-4 w-0 group-hover:w-full transition-all duration-500"></div>
                
                <div
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <Link 
                    to={`/auctions?category=${category.name}`} 
                    className="inline-flex items-center text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-white/30 transition-colors"
                  >
                    Explore <span className="hidden sm:inline">Category</span> <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCategories;