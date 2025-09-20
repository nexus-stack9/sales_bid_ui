import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, MessageCircle, Building2, User, ChevronDown, Download, CreditCard, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import { getOrderById } from '@/services/crudService';
import { toast } from '@/components/ui/use-toast';

interface OrderDetails {
  order_id: number;
  product_id: number;
  user_id: number;
  seller_id: number;
  winning_bid_id: number;
  order_status: 'order_placed' | 'shipped' | 'delivered' | 'cancelled';
  order_date: string;
  delivered_date: string | null;
  final_price: string;
  condition: string;
  name: string;
  description: string;
  image_path: string;
  quantity: number;
  label: string;
  street: string;
  city: string;
  country: string;
  postal_code: string;
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const formatCurrency = (value: string | number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));
  };
  
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  type OrderStatus = 'order_placed' | 'shipped' | 'delivered' | 'cancelled';
  
  const getStatusBadge = (status: string): JSX.Element => {
    const statusMap: Record<OrderStatus, { text: string; bg: string; textColor: string }> = {
      order_placed: { text: 'Order Placed', bg: 'bg-blue-100', textColor: 'text-blue-800' },
      shipped: { text: 'Shipped', bg: 'bg-purple-100', textColor: 'text-purple-800' },
      delivered: { text: 'Delivered', bg: 'bg-green-100', textColor: 'text-green-800' },
      cancelled: { text: 'Cancelled', bg: 'bg-red-100', textColor: 'text-red-800' },
    };
    
    const statusInfo = statusMap[status as OrderStatus] || { 
      text: status, 
      bg: 'bg-gray-100', 
      textColor: 'text-gray-800' 
    };
    
    return (
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.textColor}`}
      >
        {statusInfo.text}
      </span>
    );
  };

  useEffect(() => {
    const fetchOrderDetails = async (): Promise<void> => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await getOrderById(orderId);
        
        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          setOrder(response.data[0]);
        } else {
          const errorMessage = response.message || 'Failed to load order details';
          setError(errorMessage);
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('Error fetching order details:', err);
        setError('Error loading order. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load order details',
        });
        navigate('/user/profile');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
          <p className="text-gray-600">{error || 'Order not found'}</p>
        </div>
        <Footer />
        <BottomNav />
      </div>
    );
  }
  
  const estimatedDeliveryDate = new Date(order.order_date);
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7); // Add 7 days for estimated delivery
  
  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/api/placeholder/100/100';
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_id}</h1>
              <p className="text-sm text-gray-500">Placed on {formatDate(order.order_date)}</p>
            </div>
            <div className="text-right">
              {getStatusBadge(order.order_status)}
              <p className="text-sm text-gray-500 mt-1">
                {order.order_status === 'delivered' && order.delivered_date 
                  ? `Delivered on ${formatDate(order.delivered_date)}`
                  : `Estimated delivery: ${formatDate(estimatedDeliveryDate.toISOString())}`}
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Card and Rating */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Product Card */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start gap-6">
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <img
                          src={order.image_path || '/api/placeholder/100/100'}
                          alt={order.name}
                          className="w-full h-full object-cover rounded-lg bg-gray-100"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div>
                          <h1 className="text-xl font-medium text-gray-900 mb-1">{order.name}</h1>
                          <p className="text-sm text-gray-500 mb-2">{order.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Seller:</span> {order.first_name} {order.last_name || ''}
                            </div>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <div>
                              <span className="font-medium">Condition:</span> {order.condition}
                            </div>
                          </div>
                          
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-gray-900">
                              {formatCurrency(order.final_price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Status */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
                      
                      <div className="relative">
                        {/* Timeline */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        
                        <div className="space-y-6">
                          {/* Order Placed */}
                          <div className="relative pl-10">
                            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Order Placed</p>
                              <p className="text-sm text-gray-500">{formatDate(order.order_date)}</p>
                              <p className="mt-1 text-sm text-gray-600">We've received your order</p>
                            </div>
                          </div>
                          
                          {/* Processing */}
                          <div className="relative pl-10">
                            <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              ['shipped', 'delivered'].includes(order.order_status) 
                                ? 'bg-green-500' 
                                : 'bg-gray-200'}`}>
                              {['shipped', 'delivered'].includes(order.order_status) ? (
                                <Check className="w-4 h-4 text-white" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Processing</p>
                              {order.order_status === 'order_placed' && (
                                <p className="mt-1 text-sm text-gray-600">We're preparing your order</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Shipped */}
                          <div className="relative pl-10">
                            <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              order.order_status === 'delivered' 
                                ? 'bg-green-500' 
                                : order.order_status === 'shipped'
                                ? 'bg-green-500'
                                : 'bg-gray-200'}`}>
                              {['delivered', 'shipped'].includes(order.order_status) ? (
                                <Check className="w-4 h-4 text-white" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Shipped</p>
                              {order.order_status === 'shipped' && (
                                <p className="mt-1 text-sm text-gray-600">Your order is on the way</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Delivered */}
                          <div className="relative pl-10">
                            <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              order.order_status === 'delivered' 
                                ? 'bg-green-500' 
                                : 'bg-gray-200'}`}>
                              {order.order_status === 'delivered' ? (
                                <Check className="w-4 h-4 text-white" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Delivered</p>
                              {order.delivered_date ? (
                                <p className="text-sm text-gray-500">Delivered on {formatDate(order.delivered_date)}</p>
                              ) : (
                                <p className="text-sm text-gray-500">Estimated delivery: {formatDate(estimatedDeliveryDate.toISOString())}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>Contact Us</span>
                      </button>
                      
                      {order.order_status === 'delivered' && (
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                          <span>Return or Exchange</span>
                        </button>
                      )}
                      
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                        <span>Need Help?</span>
                      </button>
                    </div>
                  </div>

                  {/* Rate Experience */}
                  {/* <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Rate your experience</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded border border-gray-300"></div>
                        <span className="text-gray-700">Rate the product</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => handleStarHover(star)}
                            onMouseLeave={handleStarLeave}
                            className="p-1 transition-colors"
                          >
                            <svg
                              className={`w-8 h-8 ${
                                star <= (hoveredStar || rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-gray-200 text-gray-200'
                              } transition-colors`}
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="1"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                  {/* Order Summary */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID</span>
                        <span className="font-medium">#{order.order_id}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date</span>
                        <span>{formatDate(order.order_date)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        {getStatusBadge(order.order_status)}
                      </div>
                      
                      {order.delivered_date && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivered on</span>
                          <span>{formatDate(order.delivered_date)}</span>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between font-medium text-gray-900 mb-2">
                          <span>Total Amount</span>
                          <span>{formatCurrency(order.final_price)}</span>
                        </div>
                        <p className="text-sm text-gray-500">Inclusive of all taxes</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Delivery Details */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
                      {/* <button className="text-sm text-blue-600 hover:text-blue-700">Change</button> */}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                            <p className="font-medium">{order.first_name} {order.last_name || ''}</p>
                            <p className="text-gray-600">
                              {order.street}, {order.city}, {order.country} - {order.postal_code}
                            </p>
                          </div>
                          
                          {/* <div className="pt-3 border-t border-gray-100">
                            <p className="font-medium text-sm">Contact Information</p>
                            {order.phone && <p className="text-gray-600 text-sm">{order.phone}</p>}
                            {order.email && <p className="text-gray-600 text-sm">{order.email}</p>}
                          </div> */}
                    </div>
                  </div>

                  {/* Payment Method */}
                  {/* <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Credit / Debit Card</p>
                          <p className="text-sm text-gray-500">Visa ending in 4242</p>
                        </div>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700">Change</button>
                    </div>
                    
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                      <p className="text-sm text-amber-800">
                        Your payment of {formatCurrency(order.final_price)} was successful on {formatDate(order.order_date)}.
                      </p>
                    </div>
                  </div> */}
                  
                  {/* Need Help? */}
                  {/* <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Have questions about your order or need to make changes? Our support team is here to help.
                    </p>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                      <span>Contact Support</span>
                    </button>
                  </div> */}

                  {/* Download Invoice */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Download your invoice for order #{order.order_id}
                    </p>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                      <Download className="w-5 h-5" />
                      <span>Download Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
}