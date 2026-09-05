import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, TrendingDown, RefreshCw, Save, Calculator, Clock, ShieldCheck, Info, CheckCircle2, AlertCircle, ArrowUpRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../services/api';

interface MetalRate {
  id: string;
  gold24kPerGram: number;
  gold22kPerGram: number;
  gold18kPerGram: number;
  silverPerGram: number;
  notes?: string;
  updatedBy?: string | null;
  createdAt: string;
}

export const GoldRatesPage: React.FC = () => {
  const { user } = useAuth();
  const [currentRate, setCurrentRate] = useState<MetalRate | null>(null);
  const [history, setHistory] = useState<MetalRate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form input state
  const [gold24k, setGold24k] = useState<string>('7350');
  const [gold22k, setGold22k] = useState<string>('6738');
  const [gold18k, setGold18k] = useState<string>('5512');
  const [silver, setSilver] = useState<string>('88');
  const [notes, setNotes] = useState<string>('');

  // Valuation Estimator state
  const [estPurity, setEstPurity] = useState<'24K' | '22K' | '18K' | 'Silver'>('22K');
  const [estWeight, setEstWeight] = useState<string>('10');
  const [estMakingCharges, setEstMakingCharges] = useState<string>('12');

  const fetchRates = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [todayRes, historyRes] = await Promise.all([
        apiFetch('/api/rates/today'),
        apiFetch('/api/rates/history')
      ]);

      if (todayRes.ok) {
        const todayData: MetalRate = await todayRes.json();
        setCurrentRate(todayData);
        setGold24k(todayData.gold24kPerGram.toString());
        setGold22k(todayData.gold22kPerGram.toString());
        setGold18k(todayData.gold18kPerGram.toString());
        setSilver(todayData.silverPerGram.toString());
      }

      if (historyRes.ok) {
        const historyData: MetalRate[] = await historyRes.json();
        setHistory(historyData);
      }
    } catch (err) {
      console.error('Failed to fetch metal rates:', err);
      setErrorMsg('Failed to load live metal rates. Using store fallback rates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Calculate 22K and 18K based on standard 24K market purity
  const handleAutoDeriveFrom24K = (value24k: string) => {
    const val = parseFloat(value24k);
    if (!isNaN(val) && val > 0) {
      const derived22k = Math.round(val * 0.916);
      const derived18k = Math.round(val * 0.75);
      setGold22k(derived22k.toString());
      setGold18k(derived18k.toString());
    }
  };

  const handle24kChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGold24k(val);
    handleAutoDeriveFrom24K(val);
  };

  const applyPercentageAdjustment = (percent: number) => {
    const g24 = parseFloat(gold24k) || 0;
    const g22 = parseFloat(gold22k) || 0;
    const g18 = parseFloat(gold18k) || 0;
    const sil = parseFloat(silver) || 0;

    const factor = 1 + percent / 100;
    setGold24k((Math.round(g24 * factor)).toString());
    setGold22k((Math.round(g22 * factor)).toString());
    setGold18k((Math.round(g18 * factor)).toString());
    setSilver((Math.round(sil * factor * 10) / 10).toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const payload = {
      gold24kPerGram: parseFloat(gold24k),
      gold22kPerGram: parseFloat(gold22k),
      gold18kPerGram: parseFloat(gold18k),
      silverPerGram: parseFloat(silver),
      notes: notes.trim() || `Daily bullion update by ${user?.fullName || 'Admin'}`
    };

    if (isNaN(payload.gold24kPerGram) || payload.gold24kPerGram <= 0 ||
        isNaN(payload.gold22kPerGram) || payload.gold22kPerGram <= 0 ||
        isNaN(payload.gold18kPerGram) || payload.gold18kPerGram <= 0 ||
        isNaN(payload.silverPerGram) || payload.silverPerGram <= 0) {
      setErrorMsg('Please enter valid positive numbers for all metal rates.');
      setSaving(false);
      return;
    }

    try {
      const res = await apiFetch('/api/rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Your login session has expired. Please sign out and log back in as Owner.');
        }
        throw new Error(data.message || 'Failed to update daily rates');
      }

      setSuccessMsg("Current day's gold & silver rates updated successfully!");
      setNotes('');
      await fetchRates();

      // Clear success notification after 5 seconds
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving new metal rates');
    } finally {
      setSaving(false);
    }
  };

  // Estimator Calculations
  const weightNum = parseFloat(estWeight) || 0;
  const makingPctNum = parseFloat(estMakingCharges) || 0;
  let ratePerGram = parseFloat(gold22k) || 0;
  if (estPurity === '24K') ratePerGram = parseFloat(gold24k) || 0;
  if (estPurity === '18K') ratePerGram = parseFloat(gold18k) || 0;
  if (estPurity === 'Silver') ratePerGram = parseFloat(silver) || 0;

  const baseMetalValue = weightNum * ratePerGram;
  const makingChargesValue = baseMetalValue * (makingPctNum / 100);
  const estimatedSubtotal = baseMetalValue + makingChargesValue;
  const estimatedGst = estimatedSubtotal * 0.03; // 3% GST standard on gold jewellery in India
  const estimatedTotal = estimatedSubtotal + estimatedGst;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold gold-gradient-text">Daily Gold Price Management</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Set and update today's live bullion market rates for Venkateshwara Jewellery.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchRates}
          disabled={loading}
          className="self-start sm:self-auto bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs px-4 py-2.5 rounded-xl border border-slate-700/80 flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Live Data
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/40 text-rose-300 px-4 py-3 rounded-2xl text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Today's Active Rate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 relative overflow-hidden bg-gradient-to-br from-[#121927] to-[#0D1320]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 24K Gold (999 Purity)
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">Pure Gold</span>
          </div>
          <div className="font-serif text-2xl font-bold text-slate-100 flex items-baseline gap-1">
            <span className="text-gold-400 font-sans text-lg">₹</span>
            {currentRate ? currentRate.gold24kPerGram.toLocaleString('en-IN') : '7,350'}
            <span className="text-slate-400 text-xs font-normal font-sans">/ gram</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            Active benchmark
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gold-500/40 relative overflow-hidden bg-gradient-to-br from-[#131A29] to-[#0D1320]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-gold-300 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-gold-400" /> 22K Gold (916 Purity)
            </span>
            <span className="text-[10px] bg-gold-500/20 text-gold-300 px-2 py-0.5 rounded-full border border-gold-500/30">Jewellery Std</span>
          </div>
          <div className="font-serif text-2xl font-bold text-slate-100 flex items-baseline gap-1">
            <span className="text-gold-400 font-sans text-lg">₹</span>
            {currentRate ? currentRate.gold22kPerGram.toLocaleString('en-IN') : '6,738'}
            <span className="text-slate-400 text-xs font-normal font-sans">/ gram</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-gold-400" />
            Standard hallmarked rate
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-700/60 relative overflow-hidden bg-gradient-to-br from-[#101623] to-[#0D1320]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-200">18K Gold (750 Purity)</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">Diamond Studded</span>
          </div>
          <div className="font-serif text-2xl font-bold text-slate-100 flex items-baseline gap-1">
            <span className="text-gold-400 font-sans text-lg">₹</span>
            {currentRate ? currentRate.gold18kPerGram.toLocaleString('en-IN') : '5,512'}
            <span className="text-slate-400 text-xs font-normal font-sans">/ gram</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400" />
            Solitaire & Gem setting
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-700/60 relative overflow-hidden bg-gradient-to-br from-[#101623] to-[#0D1320]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Fine Silver (999 Purity)</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">Bullion</span>
          </div>
          <div className="font-serif text-2xl font-bold text-slate-100 flex items-baseline gap-1">
            <span className="text-slate-400 font-sans text-lg">₹</span>
            {currentRate ? currentRate.silverPerGram.toLocaleString('en-IN') : '88'}
            <span className="text-slate-400 text-xs font-normal font-sans">/ gram</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <Coins className="w-3 h-3 text-slate-400" />
            ₹{currentRate ? (currentRate.silverPerGram * 1000).toLocaleString('en-IN') : '88,000'} / kg
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rate Update Form */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-100 flex items-center gap-2">
                <Coins className="w-5 h-5 text-gold-400" /> Update Today's Market Price
              </h2>
              <p className="text-xs text-slate-400">Enter new per-gram rates below to update storefront and pricing logic.</p>
            </div>

            {/* Percentage Quick Bump Shortcuts */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold px-2">Quick Adjustment:</span>
              <button
                type="button"
                onClick={() => applyPercentageAdjustment(1)}
                className="text-[11px] bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1 transition-colors"
                title="Increase rates by 1%"
              >
                <TrendingUp className="w-3 h-3" /> +1%
              </button>
              <button
                type="button"
                onClick={() => applyPercentageAdjustment(-1)}
                className="text-[11px] bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 px-2.5 py-1 rounded-lg border border-rose-500/30 flex items-center gap-1 transition-colors"
                title="Decrease rates by 1%"
              >
                <TrendingDown className="w-3 h-3" /> -1%
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* 24K Gold Rate Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gold-300">
                  24K Gold Rate (₹ / Gram) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={gold24k}
                    onChange={handle24kChange}
                    className="w-full bg-[#0B0F17] border border-gold-500/40 rounded-xl pl-8 pr-4 py-3 text-slate-100 text-sm font-semibold focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all"
                    placeholder="7350.00"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">Pure 999 Gold. Automatically derives 22K & 18K standard.</span>
              </div>

              {/* 22K Gold Rate Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  22K Gold Rate (₹ / Gram) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={gold22k}
                    onChange={(e) => setGold22k(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-slate-100 text-sm font-semibold focus:outline-none focus:border-gold-400 transition-all"
                    placeholder="6738.00"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">Standard 916 Hallmarked Gold for traditional jewellery.</span>
              </div>

              {/* 18K Gold Rate Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  18K Gold Rate (₹ / Gram) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={gold18k}
                    onChange={(e) => setGold18k(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-slate-100 text-sm font-semibold focus:outline-none focus:border-gold-400 transition-all"
                    placeholder="5512.00"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">750 Gold used for diamond and gem setting.</span>
              </div>

              {/* Silver Rate Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  Fine Silver Rate (₹ / Gram) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={silver}
                    onChange={(e) => setSilver(e.target.value)}
                    className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-slate-100 text-sm font-semibold focus:outline-none focus:border-gold-400 transition-all"
                    placeholder="88.00"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">Fine 999 Silver per gram. (₹{(parseFloat(silver) * 1000 || 0).toLocaleString('en-IN')}/kg)</span>
              </div>
            </div>

            {/* Operational Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Bullion Market Update Notes / Remarks <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#0B0F17] border border-slate-700 rounded-xl p-3 text-slate-100 text-xs focus:outline-none focus:border-gold-400 transition-all"
                placeholder="E.g., Morning bullion trading rate, updated due to market gold price surge."
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Updating as <strong className="text-gold-300 font-semibold">{user?.fullName || 'Admin'}</strong>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving Today Rate...' : "Publish Today's Gold Rates"}
              </button>
            </div>
          </form>
        </div>

        {/* Live Jewellery Valuation Estimator Component */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 bg-gradient-to-b from-[#0F1523] to-[#0B0F17]">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-serif text-lg font-bold text-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-gold-400" /> Quick Price Estimator
            </h3>
            <p className="text-[11px] text-slate-400">Estimate customer retail price using active gold rate.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Select Metal Purity</label>
              <div className="grid grid-cols-4 gap-1.5 bg-[#080B12] p-1 rounded-xl border border-slate-800">
                {(['24K', '22K', '18K', 'Silver'] as const).map((purity) => (
                  <button
                    key={purity}
                    type="button"
                    onClick={() => setEstPurity(purity)}
                    className={`py-1.5 text-center font-semibold rounded-lg transition-colors ${
                      estPurity === purity
                        ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {purity}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Gross Weight (Grams)</label>
              <input
                type="number"
                step="0.01"
                value={estWeight}
                onChange={(e) => setEstWeight(e.target.value)}
                className="w-full bg-[#080B12] border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Making Charges (%)</label>
              <input
                type="number"
                step="0.5"
                value={estMakingCharges}
                onChange={(e) => setEstMakingCharges(e.target.value)}
                className="w-full bg-[#080B12] border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-gold-400"
              />
            </div>

            {/* Calculated Breakdown Box */}
            <div className="p-4 rounded-2xl bg-[#080C14] border border-gold-500/20 space-y-2 mt-4">
              <div className="flex justify-between text-slate-400">
                <span>Base Metal Value:</span>
                <span className="text-slate-200">₹{Math.round(baseMetalValue).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Making Charges ({makingPctNum}%):</span>
                <span className="text-slate-200">₹{Math.round(makingChargesValue).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated GST (3%):</span>
                <span className="text-slate-200">₹{Math.round(estimatedGst).toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm text-gold-300">
                <span>Estimated Final Price:</span>
                <span className="font-serif text-base">₹{Math.round(estimatedTotal).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Revision History Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold-400" /> Metal Rate Revision Audit Log
            </h2>
            <p className="text-xs text-slate-400">Chronological history of rate changes published to the platform.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B0F17] text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">24K Gold / g</th>
                <th className="py-3 px-4">22K Gold / g</th>
                <th className="py-3 px-4">18K Gold / g</th>
                <th className="py-3 px-4">Silver / g</th>
                <th className="py-3 px-4">Notes & Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {history.length > 0 ? (
                history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {new Date(record.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-amber-300">
                      ₹{record.gold24kPerGram.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gold-400">
                      ₹{record.gold22kPerGram.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      ₹{record.gold18kPerGram.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-300">
                      ₹{record.silverPerGram.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                      {record.notes || 'Routine rate update'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No rate update history records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GoldRatesPage;
