import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { AuthProvider } from './hooks/useAuth';
import { WishlistProvider } from './hooks/useWishlist';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AIChatModal } from './components/common/AIChatModal';

// Customer Showcase Pages
import { HomePage } from './pages/customer/HomePage';
import { CatalogPage } from './pages/customer/CatalogPage';
import { CataloguesPage } from './pages/customer/CataloguesPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { AboutPage } from './pages/customer/AboutPage';
import { ContactPage } from './pages/customer/ContactPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Admin Portal Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { DashboardPage as AdminDashboard } from './pages/admin/DashboardPage';
import { ProductsPage as AdminProducts } from './pages/admin/ProductsPage';
import { OffersPage as AdminOffers } from './pages/admin/OffersPage';
import { CustomersPage as AdminCustomers } from './pages/admin/CustomersPage';
import { SupportPage as AdminSupport } from './pages/admin/SupportPage';
import { GoldRatesPage as AdminGoldRates } from './pages/admin/GoldRatesPage';
import { EnquiriesPage as AdminEnquiries } from './pages/admin/EnquiriesPage';
import { CataloguesPage as AdminCatalogues } from './pages/admin/CataloguesPage';
import { CategoriesPage as AdminCategories } from './pages/admin/CategoriesPage';

export function App() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <AuthProvider>
      <WishlistProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100 selection:bg-gold-500 selection:text-slate-950 font-sans relative">
            <Routes>
              {/* Public Authentication Gateway */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Admin/Owner Portal Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin', 'owner']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="gold-rates" element={<AdminGoldRates />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="catalogues" element={<AdminCatalogues />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
                <Route path="offers" element={<AdminOffers />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="support" element={<AdminSupport />} />
                {/* Fallback legacy route redirect */}
                <Route path="orders" element={<Navigate to="/admin/enquiries" replace />} />
              </Route>

              {/* Public Jewellery Showcase Customer Routes */}
              <Route
                path="/*"
                element={
                  <>
                    <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<HomePage onOpenAIChat={() => setIsAIChatOpen(true)} />} />
                        <Route path="/collections" element={<CatalogPage />} />
                        <Route path="/catalog" element={<CatalogPage />} />
                        <Route path="/catalogues" element={<CataloguesPage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />

                        {/* Redirect legacy shopping routes to catalogue */}
                        <Route path="/checkout" element={<Navigate to="/catalog" replace />} />
                        <Route path="/orders" element={<Navigate to="/wishlist" replace />} />
                        <Route path="/support" element={<Navigate to="/contact" replace />} />
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

                    {/* Floating AI Modal */}
                    <AIChatModal isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
                  </>
                }
              />
            </Routes>
          </div>
        </Router>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
