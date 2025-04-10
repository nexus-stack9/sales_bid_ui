
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import AuctionGrid from '@/components/auction/AuctionGrid';

// Mock data for auctions
const mockAuctions = [
  {
    id: '1',
    title: 'Apple iPhone 12 Pro - Lot of 10 Units - Fully Tested',
    imageUrl: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 2100,
    timeLeft: '2d 6h',
    watchers: 34,
    featured: true,
    category: 'Electronics'
  },
  {
    id: '2',
    title: 'Designer Handbags - Mixed Brands - New and Return Condition',
    imageUrl: 'https://images.unsplash.com/photo-1587467512961-120760940315?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 870,
    timeLeft: '1d 12h',
    watchers: 27,
    featured: true,
    category: 'Fashion'
  },
  {
    id: '3',
    title: 'Top-Brand Kitchen Appliances - Reseller Bundle - 20 Units',
    imageUrl: 'https://images.unsplash.com/photo-1593348354863-e8f9f10bcc1d?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 1450,
    timeLeft: '3d 4h',
    watchers: 19,
    featured: false,
    category: 'Home Goods'
  },
  {
    id: '4',
    title: 'Premium Jewelry Collection - Gold & Silver - Retail $10K+',
    imageUrl: 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 3200,
    timeLeft: '6h 30m',
    watchers: 42,
    featured: true,
    category: 'Jewelry'
  },
  {
    id: '5',
    title: 'Samsung 4K Smart TVs - Customer Return Lot - 5 Units',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 1275,
    timeLeft: '4d 10h',
    watchers: 23,
    featured: false,
    category: 'Electronics'
  },
  {
    id: '6',
    title: 'Designer Sunglasses - Mixed Brands - 50 Units',
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 980,
    timeLeft: '2d 15h',
    watchers: 18,
    featured: false,
    category: 'Fashion'
  },
  {
    id: '7',
    title: 'Premium Fitness Equipment - Home Gym Bundle',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 750,
    timeLeft: '1d 8h',
    watchers: 31,
    featured: false,
    category: 'Sports'
  },
  {
    id: '8',
    title: 'Luxury Watch Collection - Swiss Made - 3 Units',
    imageUrl: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=1000',
    currentBid: 4500,
    timeLeft: '12h 45m',
    watchers: 47,
    featured: false,
    category: 'Jewelry'
  }
];

const AuctionsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">All Auctions</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Find and bid on premium inventory at great prices
          </p>
        </div>

        <AuctionGrid auctions={mockAuctions} />
        
        <div className="mt-10 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium bg-primary text-white">
              1
            </button>
            <button className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
              2
            </button>
            <button className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
              3
            </button>
            <span className="px-2">...</span>
            <button className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
              8
            </button>
            <button className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
              Next
            </button>
          </nav>
        </div>
      </div>
    </Layout>
  );
};

export default AuctionsPage;
