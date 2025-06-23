import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { getWishlist, removeFromWishlist, Product } from '@/services/productService';
import { motion } from 'framer-motion';
import { Heart, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuctionCard from '@/components/auction/AuctionCard';
import { useToast } from '@/hooks/use-toast';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const data = await getWishlist();
      setWishlistItems(data);
      setError(null);
    } catch (err) {
      setError('Failed to load wishlist. Please try again later.');
      console.error('Error fetching wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
      toast({
        title: 'Item removed',
        description: 'The item has been removed from your wishlist.',
        variant: 'default',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to remove item from wishlist.',
        variant: 'destructive',
      });
      console.error('Error removing from wishlist:', err);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-8">
            <Heart className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-3xl font-display font-bold">My Wishlist</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="mt-4 text-muted-foreground">Loading wishlist...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={fetchWishlist}>Try Again</Button>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-lg">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add items to your wishlist to keep track of auctions you're interested in.
              </p>
              <Button asChild>
                <a href="/auctions">Browse Auctions</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <div key={item.product_id} className="relative group">
                    <AuctionCard
                      id={item.product_id}
                      title={item.product_name}
                      imageUrl={Array.isArray(item.image_url) ? item.image_url[0] : item.image_url}
                      currentBid={item.bid_amount || item.starting_price}
                      watchers={0} // This would come from the API
                      category={item.category_id} // This should be the category name, not ID
                      startDate={item.auction_start}
                      endDate={item.auction_end}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveFromWishlist(item.product_id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default WishlistPage;