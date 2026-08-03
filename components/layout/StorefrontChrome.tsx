'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import BackToTop from '@/components/common/BackToTop';
import CartSidebar from '@/components/common/CartSidebar';
import SearchModal from '@/components/common/SearchModal';

/**
 * Renders the storefront chrome (navbar, footer, floating widgets) around the
 * page, except on `/admin` routes which supply their own shell.
 */
export default function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // Admin routes provide their own shell (and their own <main>).
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="animate-fade-in">{children}</main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <CartSidebar />
      <SearchModal />
    </>
  );
}
