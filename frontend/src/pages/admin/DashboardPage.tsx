import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { IndianRupee, ShoppingBag, Users, Sparkles, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const DashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch('/api/analytics/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [token]);

  const handleFetchInsights = async () => {
    if (!token) return;
    setIsLoadingInsights(true);
    try {
      const res = await fetch('/api/ai/business-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ timeframeDays: 30 })
      });
      if (res.ok) {
        const result = await res.json();
        setInsights(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  useEffect(() => {
    if (token) handleFetchInsights();
  }, [token]);

  if (isLoading) {
    return <div className="text-center py-20 text-slate-400">Loading store executive dashboard...</div>;
  }

  const kpis = data?.kpis || { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, avgOrderValue: 0, pendingOrders: 0 };
  const salesTrend = data?.salesTrend || [];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">Executive View</span>
        <h1 className="font-serif text-3xl font-bold text-slate-100">Store Performance Analytics</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-gold-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Gross Revenue</span>
            <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-slate-100">₹{kpis.totalRevenue.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> +14.2% from last month
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gold-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-slate-100">{kpis.totalOrders}</p>
          <span className="text-[10px] text-slate-400">{kpis.pendingOrders} pending fulfillment</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gold-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Order Value (AOV)</span>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-slate-100">₹{kpis.avgOrderValue.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-400">High luxury basket value</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gold-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Registered Customers</span>
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-slate-100">{kpis.totalCustomers}</p>
          <span className="text-[10px] text-emerald-400">+8 new this week</span>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-serif text-lg font-bold text-slate-100">Monthly Revenue Velocity</h3>
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#D4AF37', borderRadius: '12px', color: '#F8FAFC' }}
                formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#D4AF37" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Business Insights Feed */}
      <div className="glass-panel-gold p-6 rounded-2xl border border-gold-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-400 animate-pulse" />
            <h3 className="font-serif text-lg font-bold text-slate-100">Gemini AI Executive Business Insights</h3>
          </div>
          <button
            onClick={handleFetchInsights}
            disabled={isLoadingInsights}
            className="text-xs bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 px-3 py-1.5 rounded-full border border-gold-500/40 flex items-center gap-1.5"
          >
            {isLoadingInsights ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} Refresh Insights
          </button>
        </div>

        {insights?.summary && (
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            {insights.summary}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {(insights?.insights || []).map((item: any, idx: number) => (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gold-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> {item.title}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  item.importance === 'high' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                }`}>
                  {item.importance} priority
                </span>
              </div>
              <p className="text-slate-300">{item.description}</p>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-emerald-400">Action: {item.recommendedAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
