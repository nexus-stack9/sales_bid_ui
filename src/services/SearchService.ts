import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export interface SearchParams {
  q?: string;
  condition?: string;
  location?: string;
  category_name?: string;
  vendor_name?: string;
  limit?: number;
  offset?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  condition: string;
  location: string;
  category_name: string;
  vendor_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  auction_end: string;
  starting_bid: number;
  current_bid?: number;
  total_bids?: number;
  is_wishlisted?: boolean;
}

export interface ApiProduct {
  product_id: number;
  name: string;
  description: string;
  starting_price: string;
  category_id: number;
  auction_start: string;
  auction_end: string;
  status: string;
  created_at: string;
  retail_value: string;
  location: string;
  shipping: string;
  quantity: number;
  image_path: string;
  created_by: string;
  vendor_id: number | null;
  trending: string | null;
  tags: string;
  condition: string;
  category_name: string;
  vendor_name: string | null;
  total_bids: string;
  max_bid_amount: string | null;
  no_watching: string;
}

export interface SearchResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  data: ApiProduct[];
  searchQuery?: string | null;
  appliedFilters: {
    condition: string | null;
    location: string | null;
    category_name: string | null;
    vendor_name: string | null;
  };
}

export const searchProducts = async (params: SearchParams): Promise<SearchResponse> => {
  try {
    const {
      q = '',
      condition,
      location,
      category_name,
      vendor_name,
      limit = 10, // Default limit to 10 as per requirement
      offset = 0,
    } = params;

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (q) queryParams.append('q', q);
    if (condition) queryParams.append('condition', condition);
    if (location) queryParams.append('location', location);
    if (category_name) queryParams.append('category_name', category_name);
    if (vendor_name) queryParams.append('vendor_name', vendor_name);
    queryParams.append('limit', limit.toString());
    if (offset > 0) queryParams.append('offset', offset.toString());

    const response = await axios.get(`${API_BASE_URL}/search/find?${queryParams.toString()}`);

    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};
