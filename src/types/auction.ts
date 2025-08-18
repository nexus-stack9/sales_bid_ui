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
  max_bid_amount: string;
  no_watching: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  currentBid: number;
  totalBids: number;
  timeLeft: string;
  location: string;
  category: string;
  category_name: string;
  seller: string;
  startingBid: number;
  buyNowPrice?: number;
  condition: string;
  isWishlisted?: boolean;
  retail_value?: number;
}
  
export interface FilterState {
  categories: string[];
  locations: string[];
  priceRange: [number, number];
  timeLeft: string[];
  condition: string[];
  searchQuery: string;
}
  
export type SortOption = 'price_asc' | 'price_desc' | 'ending_soon' | 'newest' | 'popularity';