import Layout from "@/components/layout/Layout";

// Sample seller data - expanded from the SellerSpotlight component
const allSellers = [
  {
    id: 1,
    name: "a.k.a. Brands Liquidation Auctions",
    logo: "https://example.com/aka-logo.png",
    category: "Apparel & Footwear",
    auctionCount: 0
  },
  {
    id: 2,
    name: "Ace Hardware Liquidation Auctions",
    logo: "https://example.com/ace-logo.png",
    category: "Industrial Equipment & Tools",
    auctionCount: 7
  },
  {
    id: 3,
    name: "Advance Auto Parts",
    logo: "https://example.com/advance-logo.png",
    category: "Automotive Supplies",
    auctionCount: 0
  },
  {
    id: 4,
    name: "ALMO Liquidation Auctions",
    logo: "https://example.com/almo-logo.png",
    category: "Appliances | Computer Equipment",
    auctionCount: 2
  },
  {
    id: 5,
    name: "Alphabroder Liquidation Auctions",
    logo: "https://example.com/alphabroder-logo.png",
    category: "Apparel & Footwear",
    auctionCount: 8
  },
  {
    id: 6,
    name: "Amazon Liquidation Auctions",
    logo: "https://example.com/amazon-logo.png",
    category: "Apparel & Footwear | Books | Electronics",
    auctionCount: 21
  },
  {
    id: 7,
    name: "Amazon Liquidation Auctions EU",
    logo: "https://example.com/amazon-eu-logo.png",
    category: "Computer Equipment & Electronics",
    auctionCount: 39
  },
  {
    id: 8,
    name: "Ashley Homestore Liquidation Auctions",
    logo: "https://example.com/ashley-logo.png",
    category: "Furniture",
    auctionCount: 0
  },
  {
    id: 9,
    name: "B-Stock Supply",
    logo: "https://example.com/bstock-logo.png",
    category: "Apparel & Footwear | Electronics",
    auctionCount: 0
  },
  {
    id: 10,
    name: "B-Stock Supply EU",
    logo: "https://example.com/bstock-eu-logo.png",
    category: "Apparel & Footwear | Electronics",
    auctionCount: 0
  },
  {
    id: 11,
    name: "Bayer Liquidation Auctions",
    logo: "https://example.com/bayer-logo.png",
    category: "Health & Beauty",
    auctionCount: 0
  },
  {
    id: 12,
    name: "Best Buy Liquidation Auctions",
    logo: "https://example.com/bestbuy-logo.png",
    category: "Appliances | Sports and Outdoors",
    auctionCount: 0
  }
];

const SellersPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold mb-8">All Sellers</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allSellers.map((seller) => (
            <div key={seller.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center p-4 gap-4">
                <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                  {/* Placeholder for seller logo */}
                  <div className="text-2xl font-bold text-gray-400">
                    {seller.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold truncate">{seller.name}</h2>
                  <p className="text-sm text-muted-foreground">{seller.category}</p>
                </div>
              </div>
              <div className="bg-muted px-4 py-3 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  See Listings ({seller.auctionCount})
                </span>
                <button className="text-primary text-sm hover:underline">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SellersPage;