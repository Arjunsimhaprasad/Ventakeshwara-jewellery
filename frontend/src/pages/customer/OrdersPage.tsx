import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Package, CheckCircle, Clock, Truck, ShieldCheck, LifeBuoy } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const OrdersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const successOrderNumber = searchParams.get('success');
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [token]);

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'processing': return 3;
      case 'shipped': return 4;
      case 'delivered': return 5;
      default: return 1;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Notification Banner */}
      {successOrderNumber && (
        <div className="glass-panel-gold p-6 rounded-2xl border border-gold-500/50 space-y-2 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-gold-400 flex-shrink-0" />
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-100">Order Successfully Placed!</h3>
              <p className="text-xs text-slate-300">
                Your order number is <strong className="text-gold-300">{successOrderNumber}</strong>. You will receive real-time updates as our master goldsmiths process your items.
              </p>
            </div>
          </div>
          <Link
            to="/support"
            className="bg-gold-500 hover:bg-gold-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap"
          >
            Contact Customer Support
          </Link>
        </div>
      )}

      <div className="space-y-2 border-b border-slate-800 pb-4">
        <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">Customer Account</span>
        <h1 className="font-serif text-3xl font-bold text-slate-100 flex items-center gap-3">
          <Package className="w-8 h-8 text-gold-400" /> Order Tracking & History
        </h1>
      </div>

      {!token ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-4">
          <p className="text-slate-300 text-sm">Please sign in to view your order history.</p>
          <Link to="/login?redirect=/orders" className="inline-block bg-gold-500 text-slate-950 font-bold px-6 py-2.5 rounded-full text-xs">
            Sign In to Account
          </Link>
        </div>
      ) : isLoading ? (
        <div className="text-center py-20 text-slate-400">Fetching your order history...</div>
      ) : orders.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-4">
          <Package className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-300 text-sm">You have not placed any orders yet.</p>
          <Link to="/catalog" className="inline-block bg-gold-500 text-slate-950 font-bold px-6 py-2.5 rounded-full text-xs">
            Browse Catalogue
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const currentStep = getStatusStep(order.status);
            return (
              <div key={order.id} className="glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Order Number:</span> <strong className="font-serif text-slate-100 text-sm ml-1">{order.orderNumber}</strong>
                    <span className="text-slate-400 ml-4">Placed On:</span> <span className="text-slate-300 ml-1">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-base font-bold text-gold-300">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="bg-gold-500/20 text-gold-300 px-3 py-0.5 rounded-full border border-gold-500/30 text-[10px] font-bold uppercase">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Progress Status Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span className={currentStep >= 1 ? 'text-gold-400 font-bold' : ''}>Order Placed</span>
                    <span className={currentStep >= 2 ? 'text-gold-400 font-bold' : ''}>Confirmed</span>
                    <span className={currentStep >= 3 ? 'text-gold-400 font-bold' : ''}>Processing</span>
                    <span className={currentStep >= 4 ? 'text-gold-400 font-bold' : ''}>Dispatched</span>
                    <span className={currentStep >= 5 ? 'text-gold-400 font-bold' : ''}>Delivered</span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-gradient-to-r from-gold-500 to-amber-400 h-full transition-all duration-500"
                      style={{ width: `${(currentStep / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2 pt-2">
                  {(order.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-slate-900/60 p-3 rounded-xl">
                      <span className="text-slate-200 font-medium">{item.productName} (Qty: {item.quantity})</span>
                      <span className="text-gold-400 font-serif">₹{item.subtotal?.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
                  <span>Shipping Address: {order.shippingAddress}</span>
                  <Link to="/support" className="text-gold-400 hover:underline flex items-center gap-1">
                    <LifeBuoy className="w-3.5 h-3.5" /> Need Assistance?
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
