import Cookies from 'js-cookie';
import { getUserIdFromToken } from './crudService';

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
}

/**
 * Fetches all products from the API
 * @returns Promise with the list of products
 */
export const getProducts = async (): Promise<{success: boolean, count: number, data: Product[]}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to add to wishlist');
    }

    return await response.json();
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

    const response = await fetch(`${API_BASE_URL}/wishlist/remove`, {
      method: 'DELETE',
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to remove from wishlist');
    }

    return await response.json();
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

/**
 * Gets the user's wishlist
 * @returns Promise with the list of products in the wishlist
 */
export const getWishlist = async (): Promise<Product[]> => {
  try {
    const userId = getUserIdFromToken();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/wishlist/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch wishlist');
    }

    const data = await response.json();
    return data;
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
    return wishlist.some(item => item.product_id === productId);
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};