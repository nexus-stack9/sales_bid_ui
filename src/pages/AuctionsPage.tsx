
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import AuctionGrid from '@/components/auction/AuctionGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, TrendingUp, Clock, Package2, Zap, ChevronDown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProducts, Product } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

// Featured categories with icons
const featuredCategories = [
  { name: 'Electronics', count: 145, icon: <Zap className="h-4 w-4" /> },
  { name: 'Fashion', count: 98, icon: <Package2 className="h-4 w-4" /> },
  { name: 'Home Goods', count: 76, icon: <Package2 className="h-4 w-4" /> },
  { name: 'Jewelry', count: 52, icon: <Package2 className="h-4 w-4" /> },
  { name: 'Sports', count: 43, icon: <Package2 className="h-4 w-4" /> },
  { name: 'Automotive', count: 37, icon: <Package2 className="h-4 w-4" /> },
];

const AuctionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getProducts();
        if (response.success && response.data) {
          setProducts(response.data);
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load auctions. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load auctions. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);
  
  // Simulate loading when changing pages
  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };
  
  // Convert API products to auction format for AuctionGrid
  const convertToAuctionFormat = (products: Product[]) => {
    return products.map(product => {
      // Handle image paths - they might be comma-separated strings
      const imagePaths = product.image_path ? product.image_path.split(',') : [];
      const firstImageUrl = imagePaths.length > 0 ? imagePaths[0] : '';
      
      // Parse tags to determine if product is featured
      const tags = product.tags ? product.tags.split(',') : [];
      const isFeatured = tags.includes('New') || tags.includes('Great');
      
      // Parse numeric values
      const currentBid = typeof product.max_bid_amount === 'string' 
        ? parseFloat(product.max_bid_amount) 
        : product.max_bid_amount;
      
      const startingPrice = typeof product.starting_price === 'string'
        ? parseFloat(product.starting_price)
        : product.starting_price;
        
      const retailValue = typeof product.retail_value === 'string'
        ? parseFloat(product.retail_value)
        : product.retail_value;
        
      const totalBids = typeof product.total_bids === 'string'
        ? parseInt(product.total_bids)
        : product.total_bids;
      
      return {
        id: product.product_id,
        title: product.name,
        imageUrl: firstImageUrl,
        currentBid: currentBid || startingPrice,
        msrp: retailValue,
        watchers: product.no_watching || 0,
        featured: isFeatured,
        category: product.category_name,
        location: product.location,
        condition: tags.join(', '),
        bidsPlaced: totalBids || 0,
        startDate: product.auction_start,
        endDate: product.auction_end,
        tags: tags
      };
    });
  };
  
  // Filter auctions based on active tab
  const getFilteredAuctions = () => {
    if (products.length === 0) return [];
    
    const auctions = convertToAuctionFormat(products);
    
    switch(activeTab) {
      case 'trending':
        // Filter by trending tag or high number of watchers
        return auctions.filter(auction => 
          auction.tags?.includes('Great') || 
          auction.watchers > 10 ||
          auction.bidsPlaced > 10
        );
      case 'ending-soon': {
        const now = new Date();
        return [...auctions].sort((a, b) => {
          const aEnd = new Date(a.endDate);
          const bEnd = new Date(b.endDate);
          return aEnd.getTime() - bEnd.getTime();
        }).slice(0, 8);
      }
      case 'featured':
        return auctions.filter(auction => auction.featured);
      default:
        return auctions;
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
                    {error ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <Button onClick={() => window.location.reload()}>Try Again</Button>
                      </div>
                    ) : (
                      <>
                        <TabsContent value="all" className="mt-0">
                          <AuctionGrid auctions={getFilteredAuctions()} />
                        </TabsContent>
                        
                        <TabsContent value="trending" className="mt-0">
                          <AuctionGrid auctions={getFilteredAuctions()} />
                        </TabsContent>
                        
                        <TabsContent value="ending-soon" className="mt-0">
                          <AuctionGrid auctions={getFilteredAuctions()} />
                        </TabsContent>
                        
                        <TabsContent value="featured" className="mt-0">
                          <AuctionGrid auctions={getFilteredAuctions()} />
                        </TabsContent>
                      </>
                    )}
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
