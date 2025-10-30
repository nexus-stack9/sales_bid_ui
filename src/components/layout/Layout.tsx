import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();

  // Scroll to top when path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className={`flex-1 ${isMobile ? 'pb-20' : ''}`}>{children}</main>
      <BottomNav />
      <Footer />
    </div>
  );
};

export default Layout;