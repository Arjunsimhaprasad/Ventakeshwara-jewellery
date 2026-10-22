import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Sparkles, Scale, Users, MapPin, Clock, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Banner */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#131B2A] to-[#0B0F17] border-b border-gold-500/20">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-gold-400" /> Est. 1978 • Jubilee Hills, Hyderabad
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold gold-gradient-text">
            48 Years of Royal Craftsmanship
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            At Venkateshwara Jewellery, every piece is more than an adornment—it is a sacred testament to Indian heritage, generational goldsmith artistry, and unwavering hallmark integrity.
          </p>
        </div>
      </section>

      {/* Legacy Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">
              Our Timeless Heritage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100 leading-snug">
              From Traditional Goldsmith Atelier to South India's Premier Bespoke Showroom
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Founded in 1978, Venkateshwara Jewellery began with a singular purpose: to preserve the ancient art of hand-sculpted temple jewellery and handcrafted gold filigree for discerning families celebrating life's most cherished milestones.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Over four decades and three generations of master karigars (artisans), our Jubilee Hills atelier has designed iconic bridal trousseaus for over 25,000 royal and celebratory weddings. From intricate Goddess Lakshmi nakshi chokers to certified VVS1 solitaire diamond heirlooms, our commitment to 100% BIS Hallmarked purity remains absolute.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="glass-panel p-4 rounded-2xl border border-gold-500/30">
                <span className="font-serif text-2xl font-bold text-gold-400">100%</span>
                <p className="text-xs text-slate-300 mt-1">BIS Hallmarked Purity Guarantee</p>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-gold-500/30">
                <span className="font-serif text-2xl font-bold text-gold-400">25,000+</span>
                <p className="text-xs text-slate-300 mt-1">Bespoke Bridal Heirlooms Crafted</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-gold-500/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80"
                alt="Master Artisan Crafting Jewellery"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            </div>
            <div className="absolute -bottom-6 -left-6 glass-panel-gold p-4 sm:p-6 rounded-2xl border border-gold-500/40 shadow-xl max-w-xs hidden sm:block">
              <p className="font-serif text-sm font-bold text-gold-300">"Purity is not a feature; it is our sacred family promise."</p>
              <span className="text-[10px] text-slate-400 mt-1 block">— Master Craftsman, Venkateshwara</span>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars of Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">The Venkateshwara Distinction</span>
          <h2 className="font-serif text-3xl font-bold text-slate-100">Why Families Trust Our Craftsmanship</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-3">
            <ShieldCheck className="w-10 h-10 text-gold-400" />
            <h4 className="font-serif text-base font-bold text-slate-100">100% BIS Hallmarking</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every single gram of gold undergoes rigorous government testing and laser inscription with unique 6-digit HUID authenticity.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-3">
            <Award className="w-10 h-10 text-gold-400" />
            <h4 className="font-serif text-base font-bold text-slate-100">Certified Diamonds</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Natural, ethically mined diamonds certified by internationally renowned gemological laboratories (IGI & GIA) with zero compromise on cut and clarity.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-3">
            <Users className="w-10 h-10 text-gold-400" />
            <h4 className="font-serif text-base font-bold text-slate-100">Master Karigar Atelier</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generational master goldsmiths specializing in ancient South Indian nakshi work, kundan polki setting, and intricate rava filigree.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-3">
            <Scale className="w-10 h-10 text-gold-400" />
            <h4 className="font-serif text-base font-bold text-slate-100">Lifetime Valuation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent buyback and exchange policies across our flagship showroom with guaranteed benchmark rates.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-panel-gold p-8 sm:p-12 rounded-3xl border border-gold-500/40 space-y-6">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
            Experience the Art of Bespoke Jewellery in Person
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Visit our flagship jewellery salon in Jubilee Hills, Hyderabad. Browse exclusive vault pieces, examine high-resolution digital lookbooks, or collaborate with our karigars to create a one-of-a-kind heirloom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              to="/catalog"
              className="bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold px-6 py-3 rounded-full text-xs shadow-gold-glow transition-all"
            >
              Browse Jewellery Designs
            </Link>
            <Link
              to="/contact"
              className="glass-panel hover:bg-slate-800 text-gold-300 font-semibold px-6 py-3 rounded-full text-xs border border-gold-500/40 transition-colors"
            >
              Book Showroom Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
