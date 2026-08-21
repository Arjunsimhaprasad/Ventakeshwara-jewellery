import { useState, useEffect, FormEvent } from 'react';
import { LifeBuoy, Send, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const SupportPage = () => {
  const { token, user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchTickets = () => {
    if (!token) return;
    fetch('/api/support/tickets', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setTickets(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const handleSubmitTicket = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subject, category, message })
      });

      if (res.ok) {
        setSuccessMsg('Support ticket submitted successfully. Our team will contact you shortly.');
        setSubject('');
        setMessage('');
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">Customer Concierge</span>
        <h1 className="font-serif text-3xl font-bold text-slate-100 flex items-center gap-3">
          <LifeBuoy className="w-8 h-8 text-gold-400" /> Concierge & Support Center
        </h1>
      </div>

      {successMsg && (
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 p-4 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ticket Submission Form */}
        <div className="glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-6">
          <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">
            Submit a Concierge Inquiry
          </h3>

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200"
              >
                <option value="Product Inquiry">Product Specs & Customization</option>
                <option value="Order Tracking">Order & Delivery Tracking</option>
                <option value="Gold Hallmarking">Gold Rate & Hallmarking Verification</option>
                <option value="Ring Sizing">Ring Size Measurement Assistance</option>
                <option value="Return / Exchange">Lifetime Exchange Guarantee</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief subject of your query"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-gold-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Detailed Message *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe how our concierge team can assist you..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-gold-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold py-3.5 rounded-xl shadow-gold-glow flex items-center justify-center gap-2 text-xs"
            >
              Submit Support Ticket <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Existing Tickets Thread */}
        <div className="glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-6">
          <h3 className="font-serif text-lg font-bold text-slate-100 border-b border-slate-800 pb-3">
            Your Support Tickets ({tickets.length})
          </h3>

          {!token ? (
            <p className="text-slate-400 text-xs">Sign in to view your open support tickets.</p>
          ) : isLoading ? (
            <p className="text-slate-400 text-xs">Loading support tickets...</p>
          ) : tickets.length === 0 ? (
            <p className="text-slate-400 text-xs">No active support tickets.</p>
          ) : (
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
              {tickets.map(ticket => (
                <div key={ticket.id} className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gold-300">{ticket.subject}</span>
                    <span className="bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-slate-300">{ticket.message}</p>
                  <p className="text-[10px] text-slate-400">{new Date(ticket.createdAt).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
