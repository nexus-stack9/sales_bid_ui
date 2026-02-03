
import { useState } from 'react';
import AuctionGrid from '../auction/AuctionGrid';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from '@/utils/scrollAnimation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Mock data for featured products
const featuredProducts = [
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
    featured: true,
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
  }
];

const Featured = () => {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const [showAll, setShowAll] = useState(false);
  const displayedAuctions = showAll ? featuredProducts : featuredProducts.slice(0, 4);

  return (
    <section ref={ref} className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`absolute top-40 right-0 w-96 h-96 bg-gradient-to-bl from-primary-50 to-transparent rounded-full blur-3xl -z-10 opacity-70`}></div>
        <div className={`absolute bottom-20 left-0 w-72 h-72 bg-gradient-to-tr from-secondary-50 to-transparent rounded-full blur-3xl -z-10 opacity-70`}></div>
        
        <div className={`text-center mb-14 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block px-3 py-1 rounded-full bg-primary-50 text-primary text-sm font-medium mb-4">
            Featured
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold">Featured Products</h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked products with exceptional value and verified authenticity
          </p>
        </div>
        
        <div className="md:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id}>
                  <div className="p-1">
                    <div 
                      className={`transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    >
                      <AuctionGrid auctions={[product]} />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4 gap-2">
              <CarouselPrevious className="static translate-y-0 mr-2" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
        
        <div className="hidden md:block">
          <div 
            className={`transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <AuctionGrid auctions={displayedAuctions} />
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/products">
            <Button 
              variant="outline" 
              className={`border-primary text-primary hover:bg-primary-50 transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '300ms' }}
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Featured;
