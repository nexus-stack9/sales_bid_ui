
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouterWrapper } from "./components/RouterWrapper";
import { WishlistProvider } from "@/context/WishlistContext";
import { CategoriesProvider } from "@/context/CategoriesContext";
import Index from "./pages/Index";
import AuctionsPage from "./pages/AuctionPage";
import AuctionDetail from "./pages/ProductDetailPage";
import NotFound from "./pages/NotFound";
import Profile from "./pages/user/Profile";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
// import Cart from "./pages/cart/Cart";
import PaymentPage from "./pages/PaymentPage";
import SellersPage from "./pages/sellers/SellersPage";
import ForgotPassword from './pages/ForgotPassword';
import MyBids from "./pages/user/MyBids";
import Wishlist from "./pages/user/Wishlist";
import BuyersPage from "./pages/buyers/BuyersPage"
import AllSellersPage from "./pages/sellers/allSellersPage";
import SellerRegistrationForm from "./pages/sellers/SellerRegistrationForm";
import CheckoutAddressPage from "./pages/CheckoutAddressPage";
import { SearchResultsPage } from "./pages/SearchResultsPage";


const queryClient = new QueryClient();

import OrderTrackingPage from "./pages/OrderTrackingPage";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WishlistProvider>
        <CategoriesProvider>
          <div className="overflow-x-hidden">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouterWrapper>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auctions" element={<AuctionsPage />} />
                <Route path="/auctions/:id" element={<AuctionDetail />} />
                <Route path="/user/profile" element={<Profile />} />
                <Route path="/user/wishlist" element={<Wishlist />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                {/* <Route path="/cart" element={<Cart />} /> */}
                <Route path="/payment/:orderId" element={<PaymentPage />} />
                <Route path="/my-bids" element={<MyBids />} />
                <Route path="/my-orders/:orderId" element={<OrderTrackingPage />} />
                <Route path="/sellers" element={<SellersPage />} />
                <Route path="/allSellersPage" element={<AllSellersPage />} />
                <Route path="/sellerRegistration" element={<SellerRegistrationForm />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/checkout/address" element={<CheckoutAddressPage />} />



                <Route path="/buyers" element={<BuyersPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </RouterWrapper>
            </BrowserRouter>
          </div>
        </CategoriesProvider>
      </WishlistProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;