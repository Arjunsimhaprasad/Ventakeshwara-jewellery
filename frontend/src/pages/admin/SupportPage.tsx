import React, { useState, useEffect } from 'react';
import { LifeBuoy, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const SupportPage: React.FC = () => {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [aiDraft, setAiDraft] = useState<any>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleGenerateAIDraft = async (ticketId: string) => {
    if (!token) return;
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/support-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ticketId })
      });
      if (res.ok) {
        const data = await res.json();
        setAiDraft(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleResolveTicket = async (ticketId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'resolved' })
      });
      if (res.ok) fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">Support Dispatch</span>
        <h1 className="font-serif text-3xl font-bold text-slate-100 flex items-center gap-2">
          <LifeBuoy className="w-8 h-8 text-gold-400" /> Customer Support Queue
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket List */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="font-serif text-base font-bold text-slate-100 px-2">Active Inquiries ({tickets.length})</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                onClick={() => {
                  setSelectedTicket(ticket);
                  handleGenerateAIDraft(ticket.id);
                }}
                className={`p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                  selectedTicket?.id === ticket.id
                    ? 'bg-gold-500/20 border-gold-500/50 text-gold-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold font-serif">{ticket.subject}</span>
                  <span className="text-[10px] uppercase font-bold text-gold-400">{ticket.status}</span>
                </div>
                <p className="text-slate-400 text-[11px] line-clamp-1">{ticket.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Ticket Details & AI Assistant Response Generator */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTicket ? (
            <div className="glass-panel p-6 rounded-2xl border border-gold-500/30 space-y-6">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-100">{selectedTicket.subject}</h3>
                  <p className="text-xs text-slate-400">Category: {selectedTicket.category} • User ID: {selectedTicket.userId}</p>
                </div>
                <button
                  onClick={() => handleResolveTicket(selectedTicket.id)}
                  className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                </button>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl text-xs text-slate-200 border border-slate-800 space-y-2">
                <p className="font-semibold text-slate-400">Customer Message:</p>
                <p className="leading-relaxed">{selectedTicket.message}</p>
              </div>

              {/* AI Draft Response Box */}
              <div className="glass-panel-gold p-4 rounded-xl border border-gold-500/40 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
                  <h4 className="font-serif font-bold text-slate-100 text-sm">Gemini AI Assistant Drafted Response</h4>
                </div>

                {isGeneratingAi ? (
                  <p className="text-xs text-slate-400">Gemini is drafting an optimal customer resolution...</p>
                ) : aiDraft ? (
                  <div className="space-y-2 text-xs">
                    <p className="text-slate-300 font-mono text-[11px]">Sentiment: {aiDraft.sentiment} • Priority: {aiDraft.priority}</p>
                    <textarea
                      rows={5}
                      readOnly
                      value={aiDraft.suggestedResponse}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-3"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Select ticket to generate draft response.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 text-slate-400 text-xs">
              Select a customer support ticket from the left column to view details and AI response drafts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
