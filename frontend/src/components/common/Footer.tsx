import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, MapPin, Phone, Mail, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080C14] border-t border-gold-500/20 text-slate-400 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Promises */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-2">
            <ShieldCheck className="w-8 h-8 text-gold-400" />
            <h4 className="font-serif text-slate-100 font-semibold text-sm">BIS 100% Hallmarked</h4>
            <p className="text-xs text-slate-400">Every gold gram strictly tested & government hallmarked for 916 purity.</p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <Award className="w-8 h-8 text-gold-400" />
            <h4 className="font-serif text-slate-100 font-semibold text-sm">Certified Natural Diamonds</h4>
            <p className="text-xs text-slate-400">VVS1/F certified solitaires with international authenticity guarantee.</p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <MapPin className="w-8 h-8 text-gold-400" />
            <h4 className="font-serif text-slate-100 font-semibold text-sm">Insured Doorstep Delivery</h4>
            <p className="text-xs text-slate-400">Tamper-evident transit insurance on every high-value parcel.</p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <Sparkles className="w-8 h-8 text-gold-400" />
            <h4 className="font-serif text-slate-100 font-semibold text-sm">Lifetime Buyback & Exchange</h4>
            <p className="text-xs text-slate-400">Transparent valuation guarantee across all Venkateshwara flagship stores.</p>
          </div>
        </div>

        {/* Links & Information */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold-500 text-slate-950 font-serif font-bold text-lg flex items-center justify-center">
                V
              </div>
              <span className="font-serif text-xl font-bold gold-gradient-text">VENKATESHWARA JEWELLERY</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              Crafting timeless Indian heritage gold, solitaire diamonds, and uncut Polki Kundan masterpieces since 1978. Rooted in tradition, elevated by modern technology.
            </p>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold-400" /> Flagship Store: Road No. 36, Jubilee Hills, Hyderabad, TS</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold-400" /> +91 98765 43210 / +91 40 2345 6789</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gold-400" /> concierge@venkateshwarajewellery.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-serif text-slate-200 font-semibold text-xs tracking-wider uppercase mb-4">Fine Collections</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/catalog?category=gold" className="hover:text-gold-300 transition-colors">Temple Gold Necklaces</Link></li>
              <li><Link to="/catalog?category=diamond" className="hover:text-gold-300 transition-colors">Solitaire Diamond Rings</Link></li>
              <li><Link to="/catalog?category=polki" className="hover:text-gold-300 transition-colors">Heritage Polki Chokers</Link></li>
              <li><Link to="/catalog?category=gemstones" className="hover:text-gold-300 transition-colors">Royal Gemstone Sets</Link></li>
              <li><Link to="/catalog" className="hover:text-gold-300 transition-colors">Custom Bridal Trousseau</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-slate-200 font-semibold text-xs tracking-wider uppercase mb-4">Customer Care</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/support" className="hover:text-gold-300 transition-colors">Track Order & Support</Link></li>
              <li><Link to="/orders" className="hover:text-gold-300 transition-colors">Gold Rate Calculation</Link></li>
              <li><Link to="/support" className="hover:text-gold-300 transition-colors">Ring Size Measurement Guide</Link></li>
              <li><Link to="/support" className="hover:text-gold-300 transition-colors">Jewellery Care Instructions</Link></li>
              <li><Link to="/support" className="hover:text-gold-300 transition-colors">Certificate Verification</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-slate-200 font-semibold text-xs tracking-wider uppercase mb-4">Store Portal</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-gold-300 transition-colors">Account Login</Link></li>
              <li><Link to="/admin" className="hover:text-gold-300 transition-colors">Admin & Staff Portal</Link></li>
              <li><span className="text-gold-400 font-semibold">AI Assistant: Active</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Venkateshwara Jewellery Pvt Ltd. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Hallmarking Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
