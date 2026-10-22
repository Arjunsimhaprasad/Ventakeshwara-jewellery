import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Package, BookOpen, MessageSquare, Sparkles, TrendingUp, AlertTriangle, RefreshCw, Layers, Coins, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../services/api';

export const DashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCatalogues: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    totalCategories: 14,
    todayGoldRate: 6738
  });
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  useEffect(() => {
    // Fetch products, catalogues, enquiries in parallel
    Promise.all([
      apiFetch('/api/products?status=all').then(r => r.json()).catch(() => []),
      apiFetch('/api/catalogues').then(r => r.json()).catch(() => []),
      apiFetch('/api/enquiries').then(r => r.json()).catch(() => []),
      apiFetch('/api/rates/today').then(r => r.json()).catch(() => ({}))
    ]).then(([prods, cats, enqs, rates]) => {
      const pList = Array.isArray(prods) ? prods : [];
      const cList = Array.isArray(cats) ? cats : [];
      const eList = Array.isArray(enqs) ? enqs : [];

      setStats({
        totalProducts: pList.length,
        totalCatalogues: cList.length,
        totalEnquiries: eList.length,
        newEnquiries: eList.filter((e: any) => e.status === 'new').length,
        totalCategories: 14,
        todayGoldRate: Number(rates?.gold22kPerGram) || 6738
      });
      setRecentEnquiries(eList.slice(0, 5));
      setIsLoading(false);
    });
  }, []);

  const handleFetchInsights = async () => {
    if (!token) return;
    setIsLoadingInsights(true);
    try {
      const res = await apiFetch('/api/ai/business-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  // Design distribution chart data
  const categoryChartData = [
    { name: 'Temple Gold', count: 18 },
    { name: 'Bridal Haar', count: 24 },
    { name: 'Solitaire Ring', count: 15 },
    { name: 'Antique Polki', count: 12 },
    { name: 'Bangles/Kada', count: 20 },
    { name: 'Silver Craft', count: 14 }
  ];

  if (isLoading) {
    return <div className="text-center py-20 text-slate-400">Loading showcase executive dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">Showcase Operations</span>
          <h1 className="font-serif text-3xl font-bold text-slate-100">Atelier Executive Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/enquiries"
            className="bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-gold-glow"
          >
            <MessageSquare className="w-4 h-4" /> View Enquiries ({stats.newEnquiries} New)
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-gold-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Jewellery Designs in Vault</span>
            <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-slate-100">{stats.totalProducts}</p>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            Across 14 fine categories
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gold-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Digital PDF Lookbooks</span>
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-slate-100">{stats.totalCatalogues}</p>
          <span className="text-[10px] text-slate-400">Available for customer download</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gold-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Customer Enquiries</span>
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-slate-100">{stats.totalEnquiries}</p>
          <span className="text-[10px] text-amber-400 font-bold">
            {stats.newEnquiries} requiring follow-up
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gold-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Today's 22K Gold Benchmark</span>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-slate-100">₹{stats.todayGoldRate.toLocaleString('en-IN')}/g</p>
          <span className="text-[10px] text-slate-400">BIS 916 Hallmarked Store Base</span>
        </div>
      </div>

      {/* Grid: Popular Categories Velocity & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Design Spread Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-100">Atelier Design Distribution</h3>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#D4AF37', borderRadius: '12px', color: '#F8FAFC' }}
                  formatter={(value: any) => [`${value} designs`, 'Showcase Count']}
                />
                <Bar dataKey="count" fill="#D4AF37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Enquiries Queue */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-100">Recent Customer Enquiries</h3>
              <Link to="/admin/enquiries" className="text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-800/80 pt-2 space-y-2">
              {recentEnquiries.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No customer enquiries received yet.</p>
              ) : (
                recentEnquiries.map(enq => (
                  <div key={enq.id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <strong className="text-slate-100 block">{enq.customerName}</strong>
                      <span className="text-[11px] text-slate-400">
                        {enq.productName ? `${enq.productName} (${enq.designId || ''})` : enq.category}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30 uppercase block">
                        {enq.status}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{enq.phone}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            to="/admin/enquiries"
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 rounded-xl text-center transition-colors"
          >
            Open Full Enquiry Management Queue
          </Link>
        </div>
      </div>

      {/* AI Business Insights Feed */}
      <div className="glass-panel-gold p-6 rounded-2xl border border-gold-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-400 animate-pulse" />
            <h3 className="font-serif text-lg font-bold text-slate-100">Gemini AI Showcase Insights</h3>
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
