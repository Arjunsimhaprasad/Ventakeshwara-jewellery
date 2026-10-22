import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Mail, Clock, CheckCircle, Search, Filter, Trash2, Edit3, Save, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../services/api';

export const EnquiriesPage: React.FC = () => {
  const { token } = useAuth();
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing notes state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchEnquiries = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.append('status', statusFilter);
    if (searchQuery) params.append('search', searchQuery);

    apiFetch(`/api/enquiries?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setEnquiries(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, searchQuery]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async (id: string) => {
    setIsUpdating(true);
    try {
      const res = await apiFetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: noteText })
      });
      if (res.ok) {
        setEnquiries(prev => prev.map(e => e.id === id ? { ...e, adminNotes: noteText } : e));
        setEditingId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this customer enquiry record?')) return;
    try {
      const res = await apiFetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiries(prev => prev.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    new: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    contacted: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
    in_discussion: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
    visited_store: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    closed: { bg: 'bg-slate-700/30', text: 'text-slate-400', border: 'border-slate-700' }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">
            Bespoke Communications
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-gold-400" /> Customer Enquiries & Consultations
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage incoming product enquiries, bridal appointment requests, and WhatsApp consultations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="glass-panel px-3 py-1.5 rounded-xl border-slate-700 text-slate-300">
            Total: <strong className="text-gold-400">{enquiries.length}</strong> enquiries
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center glass-panel p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {['all', 'new', 'contacted', 'in_discussion', 'visited_store', 'closed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-gold-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search name, phone, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl py-2 pl-8 pr-3 focus:outline-none focus:border-gold-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Enquiries List */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-400">Loading customer enquiries...</div>
      ) : enquiries.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl border border-slate-800 space-y-3">
          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-serif text-lg text-slate-200 font-bold">No Enquiries Match</h3>
          <p className="text-xs text-slate-400">Try changing status filter or search query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map(enq => {
            const cleanPhone = (enq.phone || '').replace(/[^0-9]/g, '');
            const customerWhatsApp = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hello ${enq.customerName}, this is Venkateshwara Jewellery following up on your enquiry for ${enq.productName || 'our jewellery collection'} (Design ID: ${enq.designId || 'N/A'}).`
            )}`;
            const colors = statusColors[enq.status] || statusColors.new;

            return (
              <div
                key={enq.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-gold-500/30 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-base font-bold text-slate-100">
                        {enq.customerName}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
                        {enq.status.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gold-400" /> {enq.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-gold-400" /> {enq.email}
                      </span>
                      <span className="text-slate-400">
                        Preferred: <strong className="uppercase text-gold-300">{enq.preferredContact}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions: Change Status & WhatsApp */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-gold-500"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="in_discussion">In Discussion</option>
                      <option value="visited_store">Visited Store</option>
                      <option value="closed">Closed</option>
                    </select>

                    {cleanPhone && (
                      <a
                        href={customerWhatsApp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        title="Open WhatsApp chat with customer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    )}

                    <button
                      onClick={() => handleDelete(enq.id)}
                      className="text-slate-400 hover:text-rose-400 p-1.5"
                      title="Delete enquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Linked Design / Subject */}
                {enq.productName && (
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Inquired Jewellery Design:</span>
                      <strong className="text-gold-300 font-serif">{enq.productName}</strong>
                    </div>
                    {enq.designId && (
                      <span className="text-xs bg-gold-500/20 text-gold-300 px-2.5 py-1 rounded border border-gold-500/30 font-mono font-bold">
                        ID: {enq.designId}
                      </span>
                    )}
                  </div>
                )}

                {/* Message Body */}
                <div className="text-xs text-slate-200 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  <p className="font-semibold text-slate-400 text-[10px] uppercase mb-1">Customer Message:</p>
                  <p>{enq.message}</p>
                </div>

                {/* Admin Internal Notes */}
                <div className="text-xs pt-1 flex items-start justify-between gap-3">
                  {editingId === enq.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add staff notes on discussion / quoting..."
                        className="flex-1 bg-slate-900 border border-slate-700 text-xs text-slate-100 rounded-lg px-3 py-1.5"
                      />
                      <button
                        onClick={() => handleSaveNotes(enq.id)}
                        disabled={isUpdating}
                        className="bg-gold-500 text-slate-950 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" /> Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-slate-400 hover:text-white px-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-800">
                      <span>
                        <strong className="text-slate-300">Staff Notes:</strong> {enq.adminNotes || 'No notes added yet.'}
                      </span>
                      <button
                        onClick={() => {
                          setEditingId(enq.id);
                          setNoteText(enq.adminNotes || '');
                        }}
                        className="text-gold-400 hover:text-gold-300 flex items-center gap-1 font-semibold ml-2"
                      >
                        <Edit3 className="w-3 h-3" /> Edit Note
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
