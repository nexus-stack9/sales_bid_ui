import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Eye, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Featured auctions data
const featuredAuctions = [
  {
    id: "1",
    title: "Luxury Watch Collection - Limited Edition",
    imageUrl: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e",
    currentBid: 4850,
    timeLeft: "2d 4h",
    watchers: 47,
    category: "Luxury"
  },
  {
    id: "2",
    title: "Premium Electronics Bundle - Factory Sealed",
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
    currentBid: 1275,
    timeLeft: "1d 6h",
    watchers: 32,
    category: "Electronics"
  },
  {
    id: "3",
    title: "Designer Jewelry Collection - Gold & Silver",
    imageUrl: "https://images.unsplash.com/photo-1603974372039-adc49044b6bd",
    currentBid: 3200,
    timeLeft: "3d 12h",
    watchers: 28,
    category: "Jewelry"
  }
];

const FeaturedAuctions = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold mb-2">Featured Auctions</h2>
            <p className="text-gray-600 max-w-2xl">
              Discover our handpicked premium auctions with exceptional value and unique items
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0">
            <Link to="/auctions" className="flex items-center">
              View All Auctions <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredAuctions.map((auction, index) => (
            <motion.div
              key={auction.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to={`/auctions/${auction.id}`}>
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <div className="absolute top-3 left-3 z-10">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 flex items-center gap-1 px-2 py-1">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        Featured
                      </Badge>
                    </div>
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={auction.imageUrl} 
                        alt={auction.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {auction.title}
                    </h3>
                    
                    <div className="flex justify-between items-baseline mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Current Bid</p>
                        <p className="text-xl font-bold text-primary">${auction.currentBid.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-gray-700">{auction.timeLeft}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span>{auction.watchers} watching</span>
                      </div>
                      <Badge variant="outline" className="bg-gray-50">
                        {auction.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedAuctions;