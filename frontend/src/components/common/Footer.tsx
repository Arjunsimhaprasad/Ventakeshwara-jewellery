import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, MapPin, Phone, Mail, Sparkles, Scale, BookOpen, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080C14] border-t border-gold-500/20 text-slate-400 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Promises */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80 text-center sm:text-left">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <ShieldCheck className="w-8 h-8 text-gold-400" />
            <h4 className="font-serif text-slate-100 font-semibold text-sm">BIS 100% Hallmarked</h4>
            <p className="text-xs text-slate-400">Strictly tested & government laser hallmarked with 6-digit HUID for 916 purity.</p>
          </div>
          <div className="flex flex-col items-center sm:items-start gap-2">
            <Award className="w-8 h-8 text-gold-400" />
            <h4 className="font-serif text-slate-100 font-semibold text-sm">Certified Natural Diamonds</h4>
            <p className="text-xs text-slate-400">Natural VVS1/EF certified solitaires with international gemological authenticity.</p>
          </div>
          <div className="flex flex-col items-center sm:items-start gap-2">
            <Sparkles className="w-8 h-8 text-gold-400" />
            <h4 className="font-serif text-slate-100 font-semibold text-sm">Bespoke Karigar Atelier</h4>
            <p className="text-xs text-slate-400">Generational goldsmith masters crafting customized heirlooms since 1978.</p>
          </div>
          <div className="flex flex-col items-center sm:items-start gap-2">
            <Scale className="w-8 h-8 text-gold-400" />
            <h4 className="font-serif text-slate-100 font-semibold text-sm">Lifetime Valuation</h4>
            <p className="text-xs text-slate-400">Transparent valuation and lifetime exchange policy on all fine jewellery.</p>
          </div>
        </div>

        {/* Links & Information */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <img 
                src="/logo-emblem.png" 
                alt="Venkateshwaraa Jewellery" 
                className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]"
              />
              <span className="font-serif text-xl font-bold gold-gradient-text tracking-wider">
                VENKATESHWARAA JEWELLERY
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              Crafting timeless Indian heritage gold, solitaire diamonds, and uncut Polki Kundan masterpieces since 1978. Rooted in devotional tradition, elevated by bespoke artistry.
            </p>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Flagship Boutique: Road No. 36, Jubilee Hills, Hyderabad, Telangana — 500033</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+91 98765 43210 / +91 40 2345 6789</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>concierge@venkateshwarajewellery.com</span>
              </p>
            </div>
          </div>

          {/* Quick Links: Showcase Collections */}
          <div>
            <h5 className="font-serif text-slate-200 font-semibold text-xs tracking-wider uppercase mb-4">
              Jewellery Categories
            </h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/catalog?category=gold" className="hover:text-gold-300 transition-colors">Gold Jewellery</Link></li>
              <li><Link to="/catalog?category=diamond" className="hover:text-gold-300 transition-colors">Diamond Solitaires</Link></li>
              <li><Link to="/catalog?category=bridal" className="hover:text-gold-300 transition-colors">Bridal Trousseau</Link></li>
              <li><Link to="/catalog?category=temple-jewellery" className="hover:text-gold-300 transition-colors">Temple Jewellery</Link></li>
              <li><Link to="/catalog?category=antique" className="hover:text-gold-300 transition-colors">Antique & Polki</Link></li>
              <li><Link to="/catalog?category=silver" className="hover:text-gold-300 transition-colors">925 Sterling Silver</Link></li>
            </ul>
          </div>

          {/* Catalogues & Assistance */}
          <div>
            <h5 className="font-serif text-slate-200 font-semibold text-xs tracking-wider uppercase mb-4">
              Catalogues & Services
            </h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/catalogues" className="hover:text-gold-300 transition-colors flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-gold-400" /> Digital Lookbooks</Link></li>
              <li><Link to="/contact" className="hover:text-gold-300 transition-colors">Book Private Consultation</Link></li>
              <li><Link to="/about" className="hover:text-gold-300 transition-colors">Atelier Legacy (Est. 1978)</Link></li>
              <li><Link to="/wishlist" className="hover:text-gold-300 transition-colors">My Shortlisted Designs</Link></li>
              <li><a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="hover:text-gold-300 transition-colors flex items-center gap-1"><MessageSquare className="w-3 h-3 text-emerald-400" /> WhatsApp Concierge</a></li>
            </ul>
          </div>

          {/* Management & AI */}
          <div>
            <h5 className="font-serif text-slate-200 font-semibold text-xs tracking-wider uppercase mb-4">
              Store Information
            </h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-gold-300 transition-colors">Staff & Artisan Login</Link></li>
              <li><span className="text-emerald-400 font-semibold">● Showroom Open: 10:30 AM - 8:30 PM</span></li>
              <li><span className="text-slate-400">Valet Parking: Available</span></li>
              <li><span className="text-gold-400 font-semibold">AI Assistant: Active 24/7</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Venkateshwaraa Jewellery Pvt Ltd. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Hallmarking Compliance</span>
            <span>Terms of Showcase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
