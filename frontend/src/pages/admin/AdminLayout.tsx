import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Tag, Users, LifeBuoy, Sparkles, Store, LogOut, ShieldAlert, Coins } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || !['staff', 'admin', 'owner'].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0B0F17] text-slate-100">
        <div className="max-w-md glass-panel p-8 rounded-3xl text-center space-y-4 border border-rose-500/40">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="font-serif text-2xl font-bold">Access Denied (403)</h2>
          <p className="text-slate-400 text-xs">
            Admin/Owner privileges are required to access this portal. Your current role: <strong className="text-gold-400">{user?.role || 'Guest'}</strong>
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/" className="bg-slate-800 text-slate-200 text-xs px-4 py-2 rounded-full">
              Back to Store
            </Link>
            <Link to="/login" className="bg-gold-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-full">
              Sign In as Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Executive Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Daily Gold Rates', path: '/admin/gold-rates', icon: Coins },
    { label: 'Product Inventory', path: '/admin/products', icon: Package },
    { label: 'Order Processing', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Promotions & Offers', path: '/admin/offers', icon: Tag },
    { label: 'Customer Directory', path: '/admin/customers', icon: Users },
    { label: 'Support Queue', path: '/admin/support', icon: LifeBuoy }
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0D1320] border-r border-slate-800 flex flex-col justify-between hidden md:flex">
        <div className="p-6 space-y-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-500 text-slate-950 font-serif font-bold text-lg flex items-center justify-center">
              V
            </div>
            <div>
              <span className="font-serif font-bold gold-gradient-text text-sm block">VENKATESHWARA</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Store Admin Portal</span>
            </div>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="glass-panel p-3 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-slate-200 truncate max-w-[120px]">{user.fullName}</p>
              <span className="text-[10px] text-gold-400 uppercase font-bold">{user.role}</span>
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-rose-400 p-1" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/"
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Store className="w-3.5 h-3.5" /> Customer Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-[#0D1320]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="bg-gold-500/20 text-gold-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-gold-500/30 uppercase">
              Role: {user.role}
            </span>
            <span className="text-xs text-slate-400">| Venkateshwara Commerce System</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs text-gold-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Store className="w-3.5 h-3.5" /> Switch to Customer View
            </Link>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="p-6 sm:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
