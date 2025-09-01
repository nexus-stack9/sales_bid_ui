import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, TrendingUp, TrendingDown, Eye, Gavel, ArrowRight, Zap, Award, CheckCircle, Trophy, AlertTriangle } from 'lucide-react';
import BidModal from './BidModal.tsx';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { getUserBids, placeBid, getUserIdFromToken } from '@/services/crudService';
import { BidSkeleton, BidSkeletonMobile } from '@/components/skeletons/BidSkeleton';
import React from 'react';

interface Bid {
  bid_id: number;
  bidder_id: number;
  product_id: number;
  bid_amount: string;
  bid_time: string;
  is_auto_bid: boolean;
  product_name: string;
  description: string;
  starting_price: string;
  auction_start: string;
  auction_end: string;
  status: string;
  image_path: string;
  location: string;
  quantity: number;
  tags: string;
  max_bid_amount: string;
}

const MyBids = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [newBidAmount, setNewBidAmount] = useState('');
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    window.scrollTo(0, 0);
    navigate(`/auctions/${productId}`);
  };

  const handleCardContainerClick = (e: React.MouseEvent, productId: number) => {
    // Only navigate if the click wasn't on a button, link, or other interactive element
    const target = e.target as HTMLElement;
    if (!target.closest('button, a, [role="button"]')) {
      window.scrollTo(0, 0);
      navigate(`/auctions/${productId}`);
    }
  };

  // Memoize the fetchBids function to prevent unnecessary re-renders
  const fetchBids = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const bidderId = getUserIdFromToken();
      if (!bidderId) {
        throw new Error('User not authenticated');
      }
      const bids = await getUserBids(bidderId);
      setItems(bids);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch your bids. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch bids on component mount
  React.useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  // Function to handle successful bid placement
  const handleBidSuccess = React.useCallback(async () => {
    // Refresh the bids data
    await fetchBids();
  }, [fetchBids]);

  const getTimeLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return { text: "Ended", seconds: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return { text: `${days}d ${hours}h`, seconds: diff };
    if (hours > 0) return { text: `${hours}h ${minutes}m`, seconds: diff };
    return { text: `${minutes}m`, seconds: diff };
  };

  const getPaymentTimeLeft = (endDate: string) => {
    const end = new Date(endDate);
    const paymentDueDate = new Date(end.getTime() + 48 * 60 * 60 * 1000);
    const now = new Date();
    const diff = paymentDueDate.getTime() - now.getTime();

    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  };

  const getStatusBadge = (status: string, bidAmount: string, maxBidAmount: string) => {
    const isWinning = parseFloat(bidAmount) >= parseFloat(maxBidAmount);
    const computedStatus = status === 'active' ? (isWinning ? 'winning' : 'losing') : status;

    switch (computedStatus) {
      case 'winning':
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 font-medium shadow-sm">
            <Trophy className="w-3 h-3 mr-1.5" />
            <span>Winning</span>
          </Badge>
        );
      case 'losing':
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 font-medium shadow-sm">
            <AlertTriangle className="w-3 h-3 mr-1.5" />
            <span>Outbid</span>
          </Badge>
        );
      case 'ended':
        if (isWinning) {
          return (
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 font-medium shadow-sm">
              <Trophy className="w-3 h-3 mr-1.5" />
              <span>Won</span>
            </Badge>
          );
        }
        return (
          <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white border-0 font-medium shadow-sm">
            <Clock className="w-3 h-3 mr-1.5" />
            <span>Ended</span>
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handlePlaceBidClick = (item: Bid) => {
    setSelectedBid(item);
    setNewBidAmount((parseFloat(item.max_bid_amount) + 50).toFixed(2));
    setIsModalOpen(true);
  };

  const handlePlaceBid = async () => {
    if (!selectedBid || !newBidAmount) return;

    const minimumBid = parseFloat(selectedBid.max_bid_amount) + 50;
    if (parseFloat(newBidAmount) < minimumBid) {
      toast({
        variant: 'destructive',
        title: 'Invalid Bid',
        description: `Bid amount must be at least ₹${minimumBid.toFixed(2)}`,
      });
      return;
    }

    try {
      const response = await placeBid(
        selectedBid.product_id.toString(),
        parseFloat(newBidAmount)
      );
      
      toast({
        title: 'Success',
        description: `Bid of ₹${newBidAmount} placed successfully!`,
      });

      // Refresh bids after successful bid placement
      const bidderId = '13'; // Replace with actual bidder ID
      const bids = await getUserBids(bidderId);
      setItems(bids);
      
      setIsModalOpen(false);
      setNewBidAmount('');
      setSelectedBid(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to place bid. Please try again.',
      });
    }
  };

  const activeBids = items.filter(item => item.status === 'active');
  const endedBids = items.filter(item => item.status === 'ended');
  const winningBids = items.filter(item => item.status === 'active' && parseFloat(item.bid_amount) >= parseFloat(item.max_bid_amount));
  const losingBids = items.filter(item => item.status === 'active' && parseFloat(item.bid_amount) < parseFloat(item.max_bid_amount));


  const CountdownTimer = ({ endDate }: { endDate: string }) => {
    const [timeLeft, setTimeLeft] = useState(getPaymentTimeLeft(endDate));

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(getPaymentTimeLeft(endDate));
      }, 1000);

      return () => clearInterval(timer);
    }, [endDate]);

    if (!timeLeft) {
      return null;
    }

    return (
      <div className="text-center text-sm text-red-600 font-medium mt-2">
        Payment due in: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </div>
    );
  };

  const BidCard = ({ item }: { item: Bid }) => {
    const timeLeft = getTimeLeft(item.auction_end);
    const isWon = item.status === 'active' && parseFloat(item.bid_amount) >= parseFloat(item.max_bid_amount);

    return (
      <div 
        className="w-[320px] sm:max-w-[280px] mx-auto bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={(e) => handleCardContainerClick(e, item.product_id)}
      >
        <div className="relative pt-[75%] overflow-hidden">
          <img 
            src={item.image_path.split(',')[0]} 
            alt={item.product_name}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 z-10">
            {getStatusBadge(item.status, item.bid_amount, item.max_bid_amount)}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
            {item.product_name}
          </h3>
          
          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-600">My Bid</span>
              <span className="text-sm font-bold text-primary">
                ₹{parseFloat(item.bid_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-600">Highest Bid</span>
              <span className={cn("text-sm font-bold", 
                parseFloat(item.bid_amount) >= parseFloat(item.max_bid_amount) ? "text-emerald-600" : "text-red-600"
              )}>
                ₹{parseFloat(item.max_bid_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-600">Time Left</span>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4" />
                <span className="font-medium text-primary">
                  {timeLeft.text}
                </span>
              </div>
            </div>
          </div>
          
          {isWon && <CountdownTimer endDate={item.auction_end} />}

        <div className="flex flex-col gap-2 mt-4">
  <button 
    onClick={(e) => {
      e.stopPropagation();
      handleCardClick(e, item.product_id);
    }}
    className="w-full px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
  >
    View Details
  </button>

  {isWon ? (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/payment/${item.product_id}`);
      }}
      className='w-full px-4 py-1.5 rounded-lg font-semibold text-sm transition-all bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg'
    >
      Pay Now
    </button>
  ) : (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        if (item.status !== 'ended') handlePlaceBidClick(item);
      }}
      className={`w-full px-4 py-1.5 rounded-lg font-semibold text-sm transition-all ${
        item.status === 'ended'
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-lg'
      }`}
      disabled={item.status === 'ended'}
    >
      {item.status === 'ended' ? 'Ended' : 'Bid Again'}
    </button>
  )}
</div>

        </div>
      </div>
    );
  };

  const EmptyState = ({ icon, title, description, showButton = false }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    showButton?: boolean;
  }) => {
    const navigate = useNavigate();
    
    return (
      <div className="text-center py-16 px-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
            {icon}
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
        {showButton && (
          <Button 
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-medium px-8 shadow-md hover:shadow-lg"
            onClick={() => navigate('/auctions')}
          >
            Browse Auctions
          </Button>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <div className="container py-8 px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-9 w-64 mx-auto" />
                <Skeleton className="h-5 w-96 max-w-full mx-auto" />
              </div>
              
              <div className="flex justify-center space-x-2 mb-6">
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-24 rounded-md" />
              </div>
              
              {isMobile ? <BidSkeletonMobile /> : <BidSkeleton />}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container py-8 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                My Bids
              </h1>
            </div>
          </div>
          
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-6 sm:mb-8 bg-transparent p-0 border-b border-gray-200 gap-0.5">
              <TabsTrigger 
                value="active" 
                className="relative px-1 py-2 text-xs font-medium transition-all duration-200
                  text-gray-500 hover:text-primary data-[state=active]:text-primary data-[state=active]:font-semibold
                  group flex flex-col items-center justify-center"
              >
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span>Active</span>
                  <span className={cn(
                    "bg-gray-100 text-gray-600 rounded-full px-1 py-0.5 text-[10px] font-medium min-w-[18px] h-4 flex items-center justify-center",
                    "group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary",
                    "group-hover:bg-gray-200"
                  )}>
                    {activeBids.length}
                  </span>
                </div>
                <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-transparent group-data-[state=active]:bg-primary group-data-[state=active]:h-[2px] transition-all duration-200" />
              </TabsTrigger>
              
              <TabsTrigger 
                value="winning" 
                className="relative px-1 py-2 text-xs font-medium transition-all duration-200
                  text-gray-500 hover:text-emerald-600 data-[state=active]:text-emerald-600
                  data-[state=active]:font-semibold group flex flex-col items-center justify-center"
              >
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3 flex-shrink-0" />
                  <span>Winning</span>
                  <span className={cn(
                    "bg-gray-100 text-gray-600 rounded-full px-1 py-0.5 text-[10px] font-medium min-w-[18px] h-4 flex items-center justify-center",
                    "group-data-[state=active]:bg-emerald-50 group-data-[state=active]:text-emerald-700",
                    "group-hover:bg-gray-200"
                  )}>
                    {winningBids.length}
                  </span>
                </div>
                <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-transparent group-data-[state=active]:bg-emerald-500 group-data-[state=active]:h-[2px] transition-all duration-200" />
              </TabsTrigger>
              
              <TabsTrigger 
                value="losing" 
                className="relative px-1 py-2 text-xs font-medium transition-all duration-200
                  text-gray-500 hover:text-red-600 data-[state=active]:text-red-600
                  data-[state=active]:font-semibold group flex flex-col items-center justify-center"
              >
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  <span>Losing</span>
                  <span className={cn(
                    "bg-gray-100 text-gray-600 rounded-full px-1 py-0.5 text-[10px] font-medium min-w-[18px] h-4 flex items-center justify-center",
                    "group-data-[state=active]:bg-red-50 group-data-[state=active]:text-red-700",
                    "group-hover:bg-gray-200"
                  )}>
                    {losingBids.length}
                  </span>
                </div>
                <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-transparent group-data-[state=active]:bg-red-500 group-data-[state=active]:h-[2px] transition-all duration-200" />
              </TabsTrigger>
              
              <TabsTrigger 
                value="ended" 
                className="relative px-1 py-2 text-xs font-medium transition-all duration-200
                  text-gray-500 hover:text-gray-700 data-[state=active]:text-gray-800
                  data-[state=active]:font-semibold group flex flex-col items-center justify-center"
              >
                <div className="flex items-center gap-1">
                  <Gavel className="w-3 h-3 flex-shrink-0" />
                  <span>Ended</span>
                  <span className={cn(
                    "bg-gray-100 text-gray-600 rounded-full px-1 py-0.5 text-[10px] font-medium min-w-[18px] h-4 flex items-center justify-center",
                    "group-data-[state=active]:bg-gray-200 group-data-[state=active]:text-gray-800",
                    "group-hover:bg-gray-200"
                  )}>
                    {endedBids.length}
                  </span>
                </div>
                <div className="absolute bottom-0 left-1 right-1 h-0.5 bg-transparent group-data-[state=active]:bg-gray-600 group-data-[state=active]:h-[2px] transition-all duration-200" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-6">
              {activeBids.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-0">
                  {activeBids.map(item => (
                    <BidCard key={item.bid_id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Gavel className="w-6 h-6 text-gray-400" />}
                  title="No active bids"
                  description="You don't have any active bids right now. Browse auctions to find items you're interested in."
                  showButton={true}
                />
              )}
            </TabsContent>
            
            <TabsContent value="winning">
              {winningBids.length > 0 ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-4 flex items-center">
                    <Award className="w-5 h-5 text-emerald-600 mr-3" />
                    <p className="text-emerald-700 font-medium">
                      You're currently winning {winningBids.length} auction{winningBids.length !== 1 ? 's' : ''}. Keep an eye on the countdown!
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-0">
                    {winningBids.map(item => (
                      <BidCard key={item.bid_id} item={item} />
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={<TrendingUp className="w-6 h-6 text-emerald-500" />}
                  title="No winning bids yet"
                  description="You're not currently winning any auctions. Place higher bids to increase your chances!"
                />
              )}
            </TabsContent>
            
            <TabsContent value="losing">
              {losingBids.length > 0 ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-xl p-4 flex items-center">
                    <TrendingDown className="w-5 h-5 text-red-600 mr-3" />
                    <p className="text-red-700 font-medium">
                      You're currently outbid on {losingBids.length} auction{losingBids.length !== 1 ? 's' : ''}. Place a higher bid to get back in the lead!
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-0">
                    {losingBids.map(item => (
                      <BidCard key={item.bid_id} item={item} />
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={<TrendingDown className="w-6 h-6 text-red-500" />}
                  title="No losing bids"
                  description="You're not currently outbid on any auctions. Keep bidding to stay in the game!"
                />
              )}
            </TabsContent>
            
            <TabsContent value="ended">
              {endedBids.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-0">
                  {endedBids.map(item => (
                    <BidCard key={item.bid_id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Clock className="w-6 h-6 text-gray-400" />}
                  title="No ended auctions"
                  description="Your completed auctions will appear here once they've ended."
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedBid && (
        <BidModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBid(null);
            setNewBidAmount('');
          }}
          currentBid={parseFloat(selectedBid.max_bid_amount)}
          productId={selectedBid.product_id}
          onBidSuccess={async () => {
            await handleBidSuccess();
            setSelectedBid(null);
            setNewBidAmount('');
          }}
        />
      )}
    </Layout>
  );
};

export default MyBids;
