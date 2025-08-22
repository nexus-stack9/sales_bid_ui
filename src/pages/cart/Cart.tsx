import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Clock, CreditCard, History, IndianRupee, MapPin, Timer, CheckCircle, XCircle, ArrowUpRight } from "lucide-react";

// ---- Types ----
interface ActiveBidItem {
  id: string;
  title: string;
  image: string;
  currentBid: number;
  yourBid: number;
  endsAt: string; // ISO string
  lotNumber: string;
}

interface WonBidItem {
  id: string;
  title: string;
  image: string;
  amountDue: number;
  wonAt: string; // ISO string
  orderId: string;
}

interface BidHistoryRow {
  id: string;
  title: string;
  bidAmount: number;
  result: "Won" | "Lost" | "Outbid" | "Paid";
  date: string; // ISO
}

// ---- Helpers ----
const currency = (n: number) => n.toLocaleString(undefined, { style: "currency", currency: "USD" });

const useCountdown = (deadline: Date) => {
  const [diff, setDiff] = useState<number>(() => Math.max(0, deadline.getTime() - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setDiff(Math.max(0, deadline.getTime() - Date.now())), 1000);
    return () => clearInterval(id);
  }, [deadline]);
  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds, expired: diff === 0 };
};

const Countdown: React.FC<{ to: string; className?: string }> = ({ to, className }) => {
  const deadline = useMemo(() => new Date(to), [to]);
  const { days, hours, minutes, seconds, expired } = useCountdown(deadline);
  return (
    <span className={className}>
      {expired ? "Expired" : `${days}d ${hours}h ${minutes}m ${seconds}s`}
    </span>
  );
};

// ---- Mock Data ----
const mockActiveBids: ActiveBidItem[] = [
  {
    id: "ab-101",
    title: "Premium Stainless Steel Refrigerator",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31b?q=80&w=600&auto=format&fit=crop",
    currentBid: 420,
    yourBid: 415,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    lotNumber: "LOT-7781",
  },
  {
    id: "ab-102",
    title: "4K Ultra HD Smart TV - 55 inch",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop",
    currentBid: 610,
    yourBid: 610,
    endsAt: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
    lotNumber: "LOT-5520",
  },
];

const mockWonBids: WonBidItem[] = [
  {
    id: "wb-301",
    title: "Energy Efficient Washing Machine",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
    amountDue: 349.99,
    wonAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // won 6h ago
    orderId: "ORD-90112",
  },
  {
    id: "wb-302",
    title: "Air Fryer Pro Max",
    image: "https://images.unsplash.com/photo-1611250188496-e966043a0625?q=80&w=600&auto=format&fit=crop",
    amountDue: 129.5,
    wonAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(), // won 40h ago
    orderId: "ORD-90144",
  },
];

const mockHistory: BidHistoryRow[] = [
  { id: "h1", title: "Smartphone X200", bidAmount: 299, result: "Lost", date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
  { id: "h2", title: "Noise Cancelling Headphones", bidAmount: 189, result: "Paid", date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString() },
  { id: "h3", title: "Robot Vacuum Cleaner", bidAmount: 219, result: "Outbid", date: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString() },
  { id: "h4", title: "Gaming Laptop 15\"", bidAmount: 1020, result: "Won", date: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() },
];

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalActive = mockActiveBids.length;
  const totalWon = mockWonBids.length;
  const totalDue = mockWonBids.filter((w) => {
    const dueAt = new Date(new Date(w.wonAt).getTime() + 48 * 3600 * 1000);
    return dueAt.getTime() > Date.now();
  }).length;
  const totalSpent = mockHistory.filter((h) => h.result === "Paid").reduce((s, h) => s + h.bidAmount, 0);

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Buyer Dashboard</h1>
            <p className="text-muted-foreground">Track your bids, payments, and history in one place.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/auctions")}>Browse Auctions</Button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-xs text-muted-foreground">Active Bids</div>
                <div className="text-xl font-semibold">{totalActive}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <div>
                <div className="text-xs text-muted-foreground">Won Bids</div>
                <div className="text-xl font-semibold">{totalWon}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-amber-600" />
              <div>
                <div className="text-xs text-muted-foreground">Pending Payments</div>
                <div className="text-xl font-semibold">{totalDue}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <IndianRupee className="h-5 w-5 text-indigo-600" />
              <div>
                <div className="text-xs text-muted-foreground">Total Spent</div>
                <div className="text-xl font-semibold">{currency(totalSpent)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active">
          <div className="flex items-center justify-between overflow-x-auto">
            <TabsList className="min-w-max">
              <TabsTrigger value="active" className="gap-2"><Timer className="h-4 w-4" /> Active Bids</TabsTrigger>
              <TabsTrigger value="won" className="gap-2"><CheckCircle className="h-4 w-4" /> Won Bids</TabsTrigger>
              <TabsTrigger value="history" className="gap-2"><History className="h-4 w-4" /> Bid History</TabsTrigger>
            </TabsList>
          </div>

          {/* Active Bids */}
          <TabsContent value="active" className="mt-4">
            {mockActiveBids.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">No active bids yet.</CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockActiveBids.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-32 h-40 sm:h-28 md:w-40 md:h-32">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div>
                              <div className="text-sm text-muted-foreground">{item.lotNumber}</div>
                              <h3 className="font-semibold leading-tight">{item.title}</h3>
                            </div>
                            <Badge variant={item.yourBid >= item.currentBid ? "default" : "secondary"}>
                              {item.yourBid >= item.currentBid ? "Leading" : "Outbid"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                            <div>
                              <div className="text-muted-foreground">Current Bid</div>
                              <div className="font-semibold">{currency(item.currentBid)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Your Bid</div>
                              <div className="font-semibold">{currency(item.yourBid)}</div>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <Countdown to={item.endsAt} />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button variant="outline" size="sm" onClick={() => toast({ title: "Auto-bid enabled", description: "We'll bid up to your max." })}>Enable Auto-bid</Button>
                              <Button size="sm" onClick={() => toast({ title: "Bid placed", description: "Your new bid is submitted." })}>Increase Bid</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Won Bids */}
          <TabsContent value="won" className="mt-4">
            {mockWonBids.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">No won bids yet.</CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mockWonBids.map((item) => {
                  const dueAt = new Date(new Date(item.wonAt).getTime() + 48 * 3600 * 1000);
                  const { expired } = useCountdown(dueAt);
                  const totalMs = 48 * 3600 * 1000;
                  const remainingMs = Math.max(0, dueAt.getTime() - Date.now());
                  const progress = 100 - Math.round((remainingMs / totalMs) * 100);
                  return (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="w-full sm:w-28 h-40 sm:h-24 md:w-32 md:h-28">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <h3 className="font-semibold leading-tight">{item.title}</h3>
                                <div className="text-sm text-muted-foreground">Order: {item.orderId}</div>
                              </div>
                              <Badge variant={expired ? "destructive" : "default"}>
                                {expired ? "Payment Window Expired" : "Payment Due"}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-sm">
                              <div>
                                <div className="text-muted-foreground">Amount Due</div>
                                <div className="font-semibold">{currency(item.amountDue)}</div>
                              </div>
                              <div className="sm:col-span-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><Timer className="h-3.5 w-3.5" /> Pay within 48 hours</span>
                                  <span><Countdown to={dueAt.toISOString()} /></span>
                                </div>
                                <Progress value={progress} className="mt-1" />
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <Button size="sm" onClick={() => navigate(`/payment/${item.orderId}`)}>
                                Pay Now <ArrowUpRight className="ml-1 h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => toast({ title: "Invoice downloaded" })}>
                                Download Invoice
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Bid History */}
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right">Bid</TableHead>
                      <TableHead className="text-right">Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockHistory.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">{row.title}</TableCell>
                        <TableCell className="hidden md:table-cell">{new Date(row.date).toLocaleString()}</TableCell>
                        <TableCell className="text-right">{currency(row.bidAmount)}</TableCell>
                        <TableCell className="text-right">
                          {row.result === "Paid" && (
                            <span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle className="h-4 w-4" /> Paid</span>
                          )}
                          {row.result === "Won" && (
                            <span className="inline-flex items-center gap-1 text-blue-600"><CheckCircle className="h-4 w-4" /> Won</span>
                          )}
                          {row.result === "Lost" && (
                            <span className="inline-flex items-center gap-1 text-muted-foreground"><XCircle className="h-4 w-4" /> Lost</span>
                          )}
                          {row.result === "Outbid" && (
                            <span className="inline-flex items-center gap-1 text-amber-600"><XCircle className="h-4 w-4" /> Outbid</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Help / Address Note */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              You can choose or add a delivery address during payment. Saved addresses will be available for quick selection.
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;