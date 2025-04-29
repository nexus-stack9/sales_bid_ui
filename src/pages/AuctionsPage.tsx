
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import AuctionGrid from '@/components/auction/AuctionGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, TrendingUp, Clock, Package2, Zap, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for auctions
const mockAuctions = [
  {
    id: '1',
    title: 'Apple iPhone 12 Pro - Lot of 10 Units - Fully Tested',
    imageUrl: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 2100,
    timeLeft: '2d 6h',
    watchers: 34,
    featured: true,
    category: 'Electronics'
  },
  {
    id: '2',
    title: 'Designer Handbags - Mixed Brands - New and Return Condition',
    imageUrl: 'https://images.unsplash.com/photo-1587467512961-120760940315?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 870,
    timeLeft: '1d 12h',
    watchers: 27,
    featured: true,
    category: 'Fashion'
  },
  {
    id: '3',
    title: 'Top-Brand Kitchen Appliances - Reseller Bundle - 20 Units',
    imageUrl: 'https://images.unsplash.com/photo-1593348354863-e8f9f10bcc1d?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 1450,
    timeLeft: '3d 4h',
    watchers: 19,
    featured: false,
    category: 'Home Goods'
  },
  {
    id: '4',
    title: 'Premium Jewelry Collection - Gold & Silver - Retail $10K+',
    imageUrl: 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 3200,
    timeLeft: '6h 30m',
    watchers: 42,
    featured: true,
    category: 'Jewelry'
  },
  {
    id: '5',
    title: 'Samsung 4K Smart TVs - Customer Return Lot - 5 Units',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 1275,
    timeLeft: '4d 10h',
    watchers: 23,
    featured: false,
    category: 'Electronics'
  },
  {
    id: '6',
    title: 'Designer Sunglasses - Mixed Brands - 50 Units',
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 980,
    timeLeft: '2d 15h',
    watchers: 18,
    featured: false,
    category: 'Fashion'
  },
  {
    id: '7',
    title: 'Premium Fitness Equipment - Home Gym Bundle',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 750,
    timeLeft: '1d 8h',
    watchers: 31,
    featured: false,
    category: 'Sports'
  },
  {
    id: '8',
    title: 'Luxury Watch Collection - Swiss Made - 3 Units',
    imageUrl: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 4500,
    timeLeft: '12h 45m',
    watchers: 47,
    featured: false,
    category: 'Jewelry'
  },
  {
    id: '9',
    title: 'Bulk Lot of Gaming Consoles - PlayStation & Xbox - 15 Units',
    imageUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 3750,
    timeLeft: '3d 8h',
    watchers: 56,
    featured: true,
    category: 'Electronics'
  },
  {
    id: '10',
    title: 'Premium Outdoor Furniture Set - Retail Value $8,000',
    imageUrl: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 1950,
    timeLeft: '5d 12h',
    watchers: 29,
    featured: false,
    category: 'Home Goods'
  },
  {
    id: '11',
    title: 'Designer Footwear Collection - Mixed Sizes - 30 Pairs',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 1200,
    timeLeft: '2d 18h',
    watchers: 37,
    featured: false,
    category: 'Fashion'
  },
  {
    id: '12',
    title: 'Premium Audio Equipment - Speakers & Headphones Bundle',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 2250,
    timeLeft: '1d 20h',
    watchers: 41,
    featured: true,
    category: 'Electronics'
  }
];

// Featured categories with icons
const featuredCategories = [
  { name: 'Electronics', count: 145, icon: <Zap className="h-4 w-4" /> },
  { name: 'Fashion', count: 98, icon: <Package2 className="h-4 w-4" /> },
  { name: 'Home Goods', count: 76, icon: <Package2 className="h-4 w-4" /> },
  { name: 'Jewelry', count: 52, icon: <Package2 className="h-4 w-4" /> },
  { name: 'Sports', count: 43, icon: <Package2 className="h-4 w-4" /> },
  { name: 'Automotive', count: 37, icon: <Package2 className="h-4 w-4" /> },
];

// Trending auctions - subset of mock data
const trendingAuctions = mockAuctions.filter(auction => auction.watchers > 30);
const endingSoonAuctions = [...mockAuctions].sort((a, b) => {
  const aTime = parseInt(a.timeLeft.split('d')[0] || '0') * 24 + parseInt(a.timeLeft.split('h')[0].split(' ')[1] || '0');
  const bTime = parseInt(b.timeLeft.split('d')[0] || '0') * 24 + parseInt(b.timeLeft.split('h')[0].split(' ')[1] || '0');
  return aTime - bTime;
}).slice(0, 8);

const AuctionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Simulate loading when changing pages
  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };
  
  // Filter auctions based on active tab
  const getFilteredAuctions = () => {
    switch(activeTab) {
      case 'trending':
        return trendingAuctions;
      case 'ending-soon':
        return endingSoonAuctions;
      case 'featured':
        return mockAuctions.filter(auction => auction.featured);
      default:
        return mockAuctions;
    }
  };

  return (
    <Layout>
      <div className="relative overflow-hidden">
        {/* Hero Section with Animated Background */}
        {/* <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute top-60 -left-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
                Discover Premium Inventory at <span className="text-primary">Wholesale Prices</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Find and bid on high-quality merchandise from top retailers and manufacturers. Perfect for resellers, small businesses, and savvy shoppers.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search for auctions, brands, or categories..." 
                    className="pl-10 py-6 text-base rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button size="lg" className="rounded-full px-8">
                  Search <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="text-sm font-medium text-muted-foreground">Popular:</span>
                {featuredCategories.slice(0, 5).map((category) => (
                  <Badge 
                    key={category.name} 
                    variant="outline" 
                    className="rounded-full px-3 py-1 hover:bg-primary/10 cursor-pointer transition-colors"
                  >
                    {category.icon}
                    <span className="ml-1">{category.name}</span>
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>
        </div> */}
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Category Highlights */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-semibold">Browse Categories</h2>
              <Button variant="ghost" className="text-primary">
                View All <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {featuredCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm border border-muted p-4 text-center cursor-pointer hover:border-primary/20 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    {category.icon}
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{category.count} items</p>
                </motion.div>
              ))}
            </div>
          </motion.div> */}
          
          {/* Auction Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-display font-semibold">Explore Auctions</h2>
                <TabsList className="w-full sm:w-auto overflow-x-auto flex-nowrap">
                  <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap">
                    All Auctions
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap">
                    <TrendingUp className="h-4 w-4 mr-1" /> Trending
                  </TabsTrigger>
                  <TabsTrigger value="ending-soon" className="data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap">
                    <Clock className="h-4 w-4 mr-1" /> Ending Soon
                  </TabsTrigger>
                  <TabsTrigger value="featured" className="data-[state=active]:bg-primary data-[state=active]:text-white whitespace-nowrap">
                    Featured
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center py-20"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      <p className="mt-4 text-muted-foreground">Loading auctions...</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="all" className="mt-0">
                      <AuctionGrid auctions={mockAuctions} />
                    </TabsContent>
                    
                    <TabsContent value="trending" className="mt-0">
                      <AuctionGrid auctions={trendingAuctions} />
                    </TabsContent>
                    
                    <TabsContent value="ending-soon" className="mt-0">
                      <AuctionGrid auctions={endingSoonAuctions} />
                    </TabsContent>
                    
                    <TabsContent value="featured" className="mt-0">
                      <AuctionGrid auctions={mockAuctions.filter(a => a.featured)} />
                    </TabsContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Tabs>
          </motion.div>
          
          {/* Pagination */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 flex justify-center"
          >
            <nav className="flex items-center space-x-2">
              <Button 
                variant={currentPage === 1 ? "default" : "outline"}
                onClick={() => handlePageChange(1)}
                className="transition-all duration-300"
              >
                1
              </Button>
              <Button 
                variant={currentPage === 2 ? "default" : "outline"}
                onClick={() => handlePageChange(2)}
                className="transition-all duration-300"
              >
                2
              </Button>
              <Button 
                variant={currentPage === 3 ? "default" : "outline"}
                onClick={() => handlePageChange(3)}
                className="transition-all duration-300"
              >
                3
              </Button>
              <span className="px-2">...</span>
              <Button 
                variant={currentPage === 8 ? "default" : "outline"}
                onClick={() => handlePageChange(8)}
                className="transition-all duration-300"
              >
                8
              </Button>
              <Button 
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                className="transition-all duration-300"
                disabled={currentPage === 8}
              >
                Next <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </nav>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AuctionsPage;
