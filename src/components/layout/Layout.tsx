
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { initializeStore } from '@/store/useStore';
import { Toaster } from '@/components/ui/sonner';

export function Layout() {
  useEffect(() => {
    // Initialize store with mock data
    initializeStore();
  }, []);

  return (
    <div className="">
      <Navbar />
      <main className="mt-20">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default Layout;
