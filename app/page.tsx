import HeroSection from '@/components/home/HeroSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import CatalogShowcase from '@/components/home/CatalogShowcase';
import BestSellers from '@/components/home/BestSellers';
import StoreStats from '@/components/home/StoreStats';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Newsletter from '@/components/home/Newsletter';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <CatalogShowcase />
      <BestSellers />
      <StoreStats />
      <WhyChooseUs />
      <Newsletter />
    </>
  );
}
