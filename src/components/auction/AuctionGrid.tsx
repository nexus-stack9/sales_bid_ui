
import { useState, useEffect } from 'react';
import AuctionCard from './AuctionCard';
import { Grid, List, SlidersHorizontal, X, Search, Star, Clock, Tag, DollarSign, Package, Filter, ChevronDown, ChevronUp, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetClose 
} from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface Auction {
  id: string | number;
  title: string;
  imageUrl: string;
  currentBid: number;
  msrp?: number;
  timeLeft?: string;
  watchers: number;
  featured: boolean;
  category: string;
  location?: string;
  condition?: string;
  bidsPlaced: number;
  startDate: string;
  endDate: string;
  tags?: string[];
}

interface AuctionGridProps {
  auctions: Auction[];
  title?: string;
}

// Filter options
const categories = [
  'Electronics', 'Fashion', 'Home Goods', 'Jewelry', 'Sports', 'Automotive', 
  'Collectibles', 'Toys', 'Office Supplies', 'Beauty'
];

const conditions = ['New', 'Like New', 'Good', 'Fair', 'Salvage'];
const sortOptions = ['Ending Soon', 'Newest', 'Price: Low to High', 'Price: High to Low', 'Most Watched'];

const AuctionGrid = ({ auctions, title }: AuctionGridProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>(auctions);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Ending Soon');
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    condition: true,
    time: true,
    other: true
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const isMobile = useIsMobile();

  // Toggle section expansion with proper event handling
  const toggleSection = (section: keyof typeof expandedSections, e: React.MouseEvent) => {
    // This is critical - prevent the event from bubbling up
    e.preventDefault();
    e.stopPropagation();
    
    // Update the expanded sections state with a fixed height approach
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Handle condition selection
  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition) 
        : [...prev, condition]
    );
  };

  // Apply filters
  const applyFilters = () => {
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      let results = [...auctions];
      
      // Filter by search term
      if (searchTerm) {
        results = results.filter(auction => 
          auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (auction.condition && auction.condition.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (auction.category && auction.category.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Filter by categories
      if (selectedCategories.length > 0) {
        results = results.filter(auction => 
          selectedCategories.includes(auction.category)
        );
      }
      
      // Filter by price range
      results = results.filter(auction => 
        auction.currentBid >= priceRange[0] && auction.currentBid <= priceRange[1]
      );
      
      // Filter by condition
      if (selectedConditions.length > 0) {
        results = results.filter(auction => {
          if (!auction.condition) return false;
          
          // Check if any of the selected conditions are in the auction's condition
          return selectedConditions.some(condition => 
            auction.condition?.includes(condition)
          );
        });
      }
      
      // Filter featured only
      if (showFeaturedOnly) {
        results = results.filter(auction => auction.featured);
      }
      
      // Sort results
      switch(sortBy) {
        case 'Ending Soon':
          // Sort by end date
          results.sort((a, b) => {
            const aEnd = new Date(a.endDate).getTime();
            const bEnd = new Date(b.endDate).getTime();
            return aEnd - bEnd;
          });
          break;
        case 'Newest':
          // Sort by start date (newest first)
          results.sort((a, b) => {
            const aStart = new Date(a.startDate).getTime();
            const bStart = new Date(b.startDate).getTime();
            return bStart - aStart;
          });
          break;
        case 'Price: Low to High':
          results.sort((a, b) => a.currentBid - b.currentBid);
          break;
        case 'Price: High to Low':
          results.sort((a, b) => b.currentBid - a.currentBid);
          break;
        case 'Most Watched':
          results.sort((a, b) => b.watchers - a.watchers);
          break;
      }
      
      setFilteredAuctions(results);
      setIsLoading(false);
      
      // Show a toast notification with the number of results
      if (results.length === 0) {
        // In a real app, you would use a toast notification system
        console.log("No listings found matching your criteria");
      } else {
        console.log(`Found ${results.length} listings matching your criteria`);
      }
    }, 600);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 5000]);
    setSelectedCategories([]);
    setSelectedConditions([]);
    setShowFeaturedOnly(false);
    setSortBy('Ending Soon');
    setFilteredAuctions(auctions);
  };

  // Apply filters when filter values change
  useEffect(() => {
    // This will run on initial load and when any of these dependencies change
    applyFilters();
  }, [searchTerm, selectedCategories, selectedConditions, priceRange, showFeaturedOnly, sortBy, auctions]);

  // Filter sidebar content - reused in both desktop and mobile views
  const FilterContent = () => (
    <div className="space-y-6 py-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search listings..."
          className="pl-8 bg-background"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {/* Sort options */}
        <div className="pb-2 border-b">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={(e) => toggleSection('other', e)}
          >
            <h3 className="text-sm font-semibold flex items-center">
              <Filter className="h-4 w-4 mr-2" /> Sort By
            </h3>
            {expandedSections.other ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            expandedSections.other ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="pt-2 space-y-1">
              {sortOptions.map(option => (
                <div 
                  key={option}
                  className={`flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
                    sortBy === option ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => setSortBy(option)}
                >
                  {sortBy === option && <Check className="h-4 w-4 mr-2" />}
                  <span className={sortBy === option ? 'ml-2' : 'ml-6'}>{option}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="pb-2 border-b">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={(e) => toggleSection('categories', e)}
          >
            <h3 className="text-sm font-semibold flex items-center">
              <Tag className="h-4 w-4 mr-2" /> Categories
            </h3>
            {expandedSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            expandedSections.categories ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="pt-2 grid grid-cols-2 gap-1">
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <label 
                    htmlFor={`category-${category}`}
                    className="text-sm cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Price Range */}
        <div className="pb-2 border-b">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={(e) => toggleSection('price', e)}
          >
            <h3 className="text-sm font-semibold flex items-center">
              <DollarSign className="h-4 w-4 mr-2" /> Price Range
            </h3>
            {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            expandedSections.price ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="pt-4 px-2">
              <Slider
                defaultValue={[0, 5000]}
                max={5000}
                step={100}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-6"
              />
              <div className="flex items-center justify-between">
                <div className="bg-muted px-2 py-1 rounded-md text-sm">
                  ${priceRange[0]}
                </div>
                <div className="bg-muted px-2 py-1 rounded-md text-sm">
                  ${priceRange[1]}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Condition */}
        <div className="pb-2 border-b">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={(e) => toggleSection('condition', e)}
          >
            <h3 className="text-sm font-semibold flex items-center">
              <Package className="h-4 w-4 mr-2" /> Condition
            </h3>
            {expandedSections.condition ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            expandedSections.condition ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="pt-2 space-y-1">
              {conditions.map(condition => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`condition-${condition}`} 
                    checked={selectedConditions.includes(condition)}
                    onCheckedChange={() => toggleCondition(condition)}
                  />
                  <label 
                    htmlFor={`condition-${condition}`}
                    className="text-sm cursor-pointer"
                  >
                    {condition}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* End Time */}
        <div className="pb-2 border-b">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={(e) => toggleSection('time', e)}
          >
            <h3 className="text-sm font-semibold flex items-center">
              <Clock className="h-4 w-4 mr-2" /> End Time
            </h3>
            {expandedSections.time ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            expandedSections.time ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="pt-2 space-y-1">
              {['Ending Today', 'Ending in 3 Days', 'Ending in 7 Days', 'Ending in 14 Days'].map(option => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox id={`time-${option}`} />
                  <label 
                    htmlFor={`time-${option}`}
                    className="text-sm cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Featured Only */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium">Featured Only</span>
          </div>
          <Switch 
            checked={showFeaturedOnly} 
            onCheckedChange={setShowFeaturedOnly} 
          />
        </div>
        
        {/* Action Buttons - Only show in desktop view since mobile has fixed buttons */}
        {!isMobile && (
          <div className="flex items-center space-x-2 pt-4">
            <Button 
              onClick={applyFilters} 
              className="flex-1"
            >
              Apply Filters
            </Button>
            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative">
      {title && <h2 className="text-2xl font-display font-semibold mb-6">{title}</h2>}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
            className="transition-all duration-300"
          >
            <Grid className="h-4 w-4 mr-1" /> Grid
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
            className="transition-all duration-300"
          >
            <List className="h-4 w-4 mr-1" /> List
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowFilterSheet(true)}
          className="flex items-center sm:hidden"
        >
          <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
        </Button>
        
        {/* Active filters display */}
        {(selectedCategories.length > 0 || selectedConditions.length > 0 || showFeaturedOnly) && (
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            {selectedCategories.map(category => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                {category}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleCategory(category)}
                />
              </Badge>
            ))}
            {selectedConditions.map(condition => (
              <Badge key={condition} variant="secondary" className="flex items-center gap-1">
                {condition}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleCondition(condition)}
                />
              </Badge>
            ))}
            {showFeaturedOnly && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-amber-100 text-amber-800">
                Featured Only
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setShowFeaturedOnly(false)}
                />
              </Badge>
            )}
            {(selectedCategories.length > 0 || selectedConditions.length > 0 || showFeaturedOnly) && (
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-muted"
                onClick={resetFilters}
              >
                Clear All
              </Badge>
            )}
          </div>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden md:block shrink-0 overflow-hidden border-r" style={{ width: sidebarOpen ? '280px' : '0px' }}>
          {sidebarOpen && (
            <div className="w-[280px] pr-4">
              <FilterContent />
            </div>
          )}
        </div>
        
        {/* Mobile Filter Sheet */}
        <Sheet open={showFilterSheet} onOpenChange={setShowFilterSheet}>
          <SheetContent side="right" className="w-[95%] sm:w-[400px] bg-white overflow-hidden flex flex-col h-full">
            <SheetHeader className="sticky top-0 z-10 bg-white pb-2 pt-2">
              <div className="flex items-center justify-between">
                <SheetTitle>Filter Options</SheetTitle>
                <SheetClose className="rounded-full p-1.5 hover:bg-muted">
                  <X className="h-5 w-5" />
                </SheetClose>
              </div>
              <SheetDescription>
                Refine your listing search results
              </SheetDescription>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto pb-24">
              <FilterContent />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t shadow-md flex gap-2">
              <Button 
                onClick={() => {
                  applyFilters();
                  setShowFilterSheet(false);
                }} 
                className="flex-1"
              >
                Apply Filters
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  resetFilters();
                  setShowFilterSheet(false);
                }}
                className="flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-1" /> Reset
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Toggle sidebar button for desktop */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-background shadow-md rounded-full h-8 w-8 -ml-4 hidden md:flex"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronUp className="h-4 w-4 rotate-90" /> : <ChevronDown className="h-4 w-4 -rotate-90" />}
        </Button>
        
        {/* Main content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center min-h-[300px]"
              >
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-4 text-muted-foreground">Loading listings...</p>
                </div>
              </motion.div>
            ) : filteredAuctions.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center min-h-[300px] border rounded-lg p-8"
              >
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No listings found</h3>
                  <p className="mt-2 text-muted-foreground">Try adjusting your filters or search criteria</p>
                  <Button onClick={resetFilters} className="mt-4">
                    Reset Filters
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={
                  viewMode === 'grid'
                    ? `grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-y-6`
                    : "space-y-4"
                }>
                  {filteredAuctions.map((auction, index) => (
                    <motion.div
                      key={auction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="transition-all duration-300"
                    >

                     
                      <AuctionCard
                        id={auction.id}
                        title={auction.title}
                        imageUrl={auction.imageUrl}
                        currentBid={auction.currentBid}
                         startDate="2025-06-06T18:30:00Z"
  endDate="2025-06-07T18:30:00Z"
                        watchers={auction.watchers}
                         bidsPlaced={12}
                          msrp={27499}
                          location="Tanna, Thuringia, Germany"
                        featured={auction.featured}
                        category={auction.category}
                          condition="Used - Fair"
                          // totalPieces={55}
                      />

                      {/* <AuctionCard
  id="1"
  title="Mixed Electronics, 55 Pieces"
  imageUrl="/images/mixed-electronics.jpg"
  currentBid={695}
  msrp={27499}
  timeLeft="0s left"
  watchers={0}
  bidsPlaced={12}
  category="Electronics"
  location="Tanna, Thuringia, Germany"
  condition="Used - Fair"
  totalPieces={55}
/> */}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuctionGrid;
