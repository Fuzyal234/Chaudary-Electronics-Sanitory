import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Public_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { CatalogProvider } from '@/context/CatalogContext';
import StorefrontChrome from '@/components/layout/StorefrontChrome';

/* Display — Plus Jakarta Sans. Geometric enough to feel modern, humanist
   enough to stay approachable at headline weight. */
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

/* Body — Public Sans. Workmanlike, high legibility at small sizes. */
const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

/* Reference — IBM Plex Mono. Part numbers and spec codes only. */
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
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
    <html
      lang="en"
      className={`${jakarta.variable} ${publicSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="font-body bg-bg dark:bg-dark-bg text-primary dark:text-slate-100 antialiased">
        <AuthProvider>
          <CatalogProvider>
            <AppProvider>
              <StorefrontChrome>{children}</StorefrontChrome>
            </AppProvider>
          </CatalogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
