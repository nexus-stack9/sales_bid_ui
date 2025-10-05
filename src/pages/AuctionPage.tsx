/* eslint-disable prefer-const */
import * as React from "react";
import { useState, useEffect, useRef } from "react";
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
import { useLocation } from "react-router-dom";

const AuctionPage: React.FC = () => {
  const { pathname } = useLocation();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("ending_soon");
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const location = useLocation();
  
  // Use ref to prevent initial load race conditions
  const hasInitiallyLoaded = useRef(false);
  const lastRequestRef = useRef<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [filtersInitialized, setFiltersInitialized] = useState(false);

  // Mobile infinite scroll accumulation
  const [mobileMappedProducts, setMobileMappedProducts] = useState<Product[]>([]);
  const [previousPage, setPreviousPage] = useState<number>(0);

  // Track if we're waiting for wishlist data to prevent flickering
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const {
    products: apiProducts,
    filterOptions,
    pagination,
    loading: isLoading,
    error: apiError,
    loadProducts,
    loadNextPage,
    loadPrevPage,
    loadSpecificPage
  } = usePaginatedProducts();

  // Scroll-based infinite scroll for mobile
  useEffect(() => {
    if (!isMobile) return;

    let ticking = false;
    const threshold = 1800; // Trigger after approximately 15th item (5 items * ~360px height)

    const handleScroll = () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        if (
          scrollTop + clientHeight >= scrollHeight - threshold &&
          pagination?.hasNextPage &&
          !isLoading
        ) {
          loadNextPage();
        }
        ticking = false;
      });
      ticking = true;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, pagination?.hasNextPage, isLoading, loadNextPage]);

  // Accumulate mapped products for mobile infinite scroll
  useEffect(() => {
    if (!pagination || !isMobile) return;

    const currentPage = pagination.currentPage;

    if (currentPage === 1) {
      setIsWishlistLoading(true);
      const mapped = apiProducts.map(mapApiProductToProduct);
      setMobileMappedProducts(mapped);
      setPreviousPage(1);
      // Small delay to ensure wishlist state is reflected
      setTimeout(() => setIsWishlistLoading(false), 50);
    } else if (currentPage > previousPage && apiProducts.length > 0) {
      const newBatch = apiProducts.map(mapApiProductToProduct);
      setMobileMappedProducts(prev => [...prev, ...newBatch]);
      setPreviousPage(currentPage);
    }
  }, [apiProducts, pagination?.currentPage, isMobile, previousPage]);

  // Update maxPrice if higher values found in new mobile products
  useEffect(() => {
    if (!isMobile || mobileMappedProducts.length === 0) return;

    const prices = mobileMappedProducts
      .map(p => typeof p.retail_value === 'number' ? p.retail_value : (p.retail_value || 0))
      .filter(Number.isFinite);
    const newMaxPrice = prices.length > 0 ? Math.max(...prices) : 50000;

    if (newMaxPrice > maxPrice) {
      setMaxPrice(newMaxPrice);
    }
  }, [mobileMappedProducts, isMobile, maxPrice]);

  // Generate skeleton products
  const generateSkeletonProducts = (count: number, startIndex: number): Product[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `skeleton-${startIndex + i}`,
      name: "",
      image: "",
      description: "",
      currentBid: 0,
      totalBids: 0,
      timeLeft: new Date().toISOString(),
      location: "",
      category: "",
      category_name: "",
      seller: "",
      startingBid: 0,
      buyNowPrice: 0,
      condition: "",
      isWishlisted: false,
      retail_value: 0,
    } as Product));
  };

  // Product Skeleton Component
  const ProductSkeleton: React.FC<{ key: string }> = ({ key: skey }) => (
    <div key={skey} className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative aspect-square bg-gray-100">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        <div className="pt-2">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );

  // Calculate dynamic max price from API products
  const calculateMaxPrice = (): number => {
    if (!apiProducts || apiProducts.length === 0) return 50000;
    const calculatedMaxPrice = Math.max(...apiProducts
      .map(p => typeof p.retail_value === 'string' ? parseFloat(p.retail_value) : (p.retail_value || 0))
      .filter(Number.isFinite)
    );
    return calculatedMaxPrice > 0 ? calculatedMaxPrice : 50000;
  };

  // Initialize filters state with null priceRange initially
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    locations: [],
    priceRange: [0, 50000],
    timeLeft: [],
    condition: [],
    searchQuery: "",
  });

  // Helper to get query param
  const getCategoryFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("category");
  };

  // Set category from query param whenever location.search changes
  useEffect(() => {
    const category = getCategoryFromQuery();
    setFilters((prev) => ({
      ...prev,
      categories: category ? [category] : [],
    }));
    lastRequestRef.current = ""; // Reset request so API is called
  }, [location.search]);

  // Update maxPrice and initialize filters properly when products first load
  useEffect(() => {
    if (apiProducts && apiProducts.length > 0 && !filtersInitialized) {
      const newMaxPrice = calculateMaxPrice();
      setMaxPrice(newMaxPrice);
      
      // Initialize filters with the correct max price
      setFilters((prev) => ({
        ...prev,
        priceRange: [0, newMaxPrice] as [number, number],
      }));
      
      setFiltersInitialized(true);
    }
  }, [apiProducts, filtersInitialized]);

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

  // Function to map API products to Product type
  const mapApiProductToProduct = (apiProduct): Product => {
    const productData = apiProduct.product_id ? apiProduct : apiProduct;

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

    const isWishlisted = Boolean(productData.is_in_wishlist);

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
        isWishlisted,
        retail_value: retailValue,
      };
    } catch (error) {
      console.error("Error mapping product:", productData, error);
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

  // Function for client-side sorting
  const sortProducts = (products: Product[], sortOption: SortOption): Product[] => {
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
        return sortedProducts.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      case "popularity":
        return sortedProducts.sort((a, b) => b.totalBids - a.totalBids);
      default:
        return sortedProducts;
    }
  };

  // Map and sort products
  const getMappedProducts = (): Product[] => {
    if (isMobile) {
      let prods = mobileMappedProducts;
      if (isLoading && mobileMappedProducts.length > 0) {
        const skeletons = generateSkeletonProducts(20, mobileMappedProducts.length);
        prods = [...prods, ...skeletons];
      }
      return prods;
    } else {
      if (!apiProducts.length) return [];
      const mapped = apiProducts.map(mapApiProductToProduct);
      return sortProducts(mapped, sortBy);
    }
  };

  // Create a single load function with debouncing
  const loadProductsWithParams = async (
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
        currentFilters.priceRange[1] < maxPrice
          ? currentFilters.priceRange[1]
          : undefined,
      sortBy: currentSortBy,
      page: page,
      limit: limit,
    };

    const requestId = JSON.stringify({ searchParams, page, limit });
    
    if (lastRequestRef.current === requestId) {
      return;
    }
    
    lastRequestRef.current = requestId;
    
    try {
      await loadProducts(page, limit, searchParams);
    } catch (error) {
      lastRequestRef.current = "";
      throw error;
    }
  };

  // Single effect for initial load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await loadProductsWithParams(1, 20);
        // Only mark as loaded after we have products with wishlist data
        // Give a small delay to ensure wishlist data is processed
        setTimeout(() => {
          hasInitiallyLoaded.current = true;
        }, 100);
      } catch (error) {
        console.error('Error loading initial data:', error);
        hasInitiallyLoaded.current = true; // Mark as loaded even on error
      }
    };
    
    if (!hasInitiallyLoaded.current) {
      loadInitialData();
    }
  }, []);

  // Separate effect for filters and sorting changes with debouncing
  useEffect(() => {
    if (!hasInitiallyLoaded.current) return;

    // Reset mobile products when filters or sort change
    if (isMobile) {
      setMobileMappedProducts([]);
      setPreviousPage(0);
    }

    const timer = setTimeout(() => {
      loadProductsWithParams(1, 20, filters, sortBy);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, sortBy]);

  // Reset to first page when filters or sort change
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    lastRequestRef.current = "";
  };

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
    lastRequestRef.current = "";
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    loadSpecificPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    if (pagination?.hasPrevPage) {
      loadPrevPage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (pagination?.hasNextPage) {
      loadNextPage();
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(totalPages - 3, 2);
      }

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

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
      priceRange: [0, maxPrice],
      timeLeft: [],
      condition: [],
      searchQuery: "",
    });
    lastRequestRef.current = "";
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    return (
      filters.categories.length +
      filters.locations.length +
      filters.timeLeft.length +
      filters.condition.length +
      (filters.searchQuery ? 1 : 0) +
      (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0)
    );
  };

  // Get showing info for results
  const getShowingInfo = () => {
    if (!pagination) return { start: 0, end: 0, total: 0 };

    const perPage = pagination.recordsPerPage;
    let start = 1;
    let end = 0;

    if (isMobile) {
      let currentLength = mobileMappedProducts.length;
      if (isLoading && mobileMappedProducts.length > 0) {
        currentLength += 20;
      }
      end = currentLength;
      start = 1;
    } else {
      start = (pagination.currentPage - 1) * perPage + 1;
      end = Math.min(pagination.currentPage * perPage, pagination.totalRecords);
    }

    return {
      start,
      end: Math.min(end, pagination.totalRecords),
      total: pagination.totalRecords,
    };
  };

  // Results info component
  const ResultsInfo = () => {
    const { start, end, total } = getShowingInfo();
    if (total === 0) return null;

    return (
      <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
        <span>
          Showing {start} to {end} of {total} results
        </span>

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
  };

  // Pagination component
  const PaginationComponent = () => {
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
  };

  // No products message
  const NoProductsMessage = () => {
    const realProductsLength = getMappedProducts().filter(p => !p.id.startsWith('skeleton')).length;
    if (isLoading || realProductsLength > 0) return null;

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
  };

  // Force refresh function
  const forceRefresh = () => {
    lastRequestRef.current = "";
    loadProductsWithParams(1, 20);
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <Layout>
      <div className="container mx-auto px-3 sm:px-4 py-6 animate-pulse">
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar Skeleton */}
          <div className="hidden lg:block w-80 flex-shrink-0 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/3 mb-2" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              
              <div className="space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-8 ml-auto" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <div className="space-y-4">
                  <Skeleton className="h-2 w-full rounded-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <Skeleton className="h-10 w-28 rounded-md" />
              <Skeleton className="h-10 w-40 rounded-md" />
            </div>

            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-4 w-48" />
              <div className="hidden lg:block">
                <Skeleton className="h-10 w-48" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="relative aspect-square bg-gray-100">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                    <div className="pt-2">
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-md" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );

  // Show skeleton while loading OR while waiting for maxPrice calculation OR while products are empty on initial load OR while wishlist is loading
  if (isLoading || !filtersInitialized || (!hasInitiallyLoaded.current && apiProducts.length === 0) || isWishlistLoading) {
    return <SkeletonLoader />;
  }

  const allProducts = getMappedProducts();
  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Layout>
      <div className="container mx-auto px-3 sm:px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar - Only render when filters are initialized */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                isOpen={true}
                onClose={() => {}}
                filters={filters}
                filterOptions={filterOptions}
                products={allProducts.filter(p => !p.id.startsWith('skeleton'))}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearFilters}
                forceRefresh={forceRefresh}
                maxPrice={maxPrice}
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
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
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

            {/* Results Info */}
            <ResultsInfo />

            {/* Products Grid */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-6">
                {allProducts.map((product) =>
                  product.id.startsWith("skeleton") ? (
                    <ProductSkeleton key={product.id} />
                  ) : (
                    <ProductCard key={product.id} product={product} />
                  )
                )}
              </div>

              {/* No products message */}
              <NoProductsMessage />

              {/* Desktop Pagination */}
              {!isMobile && <PaginationComponent />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        filterOptions={filterOptions}
        products={allProducts.filter(p => !p.id.startsWith('skeleton'))}
        onFiltersChange={handleFiltersChange}
        onClearFilters={clearFilters}
        forceRefresh={forceRefresh}
        maxPrice={maxPrice}
      />
    </Layout>
  );
};

export default AuctionPage;