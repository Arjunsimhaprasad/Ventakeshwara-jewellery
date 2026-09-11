import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Sparkles, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'customer' | 'staff' | 'admin' | 'owner'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // 1. Loading Splash Screen while verifying auth session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center p-6 text-slate-100 selection:bg-gold-500 selection:text-slate-950">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gold-500/10 border border-gold-500/30 animate-ping absolute" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-amber-300 text-slate-950 font-serif font-extrabold text-3xl flex items-center justify-center shadow-gold-glow relative z-10 animate-pulse">
            V
          </div>
        </div>

        <div className="text-center space-y-2 max-w-sm">
          <h3 className="font-serif text-lg font-bold gold-gradient-text tracking-wide">
            VENKATESHWARA JEWELLERY
          </h3>
          <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-spin" />
            <span>Verifying secure customer session...</span>
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated -> Redirect to Login with return redirect URL
  if (!user) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnUrl}`} replace />;
  }

  // 3. Optional Role Authorization Check (e.g., for Admin Portal)
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 text-slate-100">
        <div className="max-w-md glass-panel p-8 rounded-3xl text-center space-y-4 border border-rose-500/40 shadow-2xl">
          <ShieldAlert className="w-14 h-14 text-rose-500 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-slate-100">Access Restricted</h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Your account (<strong className="text-gold-400">{user.email}</strong>) with role <strong className="text-gold-300 uppercase">{user.role}</strong> does not have permission to view this section.
          </p>
          <div className="pt-2">
            <Navigate to="/" replace />
          </div>
        </div>
      </div>
    );
  }

  // 4. Authenticated & Authorized -> Render Children
  return <>{children}</>;
};
