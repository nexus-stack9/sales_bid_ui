
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Users, Award } from 'lucide-react';
import { useInView } from '@/utils/scrollAnimation';

const Hero = () => {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const [typed, setTyped] = useState("");
  const fullText = "Premium Auction Deals";
  
  useEffect(() => {
    if (isInView) {
      let currentIndex = 0;
      const intervalId = setInterval(() => {
        setTyped(fullText.substring(0, currentIndex + 1));
        currentIndex++;
        
        if (currentIndex === fullText.length) {
          clearInterval(intervalId);
        }
      }, 100);
      
      return () => clearInterval(intervalId);
    }
  }, [isInView]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 -z-10">
        <svg className="w-full" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0,140 C320,100 420,180 720,120 C1020,60 1120,80 1440,100 L1440,0 L0,0 Z" 
            fill="#1A365D" 
            fillOpacity="0.05"
          />
        </svg>
      </div>
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`max-w-2xl transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl font-display font-bold tracking-tight sm:text-5xl lg:text-6xl mb-3">
              Discover <span className="text-primary relative">
                <span className="relative z-10">{typed}</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-secondary/30 -z-10 skew-x-3"></span>
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Find exceptional value on surplus, salvage, and returned inventory from top retailers and manufacturers.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-4">
              <Link to="/auctions">
                <Button size="lg" className="group bg-primary hover:bg-primary-600 shadow-lg hover:shadow-xl transition-all">
                  Browse Auctions
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/sell">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary-50 transition-all">
                  Sell With Us
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className={`flex items-center transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
                <div className="p-2 rounded-full bg-secondary/20 mr-3">
                  <Package className="h-5 w-5 text-secondary-800" />
                </div>
                <div>
                  <p className="font-medium text-sm">1000+</p>
                  <p className="text-xs text-gray-500">Premium Auctions</p>
                </div>
              </div>
              
              <div className={`flex items-center transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
                <div className="p-2 rounded-full bg-primary/10 mr-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">10,000+</p>
                  <p className="text-xs text-gray-500">Active Buyers</p>
                </div>
              </div>
              
              <div className={`flex items-center transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
                <div className="p-2 rounded-full bg-accent/10 mr-3">
                  <Award className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">35%</p>
                  <p className="text-xs text-gray-500">Avg. Savings</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`relative transition-all duration-1000 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="absolute -z-10 w-72 h-72 rounded-full bg-gradient-to-r from-secondary/30 to-accent/20 blur-3xl -right-10 -top-10"></div>
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform">
              <img 
                src="https://images.unsplash.com/photo-1600401836478-f791a4d95d96?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2070" 
                alt="Featured auction items"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-xs font-medium uppercase tracking-wider mb-1 text-secondary">Featured</p>
                <h3 className="text-lg font-display font-medium">Luxury Electronics Bundle</h3>
                <p className="text-sm text-white/80">Ending in 2 days</p>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Latest Stats</h3>
                  <p className="text-sm text-muted-foreground">Average savings of 35%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
