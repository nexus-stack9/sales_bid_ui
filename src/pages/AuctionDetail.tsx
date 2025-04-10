
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Share, Clock, Eye, Truck, Package, AlertTriangle, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock auction data
const mockAuction = {
  id: '1',
  title: 'Apple iPhone 12 Pro - Lot of 10 Units - Fully Tested',
  description: 'This lot contains 10 Apple iPhone 12 Pro devices in various colors. All units have been fully tested and are functional. Minor cosmetic wear on some units. Perfect for resellers or refurbishers.',
  imageUrls: [
    'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1606041011872-596597976b25?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1581795669373-3b1d23f9ee87?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000'
  ],
  currentBid: 2100,
  startingBid: 1000,
  bidIncrement: 50,
  bids: 15,
  timeLeft: '2d 6h',
  endDate: '2025-04-09T18:00:00Z',
  watchers: 34,
  seller: {
    name: 'Tech Liquidators Inc.',
    rating: 4.8,
    totalSales: 342
  },
  category: 'Electronics',
  condition: 'Used - Good',
  retailValue: 8500,
  location: 'Atlanta, GA',
  shippingOptions: ['Freight', 'Pickup'],
  paymentOptions: ['Credit Card', 'Wire Transfer'],
  specifications: [
    { key: 'Brand', value: 'Apple' },
    { key: 'Model', value: 'iPhone 12 Pro' },
    { key: 'Quantity', value: '10 units' },
    { key: 'Storage', value: '128GB - 256GB (mixed)' },
    { key: 'Condition', value: 'Used - Good' },
    { key: 'Testing', value: 'Fully functional' },
    { key: 'Accessories', value: 'No accessories included' },
    { key: 'Returns', value: 'All sales final' }
  ],
  bidHistory: [
    { user: 'buyer567', amount: 2100, time: '2 hours ago' },
    { user: 'tech_deals', amount: 2050, time: '5 hours ago' },
    { user: 'reseller22', amount: 2000, time: '6 hours ago' },
    { user: 'mobilepro', amount: 1950, time: '8 hours ago' },
    { user: 'gadgetking', amount: 1900, time: '10 hours ago' }
  ]
};

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [bidAmount, setBidAmount] = useState<number>(mockAuction.currentBid + mockAuction.bidIncrement);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isWatching, setIsWatching] = useState<boolean>(false);
  const { toast } = useToast();

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Bid Submitted",
      description: `Your bid of $${bidAmount} has been placed.`,
    });
  };

  const toggleWatchlist = () => {
    setIsWatching(!isWatching);
    toast({
      title: isWatching ? "Removed from Watchlist" : "Added to Watchlist",
      description: isWatching ? "This auction has been removed from your watchlist." : "This auction has been added to your watchlist.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div>
            <div className="mb-4 overflow-hidden rounded-lg bg-white">
              <img
                src={mockAuction.imageUrls[selectedImage]}
                alt={mockAuction.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {mockAuction.imageUrls.map((img, index) => (
                <button
                  key={index}
                  className={`overflow-hidden rounded-md border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={img}
                    alt={`Product thumbnail ${index + 1}`}
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Auction Info and Bidding */}
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="badge badge-primary">{mockAuction.category}</span>
                <span className="badge badge-secondary">Lot #{mockAuction.id}</span>
              </div>
              <h1 className="mt-2 text-2xl font-display font-semibold sm:text-3xl">
                {mockAuction.title}
              </h1>
            </div>

            <div className="mb-6 flex items-center justify-between rounded-lg bg-muted/30 p-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Bid</p>
                <p className="text-2xl font-semibold text-primary">${mockAuction.currentBid.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{mockAuction.bids} bids so far</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-sm font-medium text-accent">
                  <Clock className="h-4 w-4" />
                  <span>{mockAuction.timeLeft} left</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Retail Value: ${mockAuction.retailValue.toFixed(2)}
                </p>
              </div>
            </div>

            <form onSubmit={handleBidSubmit} className="mb-6">
              <div className="flex flex-wrap gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium">Your Bid (USD)</label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={mockAuction.currentBid + mockAuction.bidIncrement}
                    step={mockAuction.bidIncrement}
                    className="mt-1 w-full rounded-md border border-input px-3 py-2"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Minimum bid: ${(mockAuction.currentBid + mockAuction.bidIncrement).toFixed(2)}
                  </p>
                </div>
                <Button
                  type="submit"
                  className="mt-auto flex-1"
                >
                  Place Bid
                </Button>
              </div>
            </form>

            <div className="mb-6 flex space-x-3">
              <Button variant="outline" onClick={toggleWatchlist} className="flex-1">
                <Heart className={`mr-2 h-4 w-4 ${isWatching ? 'fill-red-500 text-red-500' : ''}`} />
                {isWatching ? 'Watching' : 'Add to Watchlist'}
              </Button>
              <Button variant="outline" className="flex-1">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="rounded-full bg-muted p-2">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Shipping</h3>
                  <p className="text-sm text-muted-foreground">
                    {mockAuction.shippingOptions.join(', ')} available from {mockAuction.location}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="rounded-full bg-muted p-2">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Condition</h3>
                  <p className="text-sm text-muted-foreground">{mockAuction.condition}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="rounded-full bg-muted p-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <h3 className="font-medium">Important Notice</h3>
                  <p className="text-sm text-muted-foreground">
                    All sales are final. Inspect photos carefully before bidding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details & Specs</TabsTrigger>
              <TabsTrigger value="history">Bid History</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Payment</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-display font-semibold">Description</h3>
                  <div className="mt-3 text-muted-foreground">
                    <p>{mockAuction.description}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold">Specifications</h3>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {mockAuction.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between rounded-lg bg-muted/30 p-3">
                        <span className="font-medium">{spec.key}</span>
                        <span className="text-muted-foreground">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-display font-semibold">Seller Information</h3>
                  <div className="mt-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{mockAuction.seller.name}</p>
                        <div className="mt-1 flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(mockAuction.seller.rating)
                                    ? 'text-secondary'
                                    : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-muted-foreground">
                            {mockAuction.seller.rating} ({mockAuction.seller.totalSales} sales)
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="history" className="mt-6">
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Bidder</th>
                      <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mockAuction.bidHistory.map((bid, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 font-medium">{bid.user}</td>
                        <td className="px-4 py-3">${bid.amount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{bid.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-display font-semibold">Shipping Options</h3>
                  <div className="mt-3 space-y-3">
                    {mockAuction.shippingOptions.includes('Freight') && (
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium">Freight Shipping</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Freight shipping is available for this item. The buyer is responsible for arranging freight shipping.
                        </p>
                      </div>
                    )}
                    {mockAuction.shippingOptions.includes('Pickup') && (
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium">Local Pickup</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Local pickup is available from our {mockAuction.location} warehouse. Schedule pickup after winning the auction.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-display font-semibold">Payment Information</h3>
                  <div className="mt-3 space-y-3">
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium">Accepted Payment Methods</h4>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        {mockAuction.paymentOptions.map((option, index) => (
                          <li key={index}>{option}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium">Payment Terms</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Full payment is due within 3 business days of auction end. A buyer's premium of 10% will be added to the final bid price.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AuctionDetail;
