import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export const CartDrawer: React.FC = () => {
  const { items, itemCount, subtotal, updateQuantity, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'ROYAL10') {
      setAppliedDiscount(10);
      setCouponMsg('ROYAL10 applied! 10% festal discount added.');
    } else if (code === 'WELCOMEVJ') {
      setAppliedDiscount(5);
      setCouponMsg('WELCOMEVJ applied! 5% luxury gift discount added.');
    } else {
      setAppliedDiscount(0);
      setCouponMsg('Invalid coupon code.');
    }
  };

  const discountAmount = (subtotal * appliedDiscount) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#0F172A] border-l border-gold-500/30 text-slate-100 flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between glass-panel">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold-400" />
            <h3 className="font-serif text-lg font-bold gold-gradient-text">Shopping Bag ({itemCount})</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm">Your luxury bag is currently empty.</p>
              <button
                onClick={() => { setIsCartOpen(false); navigate('/catalog'); }}
                className="bg-gold-500 hover:bg-gold-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-full shadow-gold-glow"
              >
                Explore Jewellery Catalog
              </button>
            </div>
          ) : (
            items.map(item => {
              const product = item.product || {
                name: 'Heritage Jewellery Item',
                price: 100000,
                discountPercentage: 0,
                material: 'Gold',
                purity: '22K',
                images: [{ imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' }]
              };
              const itemPrice = product.price * (1 - product.discountPercentage / 100);

              return (
                <div key={item.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex gap-3">
                  <img
                    src={product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg bg-slate-950"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-slate-200 line-clamp-1">{product.name}</h4>
                      <p className="text-[10px] text-gold-400">{product.material} • {product.purity}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          -
                        </button>
                        <span className="px-2.5 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-serif text-sm font-bold text-gold-300">
                          ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-800 glass-panel space-y-4">
            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo Code (ROYAL10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 uppercase"
              />
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-700 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-600"
              >
                Apply
              </button>
            </form>
            {couponMsg && <p className="text-[11px] text-emerald-400">{couponMsg}</p>}

            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({appliedDiscount}%)</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between font-serif text-base font-bold text-gold-400 pt-2 border-t border-slate-800">
                <span>Total Amount</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
              className="w-full bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 font-bold py-3 rounded-xl shadow-gold-glow flex items-center justify-center gap-2 text-sm"
            >
              Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Insured high-security delivery guaranteed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
