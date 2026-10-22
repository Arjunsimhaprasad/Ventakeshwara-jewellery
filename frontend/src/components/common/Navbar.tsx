import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Sparkles, User, Search, ShieldCheck, LogOut, Menu, X, Coins, BookOpen, Send, Phone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useWishlist } from '../../hooks/useWishlist';
import { apiFetch } from '../../services/api';

interface NavbarProps {
  onOpenAIChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAIChat }) => {
  const { user, logout } = useAuth();
  const { wishlistProductIds } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [todayRates, setTodayRates] = useState<{ gold22kPerGram: number; gold24kPerGram: number; silverPerGram: number }>({
    gold22kPerGram: 6738,
    gold24kPerGram: 7350,
    silverPerGram: 88
  });

  const loadTodayRates = () => {
    apiFetch('/api/rates/today')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.gold22kPerGram) {
          setTodayRates({
            gold22kPerGram: Number(data.gold22kPerGram),
            gold24kPerGram: Number(data.gold24kPerGram),
            silverPerGram: Number(data.silverPerGram)
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadTodayRates();

    const handleRateUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.gold22kPerGram) {
        setTodayRates({
          gold22kPerGram: Number(customEvent.detail.gold22kPerGram),
          gold24kPerGram: Number(customEvent.detail.gold24kPerGram),
          silverPerGram: Number(customEvent.detail.silverPerGram)
        });
      } else {
        loadTodayRates();
      }
    };

    window.addEventListener('vj_rates_updated', handleRateUpdate);
    return () => window.removeEventListener('vj_rates_updated', handleRateUpdate);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Collections', path: '/catalog' },
    { label: 'Jewellery Designs', path: '/catalog' },
    { label: 'Catalogues', path: '/catalogues' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gold-500/20 shadow-lg">
      {/* Live Gold & Silver Ticker Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-burgundy-950 border-b border-gold-500/10 py-1.5 px-3 sm:px-4 text-[11px] text-slate-300 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            <span className="flex items-center gap-1 text-gold-400 font-semibold whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500 shrink-0" /> BIS 100% Hallmarked 22K/18K Gold
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="flex items-center gap-1.5 text-slate-300 whitespace-nowrap">
              <Coins className="w-3 h-3 text-gold-400 shrink-0" />
              <span className="hidden sm:inline">Daily Bullion:</span>
              <strong className="text-gold-300 font-bold">22K: ₹{todayRates.gold22kPerGram.toLocaleString('en-IN')}/g</strong>
              <span className="text-slate-500">•</span>
              <strong className="text-amber-300">24K: ₹{todayRates.gold24kPerGram.toLocaleString('en-IN')}/g</strong>
              <span className="text-slate-500">•</span>
              <strong className="text-slate-300">Silver: ₹{todayRates.silverPerGram.toLocaleString('en-IN')}/g</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={onOpenAIChat}
              className="text-gold-300 hover:text-gold-200 hidden xs:flex items-center gap-1 font-semibold transition-colors text-[11px]"
            >
              <Sparkles className="w-3 h-3 text-gold-400 animate-pulse" /> Ask "Ratna AI"
            </button>
            {user && ['staff', 'admin', 'owner'].includes(user.role) && (
              <Link
                to="/admin"
                className="bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 px-2 py-0.5 rounded border border-gold-500/40 text-[10px] font-bold tracking-wider uppercase transition-colors whitespace-nowrap"
              >
                {user.role} Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Showcase Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3.5 group shrink-0">
          <div className="relative flex items-center justify-center">
            <img 
              src="/logo-emblem.png" 
              alt="Venkateshwara Jewellery Logo" 
              className="w-11 h-11 object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <span className="font-serif text-lg sm:text-2xl font-bold tracking-wider gold-gradient-text block leading-none">
              VENKATESHWARAA
            </span>
            <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.16em] text-gold-400/90 uppercase mt-0.5 block font-semibold">
              Jewellery Showcase & Catalogues • Est. 1978
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Home, Collections, Jewellery Designs, Catalogues, About Us, Contact Us) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((item, idx) => {
            // Avoid duplicate active underline for Collections & Jewellery Designs if both point to /catalog
            const isActive = location.pathname === item.path && (idx !== 1 || location.search !== '');
            return (
              <Link
                key={`${item.label}-${idx}`}
                to={item.path}
                className={`text-xs font-semibold px-3 py-2 rounded-full transition-all uppercase tracking-wider ${
                  isActive
                    ? 'text-gold-300 bg-gold-500/10 border border-gold-500/30'
                    : 'text-slate-300 hover:text-gold-300 hover:bg-slate-800/40'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs relative">
          <input
            type="text"
            placeholder="Search designs, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 focus:border-gold-500 text-slate-200 text-xs rounded-full py-2 pl-9 pr-3 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </form>

        {/* Action Buttons: Shortlist, Consultation, Auth */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Ask Ratna AI Button */}
          <button
            onClick={onOpenAIChat}
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-full shadow-gold-glow transition-transform active:scale-95"
            title="Ask Ratna AI Jewellery Advisor"
          >
            <Sparkles className="w-3.5 h-3.5" /> <span>AI Advisor</span>
          </button>

          {/* Shortlist / Saved Designs (Replaces shopping cart) */}
          <Link
            to="/wishlist"
            className="relative p-2.5 text-slate-300 hover:text-gold-300 transition-colors rounded-full hover:bg-slate-800/50"
            title="Shortlisted Designs"
          >
            <Heart className="w-5 h-5" />
            {wishlistProductIds.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow">
                {wishlistProductIds.length}
              </span>
            )}
          </Link>

          {/* User Auth or Sign In */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:inline text-xs text-slate-300 font-medium px-2 py-1 rounded bg-slate-900/80 border border-slate-800 truncate max-w-[90px]">
                {user.fullName}
              </span>
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
              className="text-xs font-bold text-gold-400 hover:text-gold-300 border border-gold-500/40 px-3 py-1.5 rounded-full hover:bg-gold-500/10 transition-colors hidden sm:inline-block"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-gold-300 min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900/98 p-4 space-y-4 shadow-2xl backdrop-blur-md">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search jewellery designs, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-gold-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-1.5 text-sm font-medium">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-gold-300"
            >
              Home
            </Link>
            <Link
              to="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-gold-300 flex items-center justify-between"
            >
              <span>Collections & Designs</span>
              <span className="text-[10px] text-gold-400 uppercase font-bold bg-gold-500/10 px-2 py-0.5 rounded">14 Categories</span>
            </Link>
            <Link
              to="/catalogues"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-gold-300 flex items-center justify-between"
            >
              <span>Digital PDF Catalogues</span>
              <span className="text-[10px] bg-gold-500 text-slate-950 font-bold px-2 py-0.5 rounded">Lookbooks</span>
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-gold-300"
            >
              About Us (Since 1978)
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-gold-300"
            >
              Contact Us & Showroom
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800 hover:text-gold-300 flex items-center justify-between"
            >
              <span>Saved Shortlist</span>
              <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                {wishlistProductIds.length}
              </span>
            </Link>

            {/* Admin Portal if staff/admin/owner */}
            {user && ['staff', 'admin', 'owner'].includes(user.role) && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl bg-gold-500/10 text-gold-300 border border-gold-500/30 flex items-center justify-between font-bold text-xs uppercase"
              >
                <span>Showroom Management Portal</span>
                <span className="bg-gold-500 text-slate-950 px-2 py-0.5 rounded text-[10px]">{user.role}</span>
              </Link>
            )}

            {/* AI Advisor Mobile */}
            <button
              onClick={() => { setIsMobileMenuOpen(false); onOpenAIChat(); }}
              className="mt-2 text-left bg-gradient-to-r from-gold-500/20 via-amber-500/10 to-transparent p-3 rounded-xl text-gold-300 font-bold flex items-center justify-between border border-gold-500/40"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
                <span>Ask AI Concierge "Ratna"</span>
              </div>
              <span className="text-[10px] bg-gold-500 text-slate-950 px-2 py-0.5 rounded font-extrabold uppercase">Live AI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
