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

export type PaymentMethod = 'cod' | 'bank' | 'card';

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
}

/** A line item snapshot captured at checkout time (decoupled from the live catalog). */
export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;           // opaque id used in the receipt URL
  orderNumber: string;  // human-friendly, e.g. CHY-260729-4821
  date: string;         // ISO timestamp
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  discountCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  status: 'confirmed';
}
