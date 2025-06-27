import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, TrendingDown, Eye, Gavel, ArrowRight, Zap, Award, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Mock data for bid items
const bidItems = [
  {
    id: 1,
    title: "Apple MacBook Pro 16\" 2023 (M3 Max, 48GB RAM, 2TB SSD)",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    myBid: 1299.00,
    highestBid: 1350.00,
    endDate: "2025-06-28T14:30:00Z",
    status: "losing",
    watchers: 24,
    totalBids: 18,
    timeLeft: "1d 4h",
    auctionId: "AU-2023-MBP16"
  },
  {
    id: 2,
    title: "Canon EOS R5 Mirrorless Camera with RF 24-70mm Lens",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    myBid: 2899.00,
    highestBid: 2899.00,
    endDate: "2025-06-27T18:45:00Z",
    status: "winning",
    watchers: 37,
    totalBids: 25,
    timeLeft: "6h 22m",
    auctionId: "AU-2023-EOSR5"
  },
  {
    id: 3,
    title: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    myBid: 249.99,
    highestBid: 275.00,
    endDate: "2025-06-29T12:15:00Z",
    status: "losing",
    watchers: 18,
    totalBids: 12,
    timeLeft: "2d 1h",
    auctionId: "AU-2023-SONYXM4"
  },
  {
    id: 4,
    title: "Samsung 65\" QN90B Neo QLED 4K Smart TV (2023 Model)",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    myBid: 1499.00,
    highestBid: 1499.00,
    endDate: "2025-07-01T20:00:00Z",
    status: "winning",
    watchers: 11,
    totalBids: 8,
    timeLeft: "4d 5h",
    auctionId: "AU-2023-SAM65QN90"
  },
  {
    id: 5,
    title: "Nintendo Switch OLED Console with 5 Games Bundle",
    image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    myBid: 299.99,
    highestBid: 325.00,
    endDate: "2025-06-26T23:59:00Z",
    status: "ended",
    watchers: 45,
    totalBids: 31,
    timeLeft: "Ended",
    auctionId: "AU-2023-NSWOLED"
  }
];

const MyBids = () => {
  const { toast } = useToast();
  const [items] = useState(bidItems);
  const isMobile = useIsMobile();
  
  const getTimeLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'winning':
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 font-medium shadow-sm">
            <TrendingUp className="w-3 h-3 mr-1.5" />
            <span>Winning</span>
          </Badge>
        );
      case 'losing':
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 font-medium shadow-sm">
            <TrendingDown className="w-3 h-3 mr-1.5" />
            <span>Outbid</span>
          </Badge>
        );
      case 'ended':
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

  const activeBids = items.filter(item => item.status !== 'ended');
  const endedBids = items.filter(item => item.status === 'ended');
  const winningBids = items.filter(item => item.status === 'winning');
  const losingBids = items.filter(item => item.status === 'losing');

  const BidCard = ({ item }: { item: typeof bidItems[0] }) => (
    <Card className="group relative overflow-hidden bg-white hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-primary/20 rounded-xl">
      <div className="relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-48 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 right-4 z-10">
          {getStatusBadge(item.status)}
        </div>
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center space-x-4 backdrop-blur-sm bg-black/30 px-3 py-1.5 rounded-full">
              {/* <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1.5" />
                <span className="font-medium">{item.watchers}</span>
              </div>
              <div className="flex items-center">
                <Gavel className="w-4 h-4 mr-1.5" />
                <span className="font-medium">{item.totalBids}</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-5">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-xs font-medium text-gray-500">Auction ID: {item.auctionId}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">My Bid</p>
            <p className="font-bold text-xl text-primary">${item.myBid.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Highest Bid</p>
            <p className={cn(
              "font-bold text-xl",
              item.status === 'winning' ? "text-emerald-600" : "text-red-600"
            )}>
              ${item.highestBid.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
          <div className={cn(
            "flex items-center px-3 py-2 rounded-lg",
            item.status === 'winning' ? "bg-emerald-50 text-emerald-700" : 
            item.status === 'ended' ? "bg-gray-50 text-gray-700" : "bg-red-50 text-red-700"
          )}>
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{getTimeLeft(item.endDate)}</span>
            {item.status === 'winning' && (
              <Zap className="w-4 h-4 ml-2 animate-pulse text-emerald-600" />
            )}
          </div>
          <Button 
            size={isMobile ? "sm" : "default"}
            variant={item.status === 'ended' ? 'outline' : 'default'}
            className={cn(
              "font-medium transition-all duration-200 w-full sm:w-auto",
              item.status === 'ended' 
                ? "text-gray-700 border-gray-300 hover:bg-gray-50 hover:shadow-sm" 
                : "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-sm hover:shadow-md"
            )}
          >
            {item.status === 'ended' ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                View Result
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4 mr-2" />
                Place Higher Bid
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {showButton && (
        <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-medium px-8 shadow-md hover:shadow-lg">
          Browse Auctions
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container py-8 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                My Bids
              </h1>
              <p className="text-gray-600 max-w-lg">
                Track and manage all your auction bids in one place. Stay updated on your winning bids and outbid notifications.
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-8 sm:mb-10 bg-transparent p-0 border-b border-gray-200">
              <TabsTrigger 
                value="active" 
                className="relative px-1 py-2.5 text-xs font-medium transition-all duration-200
                  text-gray-500 hover:text-primary data-[state=active]:text-primary data-[state=active]:font-semibold
                  group flex flex-col items-center justify-center"
              >
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Active</span>
                  <span className={cn(
                    "bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5 text-[10px] font-medium min-w-[20px] text-center",
                    "group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary",
                    "group-hover:bg-gray-200"
                  )}>
                    {activeBids.length}
                  </span>
                </div>
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-transparent group-data-[state=active]:bg-primary group-data-[state=active]:h-[2px] transition-all duration-200" />
              </TabsTrigger>
              
              <TabsTrigger 
                value="winning" 
                className="relative px-1 py-2.5 text-xs font-medium transition-all duration-200
                  text-gray-500 hover:text-emerald-600 data-[state=active]:text-emerald-600
                  data-[state=active]:font-semibold group flex flex-col items-center justify-center"
              >
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Winning</span>
                  <span className={cn(
                    "bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5 text-[10px] font-medium min-w-[20px] text-center",
                    "group-data-[state=active]:bg-emerald-50 group-data-[state=active]:text-emerald-700",
                    "group-hover:bg-gray-200"
                  )}>
                    {winningBids.length}
                  </span>
                </div>
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-transparent group-data-[state=active]:bg-emerald-500 group-data-[state=active]:h-[2px] transition-all duration-200" />
              </TabsTrigger>
              
              <TabsTrigger 
                value="losing" 
                className="relative px-1 py-2.5 text-xs font-medium transition-all duration-200
                  text-gray-500 hover:text-red-600 data-[state=active]:text-red-600
                  data-[state=active]:font-semibold group flex flex-col items-center justify-center"
              >
                <div className="flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Losing</span>
                  <span className={cn(
                    "bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5 text-[10px] font-medium min-w-[20px] text-center",
                    "group-data-[state=active]:bg-red-50 group-data-[state=active]:text-red-700",
                    "group-hover:bg-gray-200"
                  )}>
                    {losingBids.length}
                  </span>
                </div>
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-transparent group-data-[state=active]:bg-red-500 group-data-[state=active]:h-[2px] transition-all duration-200" />
              </TabsTrigger>
              
              <TabsTrigger 
                value="ended" 
                className="relative px-1 py-2.5 text-xs font-medium transition-all duration-200
                  text-gray-500 hover:text-gray-700 data-[state=active]:text-gray-800
                  data-[state=active]:font-semibold group flex flex-col items-center justify-center"
              >
                <div className="flex items-center gap-1.5">
                  <Gavel className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Ended</span>
                  <span className={cn(
                    "bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5 text-[10px] font-medium min-w-[20px] text-center",
                    "group-data-[state=active]:bg-gray-200 group-data-[state=active]:text-gray-800",
                    "group-hover:bg-gray-200"
                  )}>
                    {endedBids.length}
                  </span>
                </div>
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-transparent group-data-[state=active]:bg-gray-600 group-data-[state=active]:h-[2px] transition-all duration-200" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-6">
              {activeBids.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeBids.map(item => (
                    <BidCard key={item.id} item={item} />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {winningBids.map(item => (
                      <BidCard key={item.id} item={item} />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {losingBids.map(item => (
                      <BidCard key={item.id} item={item} />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {endedBids.map(item => (
                    <BidCard key={item.id} item={item} />
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
    </Layout>
  );
};

export default MyBids;