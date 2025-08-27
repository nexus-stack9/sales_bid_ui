import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CreditCard, MapPin, Plus, Shield, Clock, Check, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const savedAddresses: Address[] = [
  {
    id: '1',
    name: 'Home',
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    isDefault: true
  },
  {
    id: '2',
    name: 'Office',
    street: '456 Business Ave, Suite 200',
    city: 'New York',
    state: 'NY',
    zipCode: '10002',
    country: 'United States',
    isDefault: false
  }
];

// Sample bid data - in real app this would come from API
const getBidData = (bidId: string) => ({
  id: bidId,
  itemName: 'Vintage Rolex Submariner 1970',
  imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&h=300&fit=crop',
  bidAmount: 12500,
  paymentDeadline: new Date(Date.now() + 43200000) // 12 hours from now
});

export default function PaymentPage() {
  const { bidId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<'payment' | 'address' | 'review' | 'processing' | 'success'>('payment');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'razorpay'>('razorpay');
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0].id);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const bid = getBidData(bidId || '1');

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `₹{hours}h ₹{minutes}m`;
  };

  // Razorpay script loader
  const loadRazorpay = () => new Promise<boolean>((resolve) => {
    if (document.getElementById('razorpay-sdk')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePayment = async () => {
    if (paymentMethod === 'razorpay') {
      const loaded = await loadRazorpay();
      if (!loaded) return;

      // In real app: create order on server and use returned order_id
      const options: any = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: Math.round(totalAmount * 100), // in paise
        currency: 'INR',
        name: 'SalesBid',
        description: bid.itemName,
        image: '/favicon.ico',
        // order_id: '<server-generated-order-id>',
        handler: function () {
          setStep('success');
          setTimeout(() => navigate('/'), 3000);
        },
        prefill: {
          name: 'John Doe',
          email: 'john@example.com',
          contact: '9999999999',
        },
        theme: { color: '#0ea5e9' },
      };

      // @ts-ignore Razorpay injected by script
      const rzp = new window.Razorpay(options);
      rzp.open();
      return;
    }

    // Default simulated processing for card
    setIsProcessing(true);
    setStep('processing');

    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 3000);
  };

  const selectedAddressData = savedAddresses.find(addr => addr.id === selectedAddress);
  const totalAmount = bid.bidAmount + (bid.bidAmount * 0.03) + 25;

  const getStepIndex = (currentStep: string) => {
    const steps = ['payment', 'address', 'review'];
    return steps.indexOf(currentStep);
  };

  const canGoNext = () => {
    if (step === 'payment') return paymentMethod;
    if (step === 'address') return selectedAddress || showNewAddress;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-neutral-950 dark:to-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
       <div className="flex items-center justify-between gap-4 mb-6 lg:mb-10">
  {/* Back Button */}
  <Button
    variant="outline"
    onClick={() => navigate('/')}
    size="sm"
    className="flex items-center gap-2 rounded-xl border-gray-300 shadow-sm hover:shadow-md transition-all"
  >
    <ArrowLeft className="h-4 w-4" />
    <span className="hidden sm:inline font-medium">Back</span>
  </Button>

  {/* Title + Subtitle */}
  <div className="text-center flex-1">
    {/* <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
      Complete Your Purchase
    </h1> */}
    <p className="text-sm sm:text-base text-muted-foreground mt-1">
      Secure checkout for your winning bid
    </p>
  </div>

  {/* Empty Spacer for Balance */}
  <div className="w-[70px] sm:w-[90px]" />
</div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Order Summary - Mobile Top, Desktop Right */}
          <div className="lg:col-span-4 lg:order-2">
            <div className="sticky top-4">
              <Card className="bg-gradient-auction border-0 shadow-elegant">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                  <div className="flex gap-3">
                    <img
                      src={bid.imageUrl}
                      alt={bid.itemName}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm sm:text-base leading-tight">{bid.itemName}</h4>
                      <p className="text-xl sm:text-2xl font-bold mt-2">
                        ₹{bid.bidAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {bid.paymentDeadline && (
                    <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg border border-warning/20">
                      <Clock className="h-4 w-4 text-warning animate-countdown flex-shrink-0" />
                      <span className="text-sm font-medium">
                        Pay within: {getTimeRemaining(bid.paymentDeadline)}
                      </span>
                    </div>
                  )}

                  <Separator />
                  
                  <div className="space-y-2 text-sm sm:text-base">
                    <div className="flex justify-between">
                      <span>Item Price</span>
                      <span>₹{bid.bidAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fee</span>
                      <span>₹{(bid.bidAmount * 0.03).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>₹25.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step Indicator */}
           {/* Step Indicator */}
{!['processing', 'success'].includes(step) && (
  <div className="flex items-center justify-center gap-2 sm:gap-4 px-4">
    {['payment', 'address', 'review'].map((s, index) => (
      <div key={s} className="flex items-center">
        <div
          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300
            ₹{
              step === s
                ? s === 'payment'
                  ? 'bg-blue-500 text-white shadow-md'
                  : s === 'address'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-amber-500 text-white shadow-md'
                : getStepIndex(step) > index
                ? 'bg-success text-success-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
        >
          {getStepIndex(step) > index ? (
            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            index + 1
          )}
        </div>
        {index < 2 && (
          <div
            className={`w-8 sm:w-12 h-0.5 mx-1 sm:mx-2 transition-colors duration-300 ₹{
              getStepIndex(step) > index ? 'bg-success' : 'bg-muted'
            }`}
          />
        )}
      </div>
    ))}
  </div>
)}


            {/* Payment Method Step */}
            {step === 'payment' && (
              <Card className="bg-background border shadow-elegant">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">Choose Razorpay for UPI, card, or netbanking payments.</p>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3 sm:space-y-4">
                      {/* Credit Card */}
                      <div className="flex items-center space-x-3 p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="card" id="card" />
                        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <Label htmlFor="card" className="flex-1 font-medium text-sm sm:text-base">Credit/Debit Card</Label>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs">Visa</Badge>
                          <Badge variant="outline" className="text-xs">MC</Badge>
                          <Badge variant="outline" className="text-xs hidden sm:inline-flex">Amex</Badge>
                        </div>
                      </div>

                      {/* Razorpay */}
                      <div className="flex items-center space-x-3 p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="razorpay" id="razorpay" />
                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                        <Label htmlFor="razorpay" className="flex-1 font-medium text-sm sm:text-base">Razorpay</Label>
                        <Badge variant="outline" className="text-xs">UPI/Card/Netbanking</Badge>
                      </div>
                    </div>
                  </RadioGroup>

                  {/* Card Details Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 p-3 sm:p-4 bg-accent/20 rounded-lg border animate-fade-in">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="cardNumber" className="text-sm">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry" className="text-sm">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="cvv" className="text-sm">CVV</Label>
                            <Input id="cvv" placeholder="123" className="mt-1" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cardName" className="text-sm">Cardholder Name</Label>
                          <Input id="cardName" placeholder="John Doe" className="mt-1" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Razorpay Button/Info */}
                  {paymentMethod === 'razorpay' && (
                    <div className="space-y-4 p-3 sm:p-4 bg-accent/20 rounded-lg border animate-fade-in">
                      <p className="text-sm text-muted-foreground">You will be redirected to Razorpay to complete the payment securely.</p>
                      <Button type="button" onClick={handlePayment} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">Pay with Razorpay</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Address Step */}
            {step === 'address' && (
              <Card className="bg-background border shadow-elegant">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                  {!showNewAddress ? (
                    <div className="space-y-3 sm:space-y-4">
                      <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                        {savedAddresses.map((address) => (
                          <div key={address.id} className="flex items-start space-x-3 p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Label htmlFor={address.id} className="font-medium text-sm sm:text-base">{address.name}</Label>
                                {address.isDefault && <Badge variant="outline" className="text-xs">Default</Badge>}
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {address.street}<br />
                                {address.city}, {address.state} {address.zipCode}<br />
                                {address.country}
                              </p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>

                      <Button
                        variant="outline"
                        onClick={() => setShowNewAddress(true)}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-sm">First Name</Label>
                          <Input id="firstName" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                          <Input id="lastName" className="mt-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address" className="text-sm">Street Address</Label>
                        <Input id="address" className="mt-1" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city" className="text-sm">City</Label>
                          <Input id="city" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="state" className="text-sm">State</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ny">New York</SelectItem>
                              <SelectItem value="ca">California</SelectItem>
                              <SelectItem value="tx">Texas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="zipCode" className="text-sm">ZIP Code</Label>
                          <Input id="zipCode" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="country" className="text-sm">Country</Label>
                          <Select>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={() => setShowNewAddress(false)}
                        className="w-full sm:w-auto"
                      >
                        Use Saved Address
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <Card className="bg-background border shadow-elegant">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Review & Confirm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-sm sm:text-base">Payment Method</h4>
                      <div className="p-3 bg-accent/20 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span className="capitalize text-sm sm:text-base">{paymentMethod === 'razorpay' ? 'Razorpay' : 'Card'} Payment</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-sm sm:text-base">Shipping Address</h4>
                      <div className="p-3 bg-accent/20 rounded-lg border">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-1" />
                          <div>
                            <p className="font-medium text-sm sm:text-base">{selectedAddressData?.name}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {selectedAddressData?.street}<br />
                              {selectedAddressData?.city}, {selectedAddressData?.state} {selectedAddressData?.zipCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 sm:p-4 bg-success/10 rounded-lg border border-success/20">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-success flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Your payment is secured with 256-bit SSL encryption</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Processing Step */}
            {step === 'processing' && (
              <Card className="bg-background border shadow-elegant">
                <CardContent className="py-12 text-center space-y-6">
                  <div className="animate-spin h-8 w-8 sm:h-12 sm:w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Processing Your Payment</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">Please don't close this window...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <Card className="bg-background border shadow-elegant">
                <CardContent className="py-12 text-center space-y-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto shadow-success">
                    <Check className="h-6 w-6 sm:h-8 sm:w-8 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-success mb-2">Payment Successful!</h3>
                    <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                      Your order has been confirmed and will be shipped soon.
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Order confirmation has been sent to your email.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            {!['processing', 'success'].includes(step) && (
              <div className="flex justify-between gap-4 px-4 sm:px-0">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (step === 'payment') navigate('/');
                    else if (step === 'address') setStep('payment');
                    else if (step === 'review') setStep('address');
                  }}
                  className="flex-1 sm:flex-none hover:bg-muted/50"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  {step === 'payment' ? 'Cancel' : 'Back'}
                </Button>
                
                <Button
                  onClick={() => {
                    if (step === 'payment') setStep('address');
                    else if (step === 'address') setStep('review');
                    else if (step === 'review') handlePayment();
                  }}
                  disabled={!canGoNext() || isProcessing}
                  className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                >
                  {step === 'review' ? (
                    <>Pay ₹{totalAmount.toFixed(2)}</>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}