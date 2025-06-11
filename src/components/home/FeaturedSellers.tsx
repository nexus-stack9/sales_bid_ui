import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Users, Award, ArrowRight, CheckCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Featured sellers data
const sellers = [
  {
    id: "1",
    name: "Premium Electronics",
    logo: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop",
    rating: 4.9,
    totalSales: "₹12.5M+",
    customers: "5,200+",
    verified: true,
    description: "Specializing in high-end electronics and gadgets with verified authenticity and warranty.",
    categories: ["Electronics", "Gadgets", "Computers"],
    color: "from-blue-400 to-cyan-400"
  },
  {
    id: "2",
    name: "Luxury Timepieces",
    logo: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=2030&auto=format&fit=crop",
    rating: 4.8,
    totalSales: "₹28.7M+",
    customers: "3,800+",
    verified: true,
    description: "Curated collection of luxury watches and timepieces from renowned brands worldwide.",
    categories: ["Watches", "Jewelry", "Luxury"],
    color: "from-purple-400 to-indigo-400"
  },
  {
    id: "3",
    name: "Vintage Collectibles",
    logo: "https://images.unsplash.com/photo-1584727638096-042c45049ebe?q=80&w=1973&auto=format&fit=crop",
    rating: 4.7,
    totalSales: "₹8.3M+",
    customers: "4,500+",
    verified: true,
    description: "Rare and unique vintage collectibles with authenticated provenance and history.",
    categories: ["Collectibles", "Antiques", "Memorabilia"],
    color: "from-amber-400 to-orange-400"
  }
];

const FeaturedSellers = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-amber-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <div className="flex items-center mb-2">
              <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-2 rounded-lg mr-3">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Sellers</h2>
                <p className="text-gray-600 max-w-2xl">
                  Discover our top-rated sellers with exceptional products and outstanding customer service.
                </p>
              </div>
            </div>
          </div>
          
          <Button asChild variant="outline" className="mt-4 md:mt-0 border-amber-300 text-amber-700 hover:bg-amber-50">
            <Link to="/sellers" className="flex items-center">
              View All Sellers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sellers.map((seller, index) => (
            <motion.div
              key={seller.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300"
            >
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={seller.logo} 
                  alt={seller.name} 
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${seller.color} opacity-60`}></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <h3 className="text-xl font-bold text-white drop-shadow-md">{seller.name}</h3>
                  {seller.verified && (
                    <Badge className="bg-white text-gray-800 flex items-center shadow-md">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="p-5">
                <p className="text-gray-600 mb-4 line-clamp-2 h-12">{seller.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {seller.categories.map(category => (
                    <Badge key={category} variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
                      {category}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="flex flex-col items-center p-2 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="flex items-center text-amber-500 mb-1">
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      <span className="font-bold">{seller.rating}</span>
                    </div>
                    <span className="text-xs text-gray-600">Rating</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center text-green-600 mb-1">
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      <span className="font-bold">{seller.totalSales}</span>
                    </div>
                    <span className="text-xs text-gray-600">Sales</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center text-blue-600 mb-1">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="font-bold">{seller.customers}</span>
                    </div>
                    <span className="text-xs text-gray-600">Customers</span>
                  </div>
                </div>
                
                <Button asChild className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white">
                  <Link to={`/sellers/${seller.id}`}>
                    View Seller
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 bg-white rounded-2xl p-8 border border-amber-200 shadow-xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-8 bg-gradient-to-r from-amber-400 to-orange-400 p-4 rounded-xl">
              <Award className="h-16 w-16 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Become a Featured Seller</h3>
              <p className="text-gray-600 mb-6 text-lg">
                Join our exclusive network of top sellers and reach thousands of potential buyers.
                Enjoy premium placement, dedicated support, and increased visibility.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white">
                  <Link to="/sellers/apply">
                    Apply Now
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                  <Link to="/sellers/benefits">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSellers;