import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Gavel, Trophy, Repeat, Search, ArrowRight, Clock, Tag, Star, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// Hero background images
const heroBackgrounds = [
  "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2070&auto=format&fit=crop"
];

// Featured auction items
const featuredItems = [
  {
    id: "1",
    title: "Luxury Watch Collection",
    category: "Jewelry",
    currentBid: 2450,
    timeLeft: "2h 15m",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1780&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Premium Electronics Bundle",
    category: "Electronics",
    currentBid: 1899,
    timeLeft: "4h 30m",
    image: "https://images.unsplash.com/photo-1593344484962-796055d4a3a4?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Vintage Collectibles Set",
    category: "Collectibles",
    currentBid: 3200,
    timeLeft: "1h 45m",
    image: "https://images.unsplash.com/photo-1584727638096-042c45049ebe?q=80&w=1973&auto=format&fit=crop"
  }
];

// Stats for the hero section
const heroStats = [
  { label: "Active Auctions", value: "2,500+" },
  { label: "Registered Bidders", value: "150K+" },
  { label: "Success Rate", value: "98%" }
];

// Categories for quick access
const quickCategories = [
  { name: "Electronics", icon: <TrendingUp className="h-4 w-4" /> },
  { name: "Jewelry", icon: <Star className="h-4 w-4" /> },
  { name: "Fashion", icon: <Tag className="h-4 w-4" /> },
  { name: "Home", icon: <Clock className="h-4 w-4" /> }
];

const Hero = () => {
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Change background image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Set visibility after a short delay for animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={backgroundIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${heroBackgrounds[backgroundIndex]})`,
              filter: 'brightness(0.4)'
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10"></div>

      {/* Content container */}
      <div className="container mx-auto px-4 relative z-20 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left column - Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 rounded-full text-sm font-medium mb-4"
            >
              Premium Auction Platform
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
              <span className="block">Discover Exclusive</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Auction Treasures
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
              Join thousands of bidders worldwide in the most exciting online auctions. 
              Find rare collectibles, luxury items, and unbeatable deals all in one place.
            </p>

            {/* Search bar */}
            <div className="relative max-w-md mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search for auctions..."
                className="pl-10 py-6 bg-white/10 backdrop-blur-md border-gray-700 text-white w-full rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button className="absolute right-1.5 top-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg">
                Search
              </Button>
            </div>

            {/* Quick category access */}
            <div className="flex flex-wrap gap-3 mb-8">
              {quickCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link 
                    to={`/auctions?category=${category.name}`}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-300"
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {heroStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column - Featured auctions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              
              {/* Featured items */}
              <div className="relative bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400" />
                  Featured Auctions
                </h3>
                
                <div className="space-y-4">
                  {featuredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden transition-all duration-300 border border-white/10"
                    >
                      <Link to={`/auctions/${item.id}`} className="flex">
                        <div className="w-24 h-24 flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-white font-medium line-clamp-1">{item.title}</h4>
                              <p className="text-xs text-gray-400">{item.category}</p>
                            </div>
                            <div className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {item.timeLeft}
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-300">
                              Current bid: <span className="text-green-400 font-semibold">₹{item.currentBid.toLocaleString()}</span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <Button asChild variant="outline" className="text-white border-white/20 hover:bg-white/10">
                    <Link to="/auctions" className="flex items-center">
                      View All Auctions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bid Win Repeat Icons - Modern Interactive Layout */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-6 md:gap-12">
            {[
              {
                label: "BID",
                icon: <Gavel className="h-6 w-6 text-white" />,
                color: "from-blue-500 to-indigo-600",
                delay: 1.0,
              },
              {
                label: "WIN",
                icon: <Trophy className="h-6 w-6 text-white" />,
                color: "from-green-500 to-emerald-600",
                delay: 1.1,
              },
              {
                label: "REPEAT",
                icon: <Repeat className="h-6 w-6 text-white" />,
                color: "from-amber-500 to-yellow-600",
                delay: 1.2,
              },
            ].map(({ label, icon, color, delay }, i) => (
              <motion.div
                key={i}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ delay, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex flex-col items-center text-center relative z-10">
                  <motion.div 
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
                    whileHover={{ 
                      rotate: [0, -5, 5, -5, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    {React.cloneElement(icon as React.ReactElement, { 
                      className: "h-6 w-6 text-white" 
                    })}
                  </motion.div>
                  <motion.div
                    className="mt-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm"
                    whileHover={{ y: -2 }}
                  >
                    <p className="text-sm font-bold text-white">
                      {label}
                    </p>
                  </motion.div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;