/* eslint-disable prefer-const */
import * as React from "react";
import { useState, useMemo, useEffect, useCallback, memo, useRef } from "react";
import { Filter, SlidersHorizontal, Grid3X3, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ProductCard from "./ProductCard";
import FilterPanel from "./FilterPanel";
import { Product, FilterState, SortOption } from "@/types/auction";
import { usePaginatedProducts } from "@/services/productService";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "../hooks/use-media-query";
import Layout from "@/components/layout/Layout";

// Memoize the FilterPanel to prevent unnecessary re-renders
const MemoizedFilterPanel = memo(FilterPanel);
MemoizedFilterPanel.displayName = "MemoizedFilterPanel";

const AuctionPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("ending_soon");
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Use ref to prevent initial load race conditions
  const hasInitiallyLoaded = useRef(false);
  const lastRequestRef = useRef<string>("");

  const {
    products: apiProducts,
    filterOptions,
    pagination,
    loading: isLoading,
    error: apiError,
    loadProducts,
    loadNextPage,
    loadPrevPage,
    loadSpecificPage,
  } = usePaginatedProducts();

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    locations: [],
    priceRange: [0, 50000],
    timeLeft: [],
    condition: [],
    searchQuery: "",
  });

  // Hide bottom navbar on mobile when filters are open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.classList.add("filter-open");
    } else {
      document.body.classList.remove("filter-open");
    }
    return () => {
      document.body.classList.remove("filter-open");
    };
  }, [isFilterOpen]);

  // Memoize the mapApiProductToProduct function to prevent recreation
  const mapApiProductToProduct = useMemo(() => {
    return (apiProduct): Product => {
      // Ensure we handle the API product structure correctly
      const productData = apiProduct.product_id ? apiProduct : apiProduct;

      // Use the condition as provided by the API
      const condition = productData.condition
        ? productData.condition.toString()
        : "Unknown";

      const startingPrice = parseFloat(
        productData.starting_price?.toString() || "0"
      );
      const maxBidAmount = productData.max_bid_amount
        ? parseFloat(productData.max_bid_amount.toString())
        : startingPrice;
      const retailValue = productData.retail_value
        ? parseFloat(productData.retail_value.toString())
        : undefined;
      const categoryName =
        productData.category_name?.toString() || "Uncategorized";

      try {
        return {
          id: productData.product_id?.toString() || Math.random().toString(),
          name: productData.name?.toString() || "Unnamed Product",
          image:
            productData.image_path?.split(",")[0] || "/placeholder-product.jpg",
          description:
            productData.description?.toString() || "No description available",
          currentBid: maxBidAmount,
          totalBids: parseInt(productData.total_bids?.toString() || "0", 10),
          timeLeft: productData.auction_end || new Date().toISOString(),
          location: productData.location?.toString() || "Unknown",
          category: categoryName,
          category_name: categoryName,
          seller: productData.vendor_name?.toString() || "Unknown Seller",
          startingBid: startingPrice,
          buyNowPrice: startingPrice * 1.5,
          condition,
          isWishlisted: false,
          retail_value: retailValue,
        };
      } catch (error) {
        console.error("Error mapping product:", productData, error);
        // Return a fallback product to prevent the entire list from breaking
        return {
          id: Math.random().toString(),
          name: "Product Error",
          image: "/placeholder-product.jpg",
          description: "Error loading product data",
          currentBid: 0,
          totalBids: 0,
          timeLeft: new Date().toISOString(),
          location: "Unknown",
          category: "Uncategorized",
          category_name: "Uncategorized",
          seller: "Unknown Seller",
          startingBid: 0,
          buyNowPrice: 0,
          condition: "Fair",
          isWishlisted: false,
          retail_value: 0,
        };
      }
    };
  }, []);

  // Show error toast when API error occurs
  useEffect(() => {
    if (apiError) {
      toast({
        title: "Error",
        description: apiError,
        variant: "destructive",
      });
    }
  }, [apiError, toast]);

  // Memoize the mapped products to prevent recreation
  // Add this function for client-side sorting
  const sortProducts = useCallback(
    (products: Product[], sortOption: SortOption): Product[] => {
      if (!products.length) return products;

      const sortedProducts = [...products];

      switch (sortOption) {
        case "price_asc":
          return sortedProducts.sort((a, b) => a.currentBid - b.currentBid);
        case "price_desc":
          return sortedProducts.sort((a, b) => b.currentBid - a.currentBid);
        case "ending_soon":
          return sortedProducts.sort(
            (a, b) =>
              new Date(a.timeLeft).getTime() - new Date(b.timeLeft).getTime()
          );
        case "newest":
          // Assuming newer products have higher IDs or we could use a created_at field
          return sortedProducts.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        case "popularity":
          return sortedProducts.sort((a, b) => b.totalBids - a.totalBids);
        // case "ending_soon":
        default:
          return sortedProducts;
      }
    },
    []
  );

  // Modify the mappedProducts useMemo to include sorting
  const mappedProducts = useMemo((): Product[] => {
    if (!apiProducts.length) return [];
    const mapped = apiProducts.map(mapApiProductToProduct);
    // Apply client-side sorting
    return sortProducts(mapped, sortBy);
  }, [apiProducts, mapApiProductToProduct, sortBy, sortProducts]);

  // Create a single load function with debouncing
  const loadProductsWithParams = useCallback(
    async (
      page: number = 1,
      limit: number = 20,
      currentFilters: FilterState = filters,
      currentSortBy: SortOption = sortBy
    ) => {
      const searchParams = {
        q: currentFilters.searchQuery || undefined,
        categories:
          currentFilters.categories.length > 0
            ? currentFilters.categories
            : undefined,
        locations:
          currentFilters.locations.length > 0
            ? currentFilters.locations
            : undefined,
        condition:
          currentFilters.condition.length > 0
            ? currentFilters.condition
            : undefined,
        timeLeft:
          currentFilters.timeLeft.length > 0
            ? currentFilters.timeLeft
            : undefined,
        minPrice:
          currentFilters.priceRange[0] > 0
            ? currentFilters.priceRange[0]
            : undefined,
        maxPrice:
          currentFilters.priceRange[1] < 50000
            ? currentFilters.priceRange[1]
            : undefined,
        sortBy: currentSortBy,
        page: page,
        limit: limit,
      };

      // Create a unique request identifier
      const requestId = JSON.stringify({ searchParams, page, limit });
      
      // Prevent duplicate requests
      if (lastRequestRef.current === requestId) {
        return;
      }
      
      lastRequestRef.current = requestId;
      
      try {
        await loadProducts(page, limit, searchParams);
      } catch (error) {
        // Reset the request ref on error so retries can happen
        lastRequestRef.current = "";
        throw error;
      }
    },
    [filters, sortBy, loadProducts]
  );

  // Single effect for initial load
  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadProductsWithParams(1, 20);
    }
  }, []); // Empty dependency array for initial load only

  // Separate effect for filters and sorting changes with debouncing
  useEffect(() => {
    // Skip if this is the initial load
    if (!hasInitiallyLoaded.current) return;

    const timer = setTimeout(() => {
      loadProductsWithParams(1, 20, filters, sortBy);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [filters, sortBy, loadProductsWithParams]);

  // Reset to first page when filters or sort change
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    // Reset the request ref when filters change
    lastRequestRef.current = "";
  }, []);

  const handleSortChange = useCallback((newSortBy: SortOption) => {
    setSortBy(newSortBy);
    // Reset the request ref when sort changes
    lastRequestRef.current = "";
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback(
    (page: number) => {
      loadSpecificPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [loadSpecificPage]
  );

  const handlePrevious = useCallback(() => {
    if (pagination?.hasPrevPage) {
      loadPrevPage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pagination, loadPrevPage]);

  const handleNext = useCallback(() => {
    if (pagination?.hasNextPage) {
      loadNextPage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pagination, loadNextPage]);

  // Generate page numbers for pagination
  const getPageNumbers = useMemo(() => {
    return () => {
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
          pages.push("...");
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }

        // Add ellipsis if needed
        if (endPage < totalPages - 1) {
          pages.push("...");
        }

        // Always show last page
        if (totalPages > 1) {
          pages.push(totalPages);
        }
      }

      return pages;
    };
  }, [pagination, isMobile]);

  // Clear filters handler
  const clearFilters = useCallback(() => {
    setFilters({
      categories: [],
      locations: [],
      priceRange: [0, 50000],
      timeLeft: [],
      condition: [],
      searchQuery: "",
    });
    // Reset the request ref when clearing filters
    lastRequestRef.current = "";
  }, []);

  // Get active filters count
  const getActiveFiltersCount = useMemo(() => {
    return () => {
      return (
        filters.categories.length +
        filters.locations.length +
        filters.timeLeft.length +
        filters.condition.length +
        (filters.searchQuery ? 1 : 0) +
        (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000 ? 1 : 0)
      );
    };
  }, [filters]);

  // Memoize the results info component
  const ResultsInfo = useMemo(() => {
    if (!pagination) return null;

    return (
      <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
        <span>
          Showing {(pagination.currentPage - 1) * pagination.recordsPerPage + 1}{" "}
          to{" "}
          {Math.min(
            pagination.currentPage * pagination.recordsPerPage,
            pagination.totalRecords
          )}{" "}
          of {pagination.totalRecords} results
        </span>

        {/* Desktop Sorting UI - Add sorting options here */}
        <div className="hidden lg:block">
          <Select
            value={sortBy}
            onValueChange={(value) => handleSortChange(value as SortOption)}
          >
            <SelectTrigger className="w-48">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Sort by
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ending_soon">Ending Soon</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popularity">Most Bids</SelectItem>
              <SelectItem value="price_asc">Lowest Price</SelectItem>
              <SelectItem value="price_desc">Highest Price</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }, [pagination, sortBy, handleSortChange]);

  // Memoize the pagination component
  const PaginationComponent = useMemo(() => {
    if (!pagination || pagination.totalPages <= 1) return null;

    return (
      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrevious}
                className={
                  !pagination.hasPrevPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <span className="px-3 py-1">...</span>
                ) : (
                  <PaginationLink
                    onClick={() => handlePageChange(page as number)}
                    isActive={pagination.currentPage === page}
                    className={`cursor-pointer ${
                      pagination.currentPage === page
                        ? "bg-primary text-white hover:text-white"
                        : ""
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
                className={
                  !pagination.hasNextPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  }, [
    pagination,
    getPageNumbers,
    handlePrevious,
    handleNext,
    handlePageChange,
  ]);

  // Memoize the no products message
  const NoProductsMessage = useMemo(() => {
    if (isLoading || mappedProducts.length > 0) return null;

    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No products found matching your criteria.
        </p>
        {getActiveFiltersCount() > 0 && (
          <Button variant="outline" onClick={clearFilters} className="mt-4">
            Clear Filters
          </Button>
        )}
      </div>
    );
  }, [isLoading, mappedProducts, getActiveFiltersCount, clearFilters]);

  // Force refresh function
  const forceRefresh = useCallback(() => {
    // Reset the request ref to allow the refresh
    lastRequestRef.current = "";
    loadProductsWithParams(1, 20);
  }, [loadProductsWithParams]);

  // Create a stable key for filter panels to prevent re-rendering
  const filterPanelKey = useMemo(() => "filter-panel", []);

  // Skeleton while loading
  if (isLoading && !hasInitiallyLoaded.current) {
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
              <div className="grid grid-cols-2 gap-3 px-2 sm:px-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 sm:gap-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm p-2 hover:shadow-md transition-shadow duration-200">
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
      <div className="container mx-auto px-3 sm:px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar - Memoized with stable key */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <MemoizedFilterPanel
                key={filterPanelKey}
                isOpen={true}
                onClose={() => {}}
                filters={filters}
                filterOptions={filterOptions}
                products={mappedProducts}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearFilters}
                forceRefresh={forceRefresh}
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

              <Select
                value={sortBy}
                onValueChange={(value) => handleSortChange(value as SortOption)}
              >
                <SelectTrigger className="w-48">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Sort by
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ending_soon">Ending Soon</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popularity">Most Bids</SelectItem>
                  <SelectItem value="price_asc">Lowest Price</SelectItem>
                  <SelectItem value="price_desc">Highest Price</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Info - Memoized - Now includes desktop sorting */}
            {ResultsInfo}

            {/* Products Grid - With key based on loading state */}
            <div className="space-y-6" key={`products-${isLoading}`}>
              {/* Always use grid view for desktop since we removed the view toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-6">
                {mappedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* No products message - Memoized */}
              {NoProductsMessage}

              {/* Pagination - Memoized */}
              {PaginationComponent}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel - Memoized with stable key */}
      <MemoizedFilterPanel
        key={`mobile-${filterPanelKey}`}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        filterOptions={filterOptions}
        products={mappedProducts}
        onFiltersChange={handleFiltersChange}
        onClearFilters={clearFilters}
        forceRefresh={forceRefresh}
      />
    </Layout>
  );
};

export default memo(AuctionPage);