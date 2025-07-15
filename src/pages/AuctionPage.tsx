/* eslint-disable prefer-const */
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, Grid3X3, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ProductCard from './ProductCard';
import FilterPanel from './FilterPanel';
import { Product, FilterState, SortOption } from '@/types/auction';
import { mockProducts } from '@/data/mockProducts';
// import { useWishlist } from '@/contexts/WishlistContext';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';
import Layout from '@/components/layout/Layout';

const AuctionPage: React.FC = () => {
  //   const { wishlist } = useWishlist();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('ending-soon');
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [itemsToShow, setItemsToShow] = useState(8);
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    locations: [],
    priceRange: [0, 50000],
    timeLeft: [],
    condition: [],
    searchQuery: '',
  });

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = mockProducts.filter((product) => {
      // Search query
      if (filters.searchQuery && !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      
      // Categories
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }
      
      // Locations
      if (filters.locations.length > 0 && !filters.locations.includes(product.location)) {
        return false;
      }
      
      // Price range
      if (product.currentBid < filters.priceRange[0] || product.currentBid > filters.priceRange[1]) {
        return false;
      }
      
      // Condition
      if (filters.condition.length > 0 && !filters.condition.includes(product.condition)) {
        return false;
      }
      
      // Time left
      if (filters.timeLeft.length > 0) {
        const now = dayjs();
        const endTime = dayjs(product.timeLeft);
        const hoursLeft = endTime.diff(now, 'hours');
        
        const matchesTimeFilter = filters.timeLeft.some(filter => {
          switch (filter) {
            case '1h': return hoursLeft < 1;
            case '12h': return hoursLeft < 12;
            case '24h': return hoursLeft < 24;
            case '1d+': return hoursLeft >= 24;
            default: return false;
          }
        });
        
        if (!matchesTimeFilter) return false;
      }
      
      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return dayjs(b.timeLeft).diff(dayjs(a.timeLeft));
        case 'ending-soon':
          return dayjs(a.timeLeft).diff(dayjs(b.timeLeft));
        case 'most-bids':
          return b.totalBids - a.totalBids;
        case 'lowest-price':
          return a.currentBid - b.currentBid;
        case 'highest-price':
          return b.currentBid - a.currentBid;
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters, sortBy]);

  // Update displayed products when filters change
  useEffect(() => {
    setDisplayedProducts(filteredAndSortedProducts.slice(0, itemsToShow));
    setHasMore(filteredAndSortedProducts.length > itemsToShow);
  }, [filteredAndSortedProducts, itemsToShow]);

  const loadMoreProducts = () => {
    const newItemsToShow = itemsToShow + 8;
    setItemsToShow(newItemsToShow);
    setDisplayedProducts(filteredAndSortedProducts.slice(0, newItemsToShow));
    setHasMore(filteredAndSortedProducts.length > newItemsToShow);
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      locations: [],
      priceRange: [0, 50000],
      timeLeft: [],
      condition: [],
      searchQuery: '',
    });
    setItemsToShow(8);
  };

  const getActiveFiltersCount = () => {
    return (
      filters.categories.length +
      filters.locations.length +
      filters.timeLeft.length +
      filters.condition.length +
      (filters.searchQuery ? 1 : 0) +
      (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000 ? 1 : 0)
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                isOpen={true}
                onClose={() => {}}
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Bar */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-48">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Sort by
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ending-soon">Ending Soon</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="most-bids">Most Bids</SelectItem>
                  <SelectItem value="lowest-price">Lowest Price</SelectItem>
                  <SelectItem value="highest-price">Highest Price</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid/List */}
            <div className="space-y-6">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} viewMode="list" />
                  ))}
                </div>
              )}

              {hasMore && (
                <div className="flex justify-center">
                  <Button
                    onClick={loadMoreProducts}
                    className="w-full md:w-auto"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />
    </Layout>
  );
};

export default AuctionPage;