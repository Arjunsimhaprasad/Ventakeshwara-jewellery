import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Sparkles, User, Search, ShieldCheck, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

interface NavbarProps {
  onOpenAIChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAIChat }) => {
  const { user, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistProductIds } = useWishlist();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gold-500/20 shadow-lg">
      {/* Live Gold Ticker Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-burgundy-900 border-b border-gold-500/10 py-1.5 px-4 text-[11px] text-slate-300 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-gold-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500" /> BIS 100% Hallmarked 22K/18K Gold
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">Today's Gold Rate: <strong className="text-gold-300">₹7,240/g (22K)</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAIChat}
              className="text-gold-300 hover:text-gold-200 flex items-center gap-1 font-semibold transition-colors"
            >
              <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" /> Ask AI Concierge "Ratna"
            </button>
            {user && ['staff', 'admin', 'owner'].includes(user.role) && (
              <Link
                to="/admin"
                className="bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 px-2.5 py-0.5 rounded border border-gold-500/40 text-[10px] font-bold tracking-wider uppercase transition-colors"
              >
                {user.role} Portal
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 via-gold-600 to-amber-800 flex items-center justify-center font-serif text-slate-950 font-bold text-xl shadow-gold-glow group-hover:scale-105 transition-transform">
            V
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider gold-gradient-text block">
              VENKATESHWARA
            </span>
            <span className="text-[10px] font-sans tracking-widest text-slate-400 uppercase -mt-1 block">
              Jewellery • Est. 1978
            </span>
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search gold necklaces, solitaire rings, polki..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 focus:border-gold-500 text-slate-200 text-xs rounded-full py-2.5 pl-10 pr-4 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </form>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/catalog"
            className="hidden sm:inline-block text-xs font-semibold text-slate-200 hover:text-gold-300 transition-colors uppercase tracking-wider px-3 py-2"
          >
            Collections
          </Link>

          {/* AI Advisor Button */}
          <button
            onClick={onOpenAIChat}
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-full shadow-gold-glow transition-transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Advisor
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="relative p-2.5 text-slate-300 hover:text-gold-300 transition-colors rounded-full hover:bg-slate-800/50"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistProductIds.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                {wishlistProductIds.length}
              </span>
            )}
          </Link>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 text-slate-300 hover:text-gold-300 transition-colors rounded-full hover:bg-slate-800/50"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-gold-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/orders"
                className="hidden sm:flex items-center gap-1.5 text-xs text-slate-200 hover:text-gold-300 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700"
              >
                <User className="w-3.5 h-3.5 text-gold-400" />
                <span className="max-w-[100px] truncate">{user.fullName}</span>
              </Link>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-bold text-gold-400 hover:text-gold-300 border border-gold-500/40 px-3.5 py-1.5 rounded-full hover:bg-gold-500/10 transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 text-slate-300 hover:text-gold-300"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-800 bg-slate-900/95 p-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search jewellery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 text-xs rounded-lg py-2 pl-9 pr-3"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>
          <div className="flex flex-col gap-2 pt-2 text-sm font-medium">
            <Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-200 hover:text-gold-300">
              Browse Collections
            </Link>
            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-200 hover:text-gold-300">
              My Wishlist ({wishlistProductIds.length})
            </Link>
            <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-200 hover:text-gold-300">
              My Orders & Support
            </Link>
            <button
              onClick={() => { setIsMobileMenuOpen(false); onOpenAIChat(); }}
              className="text-left text-gold-400 font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Ask AI Concierge "Ratna"
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
