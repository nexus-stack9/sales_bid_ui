export interface Product {
    id: string;
    name: string;
    image: string;
    currentBid: number;
    totalBids: number;
    timeLeft: string; // ISO string
    location: string;
    category: string;
    seller: string;
    startingBid: number;
    buyNowPrice?: number;
    condition: 'New' | 'Like New' | 'Good' | 'Fair';
    isWishlisted?: boolean;
  }
  
  export interface FilterState {
    categories: string[];
    locations: string[];
    priceRange: [number, number];
    timeLeft: string[];
    condition: string[];
    searchQuery: string;
  }
  
  export type SortOption = 'newest' | 'ending-soon' | 'most-bids' | 'lowest-price' | 'highest-price';