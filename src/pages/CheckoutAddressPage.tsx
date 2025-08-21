import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Address, ProductCheckoutItem } from '@/types/address';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Home, MapPin, Phone, Plus, User, X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import styles from "./CheckoutAddressPage.module.css";

const CheckoutAddressPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get product data from location state
  const product = location.state?.product as ProductCheckoutItem | undefined;
  
  // Mock addresses - in a real app, these would come from an API
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'John Doe',
      phone: '9876543210',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
      isDefault: true
    },
    {
      id: '2',
      name: 'John Doe',
      phone: '9876543210',
      addressLine1: '456 Park Avenue',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      country: 'India',
      isDefault: false
    }
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // New address form state
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const [makeDefault, setMakeDefault] = useState(false);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!newAddress.name || !newAddress.phone || !newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    // In a real app, this would be an API call
    const newId = (addresses.length + 1).toString();
    const addedAddress: Address = {
      ...newAddress,
      id: newId,
      isDefault: makeDefault
    };

    setAddresses([...addresses, addedAddress]);
    setSelectedAddressId(newId);
    setShowAddressForm(false);
    
    // Reset form
    setNewAddress({ 
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    });

    toast({
      title: 'Success',
      description: 'Address added successfully',
    });
  };

  const handleProceedToCheckout = () => {
    if (!selectedAddressId) {
      toast({
        title: 'Error',
        description: 'Please select an address to continue',
        variant: 'destructive'
      });
      return;
    }
    
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    // Navigate to payment page with address and product info
    navigate('/checkout/payment', { 
      state: { 
        product,
        address: selectedAddress 
      } 
    });
  };

  // If no product data, show error
  if (!product) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold mb-2">No Product Selected</h2>
          <p className="text-muted-foreground mb-6">Please go back and select a product to checkout.</p>
          <Button onClick={() => navigate('/')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <button 
            onClick={() => navigate(-1)} 
            className={styles.backButton}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className={styles.pageTitle}>Checkout</h1>
        </header>

        <div className={styles.contentGrid}>
          <div className={styles.mainContent}>
            {/* Delivery Address Section */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <MapPin className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Delivery Address</h2>
              </div>

              {showAddressForm ? (
                <div className={styles.addAddressForm}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Add New Address</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowAddressForm(false)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <form onSubmit={handleAddAddress} className={styles.formGrid}>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+91 98765 43210" 
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="addressLine1">Address Line 1</Label>
                      <Input 
                        id="addressLine1" 
                        placeholder="House/Flat No, Building, Street, Area" 
                        value={newAddress.addressLine1}
                        onChange={(e) => setNewAddress({...newAddress, addressLine1: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                      <Input 
                        id="addressLine2" 
                        placeholder="Nearby landmark" 
                        value={newAddress.addressLine2}
                        onChange={(e) => setNewAddress({...newAddress, addressLine2: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        placeholder="City" 
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state" 
                        placeholder="State" 
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input 
                        id="pincode" 
                        type="number" 
                        placeholder="Pincode" 
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="flex items-center space-x-2 col-span-2">
                      <input
                        type="checkbox"
                        id="makeDefault"
                        checked={makeDefault}
                        onChange={(e) => setMakeDefault(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="makeDefault" className="text-sm text-gray-600">
                        Make this my default address
                      </label>
                    </div>
                    <div className={styles.formActions}>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowAddressForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Address</Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className={styles.addressList}>
                  <RadioGroup 
                    value={selectedAddressId} 
                    onValueChange={setSelectedAddressId}
                    className="space-y-3"
                  >
                    {addresses.map((address) => (
                      <div key={address.id} className="flex items-start">
                        <RadioGroupItem 
                          value={address.id} 
                          id={address.id} 
                          className="mt-4 ml-3"
                        />
                        <label 
                          htmlFor={address.id} 
                          className={`${styles.addressCard} ${selectedAddressId === address.id ? styles.addressCardSelected : ''}`}
                        >
                          <div className={styles.addressName}>
                            {address.name}
                            {address.isDefault && (
                              <span className={styles.defaultBadge}>Default</span>
                            )}
                          </div>
                          <p className={styles.addressText}>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}</p>
                          <p className={styles.addressText}>
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <span className={styles.addressPhone}>
                            <Phone className="inline h-4 w-4 mr-1" /> {address.phone}
                          </span>
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => setShowAddressForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add New Address
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className={styles.orderSummary}>
            <div className={styles.orderSummaryHeader}>
              <h3 className={styles.orderSummaryTitle}>Order Summary</h3>
            </div>
            
            <div className={styles.orderSummaryContent}>
              <div className={styles.orderItem}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className={styles.orderItemImage}
                />
                <div className={styles.orderItemDetails}>
                  <h4 className={styles.orderItemName}>{product.name}</h4>
                  <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                  <p className={styles.orderItemPrice}>
                    {(product.price * product.quantity).toLocaleString('en-IN', { 
                      style: 'currency', 
                      currency: 'INR',
                      maximumFractionDigits: 0
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Subtotal</span>
                  <span className={styles.priceValue}>
                    {(product.price * product.quantity).toLocaleString('en-IN', { 
                      style: 'currency', 
                      currency: 'INR',
                      maximumFractionDigits: 0
                    })}
                  </span>
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total Amount</span>
                <span className={styles.totalValue}>
                  {(product.price * product.quantity).toLocaleString('en-IN', { 
                    style: 'currency', 
                    currency: 'INR',
                    maximumFractionDigits: 0
                  })}
                </span>
              </div>

              {selectedAddressId && (
                <Button 
                  className={styles.checkoutButton}
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Payment
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutAddressPage;
