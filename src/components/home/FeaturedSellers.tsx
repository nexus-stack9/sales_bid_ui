import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Users, Award, ArrowRight, CheckCircle } from "lucide-react";
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
    categories: ["Electronics", "Gadgets", "Computers"]
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
    categories: ["Watches", "Jewelry", "Luxury"]
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
    categories: ["Collectibles", "Antiques", "Memorabilia"]
  }
];

const FeaturedSellers = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <div className="flex items-center mb-2">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Sellers</h2>
            </div>
            <p className="text-gray-600 max-w-2xl">
              Discover our top-rated sellers with exceptional products and outstanding customer service.
            </p>
          </div>
          
          <Button asChild variant="outline" className="mt-4 md:mt-0">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <h3 className="text-xl font-bold text-white">{seller.name}</h3>
                  {seller.verified && (
                    <Badge className="bg-blue-500 text-white flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="p-5">
                <p className="text-gray-600 mb-4 line-clamp-2 h-12">{seller.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {seller.categories.map(category => (
                    <Badge key={category} variant="outline" className="bg-gray-50">
                      {category}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-yellow-500 mb-1">
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      <span className="font-bold">{seller.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">Rating</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-green-600 mb-1">
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      <span className="font-bold">{seller.totalSales}</span>
                    </div>
                    <span className="text-xs text-gray-500">Sales</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-blue-600 mb-1">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="font-bold">{seller.customers}</span>
                    </div>
                    <span className="text-xs text-gray-500">Customers</span>
                  </div>
                </div>
                
                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Link to={`/sellers/${seller.id}`}>
                    View Seller
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-6">
              <Award className="h-16 w-16 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Become a Featured Seller</h3>
              <p className="text-gray-600 mb-4">
                Join our exclusive network of top sellers and reach thousands of potential buyers.
                Enjoy premium placement, dedicated support, and increased visibility.
              </p>
              <Button asChild variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                <Link to="/sellers/apply">
                  Apply Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSellers;