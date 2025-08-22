import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Home, Landmark, Smartphone, Timer } from "lucide-react";

// Helpers
const currency = (n: number) => n.toLocaleString(undefined, { style: "currency", currency: "USD" });

const useCountdown = (deadline: Date) => {
  const [diff, setDiff] = useState<number>(() => Math.max(0, deadline.getTime() - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setDiff(Math.max(0, deadline.getTime() - Date.now())), 1000);
    return () => clearInterval(id);
  }, [deadline]);
  const totalSec = Math.floor(diff / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { hours, minutes, seconds, expired: diff === 0, remainingMs: diff };
};

// Mock order lookup (in real app, fetch by orderId)
const ORDERS: Record<string, { title: string; image: string; amountDue: number; wonAt: string } > = {
  "ORD-90112": {
    title: "Energy Efficient Washing Machine",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
    amountDue: 349.99,
    wonAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  "ORD-90144": {
    title: "Air Fryer Pro Max",
    image: "https://images.unsplash.com/photo-1611250188496-e966043a0625?q=80&w=600&auto=format&fit=crop",
    amountDue: 129.5,
    wonAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
  },
};

const savedAddresses = [
  { id: "addr1", label: "Home", details: "123 Commerce St, Suite 400, New York, NY 10001", contact: "John Doe, +1 555-123-4567" },
  { id: "addr2", label: "Office", details: "88 Market Ave, Floor 6, San Francisco, CA 94103", contact: "John Doe, +1 555-111-2222" },
];

type Method = "upi" | "card" | "netbanking" | "wallet";

const Payment: React.FC = () => {
  const { orderId = "" } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const order = ORDERS[orderId] ?? {
    title: "Auction Order",
    image: "https://picsum.photos/seed/order/600/400",
    amountDue: 199.0,
    wonAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  };

  const dueAt = useMemo(() => new Date(new Date(order.wonAt).getTime() + 48 * 3600 * 1000), [order.wonAt]);
  const { hours, minutes, seconds, expired, remainingMs } = useCountdown(dueAt);
  const totalMs = 48 * 3600 * 1000;
  const progress = 100 - Math.round((remainingMs / totalMs) * 100);

  const [addressId, setAddressId] = useState<string>(savedAddresses[0]?.id ?? "");
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", details: "", contact: "" });

  const [method, setMethod] = useState<Method>("upi");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [bank, setBank] = useState<string>("");
  const [wallet, setWallet] = useState<string>("");
  const [agree, setAgree] = useState(true);

  const canPay = !expired && !!addressId && agree && (
    (method === "upi" && upiId.trim().length > 5) ||
    (method === "card" && card.number.length >= 12 && card.name && card.expiry && card.cvv.length >= 3) ||
    (method === "netbanking" && !!bank) ||
    (method === "wallet" && !!wallet)
  );

  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.details) return;
    const id = `addr-${Date.now()}`;
    savedAddresses.push({ id, ...newAddress });
    setAddressId(id);
    setAddingAddress(false);
    setNewAddress({ label: "", details: "", contact: "" });
    toast({ title: "Address saved" });
  };

  const payNow = () => {
    if (!canPay) return;
    toast({ title: "Payment successful", description: `Order ${orderId} has been paid.` });
    navigate("/cart", { replace: true });
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <span className="text-sm text-muted-foreground">Pay for your won auction</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <img src={order.image} alt={order.title} className="w-24 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold leading-tight">{order.title}</h3>
                    <div className="text-sm text-muted-foreground">Order ID: {orderId}</div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Timer className="h-3.5 w-3.5" /> Pay within 48 hours of winning
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />

                <div className="text-sm">
                  <div className="flex justify-between mb-2">
                    <span>Item Amount</span>
                    <span>{currency(order.amountDue)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Buyer Protection</span>
                    <span>{currency(4.99)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>{currency(12.99)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total Due</span>
                    <span>{currency(order.amountDue + 4.99 + 12.99)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Time left to pay</span>
                    <span>
                      {expired ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : (
                        <Badge variant="secondary">{hours}h {minutes}m {seconds}s</Badge>
                      )}
                    </span>
                  </div>
                  <Progress value={progress} className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment + Address */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            {/* Address Selection */}
            <Card>
              <CardContent className="p-4">
                <div className="mb-3 font-semibold flex items-center gap-2">
                  <Home className="h-4 w-4" /> Delivery Address
                </div>
                <RadioGroup value={addressId} onValueChange={setAddressId} className="space-y-3">
                  {savedAddresses.map((a) => (
                    <label key={a.id} htmlFor={a.id} className="flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-muted/30">
                      <RadioGroupItem value={a.id} id={a.id} />
                      <div>
                        <div className="font-medium flex items-center gap-2">{a.label} <Badge variant="secondary">Saved</Badge></div>
                        <div className="text-sm text-muted-foreground">{a.details}</div>
                        <div className="text-xs text-muted-foreground mt-1">{a.contact}</div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>

                {!addingAddress ? (
                  <div className="mt-3">
                    <Button variant="outline" onClick={() => setAddingAddress(true)}>+ Add new address</Button>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="label">Label</Label>
                      <Input id="label" placeholder="Home / Office" value={newAddress.label} onChange={(e) => setNewAddress(v => ({ ...v, label: e.target.value }))} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="details">Address</Label>
                      <Input id="details" placeholder="Street, City, State, ZIP" value={newAddress.details} onChange={(e) => setNewAddress(v => ({ ...v, details: e.target.value }))} />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="contact">Contact</Label>
                      <Input id="contact" placeholder="Name, Phone" value={newAddress.contact} onChange={(e) => setNewAddress(v => ({ ...v, contact: e.target.value }))} />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddAddress}>Save Address</Button>
                      <Button variant="ghost" onClick={() => setAddingAddress(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="font-semibold flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment Options</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Button variant={method === "upi" ? "default" : "outline"} onClick={() => setMethod("upi")} className="justify-start"><Smartphone className="h-4 w-4 mr-2" /> UPI</Button>
                  <Button variant={method === "card" ? "default" : "outline"} onClick={() => setMethod("card")} className="justify-start"><CreditCard className="h-4 w-4 mr-2" /> Card</Button>
                  <Button variant={method === "netbanking" ? "default" : "outline"} onClick={() => setMethod("netbanking")} className="justify-start"><Landmark className="h-4 w-4 mr-2" /> Net Banking</Button>
                  <Button variant={method === "wallet" ? "default" : "outline"} onClick={() => setMethod("wallet")} className="justify-start">Wallet</Button>
                </div>

                {method === "upi" && (
                  <div className="grid gap-2">
                    <Label htmlFor="upi">UPI ID</Label>
                    <Input id="upi" placeholder="username@bank" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                    <p className="text-xs text-muted-foreground">We'll open your UPI app to collect payment.</p>
                  </div>
                )}

                {method === "card" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <Label htmlFor="cardNo">Card Number</Label>
                      <Input id="cardNo" placeholder="1234 5678 9012 3456" value={card.number} onChange={(e) => setCard(v => ({ ...v, number: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="name">Name on Card</Label>
                      <Input id="name" placeholder="John Doe" value={card.name} onChange={(e) => setCard(v => ({ ...v, name: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                      <Input id="expiry" placeholder="09/28" value={card.expiry} onChange={(e) => setCard(v => ({ ...v, expiry: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="***" type="password" value={card.cvv} onChange={(e) => setCard(v => ({ ...v, cvv: e.target.value }))} />
                    </div>
                  </div>
                )}

                {method === "netbanking" && (
                  <div className="grid gap-2">
                    <Label>Select Bank</Label>
                    <Select value={bank} onValueChange={setBank}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose your bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boa">Bank of America</SelectItem>
                        <SelectItem value="chase">Chase</SelectItem>
                        <SelectItem value="wells">Wells Fargo</SelectItem>
                        <SelectItem value="citi">Citi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {method === "wallet" && (
                  <div className="grid gap-2">
                    <Label>Select Wallet</Label>
                    <Select value={wallet} onValueChange={setWallet}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a wallet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="amazon">Amazon Pay</SelectItem>
                        <SelectItem value="apple">Apple Pay</SelectItem>
                        <SelectItem value="google">Google Pay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <input id="agree" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <label htmlFor="agree" className="text-muted-foreground">I agree to the Terms, Fees and Refund policy</label>
                </div>

                <div className="flex items-center gap-3">
                  <Button disabled={!canPay} onClick={payNow}>
                    Pay {currency(order.amountDue + 4.99 + 12.99)}
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/cart")}>Pay Later</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;