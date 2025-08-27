import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Truck, MapPin, CheckCircle, Clock, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: Date;
  isCompleted: boolean;
}

const getOrderData = (orderId: string) => ({
  orderId: orderId,
  status: 'in_transit',
  estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  carrierName: 'FedEx Express',
  trackingNumber: '1234567890123456',
  itemName: 'Classic Ferrari Model Collection',
  itemImage: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300&h=300&fit=crop',
  shippingAddress: {
    name: 'John Doe',
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  },
  events: [
    {
      id: '1',
      status: 'order_confirmed',
      description: 'Order confirmed and payment processed',
      location: 'SalesBid Warehouse, CA',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isCompleted: true
    },
    {
      id: '2',
      status: 'preparing',
      description: 'Item picked and prepared for shipping',
      location: 'SalesBid Warehouse, CA',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isCompleted: true
    },
    {
      id: '3',
      status: 'shipped',
      description: 'Package shipped and in transit',
      location: 'Los Angeles, CA',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      isCompleted: true
    },
    {
      id: '4',
      status: 'in_transit',
      description: 'Package arrived at sorting facility',
      location: 'Phoenix, AZ',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      isCompleted: true
    },
    {
      id: '5',
      status: 'out_for_delivery',
      description: 'Out for delivery',
      location: 'New York, NY',
      timestamp: new Date(),
      isCompleted: false
    },
    {
      id: '6',
      status: 'delivered',
      description: 'Delivered to your address',
      location: 'New York, NY',
      timestamp: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      isCompleted: false
    }
  ] as TrackingEvent[]
});

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const trackingData = getOrderData(orderId || 'ORD-2024-001');

  const getStatusIcon = (status: string, isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success" />;
    }
    
    switch (status) {
      case 'order_confirmed':
      case 'preparing':
        return <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />;
      case 'shipped':
      case 'in_transit':
        return <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />;
      case 'out_for_delivery':
      case 'delivered':
        return <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />;
      default:
        return <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success text-success-foreground';
      case 'out_for_delivery': return 'bg-warning text-warning-foreground animate-pulse-glow';
      case 'in_transit': return 'bg-primary text-primary-foreground';
      case 'shipped': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const currentEvent = trackingData.events.find(event => event.status === trackingData.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-neutral-950 dark:to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 lg:mb-8">
          <Button variant="outline" onClick={() => navigate('/')} size="sm" className="shrink-0 hover:bg-muted/50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Order Tracking
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground truncate">Order #{trackingData.orderId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Tracking Info */}
          <div className="lg:col-span-8 space-y-6">
            {/* Current Status */}
            <Card className="bg-gradient-card shadow-elegant border-0 animate-fade-in">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-lg sm:text-xl">Current Status</span>
                  <Badge className={`${getStatusColor(trackingData.status)} text-xs sm:text-sm`}>
                    {trackingData.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-gradient-primary rounded-full shadow-premium flex-shrink-0">
                    {getStatusIcon(trackingData.status, false)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base sm:text-lg">{currentEvent?.description}</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">{currentEvent?.location}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {currentEvent && formatDate(currentEvent.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-accent/20 rounded-lg border hover:bg-accent/30 transition-colors">
                  <div className="flex items-center gap-2 text-primary font-medium mb-2">
                    <Truck className="h-4 w-4" />
                    <span className="text-sm sm:text-base">Estimated Delivery</span>
                  </div>
                  <p className="text-base sm:text-lg font-semibold">
                    {formatDate(trackingData.estimatedDelivery)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card className="bg-gradient-card shadow-elegant border-0 animate-fade-in">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Tracking History</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-4 sm:space-y-6">
                  {trackingData.events.map((event, index) => (
                    <div key={event.id} className="flex gap-3 sm:gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 ${
                          event.isCompleted ? 'bg-success/20 shadow-success' : 
                          event.status === trackingData.status ? 'bg-primary/20 shadow-premium animate-pulse-glow' : 
                          'bg-muted/20'
                        }`}>
                          {getStatusIcon(event.status, event.isCompleted)}
                        </div>
                        {index < trackingData.events.length - 1 && (
                          <div className={`w-0.5 h-8 sm:h-12 mt-2 transition-colors duration-300 ${
                            event.isCompleted ? 'bg-success' : 'bg-muted'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-4 sm:pb-6 min-w-0">
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <h4 className={`font-medium text-sm sm:text-base ${
                            event.isCompleted ? 'text-foreground' : 
                            event.status === trackingData.status ? 'text-primary font-semibold' : 
                            'text-muted-foreground'
                          }`}>
                            {event.description}
                          </h4>
                          {event.isCompleted && (
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{event.location}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(event.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Details Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Item Details */}
            <Card className="bg-gradient-card shadow-elegant border-0 animate-fade-in">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                <div className="flex gap-3">
                  <img
                    src={trackingData.itemImage}
                    alt={trackingData.itemName}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm sm:text-base leading-tight">{trackingData.itemName}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Order #{trackingData.orderId}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-sm">Carrier</h5>
                    <p className="text-sm text-muted-foreground">{trackingData.carrierName}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Tracking Number</h5>
                    <p className="text-xs sm:text-sm font-mono bg-accent/20 p-2 rounded border break-all">
                      {trackingData.trackingNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="bg-gradient-card shadow-elegant border-0 animate-fade-in">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base">{trackingData.shippingAddress.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {trackingData.shippingAddress.street}<br />
                      {trackingData.shippingAddress.city}, {trackingData.shippingAddress.state} {trackingData.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="bg-gradient-card shadow-elegant border-0 animate-fade-in">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
                <Button variant="outline" className="w-full justify-start text-sm sm:text-base hover:bg-muted/50">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm sm:text-base hover:bg-muted/50">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}