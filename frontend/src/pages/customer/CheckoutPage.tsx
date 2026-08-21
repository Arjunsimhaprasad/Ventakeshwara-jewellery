import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [shippingName, setShippingName] = useState(user?.fullName || '');
  const [shippingPhone, setShippingPhone] = useState(user?.phone || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-slate-200">Your Shopping Bag is Empty</h2>
        <p className="text-slate-400 text-sm">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/catalog')}
          className="bg-gold-500 text-slate-950 font-bold px-6 py-2.5 rounded-full text-xs"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      navigate('/login?redirect=/checkout');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          shippingName,
          shippingPhone,
          shippingAddress,
          notes,
          couponCode
        })
      });

      const data = await res.json();

      if (res.ok) {
        await clearCart();
        navigate(`/orders?success=${data.orderNumber}`);
      } else {
        setErrorMsg(data.message || 'Failed to place order.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try placing your order again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">High Security Checkout</span>
        <h1 className="font-serif text-3xl font-bold text-slate-100 flex items-center gap-2">
          <Lock className="w-6 h-6 text-gold-400" /> Insured Order Placement
        </h1>
      </div>

      {errorMsg && (
        <div className="bg-rose-950/80 border border-rose-800 text-rose-200 p-4 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-6">
          <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">
            Shipping & Delivery Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Recipient Full Name *</label>
              <input
                type="text"
                required
                value={shippingName}
                onChange={(e) => setShippingName(e.target.value)}
                placeholder="e.g. Smt. Lakshmi Devi"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-gold-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Contact Phone Number *</label>
              <input
                type="tel"
                required
                value={shippingPhone}
                onChange={(e) => setShippingPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-gold-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Full Shipping Address *</label>
            <textarea
              required
              rows={3}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Flat/House No., Building Name, Street, Landmark, City, State, Pincode"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-gold-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Special Instructions / Custom Engraving Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Ring size 14, gift wrap requested"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200"
            />
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="glass-panel p-6 rounded-2xl border border-gold-500/30 space-y-6 h-fit">
          <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">
            Order Summary
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map(item => {
              const product = item.product;
              return (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="max-w-[70%]">
                    <p className="text-slate-200 font-medium truncate">{product?.name || 'Jewellery Item'}</p>
                    <p className="text-[10px] text-slate-400">Qty: {item.quantity} × {product?.material}</p>
                  </div>
                  <span className="font-serif font-semibold text-gold-300">
                    ₹{((product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 text-xs border-t border-slate-800 pt-4">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>Insured Shipping</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between font-serif text-lg font-bold text-gold-400 pt-2 border-t border-slate-800">
              <span>Total Payable</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 font-bold py-4 rounded-xl shadow-gold-glow flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Processing Insured Order...' : 'Confirm & Complete Order'}
          </button>

          <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> BIS 916 Hallmarked & Certified Transit Security.
          </p>
        </div>
      </form>
    </div>
  );
};
