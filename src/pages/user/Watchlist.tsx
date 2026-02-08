
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Trash2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock data for watchlist items
const watchlistItems = [
  {
    id: 1,
    title: "Apple MacBook Pro 16\" 2023",
    image: "https://picsum.photos/seed/apple1/300/200",
    currentBid: "$1,299.00",
    timeLeft: "1 day, 4 hours",
    bids: 24
  },
  {
    id: 2,
    title: "Canon EOS R5 Mirrorless Camera",
    image: "https://picsum.photos/seed/canon1/300/200",
    currentBid: "$2,899.00",
    timeLeft: "5 hours, 28 minutes",
    bids: 37
  },
  {
    id: 3,
    title: "Sony WH-1000XM4 Wireless Headphones",
    image: "https://picsum.photos/seed/sony1/300/200",
    currentBid: "$249.99",
    timeLeft: "2 days, 12 hours",
    bids: 18
  },
  {
    id: 4,
    title: "Samsung 65\" OLED 4K TV",
    image: "https://picsum.photos/seed/samsung1/300/200",
    currentBid: "$1,499.00",
    timeLeft: "3 days, 6 hours",
    bids: 11
  }
];

const Watchlist = () => {
  const { toast } = useToast();
  const [items, setItems] = useState(watchlistItems);
  const isMobile = useIsMobile();
  
  const removeFromWatchlist = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your watchlist.",
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">My Watchlist</h1>
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Clock className="mr-2 h-4 w-4" />
              Watch History
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Listings</TabsTrigger>
            <TabsTrigger value="ended">Ended Listings</TabsTrigger>
            <TabsTrigger value="won">Won Listings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {items.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => (
                  <Card key={item.id}>
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-36 md:h-48 object-cover rounded-t-lg"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500"
                        onClick={() => removeFromWatchlist(item.id)}
                      >
                        <Heart className="h-5 w-5 fill-current" />
                      </Button>
                    </div>
                    <CardContent className="p-3 md:p-4">
                      <h3 className="font-semibold text-sm md:text-base line-clamp-2 mb-2">{item.title}</h3>
                      <div className="flex justify-between text-xs md:text-sm mb-1">
                        <span className="text-muted-foreground">Current Price:</span>
                        <span className="font-medium">{item.currentBid}</span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm">
                        <span className="text-muted-foreground">Time Left:</span>
                        <span className="font-medium text-amber-600">{item.timeLeft}</span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm mt-1">
                        <span className="text-muted-foreground">Offers:</span>
                        <span>{item.bids}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 px-3 md:px-4 pb-3 md:pb-4 flex justify-between">
                      <Button size="sm" variant="outline" className="w-[48%] text-xs md:text-sm">
                        View
                      </Button>
                      <Button size="sm" className="w-[48%] text-xs md:text-sm">
                        Place Offer
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Your watchlist is empty</h3>
                <p className="mt-2 text-muted-foreground">
                  Add items to your watchlist to keep track of listings you're interested in.
                </p>
                <Button className="mt-6">Browse Catalog</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ended">
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No ended listings</h3>
              <p className="mt-2 text-muted-foreground">
                Listings you've watched that have ended will appear here.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="won">
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-2xl">🏆</span>
              </div>
              <h3 className="mt-4 text-lg font-medium">No won listings yet</h3>
              <p className="mt-2 text-muted-foreground">
                Listings you've won will appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Watchlist;
