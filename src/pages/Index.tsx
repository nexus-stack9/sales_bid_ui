import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import LiveAuctions from "@/components/home/LiveAuctions";
import HowItWorks from "@/components/home/HowItWorks";
import CTASection from "@/components/home/CTASection";
import ReviewsMarquee from "@/components/home/ReviewsMarquee";
import SellerSpotlight from "@/components/home/SellerSpotlight";
import IntegrationsSection from "@/components/home/IntegrationsSection";
import CompanyStats from "@/components/home/CompanyStats";
import FeaturedAuctions from "@/components/home/FeaturedAuctions";
import Testimonials from "@/components/home/Testimonials";
import TrendingCategories from "@/components/home/TrendingCategories";
import FeaturedCountdown from "@/components/home/FeaturedCountdown";
import TrendingNow from "@/components/home/TrendingNow";
import Newsletter from "@/components/home/Newsletter";
import FeaturedSellers from "@/components/home/FeaturedSellers";
import MobileApp from "@/components/home/MobileApp";

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <Hero />
        <TrendingNow />
        <TrendingCategories />
        <LiveAuctions />
        <FeaturedAuctions />
        <CompanyStats />
        <FeaturedSellers />
        <HowItWorks />
        <MobileApp />
        <Newsletter />
        <Testimonials />
        <CTASection />
      </div>
    </Layout>
  );
};

export default Index;
