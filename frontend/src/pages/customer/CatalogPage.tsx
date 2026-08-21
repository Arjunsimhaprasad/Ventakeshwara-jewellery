import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedMaterial, setSelectedMaterial] = useState(searchParams.get('material') || '');
  const [selectedPurity, setSelectedPurity] = useState(searchParams.get('purity') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '1000000');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">Catalogue</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">Heritage Fine Jewellery</h1>
        <p className="text-slate-400 text-xs sm:text-sm">Browse 100% BIS Hallmarked gold necklaces, solitaire diamond rings, and Polki Kundan chokers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="glass-panel p-6 rounded-2xl border border-gold-500/20 space-y-6 h-fit">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-serif text-lg font-bold text-slate-100 flex items-center gap-2">
              <Filter className="w-4 h-4 text-gold-400" /> Filter Catalogue
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
            <label className="text-xs font-semibold text-slate-300">Keyword Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Name, SKU, Stone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg py-2 pl-8 pr-3"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-2.5"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Material Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Metal / Gemstone</label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-2.5"
            >
              <option value="">All Metals</option>
              <option value="Gold">22K / 18K Yellow Gold</option>
              <option value="White Gold">White Gold & Solitaire</option>
              <option value="Rose Gold">Rose Gold</option>
              <option value="Polki">Uncut Polki & Kundan</option>
            </select>
          </div>

          {/* Purity Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Purity Standard</label>
            <select
              value={selectedPurity}
              onChange={(e) => setSelectedPurity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-2.5"
            >
              <option value="">All Purities</option>
              <option value="22K">22K (916 Hallmarked)</option>
              <option value="18K">18K (750 Certified)</option>
            </select>
          </div>

          {/* Max Price Filter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Max Budget</span>
              <span className="text-gold-400">₹{parseInt(maxPrice).toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="1000000"
              step="25000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-gold-500"
            />
          </div>
        </div>

        {/* Product Grid & Sort Controls */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between glass-panel p-4 rounded-xl">
            <span className="text-xs text-slate-300 font-medium">
              Showing <strong className="text-gold-400">{products.length}</strong> items
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="text-center py-20 text-slate-400">Loading fine jewellery items...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
              <p className="text-slate-300 font-serif text-lg">No jewellery items matched your filters.</p>
              <button
                onClick={handleResetFilters}
                className="bg-gold-500 hover:bg-gold-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-full"
              >
                Clear All Filters
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
          )}
        </div>
      </div>
    </div>
  );
};
