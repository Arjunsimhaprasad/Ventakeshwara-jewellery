import React, { useState } from 'react';
import { X, Send, Phone, MessageSquare, CheckCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { apiFetch } from '../../services/api';

export interface EnquiryProduct {
  id?: string;
  name?: string;
  sku?: string;
  image?: string;
  price?: number;
  isPriceOnRequest?: boolean;
  purity?: string;
  material?: string;
  weightGrams?: number;
}

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: EnquiryProduct | null;
  defaultMessage?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  product,
  defaultMessage
}) => {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'phone' | 'email'>('whatsapp');
  const [message, setMessage] = useState(
    defaultMessage ||
    (product
      ? `Hello, I am interested in exploring ${product.name} (Design ID: ${product.sku || 'N/A'}). Please share detailed pricing, customization options, and availability.`
      : 'Hello, I would like to schedule a personal jewellery consultation and explore your latest collections.')
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // WhatsApp prefilled URL
  const whatsappNumber = '919876543210';
  const whatsappText = encodeURIComponent(
    product
      ? `Hello Venkateshwara Jewellery! I would like to enquire about:
• Design: ${product.name}
• Design ID: ${product.sku || 'Custom'}
• Purity: ${product.purity || '22K (916)'}
• Material: ${product.material || 'Gold'}
Please share details, pricing, and availability.`
      : 'Hello Venkateshwara Jewellery! I would like to schedule a showroom visit and jewellery consultation.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await apiFetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          preferredContact,
          productId: product?.id || null,
          productName: product?.name || 'General Consultation',
          designId: product?.sku || null,
          category: product?.material || 'Jewellery',
          message
        })
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.message || 'Unable to submit enquiry. Please try again or reach us on WhatsApp.');
      }
    } catch {
      setErrorMessage('Network error. Please try WhatsApp or call our boutique directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0F172A] border border-gold-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-burgundy-950/80 px-6 py-5 border-b border-gold-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-100">
                {product ? 'Enquire About This Design' : 'Bespoke Jewellery Enquiry'}
              </h3>
              <p className="text-[11px] text-gold-400 font-medium">
                Venkateshwara Jewellery Concierge • Since 1978
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-full hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Product Snapshot Card (if enquiring about specific design) */}
          {product && (
            <div className="glass-panel p-4 rounded-2xl border border-gold-500/20 flex items-center gap-4">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                className="w-16 h-16 rounded-xl object-cover border border-gold-500/30 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-gold-500/20 text-gold-300 font-bold px-2 py-0.5 rounded border border-gold-500/30 uppercase tracking-wider">
                    Design ID: {product.sku || 'Bespoke'}
                  </span>
                  {product.purity && (
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      {product.purity}
                    </span>
                  )}
                </div>
                <h4 className="font-serif text-sm font-bold text-slate-100 truncate mt-1">
                  {product.name}
                </h4>
                <div className="text-xs text-gold-400 font-serif font-semibold mt-0.5">
                  {product.isPriceOnRequest || !product.price
                    ? 'Price on Request'
                    : `Indicative: ₹${product.price.toLocaleString('en-IN')}`}
                </div>
              </div>
            </div>
          )}

          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-bold text-slate-100">Enquiry Received with Gratitude</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-gold-300">{customerName}</strong>. Our senior jewellery master will review your requirements for{' '}
                <strong className="text-gold-300">{product?.name || 'your custom piece'}</strong> and connect with you via{' '}
                <span className="uppercase text-gold-400 font-bold">{preferredContact}</span> shortly.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <MessageSquare className="w-4 h-4" /> Chat on WhatsApp Now
                </a>
                <button
                  onClick={handleResetAndClose}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* WhatsApp Fast-Track Callout */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-400 font-bold text-xs">
                    <MessageSquare className="w-4 h-4" /> Instant WhatsApp Assistance
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Connect directly with our master goldsmith in Hyderabad.
                  </p>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md whitespace-nowrap"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-[#0F172A] px-3 text-[11px] text-slate-400 uppercase tracking-widest absolute">
                  Or Submit An Online Enquiry
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Enquiry Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Smt. Lakshmi Rao"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-gold-500 text-slate-100 rounded-xl p-3 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Phone Number (with WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-gold-500 text-slate-100 rounded-xl p-3 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-gold-500 text-slate-100 rounded-xl p-3 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Preferred Contact Mode</label>
                    <select
                      value={preferredContact}
                      onChange={(e) => setPreferredContact(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-gold-500 text-slate-100 rounded-xl p-3 focus:outline-none"
                    >
                      <option value="whatsapp">WhatsApp Message</option>
                      <option value="phone">Phone Call</option>
                      <option value="email">Email Response</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Your Enquiry / Customization Request *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide ring size, preferred gold purity (22K/18K), budget, or custom stone preferences..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-gold-500 text-slate-100 rounded-xl p-3 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-gold-400" />
                    <span>100% Privacy • No Spam Guarantee</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-gold-glow transition-transform active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Design Enquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
