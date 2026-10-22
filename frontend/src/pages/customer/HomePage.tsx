import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Award, Crown, Eye, BookOpen, Download, Phone, MapPin, MessageSquare, Send, Coins, Scale } from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { Hero3DTitleCanvas } from '../../components/common/Hero3DTitleCanvas';
import { apiFetch } from '../../services/api';
import { EnquiryModal } from '../../components/common/EnquiryModal';

interface HomePageProps {
  onOpenAIChat: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenAIChat }) => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [catalogues, setCatalogues] = useState<any[]>([]);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  useEffect(() => {
    apiFetch('/api/products?featured=true')
      .then(res => res.json())
      .then(data => setFeaturedProducts(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

    apiFetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

    apiFetch('/api/catalogues?featured=true')
      .then(res => res.json())
      .then(data => setCatalogues(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Jewellery Banner (Hero Section with 3D Canvas) */}
      <section className="relative">
        <Hero3DTitleCanvas onOpenAIChat={onOpenAIChat} />
      </section>

      {/* 2. Trust Pillars Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 glass-panel rounded-3xl border border-gold-500/20 shadow-luxury">
          <div className="flex items-center gap-3 p-2">
            <ShieldCheck className="w-8 h-8 text-gold-400 shrink-0" />
            <div>
              <h4 className="font-serif text-slate-100 font-bold text-xs sm:text-sm">100% BIS Hallmarked</h4>
              <p className="text-[11px] text-slate-400">Strictly 916 gold with 6-digit HUID</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2">
            <Award className="w-8 h-8 text-gold-400 shrink-0" />
            <div>
              <h4 className="font-serif text-slate-100 font-bold text-xs sm:text-sm">Certified Diamonds</h4>
              <p className="text-[11px] text-slate-400">VVS1/EF certified natural solitaires</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2">
            <Sparkles className="w-8 h-8 text-gold-400 shrink-0" />
            <div>
              <h4 className="font-serif text-slate-100 font-bold text-xs sm:text-sm">Bespoke Karigars</h4>
              <p className="text-[11px] text-slate-400">Generational goldsmith masters</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2">
            <Scale className="w-8 h-8 text-gold-400 shrink-0" />
            <div>
              <h4 className="font-serif text-slate-100 font-bold text-xs sm:text-sm">Lifetime Valuation</h4>
              <p className="text-[11px] text-slate-400">Transparent buyback & exchange</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popular Categories Grid (Showcasing all 14 Categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">
            Curated Jewellery Categories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">
            Explore 14 Fine Design Collections
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            From devotional temple gold haars to certified solitaire diamond rings and sterling silverware.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 8).map((cat, idx) => (
            <Link
              key={cat.id || idx}
              to={`/catalog?category=${cat.slug || cat.id}`}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-gold-500/20 hover:border-gold-500/60 transition-all shadow-luxury"
            >
              <img
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-4 inset-x-4 space-y-1">
                <span className="text-[10px] text-gold-400 uppercase tracking-widest font-bold">Collection</span>
                <h3 className="font-serif text-lg font-bold text-slate-100 group-hover:text-gold-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-1">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-xs font-bold text-gold-400 hover:text-gold-300 border border-gold-500/30 bg-gold-500/10 px-6 py-3 rounded-full hover:bg-gold-500/20 transition-all"
          >
            <span>View All 14 Categories in Jewellery Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 4. Featured Masterpieces Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">
              Hallmarked Masterpieces
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-100">
              Featured Jewellery Designs
            </h2>
          </div>
          <Link to="/catalog" className="text-gold-400 hover:text-gold-300 text-xs font-bold flex items-center gap-1">
            Browse Full Showcase <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              sku={product.sku}
              material={product.material}
              jewelleryType={product.jewelleryType}
              purity={product.purity}
              weightGrams={product.weightGrams}
              price={product.price}
              discountPercentage={product.discountPercentage}
              image={product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
              isFeatured={product.isFeatured}
              isPriceOnRequest={product.isPriceOnRequest || product.price === 0}
              stockQuantity={product.stockQuantity}
            />
          ))}
        </div>
      </section>

      {/* 5. Digital Catalogues & Lookbooks Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-gold-400" /> High-Resolution Publications
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-100">
              Digital Catalogues & Lookbooks
            </h2>
          </div>
          <Link to="/catalogues" className="text-gold-400 hover:text-gold-300 text-xs font-bold flex items-center gap-1">
            View All Lookbooks <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {catalogues.slice(0, 3).map(cat => (
            <div
              key={cat.id}
              className="group glass-panel rounded-3xl overflow-hidden border border-gold-500/20 hover:border-gold-500/50 transition-all shadow-luxury flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={cat.coverImage}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute top-3 left-3 bg-gold-500 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {cat.category}
                </span>
                <span className="absolute bottom-3 right-3 text-[11px] bg-slate-900/80 px-2 py-0.5 rounded text-slate-300 font-mono">
                  {cat.pageCount} Pages
                </span>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-100 group-hover:text-gold-300 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-2 flex gap-2">
                  <Link
                    to="/catalogues"
                    className="flex-1 bg-gold-500 hover:bg-gold-400 text-slate-950 text-xs font-bold py-2 rounded-xl text-center shadow-gold-glow"
                  >
                    View Catalogue
                  </Link>
                  <Link
                    to="/catalogues"
                    className="glass-panel text-gold-300 hover:text-white text-xs font-semibold py-2 px-3 rounded-xl border border-gold-500/30 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. About Us Heritage Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel-gold rounded-3xl p-8 sm:p-12 border border-gold-500/30 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center shadow-2xl">
          <div className="space-y-5">
            <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">
              Our Hyderabad Legacy • Est. 1978
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100 leading-snug">
              48 Years of Uncompromising Artistry & Trust
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              At Venkateshwara Jewellery, our master karigars hand-forge every temple ornament, polki choker, and solitaire diamond ring in Jubilee Hills, Hyderabad. We do not sell mass factory jewellery—every design is an authentic tribute to South Indian royal aesthetics and strict BIS 916 hallmarking.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/about"
                className="bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs px-6 py-3 rounded-full shadow-gold-glow flex items-center gap-1.5 transition-all"
              >
                <span>Read Full Atelier Legacy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/catalog"
                className="glass-panel text-gold-300 hover:text-white text-xs font-semibold px-6 py-3 rounded-full border border-gold-500/40 transition-colors"
              >
                Browse Heirloom Portfolio
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold-500/40 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80"
              alt="Artisanal Jewellery Crafting"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-50" />
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-gold-500/30 text-xs">
              <strong className="text-gold-300 font-serif block">Handcrafted by Master Karigars</strong>
              <span className="text-slate-400 text-[11px]">Road No. 36, Jubilee Hills, Hyderabad</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Contact Us & Showroom Salon Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">
            Flagship Atelier Visit
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-100">
            Visit Our Hyderabad Showroom
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Experience our physical vault collections and consult directly with our senior jewellery masters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-3">
            <MapPin className="w-8 h-8 text-gold-400" />
            <h4 className="font-serif text-base font-bold text-slate-100">Jubilee Hills Boutique</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plot No. 482, Road No. 36, Near Peddamma Temple Metro Station, Jubilee Hills, Hyderabad — 500033. Valet parking available.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-3">
            <Phone className="w-8 h-8 text-gold-400" />
            <h4 className="font-serif text-base font-bold text-slate-100">Direct Telephones</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Showroom: +91 40 2345 6789<br />
              Concierge: +91 98765 43210<br />
              Email: concierge@venkateshwarajewellery.com
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-3 flex flex-col justify-between">
            <div>
              <MessageSquare className="w-8 h-8 text-emerald-400" />
              <h4 className="font-serif text-base font-bold text-slate-100 mt-2">Instant WhatsApp Concierge</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Share design screenshots or ask for live gold rate calculation and custom design estimates.
              </p>
            </div>
            <a
              href="https://wa.me/919876543210?text=Hello%20Venkateshwara%20Jewellery,%20I%20would%20like%20to%20enquire%20about%20your%20jewellery%20designs."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all mt-3"
            >
              <MessageSquare className="w-4 h-4" /> Message on WhatsApp
            </a>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-slate-950 text-xs font-bold px-8 py-3.5 rounded-full shadow-gold-glow transition-all"
          >
            <span>Book Private Consultation Appointment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 8. AI Concierge Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden glass-panel-gold border border-gold-500/40 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 bg-gold-500/20 text-gold-300 text-xs font-semibold px-3 py-1 rounded-full border border-gold-500/30">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" /> Google Gemini Powered Advisor
            </span>
            <h3 className="font-serif text-3xl font-bold text-slate-100">
              Uncertain About Ring Sizes, Purity, or Design Selection?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Consult "Ratna", our exclusive AI Jewellery Concierge. Receive personalized design styling advice, compare pieces side-by-side, verify live hallmarking standards, or calculate indicative valuations.
            </p>
          </div>
          <button
            onClick={onOpenAIChat}
            className="bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold px-8 py-4 rounded-full text-sm shadow-gold-glow flex items-center gap-2 whitespace-nowrap"
          >
            Launch AI Concierge <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Consultation Modal */}
      <EnquiryModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        defaultMessage="Hello, I would like to schedule a private showroom consultation for custom jewellery designing."
      />
    </div>
  );
};
