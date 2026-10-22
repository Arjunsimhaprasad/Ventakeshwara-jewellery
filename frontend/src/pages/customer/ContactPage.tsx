import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { apiFetch } from '../../services/api';

export const ContactPage: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'phone' | 'email'>('whatsapp');
  const [interestCategory, setInterestCategory] = useState('Bridal Trousseau');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await apiFetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          preferredContact,
          category: interestCategory,
          message: message || `Consultation request for ${interestCategory}.`
        })
      });

      if (res.ok) {
        setIsSuccess(true);
        setCustomerName('');
        setPhone('');
        setEmail('');
        setMessage('');
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.message || 'Unable to submit enquiry. Please contact us on WhatsApp directly.');
      }
    } catch {
      setErrorMessage('Network error. Please call or message us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-gold-400" /> Flagship Showroom & Studio
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100">
          Connect With Our Master Goldsmiths
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          Whether you seek a bespoke wedding trousseau, temple jewellery restoration, gold rate inquiry, or a private salon appointment, our jewellery concierges are at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Information & Visiting Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gold-500/30 space-y-6 shadow-luxury">
            <h3 className="font-serif text-xl font-bold text-slate-100 border-b border-slate-800 pb-3">
              Hyderabad Flagship Boutique
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block text-sm font-serif">Atelier & Showroom</strong>
                  <p className="text-slate-400 leading-relaxed mt-0.5">
                    Plot No. 482, Road No. 36, Near Peddamma Temple Metro Station,<br />
                    Jubilee Hills, Hyderabad, Telangana — 500033
                  </p>
                  <span className="text-[10px] text-gold-400 block mt-1">Valet Parking Available for Showroom Guests</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block text-sm font-serif">Visiting Hours</strong>
                  <p className="text-slate-400 mt-0.5">Monday – Saturday: 10:30 AM – 8:30 PM</p>
                  <p className="text-slate-400">Sunday: 11:00 AM – 7:30 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block text-sm font-serif">Direct Telephones</strong>
                  <p className="text-slate-300 mt-0.5">+91 98765 43210 (Mobile / WhatsApp)</p>
                  <p className="text-slate-400">+91 40 2345 6789 (Showroom Desk)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block text-sm font-serif">Electronic Mail</strong>
                  <p className="text-slate-300 mt-0.5">concierge@venkateshwarajewellery.com</p>
                  <p className="text-slate-400">bespoke@venkateshwarajewellery.com</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-2">
              <a
                href="https://wa.me/919876543210?text=Hello%20Venkateshwara%20Jewellery,%20I%20would%20like%20to%20schedule%20a%20private%20appointment."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageSquare className="w-4 h-4" /> Chat on WhatsApp with Artisan
              </a>
            </div>
          </div>
        </div>

        {/* Consultation Request Form */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-gold-500/20 shadow-luxury space-y-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-slate-100">
              Schedule A Private Consultation
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Share your jewellery desires. Our senior master karigar will curate design portfolios tailored to your taste before your arrival.
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-bold text-slate-100">Enquiry Successfully Transmitted</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you. Our showroom concierge will reach out to confirm your consultation schedule and prepare personalized design lookbooks for your viewing.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="bg-gold-500 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-full shadow-gold-glow"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 focus:outline-none focus:border-gold-500"
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
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Interest Category</label>
                  <select
                    value={interestCategory}
                    onChange={(e) => setInterestCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 focus:outline-none focus:border-gold-500"
                  >
                    <option value="Bridal Trousseau">Bridal Trousseau & Haar</option>
                    <option value="Temple Gold">Temple Gold & Nakshi Jewellery</option>
                    <option value="Solitaire Diamond">Solitaire Diamonds & Rings</option>
                    <option value="Antique Polki">Antique & Polki Kundan Sets</option>
                    <option value="Pooja Silver">Pooja Articles & Silverware</option>
                    <option value="Custom Bespoke Design">Bespoke Custom Designing</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Preferred Contact Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['whatsapp', 'phone', 'email'] as const).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPreferredContact(mode)}
                      className={`p-2.5 rounded-xl border text-center font-semibold capitalize transition-all ${
                        preferredContact === mode
                          ? 'bg-gold-500/20 text-gold-300 border-gold-500'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Your Message / Design Requirements</label>
                <textarea
                  rows={4}
                  placeholder="Mention your preferred wedding date, gold weight preferences, design codes, or special customisation..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 focus:outline-none focus:border-gold-500 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Personal Data Strictly Confidential</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 shadow-gold-glow transition-transform active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Book Consultation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
