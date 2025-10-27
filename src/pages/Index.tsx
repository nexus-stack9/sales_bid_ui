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
// import FeaturedAuctions from "@/components/home/FeaturedAuctions";
import Testimonials from "@/components/home/Testimonials";
import TrendingCategories from "@/components/home/TrendingCategories";
import FeaturedCountdown from "@/components/home/FeaturedCountdown";





const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <Hero />
        <SellerSpotlight />
        {/* <TrendingCategories /> */}
        {/* <CompanyStats /> */}
        {/* <FeaturedAuctions /> */}
        {/* <FeaturedCountdown /> */}
        <LiveAuctions />
        <HowItWorks />
        <IntegrationsSection />
        <CTASection />
        <Testimonials />
        {/* <ReviewsMarquee /> */}
      </div>
    </Layout>
  );
};

export default Index;