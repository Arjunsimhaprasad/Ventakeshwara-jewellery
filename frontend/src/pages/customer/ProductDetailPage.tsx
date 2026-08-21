import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, ShieldCheck, Sparkles, Scale, Award, ArrowLeft, RefreshCw } from 'lucide-react';
import { Product3DViewer } from '../../components/common/Product3DViewer';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [compareResult, setCompareResult] = useState<any>(null);
  const [isComparing, setIsComparing] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [id]);

  const handleAICompare = async () => {
    if (!product) return;
    setIsComparing(true);
    try {
      const res = await fetch('/api/ai/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: [product.id, 'p0000000-0000-0000-0000-000000000002'] })
      });
      if (res.ok) {
        const data = await res.json();
        setCompareResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsComparing(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-32 text-slate-400">Loading fine jewellery details...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-slate-200">Jewellery Item Not Found</h2>
        <Link to="/catalog" className="inline-block bg-gold-500 text-slate-950 font-bold px-4 py-2 rounded-full text-xs">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const inWishlist = isInWishlist(product.id);
  const imageList = (product.images || []).map((img: any) => img.imageUrl);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back Link */}
      <Link to="/catalog" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-gold-300 text-xs font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back to Collections
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Interactive 3D / Multi-Angle Image Viewer */}
        <div>
          <Product3DViewer
            productName={product.name}
            images={imageList}
          />
        </div>

        {/* Product Details Specs & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gold-400 uppercase tracking-widest">
              {product.material} • {product.purity} • SKU: {product.sku}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">{product.name}</h1>
            <p className="text-slate-300 text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Pricing Box */}
          <div className="glass-panel p-6 rounded-2xl border border-gold-500/30 space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-gold-300">
                ₹{discountedPrice.toLocaleString('en-IN')}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-sm text-slate-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">Includes all taxes. Transparent pricing breakdown below.</p>
          </div>

          {/* Specs Breakdown Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
            <h3 className="font-serif font-semibold text-slate-200 border-b border-slate-800 pb-2">Jewellery Specifications</h3>
            <div className="grid grid-cols-2 gap-3 text-slate-300">
              <div><span className="text-slate-400">Metal Purity:</span> <strong className="text-slate-100">{product.purity}</strong></div>
              <div><span className="text-slate-400">Net Weight:</span> <strong className="text-slate-100">{product.weightGrams} grams</strong></div>
              <div><span className="text-slate-400">Making Charges:</span> <strong className="text-slate-100">₹{product.makingCharges?.toLocaleString('en-IN')}</strong></div>
              <div><span className="text-slate-400">Stock Availability:</span> <strong className="text-emerald-400">{product.stockQuantity} units left</strong></div>
              <div className="col-span-2"><span className="text-slate-400">Stone Info:</span> <strong className="text-slate-100">{product.stoneInformation || 'Solid Gold (No Stones)'}</strong></div>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => addToCart(product.id, 1)}
              disabled={product.stockQuantity === 0}
              className="flex-1 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 font-bold py-4 rounded-2xl shadow-gold-glow flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-4 glass-panel rounded-2xl border border-slate-700 hover:border-rose-500/50"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`} />
            </button>
          </div>

          {/* AI Comparison Widget */}
          <div className="glass-panel-gold p-4 rounded-2xl border border-gold-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gold-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold-400" /> AI Side-by-Side Comparison
              </span>
              <button
                onClick={handleAICompare}
                disabled={isComparing}
                className="text-xs bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 px-3 py-1 rounded-full border border-gold-500/40 flex items-center gap-1"
              >
                {isComparing ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Compare with Solitaire'}
              </button>
            </div>

            {compareResult && (
              <div className="text-xs text-slate-200 bg-slate-900/90 p-3 rounded-xl space-y-2 border border-slate-800">
                <p className="font-semibold text-gold-300">Expert Verdict:</p>
                <p>{compareResult.recommendation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
