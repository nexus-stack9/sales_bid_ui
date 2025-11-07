import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { WishlistProvider } from "@/context/WishlistContext";
import { CategoriesProvider } from "@/context/CategoriesContext";
import Layout from "@/components/layout/Layout";

// Page imports
import Index from "./pages/Index";
import AuctionsPage from "./pages/AuctionPage";
import AuctionDetail from "./pages/ProductDetailPage";
import NotFound from "./pages/NotFound";
import Profile from "./pages/user/Profile";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import PaymentPage from "./pages/PaymentPage";
import SellersPage from "./pages/sellers/SellersPage";
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import MyBids from "./pages/user/MyBids";
import Wishlist from "./pages/user/Wishlist";
import BuyersPage from "./pages/buyers/BuyersPage";
import AllSellersPage from "./pages/sellers/allSellersPage";
import SellerRegistrationForm from "./pages/sellers/SellerRegistrationForm";
import CheckoutAddressPage from "./pages/CheckoutAddressPage";
import { SearchResultsPage } from "./pages/SearchResultsPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import UpcomingAuctions from "./pages/UpcomingAuctions";
import HowItWorks from "./pages/HowItWorks";
import SellingServices from "./pages/SellingServices";
import BuyerProtection from "./pages/BuyerProtection";
import CategoryPage from "./pages/CategoryPage";
import HelpCenter from "./pages/support/HelpCenter";
import ShippingLogistics from "./pages/support/ShippingLogistics";
import ReturnsRefunds from "./pages/support/ReturnsRefunds";
import ContactUs from "./pages/support/ContactUs";
import FAQ from "./pages/support/FAQ";

const queryClient = new QueryClient();

// Root layout wrapper that persists across all routes
const RootLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WishlistProvider>
        <CategoriesProvider>
          <div className="overflow-x-hidden">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Wrap all routes with persistent Layout */}
                <Route element={<RootLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/auctions" element={<AuctionsPage />} />
                  <Route path="/auctions/upcoming" element={<UpcomingAuctions />} />
                  <Route path="/auctions/:id" element={<AuctionDetail />} />
                  <Route path="/user/profile" element={<Profile />} />
                  <Route path="/user/wishlist" element={<Wishlist />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/payment/:orderId" element={<PaymentPage />} />
                  <Route path="/my-bids" element={<MyBids />} />
                  <Route path="/track-order/:orderId" element={<OrderTrackingPage />} />
                  <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
                  <Route path="/upcoming-auctions" element={<UpcomingAuctions />} />
                  <Route path="/allSellersPage" element={<AllSellersPage />} />
                  <Route path="/sellers" element={<SellersPage />} />
                  <Route path="/sellerRegistration" element={<SellerRegistrationForm />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/checkout/address" element={<CheckoutAddressPage />} />

                  {/* Marketing/Info */}
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/selling-services" element={<SellingServices />} />
                  <Route path="/buyer-protection" element={<BuyerProtection />} />

                  {/* Category route (generic) */}
                  <Route path="/category/:slug" element={<CategoryPage />} />

                  {/* Support */}
                  <Route path="/support/help-center" element={<HelpCenter />} />
                  <Route path="/support/shipping-logistics" element={<ShippingLogistics />} />
                  <Route path="/support/returns-refunds" element={<ReturnsRefunds />} />
                  <Route path="/support/contact-us" element={<ContactUs />} />
                  <Route path="/support/faq" element={<FAQ />} />

                  <Route path="/buyers" element={<BuyersPage />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* 404 - Must be last */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </div>
        </CategoriesProvider>
      </WishlistProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;