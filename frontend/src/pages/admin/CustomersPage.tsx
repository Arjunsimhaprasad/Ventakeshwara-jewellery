import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const CustomersPage: React.FC = () => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/customers', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setCustomers(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">Customer Directory</span>
        <h1 className="font-serif text-3xl font-bold text-slate-100 flex items-center gap-2">
          <Users className="w-8 h-8 text-gold-400" /> Customer Profiles & History
        </h1>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-gold-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Role</th>
              <th className="p-4">Total Orders</th>
              <th className="p-4">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {isLoading ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading customer profiles...</td></tr>
            ) : customers.map(cust => (
              <tr key={cust.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-serif font-bold text-slate-100">{cust.fullName}</td>
                <td className="p-4 text-slate-300">{cust.email}</td>
                <td className="p-4">{cust.phone || 'N/A'}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                    cust.role === 'owner' ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {cust.role}
                  </span>
                </td>
                <td className="p-4 font-bold">{cust.orderCount} orders</td>
                <td className="p-4 font-serif font-bold text-gold-300">₹{(cust.totalSpent || 0).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
