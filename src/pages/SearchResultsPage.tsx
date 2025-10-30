import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchProducts, SearchResponse, ApiProduct } from '@/services/SearchService';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

export function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';

    if (query) {
      performSearch(query);
    }
  }, [location.search]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const searchResults = await searchProducts({ q: query });
      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch search results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 py-8">

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Searching for products...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!isLoading && results && (
            <>
              <h1 className="text-2xl font-bold mb-6">
                {results.count} results for "{new URLSearchParams(location.search).get('q') || ''}"
              </h1>
              
              {results.count === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No products found matching your search.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/')}
                  >
                    Back to Home
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.data.map((product: ApiProduct) => {
                    // Calculate time left
                    const endDate = new Date(product.auction_end);
                    const now = new Date();
                    const timeDiff = endDate.getTime() - now.getTime();
                    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                    const timeLeft = daysLeft > 0 ? `${daysLeft}d left` : 'Ended';

                    // Parse numeric values with proper fallbacks
                    const startingPrice = parseFloat(product.starting_price?.toString() || '0');
                    const maxBidAmount = product.max_bid_amount
                      ? parseFloat(product.max_bid_amount.toString())
                      : startingPrice;
                    const retailValue = product.retail_value
                      ? parseFloat(product.retail_value.toString())
                      : undefined;
                    const categoryName = product.category_name?.toString() || 'Uncategorized';

                    // Map the API response to match the Product interface
                    const productData = {
                      id: product.product_id?.toString() || '',
                      name: product.name || 'Unnamed Product',
                      image: product.image_path?.split(',')[0] || '/placeholder-product.jpg',
                      description: product.description?.toString() || 'No description available',
                      currentBid: maxBidAmount,
                      totalBids: parseInt(product.total_bids?.toString() || '0', 10),
                      timeLeft: product.auction_end || new Date().toISOString(),
                      location: product.location?.toString() || 'Unknown',
                      category: categoryName,
                      category_name: categoryName,
                      seller: product.vendor_name?.toString() || 'Unknown Seller',
                      startingBid: startingPrice,
                      buyNowPrice: retailValue || startingPrice * 1.5, // Fallback to 1.5x starting price if no retail value
                      condition: product.condition?.toString() || 'Unknown',
                      isWishlisted: false,
                      retail_value: retailValue,
                      auction_end: product.auction_end,
                      tags: product.tags ? product.tags.split(',').map(tag => tag.trim()) : []
                    };
                    
                    return <ProductCard key={product.product_id} product={productData} viewMode="grid" />;
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    // </Layout>
  );
}
