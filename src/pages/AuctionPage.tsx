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
import { usePaginatedProducts } from '@/services/productService';
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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Use the paginated products hook
  const {
    products: apiProducts,
    pagination,
    loading: isLoading,
    error: apiError,
    loadProducts,
    loadNextPage,
    loadPrevPage,
    loadSpecificPage
  } = usePaginatedProducts();
  
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
  const mapApiProductToProduct = useCallback((apiProduct: any): Product => {
    // Ensure we handle the API product structure correctly
    const productData = apiProduct.product_id ? apiProduct : apiProduct;
    
    // Map condition to match Product type - be more lenient with mapping
    let condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Used' = 'Fair';
    if (productData.condition) {
      const conditionStr = productData.condition.toString().toLowerCase();
      if (conditionStr.includes('new') && conditionStr.includes('like')) {
        condition = 'Like New';
      } else if (conditionStr.includes('new')) {
        condition = 'New';
      } else if (conditionStr.includes('good')) {
        condition = 'Good';
      } else if (conditionStr.includes('used')) {
        condition = 'Used';
      } else {
        condition = 'Fair';
      }
    }
    
    const startingPrice = parseFloat(productData.starting_price?.toString() || '0');
    const retailValue = productData.retail_value ? parseFloat(productData.retail_value.toString()) : undefined;
    const categoryName = productData.category_name?.toString() || 'Uncategorized';
    
    try {
      return {
        id: productData.product_id?.toString() || Math.random().toString(),
        name: productData.name?.toString() || 'Unnamed Product',
        image: productData.image_path?.split(',')[0] || '/placeholder-product.jpg',
        description: productData.description?.toString() || 'No description available',
        currentBid: parseFloat(productData.max_bid_amount?.toString() || productData.starting_price?.toString() || '0'),
        totalBids: parseInt(productData.total_bids?.toString() || '0', 10),
        timeLeft: productData.auction_end || new Date().toISOString(),
        location: productData.location?.toString() || 'Unknown',
        category: categoryName,
        category_name: categoryName,
        seller: productData.vendor_name?.toString() || 'Unknown Seller',
        startingBid: startingPrice,
        buyNowPrice: startingPrice * 1.5,
        condition,
        isWishlisted: false,
        retail_value: retailValue,
      };
    } catch (error) {
      console.error('Error mapping product:', productData, error);
      // Return a fallback product to prevent the entire list from breaking
      return {
        id: Math.random().toString(),
        name: 'Product Error',
        image: '/placeholder-product.jpg',
        description: 'Error loading product data',
        currentBid: 0,
        totalBids: 0,
        timeLeft: new Date().toISOString(),
        location: 'Unknown',
        category: 'Uncategorized',
        category_name: 'Uncategorized',
        seller: 'Unknown Seller',
        startingBid: 0,
        buyNowPrice: 0,
        condition: 'Fair',
        isWishlisted: false,
        retail_value: 0,
      };
    }
  }, []);

  // Load initial products with 20 items per page (5 rows × 4 columns)
  useEffect(() => {
    loadProducts(1, 20);
  }, []);

  // Show error toast when API error occurs
  useEffect(() => {
    if (apiError) {
      toast({
        title: 'Error',
        description: apiError,
        variant: 'destructive',
      });
    }
  }, [apiError, toast]);

  // Map API products to the expected Product type and apply filters/sorting
  const processedProducts = useMemo((): Product[] => {
    if (!apiProducts.length) return [];
    
    // Map API products to Product type
    const mappedProducts = apiProducts.map(mapApiProductToProduct);
    
    // Debug: Log the number of products before and after filtering
    console.log('API Products received:', apiProducts.length);
    console.log('Mapped products:', mappedProducts.length);
    
    // Check if any filters are actually active
    const hasActiveFilters = (
      filters.categories.length > 0 ||
      filters.locations.length > 0 ||
      filters.timeLeft.length > 0 ||
      filters.condition.length > 0 ||
      filters.searchQuery.length > 0 ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 50000
    );
    
    // If no active filters, return all mapped products with just sorting
    if (!hasActiveFilters) {
      console.log('No active filters, returning all products');
      const sorted = [...mappedProducts].sort((a, b) => {
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
      console.log('Sorted products:', sorted.length);
      return sorted;
    }
    
    // Apply client-side filters only when there are active filters
    let filtered = mappedProducts.filter((product) => {
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
      
      // Price range - only apply if range is modified from default
      if ((filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) && 
          (product.currentBid < filters.priceRange[0] || product.currentBid > filters.priceRange[1])) {
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

    console.log('Filtered products:', filtered.length);

    // Apply client-side sorting
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

    console.log('Final processed products:', filtered.length);
    return filtered;
  }, [apiProducts, filters, sortBy, mapApiProductToProduct]);

  // Update filtered products when processing changes
  useEffect(() => {
    setFilteredProducts(processedProducts);
  }, [processedProducts]);

  // Reset to first page when filters or sort change
  useEffect(() => {
    if (pagination && (pagination.currentPage > 1)) {
      loadProducts(1, 20);
    }
  }, [filters, sortBy]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    loadSpecificPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (pagination?.hasPrevPage) {
      loadPrevPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (pagination?.hasNextPage) {
      loadNextPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!pagination) return [];
    
    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    
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
        endPage = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(totalPages - 3, 2);
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

  // Clear filters handler
  const clearFilters = () => {
    setFilters({
      categories: [],
      locations: [],
      priceRange: [0, 50000],
      timeLeft: [],
      condition: [],
      searchQuery: '',
    });
  };

  // Get active filters count
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
              {/* 5 rows × 4 columns = 20 items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                {Array.from({ length: 20 }).map((_, i) => (
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

  return (
    <Layout>
      <div className="container mx-auto px-2 sm:px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                isOpen={true}
                onClose={() => {}}
                filters={filters}
                products={filteredProducts}
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

            {/* Results Info */}
            {pagination && (
              <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                <span>
                  Showing {((pagination.currentPage - 1) * pagination.recordsPerPage) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.recordsPerPage, pagination.totalRecords)} of{' '}
                  {pagination.totalRecords} results
                </span>
                <span>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
              </div>
            )}

            {/* Products Grid - 4 columns (5 rows × 4 columns = 20 items) */}
            <div className="space-y-6">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} viewMode="list" />
                  ))}
                </div>
              )}

              {/* No products message */}
              {!isLoading && filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                  {getActiveFiltersCount() > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="mt-4"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={handlePrevious}
                          className={!pagination.hasPrevPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === '...' ? (
                            <span className="px-3 py-1">...</span>
                          ) : (
                            <PaginationLink
                              onClick={() => handlePageChange(page as number)}
                              isActive={pagination.currentPage === page}
                              className={`cursor-pointer ${
                                pagination.currentPage === page 
                                  ? 'bg-primary text-white hover:text-white' 
                                  : ''
                              }`}
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={handleNext}
                          className={!pagination.hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
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
        products={filteredProducts}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />
    </Layout>
  );
};

export default AuctionPage;