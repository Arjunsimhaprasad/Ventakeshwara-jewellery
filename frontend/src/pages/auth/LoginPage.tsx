import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../services/api';

export const LoginPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'admin' ? 'admin' : 'customer';
  
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'admin' && activeTab !== 'admin') {
      setActiveTab('admin');
    } else if (modeParam === 'customer' && activeTab !== 'customer') {
      setActiveTab('customer');
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'customer' | 'admin') => {
    setActiveTab(tab);
    setError('');
    setSearchParams({ mode: tab });
  };

  const performLogin = async (emailVal: string, passwordVal: string) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal, password: passwordVal })
      });
      const data = await res.json();

      if (res.ok) {
        if (activeTab === 'admin' && !['admin', 'owner', 'staff'].includes(data.user.role)) {
          setError('Access Denied. This account does not have Admin or Owner privileges.');
          setIsLoading(false);
          return;
        }

        login(data.token, data.user);
        if (['admin', 'owner', 'staff'].includes(data.user.role)) {
          navigate('/admin');
        } else {
          navigate(redirect);
        }
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Unable to connect to server. Please verify backend service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');

    try {
      const mockGoogleEmail = prompt('Enter your Google Account email for 1-Click Sign In:', 'customer.google@gmail.com');
      if (!mockGoogleEmail) {
        setIsGoogleLoading(false);
        return;
      }

      const res = await apiFetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: mockGoogleEmail.trim(),
          fullName: mockGoogleEmail.split('@')[0].replace('.', ' '),
          googleId: `google_${Date.now()}`
        })
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        if (['admin', 'owner', 'staff'].includes(data.user.role)) {
          navigate('/admin');
        } else {
          navigate(redirect);
        }
      } else {
        setError(data.message || 'Google authentication failed.');
      }
    } catch (err) {
      setError('Google sign-in error. Please try standard sign in.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(email, password);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-gold-500/30 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gold-500 text-slate-950 font-serif font-bold text-2xl flex items-center justify-center mx-auto shadow-gold-glow">
            V
          </div>
          <h2 className="font-serif text-2xl font-bold gold-gradient-text">Welcome Back</h2>
          <p className="text-slate-400 text-xs">Sign in to your Venkateshwara account</p>
        </div>

        {/* Tab Switcher for Customer vs Admin Portal */}
        <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleTabChange('customer')}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'customer'
                ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-slate-950 shadow-gold-glow font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer Login</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 shadow-lg font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin & Owner</span>
          </button>
        </div>

        {/* Admin Badge Notice */}
        {activeTab === 'admin' && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl text-[11px] text-amber-300 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="font-bold">Store Administration Portal</p>
              <p className="text-slate-400 text-[10px]">Restricted authentication for Store Owner and authorized staff.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-200 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Customer Tab Google Sign-In Option */}
        {activeTab === 'customer' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold py-3 rounded-xl flex items-center justify-center gap-3 text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              {/* Google Multicolor SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isGoogleLoading ? 'Connecting to Google...' : 'Sign in with Google'}</span>
            </button>

            <div className="relative flex items-center justify-center text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
              <span className="bg-[#0D1320] px-3 z-10">or sign in with email</span>
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">
              {activeTab === 'admin' ? 'Owner / Staff Email' : 'Email Address'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 pl-9 text-slate-200 focus:border-gold-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 pl-9 text-slate-200 focus:border-gold-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-3.5 rounded-xl text-xs transition-all ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md'
                : 'bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 shadow-gold-glow'
            }`}
          >
            {isLoading
              ? 'Authenticating...'
              : activeTab === 'admin'
              ? 'Sign In to Admin Portal'
              : 'Sign In'}
          </button>
        </form>

        {activeTab === 'customer' && (
          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
            <p>Don't have an account? <Link to="/register" className="text-gold-400 font-bold hover:underline">Create Account</Link></p>
          </div>
        )}
      </div>
    </div>
  );
};

