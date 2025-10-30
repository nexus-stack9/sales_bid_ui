import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Trophy, AlertTriangle, CheckCircle, Gavel } from 'lucide-react';
import BidModal from './BidModal.tsx';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { getUserBids, placeBid, getUserIdFromToken } from '@/services/crudService';
import { BidSkeleton, BidSkeletonMobile } from '@/components/skeletons/BidSkeleton';
import React from 'react';

// === Types ===
interface Bid {
  bid_id: number;
  bidder_id: number;
  product_id: number;
  bid_amount: string;
  bid_time: string;
  is_auto_bid: boolean;
  product_name: string;
  description: string;
  retail_value: string;
  auction_start: string;
  auction_end: string;
  status: string;
  image_path: string;
  location: string;
  quantity: number;
  tags: string;
  max_bid_amount: string;
  bid_status: 'winning' | 'losing' | 'won' | 'lost';
}

interface BidsResponse {
  winning: Bid[];
  losing: Bid[];
  won: Bid[];
  lost: Bid[];
}

const MyBids = () => {
  const { toast } = useToast();
  const [bidsData, setBidsData] = useState<BidsResponse>({
    winning: [],
    losing: [],
    won: [],
    lost: [],
  });
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
    const target = e.target as HTMLElement;
    if (!target.closest('button, a, [role="button"]')) {
      window.scrollTo(0, 0);
      navigate(`/auctions/${productId}`);
    }
  };

  // Fetch bids
  const fetchBids = async () => {
    try {
      setIsLoading(true);
      const bidderId = getUserIdFromToken();

      if (!bidderId) {
        throw new Error('User not authenticated');
      }

      const rawResponse = await getUserBids(bidderId);
      console.log('📡 API Response:', rawResponse);

      // Normalize: handle `unknown` and ensure all arrays exist
      const normalized: BidsResponse = {
        winning: Array.isArray(rawResponse?.winning) ? rawResponse.winning : [],
        losing: Array.isArray(rawResponse?.losing) ? rawResponse.losing : [],
        won: Array.isArray(rawResponse?.won) ? rawResponse.won : [],
        lost: Array.isArray(rawResponse?.lost) ? rawResponse.lost : [],
      };

      setBidsData(normalized);
    } catch (error) {
      console.error('❌ Failed to fetch bids:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load your bids. Please try again.',
      });
      setBidsData({ winning: [], losing: [], won: [], lost: [] });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  const handleBidSuccess = async () => {
    await fetchBids();
  };

  const getTimeLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return { text: 'Ended', seconds: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return { text: `${days}d ${hours}h`, seconds: diff };
    if (hours > 0) return { text: `${hours}h ${minutes}m`, seconds: diff };
    return { text: `${minutes}m`, seconds: diff };
  };

  const getPaymentTimeLeft = (endDate: string) => {
    const end = new Date(endDate);
    const due = new Date(end.getTime() + 48 * 60 * 60 * 1000);
    const now = new Date();
    const diff = due.getTime() - now.getTime();

    if (diff <= 0) return null;

    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
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
      case 'won':
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 font-medium shadow-sm">
            <Trophy className="w-3 h-3 mr-1.5" />
            <span>Won</span>
          </Badge>
        );
      case 'lost':
        return (
          <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white border-0 font-medium shadow-sm">
            <Clock className="w-3 h-3 mr-1.5" />
            <span>Lost</span>
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

    const minBid = parseFloat(selectedBid.max_bid_amount) + 50;
    if (parseFloat(newBidAmount) < minBid) {
      toast({
        variant: 'destructive',
        title: 'Invalid Bid',
        description: `Bid must be at least ₹${minBid.toFixed(2)}`,
      });
      return;
    }

    try {
      await placeBid(selectedBid.product_id.toString(), parseFloat(newBidAmount));
      toast({ title: 'Success', description: `Bid of ₹${newBidAmount} placed!` });
      await fetchBids();
      setIsModalOpen(false);
      setSelectedBid(null);
      setNewBidAmount('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to place bid.',
      });
    }
  };

  const CountdownTimer = ({ endDate }: { endDate: string }) => {
    const [timeLeft, setTimeLeft] = useState(getPaymentTimeLeft(endDate));

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(getPaymentTimeLeft(endDate));
      }, 1000);
      return () => clearInterval(timer);
    }, [endDate]);

    if (!timeLeft) return null;

    return (
      <div className="text-center text-sm text-red-600 font-medium mt-2">
        Payment due in: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </div>
    );
  };

  const BidCard = ({ item }: { item: Bid }) => {
    const timeLeft = getTimeLeft(item.auction_end);
    const isWon = item.bid_status === 'won';

    return (
      <div
        className="w-full max-w-full sm:max-w-none bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={(e) => handleCardContainerClick(e, item.product_id)}
      >
        <div className="relative pt-[75%] overflow-hidden">
          <img
            src={item.image_path.split(',')[0]?.trim() || '/placeholder.jpg'}
            alt={item.product_name}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 z-10">
            {getStatusBadge(item.bid_status)}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 h-12 flex items-center">
            {item.product_name}
          </h3>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-gray-50 p-2 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">My Bid</div>
              <div className="text-sm font-semibold text-gray-900">
                ₹{parseFloat(item.bid_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Highest Bid</div>
              <div className={cn(
                "text-sm font-semibold",
                parseFloat(item.bid_amount) >= parseFloat(item.max_bid_amount) ? "text-emerald-600" : "text-red-600"
              )}>
                ₹{parseFloat(item.max_bid_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Time Left</div>
              <div className="flex items-center gap-1 text-sm text-gray-900">
                <Clock className="w-3 h-3" />
                <span className="font-medium">{timeLeft.text}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">MSRP</div>
              <div className="text-sm font-semibold text-gray-900">
                ₹{item.retail_value ? parseFloat(item.retail_value).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : 'N/A'}
              </div>
            </div>
          </div>

          {isWon && <CountdownTimer endDate={item.auction_end} />}

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(e, item.product_id);
              }}
              className="w-full px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm whitespace-nowrap"
            >
              View Details
            </button>

            {isWon ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/payment/${item.product_id}`);
                }}
                className="w-full px-4 py-1.5 rounded-lg font-semibold text-sm transition-all bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg"
              >
                Pay Now
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.bid_status === 'winning' || item.bid_status === 'losing') {
                    handlePlaceBidClick(item);
                  }
                }}
                className={`w-full px-4 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                  ['won', 'lost'].includes(item.bid_status)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-lg'
                }`}
                disabled={['won', 'lost'].includes(item.bid_status)}
              >
                {['won', 'lost'].includes(item.bid_status) ? 'Auction Ended' : 'Bid Again'}
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
  }) => (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">{description}</p>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container py-8 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-9 w-64 mx-auto" />
              <Skeleton className="h-5 w-96 max-w-full mx-auto" />
            </div>
            <div className="flex justify-center space-x-2 mb-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-md" />
              ))}
            </div>
            {isMobile ? <BidSkeletonMobile /> : <BidSkeleton />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container py-8 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Bids</h1>
          </div>
        </div>

        <Tabs defaultValue="winning" className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-6 sm:mb-8 bg-transparent p-0 border-b border-gray-200 gap-0.5">
            {[
              { value: 'winning', label: 'Winning', icon: Trophy, count: bidsData.winning.length, color: 'emerald' },
              { value: 'losing', label: 'Losing', icon: AlertTriangle, count: bidsData.losing.length, color: 'red' },
              { value: 'won', label: 'Won', icon: CheckCircle, count: bidsData.won.length, color: 'green' },
              { value: 'lost', label: 'Lost', icon: Gavel, count: bidsData.lost.length, color: 'gray' },
            ].map(({ value, label, icon: Icon, count, color }) => (
              <TabsTrigger
                key={value}
                value={value}
                className={`relative px-1 py-2 text-xs font-medium transition-all duration-200
                  text-gray-500 hover:text-${color}-600 data-[state=active]:text-${color}-600 data-[state=active]:font-semibold
                  group flex flex-col items-center justify-center`}
              >
                <div className="flex items-center gap-1">
                  <Icon className="w-3 h-3 flex-shrink-0" />
                  <span>{label}</span>
                  <span className={cn(
                    "bg-gray-100 text-gray-600 rounded-full px-1 py-0.5 text-[10px] font-medium min-w-[18px] h-4 flex items-center justify-center",
                    `group-data-[state=active]:bg-${color}-50 group-data-[state=active]:text-${color}-700`,
                    "group-hover:bg-gray-200"
                  )}>
                    {count}
                  </span>
                </div>
                <div className={`absolute bottom-0 left-1 right-1 h-0.5 bg-transparent group-data-[state=active]:bg-${color}-500 group-data-[state=active]:h-[2px] transition-all duration-200`} />
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="winning">
            {bidsData.winning.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-4 flex items-center">
                  <Trophy className="w-5 h-5 text-emerald-600 mr-3" />
                  <p className="text-emerald-700 font-medium">
                    You're winning {bidsData.winning.length} auction{bidsData.winning.length !== 1 ? 's' : ''}. Keep bidding!
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-0 justify-items-center">
                  {bidsData.winning.map(item => (
                    <BidCard key={item.bid_id} item={item} />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<Trophy className="w-6 h-6 text-emerald-500" />}
                title="No winning bids"
                description="You're not currently winning any auctions. Try placing a higher bid!"
                showButton
              />
            )}
          </TabsContent>

          <TabsContent value="losing">
            {bidsData.losing.length > 0 ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-xl p-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                  <p className="text-red-700 font-medium">
                    Outbid on {bidsData.losing.length} auction{bidsData.losing.length !== 1 ? 's' : ''}. Bid again to win!
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-0 justify-items-center">
                  {bidsData.losing.map(item => (
                    <BidCard key={item.bid_id} item={item} />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
                title="No losing bids"
                description="Great job! You're not currently outbid on any auctions."
              />
            )}
          </TabsContent>

          <TabsContent value="won">
            {bidsData.won.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-0 justify-items-center">
                {bidsData.won.map(item => (
                  <BidCard key={item.bid_id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Trophy className="w-6 h-6 text-green-500" />}
                title="No auctions won"
                description="You haven't won any auctions yet. Keep bidding to win great deals!"
              />
            )}
          </TabsContent>

          <TabsContent value="lost">
            {bidsData.lost.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-0 justify-items-center">
                {bidsData.lost.map(item => (
                  <BidCard key={item.bid_id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Gavel className="w-6 h-6 text-gray-400" />}
                title="No lost auctions"
                description="You haven't lost any bids recently. Great job staying competitive!"
              />
            )}
          </TabsContent>
        </Tabs>
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
    </div>
  );
};

export default MyBids;