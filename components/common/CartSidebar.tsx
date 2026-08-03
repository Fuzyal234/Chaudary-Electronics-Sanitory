'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { formatPrice } from '@/lib/utils';

export default function CartSidebar() {
  const { cartOpen, setCartOpen, cart, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useApp();
  const router = useRouter();

  const goToCheckout = () => {
    setCartOpen(false);
    router.push('/checkout');
  };

  return (
    <>
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white dark:bg-dark-card z-[100] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/20">
              <div className="flex items-center gap-3">
                <ShoppingCart size={22} className="text-secondary" />
                <h2 className="font-heading font-bold text-primary dark:text-white text-lg">
                  Shopping Cart
                </h2>
                {cartCount > 0 && (
                  <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-sm font-bold rounded-full">{cartCount}</span>
                )}
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                    <ShoppingBag size={32} className="text-slate-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-500 dark:text-slate-300">Your cart is empty</p>
                    <p className="text-sm text-slate-400 mt-1">Add products to get started</p>
                  </div>
                  <Link
                    href="/products"
                    onClick={() => setCartOpen(false)}
                    className="px-6 py-2.5 bg-secondary text-white rounded-xl text-sm font-semibold hover:bg-secondary-dark transition-colors"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/20"
                    >
                      <div className="w-16 h-16 rounded-xl bg-white dark:bg-white/10 overflow-hidden flex-shrink-0 relative border border-slate-100 dark:border-white/20">
                        <SmartImage src={item.product.images[0]} alt={item.product.name} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-primary dark:text-white text-sm line-clamp-2 leading-snug">{item.product.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.product.brand}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-primary dark:text-white text-sm">{formatPrice(item.product.price)}</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 flex items-center justify-center hover:bg-slate-100 transition-colors">
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-primary dark:text-white">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 flex items-center justify-center hover:bg-slate-100 transition-colors">
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="self-start p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                        <Trash2 size={15} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-slate-100 dark:border-white/20 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Delivery</span>
                    <span className="text-emerald-500 font-medium">{cartTotal >= 5000 ? 'FREE' : formatPrice(250)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-primary dark:text-white pt-2 border-t border-slate-100 dark:border-white/20">
                    <span>Total</span>
                    <span>{formatPrice(cartTotal + (cartTotal >= 5000 ? 0 : 250))}</span>
                  </div>
                </div>
                {cartTotal < 5000 && (
                  <p className="text-xs text-center text-slate-400">
                    Add <strong className="text-emerald-500">{formatPrice(5000 - cartTotal)}</strong> more for free delivery
                  </p>
                )}
                <button onClick={goToCheckout} className="w-full py-3.5 bg-secondary text-white rounded-xl font-bold text-sm hover:bg-secondary-dark transition-colors shadow-lg hover:shadow-secondary/30">
                  Proceed to Checkout
                </button>
                <div className="flex gap-3">
                  <Link href="/products" onClick={() => setCartOpen(false)} className="flex-1 py-2.5 border border-slate-200 dark:border-white/20 text-primary dark:text-white rounded-xl text-sm font-semibold text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    Continue Shopping
                  </Link>
                  <button onClick={clearCart} className="flex-1 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors">
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
