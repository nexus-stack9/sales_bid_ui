import { ArrowLeft, Package, Truck, MapPin, CheckCircle, Clock, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface OrderTrackingProps {
  orderId: string;
  onBack: () => void;
}

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: Date;
  isCompleted: boolean;
}

const trackingData = {
  orderId: 'ORD-2024-001',
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
};

export function OrderTracking({ orderId, onBack }: OrderTrackingProps) {
  const getStatusIcon = (status: string, isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="h-5 w-5 text-success" />;
    }
    
    switch (status) {
      case 'order_confirmed':
      case 'preparing':
        return <Package className="h-5 w-5 text-primary" />;
      case 'shipped':
      case 'in_transit':
        return <Truck className="h-5 w-5 text-primary" />;
      case 'out_for_delivery':
      case 'delivered':
        return <MapPin className="h-5 w-5 text-primary" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
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
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="shrink-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Order Tracking
            </h1>
            <p className="text-muted-foreground">Order #{trackingData.orderId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tracking Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Status */}
            <Card className="bg-gradient-card shadow-elegant border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Current Status</span>
                  <Badge className={getStatusColor(trackingData.status)}>
                    {trackingData.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-primary rounded-full shadow-premium">
                    {getStatusIcon(trackingData.status, false)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{currentEvent?.description}</h3>
                    <p className="text-muted-foreground">{currentEvent?.location}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentEvent && formatDate(currentEvent.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-accent/20 rounded-lg border">
                  <div className="flex items-center gap-2 text-primary font-medium mb-2">
                    <Truck className="h-4 w-4" />
                    Estimated Delivery
                  </div>
                  <p className="text-lg font-semibold">
                    {formatDate(trackingData.estimatedDelivery)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card className="bg-gradient-card shadow-elegant border-0">
              <CardHeader>
                <CardTitle>Tracking History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {trackingData.events.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full ${
                          event.isCompleted ? 'bg-success/20 shadow-success' : 
                          event.status === trackingData.status ? 'bg-primary/20 shadow-premium animate-pulse-glow' : 
                          'bg-muted/20'
                        }`}>
                          {getStatusIcon(event.status, event.isCompleted)}
                        </div>
                        {index < trackingData.events.length - 1 && (
                          <div className={`w-0.5 h-12 mt-2 ${
                            event.isCompleted ? 'bg-success' : 'bg-muted'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-medium ${
                            event.isCompleted ? 'text-foreground' : 
                            event.status === trackingData.status ? 'text-primary font-semibold' : 
                            'text-muted-foreground'
                          }`}>
                            {event.description}
                          </h4>
                          {event.isCompleted && (
                            <Badge variant="outline" className="text-xs">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
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
          <div className="space-y-6">
            {/* Item Details */}
            <Card className="bg-gradient-card shadow-elegant border-0">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <img
                    src={trackingData.itemImage}
                    alt={trackingData.itemName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium">{trackingData.itemName}</h4>
                    <p className="text-sm text-muted-foreground">
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
                    <p className="text-sm font-mono bg-accent/20 p-2 rounded border">
                      {trackingData.trackingNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="bg-gradient-card shadow-elegant border-0">
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-primary" />
                  <div>
                    <p className="font-medium">{trackingData.shippingAddress.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {trackingData.shippingAddress.street}<br />
                      {trackingData.shippingAddress.city}, {trackingData.shippingAddress.state} {trackingData.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="bg-gradient-card shadow-elegant border-0">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
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