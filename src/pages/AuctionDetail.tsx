
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import {  Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, Share, Clock, Eye, Truck, Package, AlertTriangle, HelpCircle, 
  ArrowLeft, Gavel, ChevronUp, ChevronDown, DollarSign, ShieldCheck, 
  Calendar, BarChart2, Users, Award, ArrowUpRight,
  Star,
  FileText,
  Tag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock auction data
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
    title: 'Samsung Galaxy S21 - Wholesale Lot of 15 Units',
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 1800,
    timeLeft: '1d 3h',
    watchers: 28,
    featured: false,
    category: 'Electronics'
  },
  {
    id: '3',
    title: 'Designer Handbags - Mixed Brands - Lot of 20',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 3200,
    timeLeft: '4d 12h',
    watchers: 42,
    featured: true,
    category: 'Fashion'
  },
  {
    id: '4',
    title: 'Home Furniture Liquidation - Complete Inventory',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 5500,
    timeLeft: '3d 8h',
    watchers: 19,
    featured: false,
    category: 'Home Goods'
  }
];

const mockAuction = {
  id: '1',
  title: 'Apple iPhone 12 Pro - Lot of 10 Units - Fully Tested',
  description: 'This lot contains 10 Apple iPhone 12 Pro devices in various colors. All units have been fully tested and are functional. Minor cosmetic wear on some units. Perfect for resellers or refurbishers.',
  imageUrls: [
    'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1606041011872-596597976b25?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1581795669373-3b1d23f9ee87?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000'
  ],
  currentBid: 2100,
  startingBid: 1000,
  bidIncrement: 50,
  bids: 15,
  timeLeft: '2d 6h',
  endDate: '2025-04-09T18:00:00Z',
  watchers: 34,
  seller: {
    name: 'Tech Liquidators Inc.',
    rating: 4.8,
    totalSales: 342
  },
  category: 'Electronics',
  condition: 'Used - Good',
  retailValue: 8500,
  location: 'Atlanta, GA',
  shippingOptions: ['Freight', 'Pickup'],
  paymentOptions: ['Credit Card', 'Wire Transfer'],
  specifications: [
    { key: 'Brand', value: 'Apple' },
    { key: 'Model', value: 'iPhone 12 Pro' },
    { key: 'Quantity', value: '10 units' },
    { key: 'Storage', value: '128GB - 256GB (mixed)' },
    { key: 'Condition', value: 'Used - Good' },
    { key: 'Testing', value: 'Fully functional' },
    { key: 'Accessories', value: 'No accessories included' },
    { key: 'Returns', value: 'All sales final' }
  ],
  bidHistory: [
    { user: 'buyer567', amount: 2100, time: '2 hours ago' },
    { user: 'tech_deals', amount: 2050, time: '5 hours ago' },
    { user: 'reseller22', amount: 2000, time: '6 hours ago' },
    { user: 'mobilepro', amount: 1950, time: '8 hours ago' },
    { user: 'gadgetking', amount: 1900, time: '10 hours ago' }
  ]
};

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [bidAmount, setBidAmount] = useState<number>(mockAuction.currentBid + mockAuction.bidIncrement);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isWatching, setIsWatching] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [bidHistory, setBidHistory] = useState(mockAuction.bidHistory);
  const [showBidConfirmation, setShowBidConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRelatedItems, setShowRelatedItems] = useState(true);
  const [progress, setProgress] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Calculate time left dynamically
  useEffect(() => {
    const calculateTimeLeft = () => {
      const endDate = new Date(mockAuction.endDate);
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft("Auction ended");
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else {
        setTimeLeft(`${minutes}m left`);
      }
      
      // Calculate progress - assuming auction lasts 7 days
      const totalDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
      const elapsed = totalDuration - difference;
      const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
      setProgress(progressPercent);
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [mockAuction.endDate]);

  // Simplified - we'll implement proper zoom later
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Simplified for now
  };

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Add new bid to history
      const newBid = {
        user: "You",
        amount: bidAmount,
        time: "Just now"
      };
      
      setBidHistory([newBid, ...bidHistory]);
      setShowBidConfirmation(true);
      setIsSubmitting(false);
      
      toast({
        title: "Bid Submitted Successfully!",
        description: `Your bid of $${bidAmount.toFixed(2)} has been placed.`,
      });
      
      // Update current bid
      mockAuction.currentBid = bidAmount;
      // Set new minimum bid
      setBidAmount(bidAmount + mockAuction.bidIncrement);
      
      // Hide confirmation after 3 seconds
      setTimeout(() => setShowBidConfirmation(false), 3000);
    }, 1500);
  };

  const toggleWatchlist = () => {
    setIsWatching(!isWatching);
    toast({
      title: isWatching ? "Removed from Watchlist" : "Added to Watchlist",
      description: isWatching ? "This auction has been removed from your watchlist." : "This auction has been added to your watchlist.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 sm:py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb and back navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link to="/auctions" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Auctions
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image with enhanced styling */}
            <div className="relative mb-4 overflow-hidden rounded-xl bg-white aspect-[4/3] shadow-lg border border-gray-100">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              <motion.img
                src={mockAuction.imageUrls[selectedImage]}
                alt={mockAuction.title}
                className="h-full w-full object-cover transition-transform duration-500"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
              />
              
              {/* Image navigation arrows */}
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
                <motion.button 
                  className="bg-black/50 text-white rounded-full p-2 backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedImage(prev => (prev === 0 ? mockAuction.imageUrls.length - 1 : prev - 1));
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </motion.button>
                <motion.button 
                  className="bg-black/50 text-white rounded-full p-2 backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedImage(prev => (prev === mockAuction.imageUrls.length - 1 ? 0 : prev + 1));
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </motion.button>
              </div>
              
              {/* Image counter */}
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                {selectedImage + 1} / {mockAuction.imageUrls.length}
              </div>
            </div>
            
            {/* Enhanced Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {mockAuction.imageUrls.map((img, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`overflow-hidden rounded-lg transition-all duration-200 ${
                    selectedImage === index 
                      ? 'ring-2 ring-primary shadow-md' 
                      : 'border border-gray-200 hover:border-primary/30 shadow-sm'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={img}
                    alt={`Product thumbnail ${index + 1}`}
                    className="h-20 w-full object-cover"
                    style={{ 
                      filter: selectedImage !== index ? 'brightness(0.9)' : 'brightness(1.05)'
                    }}
                  />
                </motion.button>
              ))}
            </div>
            
            {/* Auction Stats */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: <Eye className="h-4 w-4 text-blue-500" />, label: "Watchers", value: mockAuction.watchers },
                { icon: <Gavel className="h-4 w-4 text-amber-500" />, label: "Bids", value: mockAuction.bids },
                { icon: <Users className="h-4 w-4 text-green-500" />, label: "Seller Rating", value: mockAuction.seller.rating }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * i }}
                  className="flex flex-col items-center justify-center rounded-lg border bg-white p-3 text-center shadow-sm"
                >
                  <div className="mb-1 rounded-full bg-muted/30 p-2">
                    {stat.icon}
                  </div>
                  <p className="text-lg font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Auction Info and Bidding */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-gradient-to-r from-primary/80 to-primary text-white px-3 py-1 shadow-sm">
                  {mockAuction.category}
                </Badge>
                <Badge variant="outline" className="border-gray-300 bg-white shadow-sm px-3 py-1">
                  Lot #{mockAuction.id}
                </Badge>
                <Badge variant="secondary" className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1 shadow-sm">
                  <Star className="h-3 w-3 fill-white text-white mr-1" />
                  Featured
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 shadow-sm flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  Manifest Available
                </Badge>
              </div>
              
              <h1 className="text-2xl font-display font-bold sm:text-3xl lg:text-4xl tracking-tight">
                {mockAuction.title}
              </h1>
              
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <ShieldCheck className="h-4 w-4 text-green-500 mr-1.5" />
                  <span>Verified Seller</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 text-blue-500 mr-1.5" />
                  <span>{mockAuction.watchers} watching this auction</span>
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 text-amber-500 mr-1.5" />
                  <span>Retail Value: ${mockAuction.retailValue.toLocaleString('en-US')}</span>
                </div>
              </div>
              
              <p className="mt-4 text-muted-foreground text-base leading-relaxed">
                {mockAuction.description.substring(0, 150)}...
                <button className="text-primary hover:underline ml-1 font-medium">Read More</button>
              </p>
              
              {/* Manifest Download Button */}
              <div className="mt-4 flex items-center">
                <Button variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 shadow-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Download Manifest</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </Button>
                <div className="ml-3 text-xs text-muted-foreground">
                  <span>Excel format • Last updated: Today</span>
                </div>
              </div>
            </div>

            {/* Time left and progress bar */}
            <div className="mb-6 rounded-lg bg-muted/20 p-4 border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-accent" />
                  <span>{timeLeft}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Ends {new Date(mockAuction.endDate).toLocaleDateString()}
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Enhanced Current bid info */}
            <motion.div 
              className="mb-6 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6 border border-primary/20 shadow-md"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="bg-primary/20 p-2 rounded-lg mr-3">
                      <Gavel className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Current Bid</p>
                      <p className="text-4xl font-bold text-primary tracking-tight">
                        ${mockAuction.currentBid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Bid progress bar */}
                  <div className="mt-4 w-full h-2.5 bg-white/70 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-primary/80"
                      initial={{ width: '0%' }}
                      animate={{ width: `${Math.round((mockAuction.currentBid / mockAuction.retailValue) * 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <BarChart2 className="h-3 w-3 mr-1" />
                      <span>{bidHistory.length} bids</span>
                    </div>
                    <span>{Math.round((mockAuction.currentBid / mockAuction.retailValue) * 100)}% of retail</span>
                  </div>
                  
                  {/* Time remaining indicator */}
                  <div className="mt-3 flex items-center">
                    <Clock className="h-4 w-4 text-primary mr-1.5" />
                    <div className="text-sm font-medium">
                      {timeLeft} <span className="text-muted-foreground text-xs ml-1">until auction ends</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-primary/10 flex-shrink-0 w-full sm:w-auto">
                  <h4 className="font-medium text-sm mb-3 text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 text-primary">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    Auction Details
                  </h4>
                  
                  <div className="space-y-2 divide-y divide-gray-100">
                    <div className="flex items-center justify-between pb-2">
                      <p className="text-sm text-gray-600">Retail Value:</p>
                      <p className="text-base font-bold">${mockAuction.retailValue.toLocaleString('en-US')}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 pb-2">
                      <p className="text-sm text-gray-600">Starting Bid:</p>
                      <p className="text-base font-medium">${mockAuction.startingBid.toLocaleString('en-US')}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-sm text-gray-600">Min Increment:</p>
                      <Badge variant="outline" className="bg-primary/10 border-primary/20 font-medium">
                        +${mockAuction.bidIncrement}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-3 bg-blue-50 rounded-lg p-2 border border-blue-100">
                    <p className="text-xs text-blue-700 flex items-center">
                      <ShieldCheck className="h-3.5 w-3.5 text-blue-500 mr-1" />
                      Buyer protection available
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bid form */}
            <AnimatePresence>
              {showBidConfirmation ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 rounded-lg bg-green-50 p-4 border border-green-200 text-green-800"
                >
                  <div className="flex items-center">
                    <div className="mr-3 rounded-full bg-green-100 p-2">
                      <Gavel className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Bid Placed Successfully!</h3>
                      <p className="text-sm">
                        Your bid of ${bidAmount.toFixed(2)} is now the highest bid.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleBidSubmit} 
                  className="mb-6 rounded-xl border border-gray-200 p-6 bg-white shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold flex items-center text-xl">
                      <div className="bg-primary text-white p-1.5 rounded-md mr-2 shadow-sm">
                        <Gavel className="h-5 w-5" />
                      </div>
                      Place Your Bid
                    </h3>
                    
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      Ends in {timeLeft}
                    </Badge>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-5">
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="flex-1">
                        <label className="text-sm font-medium uppercase tracking-wide text-gray-700 flex items-center">
                          <DollarSign className="h-4 w-4 text-primary mr-1" />
                          Your Bid Amount (USD)
                        </label>
                        <div className="relative mt-2">
                          <DollarSign className="absolute left-4 top-3.5 h-5 w-5 text-primary" />
                          <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(Number(e.target.value))}
                            min={mockAuction.currentBid + mockAuction.bidIncrement}
                            step={mockAuction.bidIncrement}
                            className="w-full rounded-lg border-2 border-gray-200 pl-11 py-3.5 text-xl font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                          />
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-xs text-gray-600 flex items-center">
                            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-green-500" />
                            Minimum bid: ${(mockAuction.currentBid + mockAuction.bidIncrement).toFixed(2)}
                          </p>
                          
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium">
                            +${mockAuction.bidIncrement} increments
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-end sm:min-w-[180px]">
                        <Button
                          type="submit"
                          className="h-[54px] px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md text-base font-medium"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              Place Bid Now
                              <Gavel className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                        
                        <p className="mt-2 text-xs text-center text-gray-500">
                          By placing a bid, you agree to the <a href="#" className="text-primary hover:underline font-medium">Terms & Conditions</a>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick bid buttons */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 text-primary">
                          <polyline points="17 1 21 5 17 9" />
                          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                          <polyline points="7 23 3 19 7 15" />
                          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                        </svg>
                        Quick Bid Options
                      </h4>
                      
                      <p className="text-xs text-gray-500">Select a preset amount</p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        mockAuction.currentBid + mockAuction.bidIncrement,
                        mockAuction.currentBid + (mockAuction.bidIncrement * 2),
                        mockAuction.currentBid + (mockAuction.bidIncrement * 5),
                        mockAuction.currentBid + (mockAuction.bidIncrement * 10)
                      ].map((amount, index) => (
                        <motion.button 
                          key={index}
                          type="button"
                          whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                          whileTap={{ y: 0, scale: 0.98 }}
                          onClick={() => setBidAmount(amount)}
                          className={`rounded-lg border-2 py-3 px-4 text-center transition-all ${
                            bidAmount === amount 
                              ? 'border-primary bg-primary/5 text-primary font-medium shadow-md' 
                              : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="text-sm font-medium">${amount.toLocaleString('en-US')}</span>
                          {index === 0 && (
                            <p className="text-xs text-gray-500 mt-1">Minimum</p>
                          )}
                          {index === 3 && (
                            <p className="text-xs text-gray-500 mt-1">Recommended</p>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bid advantages */}
                  <div className="mt-5 pt-5 border-t border-dashed border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="flex items-center">
                        <div className="bg-green-50 p-1.5 rounded-full mr-2">
                          <ShieldCheck className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="text-gray-600">Secure bidding process</span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-blue-50 p-1.5 rounded-full mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                        </div>
                        <span className="text-gray-600">Buyer protection available</span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-amber-50 p-1.5 rounded-full mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                            <line x1="9" y1="9" x2="9.01" y2="9" />
                            <line x1="15" y1="9" x2="15.01" y2="9" />
                          </svg>
                        </div>
                        <span className="text-gray-600">Satisfaction guaranteed</span>
                      </div>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="mb-6 flex flex-wrap gap-3">
              <Button 
                variant={isWatching ? "default" : "outline"} 
                onClick={toggleWatchlist} 
                className={`flex-1 ${isWatching ? 'bg-red-500 hover:bg-red-600' : ''}`}
              >
                <Heart className={`mr-2 h-4 w-4 ${isWatching ? 'fill-white text-white' : 'hover:fill-red-200'}`} />
                {isWatching ? 'Watching' : 'Add to Watchlist'}
              </Button>
              <Button variant="outline" className="flex-1">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Key information */}
            <motion.div 
              className="space-y-4 rounded-lg border p-4 bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h3 className="font-semibold border-b pb-2">Key Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-blue-50 p-2">
                    <Truck className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Shipping</h4>
                    <p className="text-xs text-muted-foreground">
                      {mockAuction.shippingOptions.join(', ')} from {mockAuction.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-green-50 p-2">
                    <Package className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Condition</h4>
                    <p className="text-xs text-muted-foreground">{mockAuction.condition}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-amber-50 p-2">
                    <Award className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Seller</h4>
                    <p className="text-xs text-muted-foreground">
                      {mockAuction.seller.name} ({mockAuction.seller.rating}★)
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-red-50 p-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Important</h4>
                    <p className="text-xs text-muted-foreground">
                      All sales are final
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div 
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="details" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Details & Specs
              </TabsTrigger>
              <TabsTrigger value="manifest" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <FileText className="h-4 w-4 mr-1.5" />
                Manifest
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Bid History
              </TabsTrigger>
              <TabsTrigger value="shipping" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Shipping & Payment
              </TabsTrigger>
            </TabsList>
            
            <AnimatePresence mode="wait">
              <TabsContent value="details" className="mt-0">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm">
                    <h3 className="text-xl font-display font-semibold mb-4 flex items-center">
                      <span className="bg-primary/10 text-primary p-1.5 rounded-md mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      </span>
                      Description
                    </h3>
                    <div className="text-muted-foreground leading-relaxed">
                      <p>{mockAuction.description}</p>
                    </div>
                  </div>
                  
                  <div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm">
                    <h3 className="text-xl font-display font-semibold mb-4 flex items-center">
                      <span className="bg-primary/10 text-primary p-1.5 rounded-md mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                          <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                      </span>
                      Specifications
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {mockAuction.specifications.map((spec, index) => (
                        <motion.div 
                          key={index} 
                          className="flex justify-between rounded-lg bg-gray-50 p-3 hover:bg-gray-100 transition-colors border border-gray-100"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          <span className="font-medium text-gray-700">{spec.key}</span>
                          <span className="text-gray-600">{spec.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm">
                    <h3 className="text-xl font-display font-semibold mb-4 flex items-center">
                      <span className="bg-primary/10 text-primary p-1.5 rounded-md mr-2">
                        <Users className="h-5 w-5" />
                      </span>
                      Seller Information
                    </h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center">
                          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mr-3 border border-primary/10 shadow-sm">
                            <Users className="h-7 w-7 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="font-semibold text-lg">{mockAuction.seller.name}</p>
                              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            </div>
                            <div className="flex items-center">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(mockAuction.seller.rating)
                                        ? 'text-amber-400'
                                        : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-muted-foreground">
                                {mockAuction.seller.rating} ({mockAuction.seller.totalSales} sales)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-gray-200 shadow-sm hover:bg-gray-50">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Contact Seller
                        </Button>
                        <Button variant="default" size="sm" className="bg-primary shadow-sm">
                          View All Listings
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="manifest" className="mt-0">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Manifest Header */}
                  <div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-xl font-display font-semibold flex items-center">
                          <FileText className="h-5 w-5 text-blue-500 mr-2" />
                          Auction Manifest
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          Detailed inventory list of all items included in this auction lot
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 shadow-sm">
                          <FileText className="h-4 w-4 mr-1.5" />
                          Download Excel
                        </Button>
                        <Button variant="outline" className="border-gray-200 shadow-sm hover:bg-gray-50">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Print Manifest
                        </Button>
                      </div>
                    </div>
                    
                    {/* Manifest Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <p className="text-sm text-muted-foreground">Total Items</p>
                        <p className="text-2xl font-bold">10 units</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <p className="text-sm text-muted-foreground">Retail Value</p>
                        <p className="text-2xl font-bold">${mockAuction.retailValue.toLocaleString('en-US')}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <p className="text-sm text-muted-foreground">Condition</p>
                        <p className="text-2xl font-bold">Used - Good</p>
                      </div>
                    </div>
                    
                    {/* Manifest Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Item #</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Description</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Model</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Condition</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Retail Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {[...Array(10)].map((_, index) => (
                            <tr key={index} className="bg-white hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 font-medium text-gray-700">#{index + 1}</td>
                              <td className="px-4 py-3 text-gray-700">iPhone 12 Pro {['Graphite', 'Silver', 'Gold', 'Pacific Blue'][index % 4]}</td>
                              <td className="px-4 py-3 text-gray-600">{['128GB', '256GB'][index % 2]}</td>
                              <td className="px-4 py-3">
                                <Badge variant="outline" className={
                                  index % 3 === 0 
                                    ? "bg-green-50 text-green-700 border-green-200" 
                                    : index % 3 === 1 
                                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                      : "bg-gray-50 text-gray-700 border-gray-200"
                                }>
                                  {index % 3 === 0 ? "Excellent" : index % 3 === 1 ? "Good" : "Fair"}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-700">${(850 + (index * 50)).toLocaleString('en-US')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Manifest Notes */}
                  <div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm">
                    <h3 className="text-lg font-semibold mb-3">Manifest Notes</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                      <p className="text-sm">
                        <strong>Important:</strong> All items have been tested for basic functionality. Cosmetic condition varies as described in the manifest. 
                        Some devices may have minor scratches or signs of use. All sales are final.
                      </p>
                    </div>
                    
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>Manifest last updated: April 24, 2023 at 10:15 AM EST</p>
                      <p className="mt-1">For questions about this manifest, please contact the seller directly.</p>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="history" className="mt-0">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-lg border bg-white overflow-hidden"
                >
                  <div className="p-4 bg-muted/20 border-b">
                    <h3 className="font-semibold flex items-center">
                      <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                      Bid History
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This auction has received {bidHistory.length} bids so far
                    </p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-muted/10 border-b">
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Bidder</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Amount</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {bidHistory.map((bid, index) => (
                          <motion.tr 
                            key={index}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className={index === 0 ? "bg-green-50" : ""}
                          >
                            <td className="px-4 py-3 font-medium">
                              {bid.user === "You" ? (
                                <span className="text-primary font-semibold">{bid.user}</span>
                              ) : bid.user}
                            </td>
                            <td className="px-4 py-3 font-semibold">
                              ${bid.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              {index === 0 && (
                                <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                                  Highest Bid
                                </Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{bid.time}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="shipping" className="mt-0">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="rounded-lg border p-6 bg-white">
                    <h3 className="text-xl font-display font-semibold mb-4 flex items-center">
                      <Truck className="mr-2 h-5 w-5 text-primary" />
                      Shipping Options
                    </h3>
                    <div className="space-y-4">
                      {mockAuction.shippingOptions.includes('Freight') && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="rounded-lg border p-4 hover:bg-muted/5 transition-colors"
                        >
                          <h4 className="font-medium flex items-center">
                            <Truck className="h-4 w-4 mr-2 text-blue-500" />
                            Freight Shipping
                          </h4>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Freight shipping is available for this item. The buyer is responsible for arranging freight shipping.
                            Our team can provide recommendations for freight carriers in your area.
                          </p>
                          <div className="mt-3 bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                            <p className="font-medium">Freight Shipping Tips:</p>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                              <li>Request quotes from multiple carriers</li>
                              <li>Confirm dimensions and weight with the seller</li>
                              <li>Arrange pickup within 5 business days of auction end</li>
                            </ul>
                          </div>
                        </motion.div>
                      )}
                      {mockAuction.shippingOptions.includes('Pickup') && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="rounded-lg border p-4 hover:bg-muted/5 transition-colors"
                        >
                          <h4 className="font-medium flex items-center">
                            <Package className="h-4 w-4 mr-2 text-green-500" />
                            Local Pickup
                          </h4>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Local pickup is available from our {mockAuction.location} warehouse. Schedule pickup after winning the auction.
                            Pickup hours are Monday-Friday, 9am-5pm.
                          </p>
                          <div className="mt-3 bg-green-50 p-3 rounded-md text-sm text-green-800">
                            <p className="font-medium">Pickup Instructions:</p>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                              <li>Bring your invoice and ID</li>
                              <li>Arrange pickup appointment at least 24 hours in advance</li>
                              <li>Bring appropriate vehicle and loading assistance</li>
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border p-6 bg-white">
                    <h3 className="text-xl font-display font-semibold mb-4 flex items-center">
                      <DollarSign className="mr-2 h-5 w-5 text-primary" />
                      Payment Information
                    </h3>
                    <div className="space-y-4">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-lg border p-4 hover:bg-muted/5 transition-colors"
                      >
                        <h4 className="font-medium">Accepted Payment Methods</h4>
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {mockAuction.paymentOptions.map((option, index) => (
                            <div key={index} className="flex items-center justify-center rounded-md border p-3 bg-muted/10">
                              <span className="text-sm font-medium">{option}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="rounded-lg border p-4 hover:bg-muted/5 transition-colors"
                      >
                        <h4 className="font-medium">Payment Terms</h4>
                        <div className="mt-2 space-y-3">
                          <p className="text-sm text-muted-foreground">
                            Full payment is due within 3 business days of auction end. A buyer's premium of 10% will be added to the final bid price.
                          </p>
                          <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-800">
                            <p className="font-medium">Important Payment Notes:</p>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                              <li>Late payments may result in cancellation of sale</li>
                              <li>All sales are final - no returns or exchanges</li>
                              <li>Buyer is responsible for all applicable taxes and fees</li>
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
        
        {/* Related Auctions - Simplified version to ensure it works */}
        <div className="mt-16">
          <h2 className="text-2xl font-display font-semibold mb-6">Similar Auctions</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockAuctions.map((auction, index) => (
              <div
                key={auction.id}
                className="group rounded-lg border bg-white overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <Link to={`/auctions/${auction.id}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={auction.imageUrl} 
                      alt={auction.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-sm">
                        ${auction.currentBid}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {auction.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {auction.timeLeft}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {auction.watchers} watching
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline">
              <Link to="/auctions" className="flex items-center">
                View All Auctions <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuctionDetail;
