
import { useState } from 'react';
import AuctionCard from './AuctionCard';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
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

interface Auction {
  id: string;
  title: string;
  imageUrl: string;
  currentBid: number;
  timeLeft: string;
  watchers: number;
  featured: boolean;
  category: string;
}

interface AuctionGridProps {
  auctions: Auction[];
  title?: string;
}

const AuctionGrid = ({ auctions, title }: AuctionGridProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div>
      {title && <h2 className="text-2xl font-display font-semibold mb-6">{title}</h2>}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        {!isMobile && (
          <div className="flex items-center space-x-2">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4 mr-1" /> Grid
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-1" /> List
            </Button>
          </div>
        )}
        
        {isMobile ? (
          <Sheet open={showFilterSheet} onOpenChange={setShowFilterSheet}>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilterSheet(true)}
              className="flex items-center"
            >
              <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
            </Button>
            <SheetContent side="right" className="w-[90%] sm:w-[400px] bg-white">
              <SheetHeader>
                <SheetTitle>Filter Options</SheetTitle>
                <SheetDescription>
                  Refine your auction search results
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select className="w-full rounded-md border border-input p-2">
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="apparel">Apparel</option>
                    <option value="home-goods">Home Goods</option>
                    <option value="jewelry">Jewelry</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full rounded-md border border-input p-2"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full rounded-md border border-input p-2"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <select className="w-full rounded-md border border-input p-2">
                    <option value="">Any Time</option>
                    <option value="1d">Ending Today</option>
                    <option value="3d">Ending in 3 Days</option>
                    <option value="7d">Ending in 7 Days</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Button className="flex-1">Apply Filters</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowFilterSheet(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
          </Button>
        )}
      </div>
      
      {showFilters && !isMobile && (
        <div className="mb-6 p-4 border rounded-lg bg-muted/30 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select className="w-full rounded-md border border-input p-2">
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="apparel">Apparel</option>
                <option value="home-goods">Home Goods</option>
                <option value="jewelry">Jewelry</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Price Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full rounded-md border border-input p-2"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full rounded-md border border-input p-2"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <select className="w-full rounded-md border border-input p-2">
                <option value="">Any Time</option>
                <option value="1d">Ending Today</option>
                <option value="3d">Ending in 3 Days</option>
                <option value="7d">Ending in 7 Days</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button className="w-full">Apply Filters</Button>
            </div>
          </div>
        </div>
      )}
      
      <div className={
        viewMode === 'grid'
          ? `grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-y-6`
          : "space-y-4"
      }>
        {auctions.map((auction) => (
          <AuctionCard
            key={auction.id}
            id={auction.id}
            title={auction.title}
            imageUrl={auction.imageUrl}
            currentBid={auction.currentBid}
            timeLeft={auction.timeLeft}
            watchers={auction.watchers}
            featured={auction.featured}
            category={auction.category}
          />
        ))}
      </div>
    </div>
  );
};

export default AuctionGrid;
