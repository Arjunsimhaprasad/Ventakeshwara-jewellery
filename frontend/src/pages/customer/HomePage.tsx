import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Award, Crown, Eye } from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { apiFetch } from '../../services/api';

interface HomePageProps {
  onOpenAIChat: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenAIChat }) => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Parallax scroll hooks (§2a)
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 40]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.7]);

  useEffect(() => {
    apiFetch('/api/products?featured=true')
      .then(res => res.json())
      .then(data => setFeaturedProducts(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

    apiFetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section with Scroll Parallax */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-10">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0 bg-cover bg-center filter brightness-40"
        >
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1920&q=80"
            alt="Venkateshwara Heritage Jewellery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/60 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass-panel-gold px-4 py-1.5 rounded-full text-gold-300 text-xs font-semibold tracking-widest uppercase shadow-gold-glow"
          >
            <Crown className="w-4 h-4 text-gold-400" /> Royal Indian Heritage • Est. 1978
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-100 leading-tight"
          >
            Pinnacle of <span className="gold-gradient-text">22K Gold</span> & Solitaire Craftsmanship
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-sans leading-relaxed"
          >
            Handcrafted Temple Gold, VVS Solitaire Diamonds, and Uncut Kundan Polki curated for royalty. Authenticated with 100% BIS Hallmarking.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/catalog"
              className="w-full sm:w-auto bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 font-bold px-8 py-4 rounded-full text-sm shadow-gold-glow flex items-center justify-center gap-2 transition-all transform hover:scale-105"
            >
              Explore Heritage Collection <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={onOpenAIChat}
              className="w-full sm:w-auto glass-panel hover:bg-gold-500/20 text-gold-300 border border-gold-500/50 font-semibold px-8 py-4 rounded-full text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" /> Ask AI Concierge "Ratna"
            </button>
          </motion.div>
        </div>
      </section>

      {/* Heritage Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">Curated Masterpieces</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">Explore Fine Collections</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id || idx}
              to={`/catalog?category=${cat.id}`}
              className="group relative h-80 rounded-2xl overflow-hidden border border-gold-500/20 hover:border-gold-500/60 transition-all shadow-luxury"
            >
              <img
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-6 inset-x-6 space-y-1">
                <h3 className="font-serif text-xl font-bold text-slate-100 group-hover:text-gold-300 transition-colors">{cat.name}</h3>
                <p className="text-xs text-slate-300 line-clamp-2">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Carousel Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">Certified Jewellery</span>
            <h2 className="font-serif text-3xl font-bold text-slate-100">Featured Masterpieces</h2>
          </div>
          <Link to="/catalog" className="text-gold-400 hover:text-gold-300 text-xs font-bold flex items-center gap-1">
            View Full Catalogue ({featuredProducts.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              material={product.material}
              purity={product.purity}
              weightGrams={product.weightGrams}
              price={product.price}
              discountPercentage={product.discountPercentage}
              image={product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
              isFeatured={product.isFeatured}
              stockQuantity={product.stockQuantity}
            />
          ))}
        </div>
      </section>

      {/* AI Concierge Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden glass-panel-gold border border-gold-500/40 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 bg-gold-500/20 text-gold-300 text-xs font-semibold px-3 py-1 rounded-full border border-gold-500/30">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" /> Google Gemini Powered Advisor
            </span>
            <h3 className="font-serif text-3xl font-bold text-slate-100">Uncertain About Ring Sizes or Purity?</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Consult "Ratna", our exclusive AI Jewellery Concierge. Receive personalized styling advice, compare products side-by-side, and verify live hallmarking standards.
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
    </div>
  );
};
