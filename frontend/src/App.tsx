import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import { WishlistProvider } from './hooks/useWishlist';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { AIChatModal } from './components/common/AIChatModal';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { CatalogPage } from './pages/customer/CatalogPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrdersPage } from './pages/customer/OrdersPage';
import { SupportPage } from './pages/customer/SupportPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Admin Portal Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { DashboardPage as AdminDashboard } from './pages/admin/DashboardPage';
import { ProductsPage as AdminProducts } from './pages/admin/ProductsPage';
import { OrdersPage as AdminOrders } from './pages/admin/OrdersPage';
import { OffersPage as AdminOffers } from './pages/admin/OffersPage';
import { CustomersPage as AdminCustomers } from './pages/admin/CustomersPage';
import { SupportPage as AdminSupport } from './pages/admin/SupportPage';
import { GoldRatesPage as AdminGoldRates } from './pages/admin/GoldRatesPage';

export function App() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100 selection:bg-gold-500 selection:text-slate-950 font-sans relative">
              <Routes>
                {/* Storefront Customer Routes */}
                <Route
                  path="/*"
                  element={
                    <>
                      <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<HomePage onOpenAIChat={() => setIsAIChatOpen(true)} />} />
                          <Route path="/catalog" element={<CatalogPage />} />
                          <Route path="/products/:id" element={<ProductDetailPage />} />
                          <Route path="/wishlist" element={<WishlistPage />} />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/orders" element={<OrdersPage />} />
                          <Route path="/support" element={<SupportPage />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/register" element={<RegisterPage />} />
                        </Routes>
                      </main>

                      {/* Floating AI Concierge Trigger Button */}
                      <button
                        onClick={() => setIsAIChatOpen(true)}
                        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-xs hover:scale-105 transition-all shadow-gold-glow border border-gold-300/40"
                        title="Open Ratna AI Concierge"
                      >
                        <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
                        <span>Ask Ratna AI</span>
                      </button>

                      <Footer />
                    </>
                  }
                />

                {/* Admin/Owner Portal Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="gold-rates" element={<AdminGoldRates />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="offers" element={<AdminOffers />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="support" element={<AdminSupport />} />
                </Route>
              </Routes>

              {/* Drawers & Floating Modals */}
              <CartDrawer />
              <AIChatModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
