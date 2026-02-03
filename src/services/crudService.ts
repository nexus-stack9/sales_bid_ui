import Cookies from 'js-cookie';
import { handleTokenValidation } from '@/utils/authUtils';

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';


/**
 * Decodes a JWT token and extracts the payload
 * @param token The JWT token to decode
 * @returns The decoded payload as an object
 */
const decodeJwtToken = (token: string) => {
  try {
    // JWT tokens are split into three parts: header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

/**
 * Gets the user ID from the JWT token stored in cookies
 * @returns The user ID from the token, or null if not found
 */
export const getUserIdFromToken = (): string | null => {
  try {
    const token = Cookies.get('authToken');
    if (!token) {
      return null;
    }

    const decodedToken = decodeJwtToken(token);
    // Assuming the user ID is stored in the 'sub' or 'userId' field
    // Adjust this based on your actual token structure
    return decodedToken?.sub || decodedToken?.userId || null;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
};

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

/**
 * Updates the user profile with the provided data
 * @param profileData The profile data to update
 * @returns The response data from the API
 */
export const updateProfile = async (profileData: ProfileData) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(`${API_BASE_URL}/profile/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      if (handleTokenValidation(response)) {
        throw new Error('Session expired. Please log in again.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update profile');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates the user's password
 * @param passwordData Object containing current and new password
 * @returns The response data from the API
 */
export const updatePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(`${API_BASE_URL}/profile/update-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      },
      body: JSON.stringify(passwordData)
    });

    if (!response.ok) {
      if (handleTokenValidation(response)) {
        throw new Error('Session expired. Please log in again.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update password');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches the user profile details by ID
 * @param userId The ID of the user to fetch details for
 * @returns The response data from the API containing user profile details
 */
export const getProfileDetails = async (userId: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(`${API_BASE_URL}/profile/details/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    });

    if (!response.ok) {
      if (handleTokenValidation(response)) {
        throw new Error('Session expired. Please log in again.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch profile details');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }



};

export const placeOrder = async (productId: string, orderAmount: number) => {
  try {
    const bidderId = getUserIdFromToken();
    
    if (!bidderId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/bids/placeBid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      },
      body: JSON.stringify({
        product_id: productId,
        bidder_id: bidderId,
        bid_amount: orderAmount
      })
    });
    
    if (!response.ok) {
      if (handleTokenValidation(response)) {
        throw new Error('Session expired. Please log in again.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to place order');
    }
    
    const result = await response.json();
    
    // Trigger a wishlist update to refresh the orders count
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('wishlist-update'));
    }
    
    return result;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};


/**
 * Adds a product to the user's wishlist
 * @param productId The ID of the product to add to wishlist
 * @param bidderId The ID of the user adding to wishlist
 * @returns The response data from the API
 */
export const addToWishlist = async (productId: string, bidderId: string) => {
  try {
    const token = Cookies.get('authToken');
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/wishlist/addToWishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        product_id: productId,
        bidder_id: bidderId
      })
    });

    if (!response.ok) {
      if (handleTokenValidation(response)) {
        throw new Error('Session expired. Please log in again.');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add to wishlist');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

/**
 * Fetches the wishlist for a specific user
 * @param userId The ID of the user whose wishlist to fetch
 * @returns Promise containing the wishlist items
 */
export const getUserWishlist = async (userId: string) => {
  try {
    const token = Cookies.get('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/wishlist/getWishlist/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (handleTokenValidation(response)) {
        throw new Error('Session expired. Please log in again.');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch wishlist');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

/**
 * Removes a product from the user's wishlist
 * @param productId The ID of the product to remove from wishlist
 * @param bidderId The ID of the user removing from wishlist
 * @returns The response data from the API
 */
export const removeFromWishlist = async (productId: string, bidderId: string) => {
  try {
    const token = Cookies.get('authToken');
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/wishlist/removeFromWishlist`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        product_id: productId,
        bidder_id: bidderId
      })
    });

    if (!response.ok) {
      if (handleTokenValidation(response)) {
        throw new Error('Session expired. Please log in again.');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove from wishlist');
    }

    return await response.json();
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

/**
 * Checks if a product is in the user's wishlist
 * @param productId The ID of the product to check
 * @param userId The ID of the user
 * @returns Promise<boolean> True if the item is in the wishlist, false otherwise
 */
export const checkWishlistItem = async (productId: string, userId: string): Promise<boolean> => {
  try {
    const token = Cookies.get('authToken');
    if (!token) {
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/wishlist/checkWishlistItem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        product_id: productId,
        bidder_id: userId
      })
    });

    if (!response.ok) {
      if (handleTokenValidation(response)) {
        return false;
      }
      return false;
    }

    const data = await response.json();
    return data.exists || false;
  } catch (error) {
    console.error('Error checking wishlist item:', error);
    return false;
  }
};

export interface Order {
  bid_id: number;
  bidder_id: number;
  product_id: number;
  bid_amount: string;
  bid_time: string;
  is_auto_bid: boolean;
  product_name: string;
  description: string;
  starting_price: string;
  auction_start: string;
  auction_end: string;
  status: 'active' | 'won' | 'lost' | 'outbid' | 'ended';
  image_path: string;
  location: string;
  quantity: number;
  tags: string;
  max_bid_amount: string;
}

/**
 * Fetches all orders for a specific user
 * @param bidderId The ID of the user whose orders to fetch
 * @returns Promise<Order[]> Array of order objects with product details  getOrdersById
 */
// types.ts
export interface GroupedUserOrders {
  winning: Order[];
  losing: Order[];
  won: Order[];
  lost: Order[];
}

// crudService.ts
/**
 * Fetches grouped order data (winning/losing/won/lost) for a specific user
 * This wraps the legacy /bids/userBids endpoint and normalizes the grouped structure
 */
export const getUserOrdersGrouped = async (userId: string): Promise<GroupedUserOrders> => {
  try {
    const token = Cookies.get('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // 🔁 Uses legacy bids endpoint to retrieve grouped data
    const response = await fetch(`${API_BASE_URL}/bids/userBids/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error fetching grouped orders: ${errorData.message || response.statusText}`);
    }

    const data: GroupedUserOrders = await response.json();

    // Validate structure
    return {
      winning: Array.isArray(data.winning) ? data.winning : [],
      losing: Array.isArray(data.losing) ? data.losing : [],
      won: Array.isArray(data.won) ? data.won : [],
      lost: Array.isArray(data.lost) ? data.lost : []
    };
  } catch (error) {
    console.error('Error fetching grouped user orders:', error);
    return { winning: [], losing: [], won: [], lost: [] };
  }
};


export const getOrdersById = async (userId: string): Promise<Order[]> => {
  try {
    const token = Cookies.get('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/bids/getBidById/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error fetching user orders: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    // Normalize the response to match our Order interface
    if (Array.isArray(data)) {
      return data.map(item => ({
        bid_id: item.bid_id,
        bidder_id: item.bidder_id,
        product_id: item.product_id,
        bid_amount: item.bid_amount?.toString() || '0',
        bid_time: item.bid_time,
        is_auto_bid: item.is_auto_bid || false,
        product_name: item.product_name || 'Unknown Product',
        description: item.description || '',
        starting_price: item.starting_price?.toString() || '0',
        auction_start: item.auction_start,
        auction_end: item.auction_end,
        status: item.status || 'active',
        image_path: item.image_path || '',
        location: item.location || '',
        quantity: item.quantity || 1,
        tags: item.tags || '',
        max_bid_amount: item.max_bid_amount?.toString() || '0'
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new Error('Failed to fetch your orders. Please try again later.');
  }
};


interface UploadFileResponse {
  success: boolean;
  message?: string;
  file?: {
    url: string;
    key: string;
    fileName: string;
  };
  files?: any[]; // for multi-upload
}

/**
 * Upload a single file to the server
 * @param file The file to upload
 * @param path The path/folder to store the file in
 */
export const uploadFile = async (
  file: File,
  path: string
): Promise<UploadFileResponse> => {
  try {
    const token = Cookies.get('authToken');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path); // backend will expect "path"

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/single`, {
      method: 'POST',
      headers, // don't set Content-Type → fetch will set multipart boundary automatically
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`File upload failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in uploadFile:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload file',
    };
  }
};

/**
 * Upload multiple files to different paths
 * @param files Array of files
 * @param paths Array of paths (must match files length)
 */
export const uploadMultipleFiles = async (
  files: File[],
  path: string
): Promise<UploadFileResponse> => {
  try {
    const token = Cookies.get('authToken');
    const formData = new FormData();
console.log(files)
    files.forEach((file) => {
      console.log(file)
      formData.append('files', file); // backend expects req.files
    });

    // Send single path string
    formData.append('path', path);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    console.log(formData)

    const response = await fetch(`${API_BASE_URL}/file/multiple-upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Multi file upload failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in uploadMultipleFiles:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload files',
    };
  }
};


/**
 * Fetches the user's orders by user ID
 * @param userId The ID of the user to fetch orders for
 * @returns The response data from the API containing user orders
 */
/**
 * Fetches order details by order ID
 * @param orderId The ID of the order to fetch
 * @returns The response data from the API containing order details
 */
export const getOrderById = async (orderId: string | number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/details/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    });

    if (!response.ok) {
      if (handleTokenValidation(response)) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error('Failed to fetch order details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getOrderById:', error);
    throw error;
  }
};

/**
 * Fetches the user's orders by user ID
 * @param userId The ID of the user to fetch orders for
 * @returns The response data from the API containing user orders
 */
export const getUserOrders = async (userId: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(`${API_BASE_URL}/profile/orders/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('authToken')}`
      }
    });

    if (!response.ok) {
      if (handleTokenValidation(response)) {
        throw new Error('Session expired. Please log in again.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch user orders');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

