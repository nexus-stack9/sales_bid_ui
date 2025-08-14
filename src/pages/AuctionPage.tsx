/* eslint-disable prefer-const */
import * as React from 'react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Filter, SlidersHorizontal, Grid3X3, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import ProductCard from './ProductCard';
import FilterPanel from './FilterPanel';
import { Product, FilterState, SortOption } from '@/types/auction';
import { getProducts } from '@/services/productService';
// import { useWishlist } from '@/contexts/WishlistContext';
import dayjs from 'dayjs';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useMediaQuery } from '../hooks/use-media-query';

const AuctionPage: React.FC = () => {
  //   const { wishlist } = useWishlist();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('ending-soon');
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    locations: [],
    priceRange: [0, 50000],
    timeLeft: [],
    condition: [],
    searchQuery: '',
  });

  // Hide bottom navbar on mobile when filters are open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.classList.add('filter-open');
    } else {
      document.body.classList.remove('filter-open');
    }
    return () => {
      document.body.classList.remove('filter-open');
    };
  }, [isFilterOpen]);

  // Define API product type
  interface ApiProduct {
    product_id: number;
    name: string;
    image_path?: string;
    max_bid_amount?: string;
    starting_price: string;
    auction_end: string;
    total_bids: string;
    condition?: 'New' | 'Like New' | 'Good' | 'Fair' | 'Used';
    location?: string;
    category_name?: string;
    description?: string;
    vendor_name?: string;
    retail_value?: string;
  }

  // Map API response to Product type
  const mapApiProductToProduct = useCallback((apiProduct: ApiProduct): Product => {
    // Map condition to match Product type
    const condition = (apiProduct.condition === 'Used' ? 'Fair' : 
                      apiProduct.condition || 'Fair') as 'New' | 'Like New' | 'Good' | 'Fair' | 'Used';
    
    const startingPrice = parseFloat(apiProduct.starting_price || '0');
    const retailValue = apiProduct.retail_value ? parseFloat(apiProduct.retail_value) : undefined;
    
    const categoryName = apiProduct.category_name || 'Uncategorized';
    
    return {
      id: apiProduct.product_id.toString(),
      name: apiProduct.name,
      image: apiProduct.image_path?.split(',')[0] || '/placeholder-product.jpg',
      description: apiProduct.description || 'No description available',
      currentBid: parseFloat(apiProduct.max_bid_amount || apiProduct.starting_price || '0'),
      totalBids: parseInt(apiProduct.total_bids || '0', 10),
      timeLeft: apiProduct.auction_end,
      location: apiProduct.location || 'Unknown',
      category: categoryName,
      category_name: categoryName,
      seller: apiProduct.vendor_name || 'Unknown Seller',
      startingBid: startingPrice,
      buyNowPrice: startingPrice * 1.5,
      condition,
      isWishlisted: false,
      retail_value: retailValue,
    };
  }, []);

  // Fetch products from API
  useEffect(() => {
    // Type guard to check if the response is valid
    const isValidApiResponse = (data: unknown): data is { success: boolean; data: ApiProduct[] } => {
      if (!data || typeof data !== 'object') return false;
      const response = data as Record<string, unknown>;
      return 'success' in response && 
             'data' in response && 
             Array.isArray(response.data);
    };
    
    // Type guard for the error response
    const isErrorResponse = (data: unknown): data is { message: string } => {
      return !!data && typeof data === 'object' && 'message' in data && 
             typeof (data as { message: unknown }).message === 'string';
    };

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getProducts();
        if (isValidApiResponse(response) && response.success) {
          const mappedProducts = response.data.map(mapApiProductToProduct);
          setAllProducts(mappedProducts);
          setDisplayedProducts(mappedProducts.slice(0, isMobile ? itemsPerPage * currentPage : itemsPerPage));
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        const errorMessage = isErrorResponse(err) ? err.message : 'Failed to load auctions. Please try again later.';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast, itemsPerPage, currentPage, mapApiProductToProduct, isMobile]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo((): Product[] => {
    let filtered = allProducts.filter((product) => {
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
  }, [allProducts, filters, sortBy]);

  // Update displayed products when filters/sort change or when loading state changes
  useEffect(() => {
    if (!isLoading) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newProducts = filteredAndSortedProducts.slice(0, isMobile ? itemsPerPage * currentPage : endIndex);
      
      setDisplayedProducts((prev) => {
        // Only update if the products have actually changed
        return JSON.stringify(prev) !== JSON.stringify(newProducts) ? newProducts : prev;
      });
      
      setHasMore(filteredAndSortedProducts.length > (isMobile ? itemsPerPage * currentPage : endIndex));
    }
  }, [filteredAndSortedProducts, currentPage, itemsPerPage, isLoading, isMobile]);
  
  // Reset to first page when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);
  
  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Show max 5 page numbers at a time
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the start or end
      if (currentPage <= 3) {
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Skeleton while loading
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Desktop Filter Sidebar Skeleton */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-40" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-4">
                    <Skeleton className="w-full h-48 rounded-lg" />
                    <div className="mt-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex items-center justify-between pt-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const loadMoreProducts = () => {
    setCurrentPage(prev => prev + 1);
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
    setCurrentPage(1);
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
                products={allProducts}
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

              {isMobile ? (
                hasMore && (
                  <div className="flex justify-center">
                    <Button
                      onClick={loadMoreProducts}
                      className="w-full md:w-auto"
                    >
                      Load More
                    </Button>
                  </div>
                )
              ) : (
                totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        
                        {getPageNumbers().map((page, index) => (
                          <PaginationItem key={index}>
                            {page === '...' ? (
                              <span className="px-3 py-1">...</span>
                            ) : (
                              <PaginationLink
                                onClick={() => setCurrentPage(page as number)}
                                isActive={currentPage === page}
                                className={`cursor-pointer ${currentPage === page ? 'bg-primary text-white hover:text-white' : ''}`}
                              >
                                {page}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )
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
        products={allProducts}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />
    </Layout>
  );
};

export default AuctionPage;