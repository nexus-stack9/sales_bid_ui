/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from 'js-cookie';
import { useState, useCallback } from 'react';
import { getUserIdFromToken } from './crudService';

export interface UserProductCounts {
  wishlist_count: number;
  bids_count: number;
}

export interface SearchParams {
  q?: string;
  categories?: string[];
  locations?: string[];
  condition?: string[];
  timeLeft?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'ending_soon' | 'newest' | 'popularity';
  page?: number;
  limit?: number;
}

export interface FilterOptions {
  categories: string[];
  locations: string[];
  conditions: string[];
}

export interface SearchResponse {
  success: boolean;
  data: Product[];
  filterOptions: FilterOptions;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  appliedFilters: {
    categories: string[];
    locations: string[];
    conditions: string[];
    timeLeft: string[];
    priceRange: [number, number];
    searchQuery: string | null;
  };
}

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface Product {
  product_id: string | number;
  seller_id: string | number;
  name: string;
  description: string;
  starting_price: string | number;
  category_id: string | number;
  auction_start: string;
  auction_end: string;
  status: string;
  created_at: string;
  retail_value: string | number;
  location: string;
  shipping: string;
  quantity: number;
  image_path: string;
  created_by: string;
  vendor_id: string | number | null;
  trending: string | null;
  tags: string;
  no_watching: number;
  category_name: string;
  vendor_name: string | null;
  total_bids: string | number;
  max_bid_amount: string | number;
  condition: string;
}

// Pagination types
interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

interface PaginatedProductResponse {
  success: boolean;
  data: Product[];
  filterOptions: FilterOptions;
  pagination: PaginationInfo;
}

// Legacy response type for backward compatibility
interface LegacyProductResponse {
  success: boolean;
  count: number;
  data: Product[];
}

/**
 * Fetches all products from the API with pagination and filters
 * @param page The page number (default: 1)
 * @param limit The number of records per page (default: 20)
 * @param filters Search parameters including query, filters, and pagination
 * @returns Promise with the paginated list of products
 */
export const getProducts = async (
  page: number = 1, 
  limit: number = 20,
  filters: Partial<SearchParams> = {}
): Promise<PaginatedProductResponse> => {
  try {
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    // Add pagination
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    // Add filters
    if (filters.q) queryParams.append('searchQuery', filters.q);
    
    if (filters.categories && filters.categories.length > 0) {
      filters.categories.forEach(category => queryParams.append('categories', category));
    }
    
    if (filters.locations && filters.locations.length > 0) {
      filters.locations.forEach(location => queryParams.append('locations', location));
    }
    
    if (filters.condition && filters.condition.length > 0) {
      filters.condition.forEach(condition => queryParams.append('condition', condition));
    }
    
    if (filters.timeLeft && filters.timeLeft.length > 0) {
      filters.timeLeft.forEach(time => queryParams.append('timeLeft', time));
    }
    
    if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice.toString());
    
    // Add sorting - map UI values to database column names
    if (filters.sortBy) {
      queryParams.append('sortBy', filters.sortBy);
    }

    const token = Cookies.get('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      // Get user ID from token and add it to query params
      const userId = getUserIdFromToken();
      if (userId) {
        queryParams.append('userId', userId);
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/products?${queryParams.toString()}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch products');
    }

    // Fixed: Removed the incorrect destructuring
    const data: PaginatedProductResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Legacy function for backward compatibility
 * Fetches all products without pagination (returns first 1000 records)
 * @deprecated Use getProducts() with pagination instead
 * @returns Promise with all products
 */
export const getAllProducts = async (): Promise<LegacyProductResponse> => {
  try {
    const response = await getProducts(1, 1000); // Get first 1000 records
    return {
      success: response.success,
      count: response.data.length,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

// Additional utility functions for easier pagination handling
export const getFirstPage = async (limit: number = 20, filters: Partial<SearchParams> = {}): Promise<PaginatedProductResponse> => {
  return getProducts(1, limit, filters);
};

export const getNextPage = async (currentPage: number, limit: number = 20, filters: Partial<SearchParams> = {}): Promise<PaginatedProductResponse> => {
  return getProducts(currentPage + 1, limit, filters);
};

export const getPrevPage = async (currentPage: number, limit: number = 20, filters: Partial<SearchParams> = {}): Promise<PaginatedProductResponse> => {
  return getProducts(currentPage - 1, limit, filters);
};

export const getSpecificPage = async (page: number, limit: number = 20, filters: Partial<SearchParams> = {}): Promise<PaginatedProductResponse> => {
  return getProducts(page, limit, filters);
};

/**
 * Hook for managing paginated products state with filters
 */
export const usePaginatedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    locations: [],
    conditions: []
  });
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async (page: number = 1, limit: number = 20, filters: Partial<SearchParams> = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Remove sortBy from filters
      const { sortBy, ...restFilters } = filters;
      const response = await getProducts(page, limit, restFilters);
      
      if (response.success) {
        setProducts(response.data);
        setFilterOptions(response.filterOptions);
        setPagination(response.pagination);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadNextPage = useCallback(async () => {
    if (pagination?.hasNextPage && pagination.currentPage) {
      await loadProducts(pagination.currentPage + 1, pagination.recordsPerPage, {});
    }
  }, [pagination, loadProducts]);

  const loadPrevPage = useCallback(async () => {
    if (pagination?.hasPrevPage && pagination.currentPage && pagination.currentPage > 1) {
      await loadProducts(pagination.currentPage - 1, pagination.recordsPerPage, {});
    }
  }, [pagination, loadProducts]);

  const loadSpecificPage = useCallback(async (page: number) => {
    if (pagination?.recordsPerPage) {
      await loadProducts(page, pagination.recordsPerPage, {});
    }
  }, [pagination, loadProducts]);

  const refreshCurrentPage = useCallback(() => {
    if (pagination) {
      loadProducts(pagination.currentPage, pagination.recordsPerPage);
    }
  }, [pagination, loadProducts]);

  return {
    products,
    filterOptions,
    pagination,
    loading,
    error,
    loadProducts,
    loadNextPage,
    loadPrevPage,
    loadSpecificPage,
    refreshCurrentPage
  };
};

/**
 * Fetches a single product by ID
 * @param productId The ID of the product to fetch
 * @returns Promise with the product details
 */
export const getProductById = async (productId: string): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Adds a product to the user's wishlist
 * @param productId The ID of the product to add to wishlist
 * @returns Promise with the response data
 */
export const addToWishlist = async (productId: number): Promise<any> => {
  try {
    const userId = getUserIdFromToken();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add to wishlist');
    }

    const result = await response.json();
    
    // Trigger wishlist update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('wishlist-update'));
    }
    
    return result;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

/**
 * Removes a product from the user's wishlist
 * @param productId The ID of the product to remove from wishlist
 * @returns Promise with the response data
 */
export const removeFromWishlist = async (productId: number): Promise<any> => {
  try {
    const userId = getUserIdFromToken();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/wishlist/remove/${userId}/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove from wishlist');
    }

    const result = await response.json();
    
    // Trigger wishlist update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('wishlist-update'));
    }
    
    return result;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

interface WishlistResponse {
  success: boolean;
  count: number;
  data: Array<{
    id: number;
    user_id: number;
    product_id: number;
    created_date_time: string;
    [key: string]: unknown;
  }>;
}

/**
 * Gets the user's wishlist
 * @returns Promise with the wishlist response containing count and data
 */
export const getWishlist = async (): Promise<WishlistResponse> => {
  try {
    const userId = getUserIdFromToken();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/wishlist/getWishlist/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch wishlist');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

/**
 * Checks if a product is in the user's wishlist
 * @param productId The ID of the product to check
 * @returns Promise with boolean indicating if product is in wishlist
 */
export const isInWishlist = async (productId: number): Promise<boolean> => {
  try {
    const wishlist = await getWishlist();
    if ('data' in wishlist && Array.isArray(wishlist.data)) {
      return wishlist.data.some(item => item.product_id === productId);
    }
    return false;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};

/**
 * Fetches product counts for a specific user
 * @param userId The ID of the user to get counts for
 * @returns Promise with the user's product counts
 */
export const getUserProductCounts = async (userId: string | number): Promise<{ success: boolean;  UserProductCounts }> => {
  try {
    const token = Cookies.get('authToken'); // Changed from 'token' to 'authToken' to match your auth system

    const response = await fetch(`${API_BASE_URL}/profile/userCounts/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch user product counts');
    }
    
    const data = await response.json();
    console.log('getUserProductCounts response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user product counts:', error);
    throw error;
  }
};

/**
 * Searches for products based on various filters and search terms
 * @param params Search parameters including query, filters, and pagination
 * @returns Promise with the search results and pagination info
 */
export const searchProducts = async (params: SearchParams): Promise<SearchResponse> => {
  try {
    // Build query string from params
    const queryParams = new URLSearchParams();
    
    // Add search query if provided
    if (params.q) queryParams.append('searchQuery', params.q);
    
    // Add filters if provided
    if (params.categories && params.categories.length > 0) {
      params.categories.forEach(category => queryParams.append('categories', category));
    }
    
    if (params.locations && params.locations.length > 0) {
      params.locations.forEach(location => queryParams.append('locations', location));
    }
    
    if (params.condition && params.condition.length > 0) {
      params.condition.forEach(condition => queryParams.append('condition', condition));
    }
    
    if (params.timeLeft && params.timeLeft.length > 0) {
      params.timeLeft.forEach(time => queryParams.append('timeLeft', time));
    }
    
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    
    // Add pagination
    const page = params.page || 1;
    const limit = params.limit || 12;
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    const token = Cookies.get('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/products/search?${queryParams.toString()}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to search products');
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};