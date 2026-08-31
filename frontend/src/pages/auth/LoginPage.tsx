import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleQuickLogin = (emailVal: string, passwordVal: string) => {
    setEmail(emailVal);
    setPassword(passwordVal);
    performLogin(emailVal, passwordVal);
  };

  const performLogin = async (emailVal: string, passwordVal: string) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal, password: passwordVal })
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
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('Unable to reach server. Please ensure backend is running.');
    } finally {
      setIsLoading(false);
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

        {/* Quick Demo Sign In Pills */}
        <div className="bg-slate-900/90 border border-gold-500/20 p-3.5 rounded-2xl text-xs space-y-2">
          <p className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" /> Quick 1-Click Demo Login:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer@example.com', 'password123')}
              className="bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/40 text-gold-300 py-2 px-3 rounded-xl font-medium text-[11px] text-left transition-colors flex flex-col"
            >
              <span className="font-bold text-white">Demo Customer</span>
              <span className="text-[10px] text-slate-400">customer@example.com</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('anajipuramarjun8@gmail.com', 'akhilavirat')}
              className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 py-2 px-3 rounded-xl font-medium text-[11px] text-left transition-colors flex flex-col"
            >
              <span className="font-bold text-white">Store Owner</span>
              <span className="text-[10px] text-slate-400">Owner Portal</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-200 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
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
            className="w-full bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 rounded-xl shadow-gold-glow text-xs"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          <p>Don't have an account? <Link to="/register" className="text-gold-400 font-bold hover:underline">Create Account</Link></p>
        </div>
      </div>
    </div>
  );
};
