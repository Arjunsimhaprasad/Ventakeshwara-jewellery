import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const OrdersPage: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = () => {
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
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">Order Fulfillment</span>
        <h1 className="font-serif text-3xl font-bold text-slate-100 flex items-center gap-2">
          <ShoppingBag className="w-8 h-8 text-gold-400" /> Customer Orders Pipeline
        </h1>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-gold-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">Order Number</th>
              <th className="p-4">Recipient & Address</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Order Date</th>
              <th className="p-4">Fulfillment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading orders...</td></tr>
            ) : orders.map(order => (
              <tr key={order.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-serif font-bold text-slate-100">{order.orderNumber}</td>
                <td className="p-4">
                  <p className="font-semibold text-slate-200">{order.shippingName} ({order.shippingPhone})</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{order.shippingAddress}</p>
                </td>
                <td className="p-4 font-serif font-bold text-gold-300">₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                <td className="p-4">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs text-gold-300 rounded-lg p-2 font-semibold uppercase"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Dispatched / Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
