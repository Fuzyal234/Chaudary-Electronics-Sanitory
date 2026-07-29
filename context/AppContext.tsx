'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, WishlistItem } from '@/types';

interface AppContextType {
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;

  // Wishlist
  wishlist: WishlistItem[];
  wishlistCount: number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;

  // Compare
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;

  // Dark Mode
  darkMode: boolean;
  toggleDarkMode: () => void;

  // UI State
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  wishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Recently Viewed
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Hydrate persisted state from localStorage on mount. This must run in an
  // effect because localStorage is unavailable during server-side rendering.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('chaudhry-cart');
      const savedWishlist = localStorage.getItem('chaudhry-wishlist');
      const savedDarkMode = localStorage.getItem('chaudhry-darkmode');
      const savedRecent = localStorage.getItem('chaudhry-recent');

      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
      if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));
    } catch { /* ignore parse errors */ }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist cart
  useEffect(() => {
    localStorage.setItem('chaudhry-cart', JSON.stringify(cart));
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem('chaudhry-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Persist recently viewed
  useEffect(() => {
    localStorage.setItem('chaudhry-recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Apply dark mode to HTML
  useEffect(() => {
    localStorage.setItem('chaudhry-darkmode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const wishlistCount = wishlist.length;

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);
  const isInCart = useCallback((productId: string) => cart.some((item) => item.product.id === productId), [cart]);

  const addToWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.product.id === product.id)) return prev;
      return [...prev, { product, addedAt: new Date() }];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const isInWishlist = useCallback((productId: string) => wishlist.some((item) => item.product.id === productId), [wishlist]);

  const toggleWishlist = useCallback((product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [isInWishlist, removeFromWishlist, addToWishlist]);

  const addToCompare = useCallback((product: Product) => {
    setCompareList((prev) => {
      if (prev.length >= 3 || prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);
  const isInCompare = useCallback((productId: string) => compareList.some((p) => p.id === productId), [compareList]);

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), []);

  const addToRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        cart, cartCount, cartTotal,
        addToCart, removeFromCart, updateQuantity, clearCart, isInCart,
        wishlist, wishlistCount,
        addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist,
        compareList, addToCompare, removeFromCompare, clearCompare, isInCompare,
        darkMode, toggleDarkMode,
        cartOpen, setCartOpen,
        wishlistOpen, setWishlistOpen,
        searchOpen, setSearchOpen,
        recentlyViewed, addToRecentlyViewed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
