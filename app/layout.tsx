import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import BackToTop from '@/components/common/BackToTop';
import CartSidebar from '@/components/common/CartSidebar';
import SearchModal from '@/components/common/SearchModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'Chaudhry Sanitary, Electric & Hardware | Premium Products Pakistan',
    template: '%s | Chaudhry Sanitary',
  },
  description: 'Pakistan\'s premier destination for premium sanitary ware, electrical supplies, LED lighting, hardware, pipes, tools and construction materials. 850+ products from 50+ brands.',
  keywords: ['sanitary ware', 'electrical', 'hardware', 'LED lights', 'pipes fittings', 'water pump', 'Pakistan', 'Lahore', 'Master', 'Sonex', 'Philips', 'Schneider'],
  openGraph: {
    title: 'Chaudhry Sanitary, Electric & Hardware',
    description: 'Premium sanitary ware, electrical, hardware and construction supplies in Pakistan',
    type: 'website',
    locale: 'en_PK',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-body bg-bg dark:bg-dark-bg text-primary dark:text-slate-100 antialiased">
        <AppProvider>
          <Navbar />
          <main className="animate-fade-in">{children}</main>
          <Footer />
          <WhatsAppButton />
          <BackToTop />
          <CartSidebar />
          <SearchModal />
        </AppProvider>
      </body>
    </html>
  );
}
