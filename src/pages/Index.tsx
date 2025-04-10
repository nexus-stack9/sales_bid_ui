
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import Featured from '@/components/home/Featured';
import Categories from '@/components/home/Categories';
import HowItWorks from '@/components/home/HowItWorks';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <Hero />
        <Featured />
        <Categories />
        <HowItWorks />
        <CTASection />
      </div>
    </Layout>
  );
};

export default Index;
