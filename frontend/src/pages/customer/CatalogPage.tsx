import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, RotateCcw, Sparkles, BookOpen, MessageSquare } from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 14 Official Showcase Categories
  const showcaseCategories = [
    { id: 'cat-gold', slug: 'gold', name: 'Gold' },
    { id: 'cat-diamond', slug: 'diamond', name: 'Diamond' },
    { id: 'cat-silver', slug: 'silver', name: 'Silver' },
    { id: 'cat-bridal', slug: 'bridal', name: 'Bridal' },
    { id: 'cat-necklaces', slug: 'necklaces', name: 'Necklaces' },
    { id: 'cat-chains', slug: 'chains', name: 'Chains' },
    { id: 'cat-bangles', slug: 'bangles', name: 'Bangles' },
    { id: 'cat-bracelets', slug: 'bracelets', name: 'Bracelets' },
    { id: 'cat-rings', slug: 'rings', name: 'Rings' },
    { id: 'cat-earrings', slug: 'earrings', name: 'Earrings' },
    { id: 'cat-pendants', slug: 'pendants', name: 'Pendants' },
    { id: 'cat-antique', slug: 'antique', name: 'Antique' },
    { id: 'cat-traditional', slug: 'traditional', name: 'Traditional' },
    { id: 'cat-temple', slug: 'temple-jewellery', name: 'Temple Jewellery' }
  ];

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedMaterial, setSelectedMaterial] = useState(searchParams.get('material') || '');
  const [selectedPurity, setSelectedPurity] = useState(searchParams.get('purity') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '1000000');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        } else {
          setCategories(showcaseCategories);
        }
      })
      .catch(() => setCategories(showcaseCategories));
  }, []);

  const fetchFilteredProducts = () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedMaterial) params.append('material', selectedMaterial);
    if (selectedPurity) params.append('purity', selectedPurity);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (searchQuery) params.append('search', searchQuery);
    if (sortBy) params.append('sort', sortBy);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCategory, selectedMaterial, selectedPurity, maxPrice, searchQuery, sortBy]);

  const handleCategoryPillClick = (catSlug: string) => {
    if (selectedCategory === catSlug) {
      setSelectedCategory('');
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSelectedCategory(catSlug);
      searchParams.set('category', catSlug);
      setSearchParams(searchParams);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedMaterial('');
    setSelectedPurity('');
    setMaxPrice('1000000');
    setSearchQuery('');
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-2">
          <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" /> Digital Showcase
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">
            Heritage Jewellery Designs
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
            Explore handcrafted 100% BIS Hallmarked gold necklaces, solitaire diamond rings, uncut Polki Kundan sets, temple sculptures, and sterling silverware.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://wa.me/919876543210?text=Hello%20Venkateshwara%20Jewellery,%20I%20would%20like%20to%20enquire%20about%20your%20jewellery%20designs."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-md"
          >
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Concierge
          </a>
        </div>
      </div>

      {/* 14 Official Categories Horizontal Filter Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
            Browse by 14 Fine Categories:
          </span>
          {selectedCategory && (
            <button
              onClick={() => handleCategoryPillClick(selectedCategory)}
              className="text-gold-400 hover:text-gold-300 text-xs font-semibold"
            >
              Clear Category Filter
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => handleCategoryPillClick('')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === ''
                ? 'bg-gold-500 text-slate-950 shadow-gold-glow'
                : 'glass-panel text-slate-300 hover:text-white border-slate-700'
            }`}
          >
            All Designs ({products.length})
          </button>
          {showcaseCategories.map(cat => {
            const isActive = selectedCategory.toLowerCase() === cat.slug.toLowerCase() || selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryPillClick(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gold-500 text-slate-950 font-bold shadow-gold-glow'
                    : 'glass-panel text-slate-300 hover:text-white hover:border-gold-500/40 border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden flex items-center justify-between glass-panel p-3.5 rounded-2xl border border-gold-500/20">
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="flex items-center gap-2 text-xs font-bold text-gold-300 bg-gold-500/10 hover:bg-gold-500/20 px-4 py-2 rounded-xl border border-gold-500/30"
        >
          <Filter className="w-4 h-4 text-gold-400" />
          <span>{isMobileFilterOpen ? 'Hide Filters' : 'Filter Jewellery Designs'}</span>
          {(selectedCategory || selectedMaterial || selectedPurity || searchQuery) && (
            <span className="bg-gold-500 text-slate-950 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold">
              !
            </span>
          )}
        </button>
        <span className="text-xs text-slate-400">
          <strong className="text-gold-400">{products.length}</strong> designs found
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className={`glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-6 h-fit ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-serif text-lg font-bold text-slate-100 flex items-center gap-2">
              <Filter className="w-4 h-4 text-gold-400" /> Filter Designs
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-slate-400 hover:text-gold-300 text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Search by Name or Design ID</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. VJ-TMP-NK-001, Choker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg py-2.5 pl-8 pr-3 focus:outline-none focus:border-gold-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Jewellery Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-gold-500"
            >
              <option value="">All 14 Categories</option>
              {showcaseCategories.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Material Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Metal / Gemstone</label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-gold-500"
            >
              <option value="">All Metals</option>
              <option value="Gold">22K Yellow Gold</option>
              <option value="Diamond">Certified Diamonds</option>
              <option value="Polki">Uncut Polki Kundan</option>
              <option value="Silver">925 Sterling Silver</option>
              <option value="Rose Gold">18K Rose Gold</option>
              <option value="White Gold">18K White Gold</option>
              <option value="Gemstone">Precious Gemstones</option>
            </select>
          </div>

          {/* Purity Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Hallmark Purity</label>
            <select
              value={selectedPurity}
              onChange={(e) => setSelectedPurity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-gold-500"
            >
              <option value="">All Purities</option>
              <option value="22K">22K (916 Hallmarked)</option>
              <option value="18K">18K (750 Hallmarked)</option>
              <option value="925">925 Sterling Silver</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-gold-500"
            >
              <option value="newest">Latest Designs First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong className="text-slate-100">{products.length}</strong> authenticated designs
            </span>
            <span className="text-[11px] text-gold-400">
              * Indicative valuations subject to live gold bullion rate
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-slate-400 space-y-3">
              <Sparkles className="w-8 h-8 text-gold-400 animate-spin mx-auto" />
              <p className="font-serif text-slate-200">Refining fine jewellery designs...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 glass-panel p-8 rounded-3xl space-y-4 border border-gold-500/20">
              <Sparkles className="w-12 h-12 text-gold-400 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-slate-100">No Matching Designs Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                We have over 5,000+ custom designs in our Jubilee Hills showroom vault. Contact our artisan karigar for bespoke creation.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-gold-500 text-slate-950 text-xs font-bold px-6 py-2.5 rounded-full shadow-gold-glow"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
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
          )}
        </div>
      </div>
    </div>
  );
};
