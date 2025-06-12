import Cookies from 'js-cookie';

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3000';

// WebSocket connection instance
let socket: WebSocket | null = null;
let socketReconnectTimer: number | null = null;
const messageListeners: Map<string, ((data: any) => void)[]> = new Map();

/**
 * Initializes and manages the WebSocket connection
 * @returns The WebSocket instance
 */
export const initWebSocket = (): WebSocket => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }
  
  // Clear any existing reconnect timer
  if (socketReconnectTimer) {
    window.clearTimeout(socketReconnectTimer);
    socketReconnectTimer = null;
  }
  
  // Create new WebSocket connection
  socket = new WebSocket(WS_BASE_URL);
  
  // Set up event handlers
  socket.onopen = () => {
    console.log('WebSocket connection established');
  };
  
  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      const { type, payload } = message;
      
      // Dispatch message to registered listeners
      if (messageListeners.has(type)) {
        messageListeners.get(type)?.forEach(listener => listener(payload));
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  };
  
  socket.onclose = (event) => {
    console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
    
    // Attempt to reconnect after 5 seconds
    socketReconnectTimer = window.setTimeout(() => {
      console.log('Attempting to reconnect WebSocket...');
      initWebSocket();
    }, 5000);
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return socket;
};

/**
 * Registers a listener for a specific message type
 * @param type The message type to listen for
 * @param callback The callback function to execute when a message of this type is received
 * @returns A function to unregister the listener
 */
export const addWebSocketListener = (type: string, callback: (data: any) => void): () => void => {
  if (!messageListeners.has(type)) {
    messageListeners.set(type, []);
  }
  
  messageListeners.get(type)?.push(callback);
  
  // Return a function to remove this listener
  return () => {
    const listeners = messageListeners.get(type);
    if (listeners) {
      messageListeners.set(type, listeners.filter(listener => listener !== callback));
    }
  };
};

/**
 * Sends a message through the WebSocket connection
 * @param type The message type
 * @param payload The message payload
 * @returns A promise that resolves when the message is sent
 */
export const sendWebSocketMessage = (type: string, payload?: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      socket = initWebSocket();
      
      // Wait for the socket to open before sending
      socket.addEventListener('open', () => {
        socket?.send(JSON.stringify({ type, payload }));
        resolve();
      }, { once: true });
      
      // Handle connection error
      socket.addEventListener('error', (error) => {
        reject(error);
      }, { once: true });
    } else {
      // Socket is already open, send immediately
      socket.send(JSON.stringify({ type, payload }));
      resolve();
    }
  });
};

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
      throw new Error('Failed to update profile');
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
      throw new Error('Failed to update password');
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
      throw new Error('Failed to fetch profile details');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Product interface representing the structure of product data
 */
export interface Product {
  id: string;
  title: string;
  imageUrl: string;
  currentBid: number;
  msrp?: number;
  watchers: number;
  featured: boolean;
  category: string;
  location?: string;
  condition?: string;
  bidsPlaced?: number;
  startDate: string;
  endDate: string;
  description?: string;
}

/**
 * Fetches all products using WebSocket
 * @returns A promise that resolves with the products data
 */
export const getAllProductsWS = (): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    try {
      // Initialize WebSocket if not already connected
      initWebSocket();
      
      // Set up a one-time listener for the product list response
      const removeListener = addWebSocketListener('all_products', (data) => {
        removeListener(); // Remove the listener once we get the response
        
        // Map the data to match our Product interface
        const products = data.products.map((product: any) => ({
          id: product.id,
          title: product.title,
          imageUrl: product.imageurl || 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=2070&auto=format&fit=crop',
          currentBid: parseFloat(product.currentbid) || 0,
          msrp: parseFloat(product.msrp) || undefined,
          watchers: parseInt(product.watchers) || 0,
          featured: product.featured || false,
          category: product.category || 'Uncategorized',
          location: product.location || undefined,
          condition: product.condition || 'New',
          bidsPlaced: parseInt(product.bidsplaced) || 0,
          startDate: product.startdate || new Date().toISOString(),
          endDate: product.enddate || new Date(Date.now() + 86400000).toISOString(),
          description: product.description || ''
        }));
        
        resolve(products);
      });
      
      // Set up error handling
      const errorListener = addWebSocketListener('error', (error) => {
        removeListener(); // Clean up the success listener
        errorListener(); // Clean up this error listener
        reject(new Error(error.message || 'Failed to fetch products'));
      });
      
      // Send the request for all products
      sendWebSocketMessage('get_all_products')
        .catch(error => {
          removeListener();
          errorListener();
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Fetches a single product by ID using WebSocket
 * @param productId The ID of the product to fetch
 * @returns A promise that resolves with the product data
 */
export const getProductByIdWS = (productId: string): Promise<Product> => {
  return new Promise((resolve, reject) => {
    try {
      // Initialize WebSocket if not already connected
      initWebSocket();
      
      // Set up a one-time listener for the product response
      const removeListener = addWebSocketListener('product_details', (data) => {
        removeListener(); // Remove the listener once we get the response
        
        // Map the data to match our Product interface
        const product = data.product;
        const mappedProduct: Product = {
          id: product.id,
          title: product.title,
          imageUrl: product.imageurl || 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=2070&auto=format&fit=crop',
          currentBid: parseFloat(product.currentbid) || 0,
          msrp: parseFloat(product.msrp) || undefined,
          watchers: parseInt(product.watchers) || 0,
          featured: product.featured || false,
          category: product.category || 'Uncategorized',
          location: product.location || undefined,
          condition: product.condition || 'New',
          bidsPlaced: parseInt(product.bidsplaced) || 0,
          startDate: product.startdate || new Date().toISOString(),
          endDate: product.enddate || new Date(Date.now() + 86400000).toISOString(),
          description: product.description || ''
        };
        
        resolve(mappedProduct);
      });
      
      // Set up error handling
      const errorListener = addWebSocketListener('error', (error) => {
        removeListener(); // Clean up the success listener
        errorListener(); // Clean up this error listener
        reject(new Error(error.message || 'Failed to fetch product'));
      });
      
      // Send the request for the specific product
      sendWebSocketMessage('get_product_by_id', { id: productId })
        .catch(error => {
          removeListener();
          errorListener();
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};