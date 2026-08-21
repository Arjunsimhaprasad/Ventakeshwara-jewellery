import React, { useState, useEffect, FormEvent } from 'react';
import { Tag, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const OffersPage: React.FC = () => {
  const { token } = useAuth();
  const [offers, setOffers] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('10');

  const fetchOffers = () => {
    fetch('/api/offers')
      .then(res => res.json())
      .then(data => setOffers(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleCreateOffer = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          code,
          discountPercentage: parseFloat(discountPercentage),
          isActive: true
        })
      });

      if (res.ok) {
        setTitle('');
        setCode('');
        fetchOffers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">Promotional Management</span>
        <h1 className="font-serif text-3xl font-bold text-slate-100 flex items-center gap-2">
          <Tag className="w-8 h-8 text-gold-400" /> Active Offers & Coupon Codes
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Offer Creation Form */}
        <div className="glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-100">Create New Coupon Offer</h3>
          <form onSubmit={handleCreateOffer} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Offer Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Diwali Festive Offer" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200" />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Coupon Code</label>
              <input type="text" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="DIWALI15" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 uppercase font-mono" />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Discount Percentage (%)</label>
              <input type="number" required value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200" />
            </div>

            <button type="submit" className="w-full bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold py-3 rounded-xl shadow-gold-glow">
              Publish Coupon Code
            </button>
          </form>
        </div>

        {/* Existing Offers */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-100">Active Offer Codes</h3>
          <div className="space-y-3">
            {offers.map(offer => (
              <div key={offer.id} className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-100 font-serif">{offer.title}</h4>
                  <p className="text-gold-400 font-mono font-bold text-sm">Code: {offer.code}</p>
                </div>
                <span className="bg-emerald-950 text-emerald-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-800">
                  {offer.discountPercentage}% OFF
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
