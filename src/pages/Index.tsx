import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import LiveAuctions from "@/components/home/LiveAuctions";
import HowItWorks from "@/components/home/HowItWorks";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <Hero />
        <Categories />
        <LiveAuctions />
        <HowItWorks />
        <CTASection />
      </div>
    </Layout>
  );
};

export default Index;
