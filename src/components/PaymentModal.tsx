import { useState } from "react";
import { CreditCard, MapPin, Plus, Shield, Clock, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Order {
  id: string;
  itemName: string;
  imageUrl: string;
  orderAmount: number;
  paymentDeadline?: Date;
}

interface PaymentModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

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

export function PaymentModal({ order, isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<'payment' | 'address' | 'review' | 'processing' | 'success'>('payment');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0].id);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onPaymentSuccess();
      }, 2000);
    }, 3000);
  };

  const selectedAddressData = savedAddresses.find(addr => addr.id === selectedAddress);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-card border-0 shadow-premium">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Complete Your Purchase
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary - Always Visible */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-auction border-0 shadow-elegant sticky top-0">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <img
                    src={order.imageUrl}
                    alt={order.itemName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm leading-tight">{order.itemName}</h4>
                    <p className="text-2xl font-bold mt-2">
                      ${order.orderAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {order.paymentDeadline && (
                  <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg border border-warning/20">
                    <Clock className="h-4 w-4 text-warning animate-countdown" />
                    <span className="text-sm font-medium">
                      Pay within: {getTimeRemaining(order.paymentDeadline)}
                    </span>
                  </div>
                )}

                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Item Price</span>
                    <span>${order.orderAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee</span>
                    <span>${(order.orderAmount * 0.03).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>$25.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(order.orderAmount + (order.orderAmount * 0.03) + 25).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-4">
              {['payment', 'address', 'review'].map((s, index) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    step === s ? 'bg-gradient-primary text-primary-foreground shadow-premium' :
                    ['processing', 'success'].includes(step) || ['payment', 'address', 'review'].indexOf(step) > index
                      ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {['processing', 'success'].includes(step) || ['payment', 'address', 'review'].indexOf(step) > index ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 2 && (
                    <div className={`w-12 h-0.5 mx-2 transition-colors duration-300 ${
                      ['processing', 'success'].includes(step) || ['payment', 'address', 'review'].indexOf(step) > index
                        ? 'bg-success' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Payment Method Step */}
            {step === 'payment' && (
              <Card className="bg-background border shadow-elegant">
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-4">
                      {/* Credit Card */}
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="card" id="card" />
                        <CreditCard className="h-5 w-5" />
                        <Label htmlFor="card" className="flex-1 font-medium">Credit/Debit Card</Label>
                        <div className="flex gap-1">
                          <Badge variant="outline">Visa</Badge>
                          <Badge variant="outline">MC</Badge>
                          <Badge variant="outline">Amex</Badge>
                        </div>
                      </div>

                      {/* PayPal */}
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
                        <Label htmlFor="paypal" className="flex-1 font-medium">PayPal</Label>
                        <Badge variant="outline" className="bg-blue-50">Express</Badge>
                      </div>

                      {/* Apple Pay */}
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <RadioGroupItem value="apple" id="apple" />
                        <div className="w-5 h-5 bg-black rounded text-white text-xs flex items-center justify-center">🍎</div>
                        <Label htmlFor="apple" className="flex-1 font-medium">Apple Pay</Label>
                        <Badge variant="outline">Touch ID</Badge>
                      </div>
                    </div>
                  </RadioGroup>

                  {/* Card Details Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 p-4 bg-accent/20 rounded-lg border">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cardName">Cardholder Name</Label>
                          <Input id="cardName" placeholder="John Doe" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button onClick={() => setStep('address')} className="bg-gradient-primary shadow-premium">
                      Continue to Shipping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Address Step */}
            {step === 'address' && (
              <Card className="bg-background border shadow-elegant">
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!showNewAddress ? (
                    <div className="space-y-4">
                      <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                        {savedAddresses.map((address) => (
                          <div key={address.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Label htmlFor={address.id} className="font-medium">{address.name}</Label>
                                {address.isDefault && <Badge variant="outline">Default</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground">
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
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">Street Address</Label>
                        <Input id="address" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input id="city" />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Select>
                            <SelectTrigger>
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input id="zipCode" />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Select>
                            <SelectTrigger>
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
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep('payment')}>
                      Back
                    </Button>
                    <Button onClick={() => setStep('review')} className="bg-gradient-primary shadow-premium">
                      Continue to Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <Card className="bg-background border shadow-elegant">
                <CardHeader>
                  <CardTitle>Review & Confirm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Payment Method</h4>
                      <div className="p-3 bg-accent/20 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span className="capitalize">{paymentMethod} Payment</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <div className="p-3 bg-accent/20 rounded-lg border">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-1" />
                          <div>
                            <p className="font-medium">{selectedAddressData?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedAddressData?.street}<br />
                              {selectedAddressData?.city}, {selectedAddressData?.state} {selectedAddressData?.zipCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-success/10 rounded-lg border border-success/20">
                    <Shield className="h-5 w-5 text-success" />
                    <span className="text-sm">Your payment is secured with 256-bit SSL encryption</span>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep('address')}>
                      Back
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="bg-gradient-success shadow-success"
                    >
                      {isProcessing ? 'Processing...' : `Pay $${(order.orderAmount + (order.orderAmount * 0.03) + 25).toFixed(2)}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Processing Step */}
            {step === 'processing' && (
              <Card className="bg-background border shadow-elegant">
                <CardContent className="py-12 text-center space-y-6">
                  <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Processing Your Payment</h3>
                    <p className="text-muted-foreground">Please don't close this window...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <Card className="bg-background border shadow-elegant">
                <CardContent className="py-12 text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto shadow-success">
                    <Check className="h-8 w-8 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-success mb-2">Payment Successful!</h3>
                    <p className="text-muted-foreground mb-4">
                      Your order has been confirmed and will be shipped soon.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Order confirmation has been sent to your email.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}