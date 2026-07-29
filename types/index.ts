export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  brand: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  description: string;
  shortDescription: string;
  specifications: Record<string, string>;
  features: string[];
  stock: number;
  images: string[];
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  sku: string;
  weight?: string;
  dimensions?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  color: string;
  productCount: number;
  subcategories: string[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  country: string;
  website?: string;
  categories: string[];
  productCount: number;
  established?: string;
  featuredProducts?: string[];
  color: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  productId?: string;
  verified: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  image: string;
  validUntil: string;
  code?: string;
  category?: string;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  availability: 'all' | 'in-stock' | 'out-of-stock';
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'name';
  viewMode: 'grid' | 'list';
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
