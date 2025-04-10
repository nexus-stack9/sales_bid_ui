
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';
import { useIsMobile } from '@/hooks/use-mobile';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className={`flex-1 ${isMobile ? 'pb-20' : ''}`}>{children}</main>
      <BottomNav />
      {!isMobile && <Footer />}
    </div>
  );
};

export default Layout;
