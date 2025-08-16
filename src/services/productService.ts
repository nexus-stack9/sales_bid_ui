/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from 'js-cookie';
import { useState } from 'react';
import { getUserIdFromToken } from './crudService';

export interface UserProductCounts {
  wishlist_count: number;
  bids_count: number;
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
  auction_end: string ;
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
  pagination: PaginationInfo;
}

// Legacy response type for backward compatibility
interface LegacyProductResponse {
  success: boolean;
  count: number;
  data: Product[];
}

/**
 * Fetches all products from the API with pagination
 * @param page The page number (default: 1)
 * @param limit The number of records per page (default: 20)
 * @returns Promise with the paginated list of products
 */
export const getProducts = async (
  page: number = 1, 
  limit: number = 20
): Promise<PaginatedProductResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/products?page=${page}&limit=${limit}`, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('authToken')}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

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
export const getFirstPage = async (limit: number = 20): Promise<PaginatedProductResponse> => {
  return getProducts(1, limit);
};

export const getNextPage = async (currentPage: number, limit: number = 20): Promise<PaginatedProductResponse> => {
  return getProducts(currentPage + 1, limit);
};

export const getPrevPage = async (currentPage: number, limit: number = 20): Promise<PaginatedProductResponse> => {
  return getProducts(currentPage - 1, limit);
};

export const getSpecificPage = async (page: number, limit: number = 20): Promise<PaginatedProductResponse> => {
  return getProducts(page, limit);
};

/**
 * Hook for managing paginated products state
 */
export const usePaginatedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async (page: number = 1, limit: number = 20) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getProducts(page, limit);
      
      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadNextPage = async () => {
    if (pagination?.hasNextPage) {
      await loadProducts(pagination.nextPage!, pagination.recordsPerPage);
    }
  };

  const loadPrevPage = async () => {
    if (pagination?.hasPrevPage) {
      await loadProducts(pagination.prevPage!, pagination.recordsPerPage);
    }
  };

  const loadSpecificPage = async (page: number) => {
    if (pagination) {
      await loadProducts(page, pagination.recordsPerPage);
    }
  };

  const refreshCurrentPage = async () => {
    if (pagination) {
      await loadProducts(pagination.currentPage, pagination.recordsPerPage);
    }
  };

  return {
    products,
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
export const getUserProductCounts = async (userId: string | number): Promise<{ success: boolean; data: UserProductCounts }> => {
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