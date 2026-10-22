import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShieldCheck, Sparkles, Scale, Award, ArrowLeft, RefreshCw, Send, MessageSquare, Check, PhoneCall, HelpCircle } from 'lucide-react';
import { Product3DViewer } from '../../components/common/Product3DViewer';
import { useWishlist } from '../../hooks/useWishlist';
import { EnquiryModal } from '../../components/common/EnquiryModal';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [compareResult, setCompareResult] = useState<any>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<string>('');

  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        if (data.variations && data.variations.length > 0) {
          setSelectedVariation(data.variations[0]);
        }
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
        body: JSON.stringify({ productIds: [product.id, 'f0000000-0000-0000-0000-000000000002'] })
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
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-32 text-slate-400 space-y-4">
        <Sparkles className="w-8 h-8 text-gold-400 animate-spin" />
        <p className="font-serif text-lg text-slate-200">Loading fine jewellery craftsmanship details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-slate-200">Jewellery Design Not Found</h2>
        <p className="text-xs text-slate-400">The requested design code or catalogue piece is currently unavailable.</p>
        <Link to="/catalog" className="inline-block bg-gold-500 text-slate-950 font-bold px-6 py-2.5 rounded-full text-xs shadow-gold-glow">
          Explore All Jewellery Designs
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const imageList = (product.images || []).map((img: any) => img.imageUrl);
  const hasPrice = product.price > 0 && !product.isPriceOnRequest;
  const discountedPrice = hasPrice ? product.price * (1 - (product.discountPercentage || 0) / 100) : 0;
  const sku = product.sku || 'VJ-DSG-001';

  // WhatsApp Enquiry Link
  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hello Venkateshwara Jewellery! I am interested in this design:
• Design: ${product.name}
• Design ID: ${sku}
• Purity: ${product.purity}
• Weight: ${product.weightGrams}g
${selectedVariation ? `• Selected Variation: ${selectedVariation}` : ''}
Please share details, current gold making charges, and consultation availability.`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link to="/catalog" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-gold-300 text-xs font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Jewellery Catalogue
        </Link>
        <span className="text-[11px] text-slate-400 font-mono">
          DESIGN ID: <strong className="text-gold-400 font-bold">{sku}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Interactive 3D / Multi-Angle Image Viewer */}
        <div className="space-y-4">
          <Product3DViewer
            productName={product.name}
            images={imageList}
          />
          <div className="glass-panel p-4 rounded-2xl border border-gold-500/20 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Interactive 360° Studio View • Drag to inspect craftsmanship angles</span>
          </div>
        </div>

        {/* Product Details Specs & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest bg-gold-500/10 px-2.5 py-0.5 rounded border border-gold-500/20">
                {product.material}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • {product.purity}
              </span>
              <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/40 font-semibold">
                100% BIS Hallmarked
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100 leading-tight">
              {product.name}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed pt-1">
              {product.description}
            </p>
          </div>

          {/* Pricing Box / Price on Request */}
          <div className="glass-panel p-6 rounded-2xl border border-gold-500/30 space-y-2">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
              Pricing Structure
            </span>
            {hasPrice ? (
              <div className="space-y-1">
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
                <p className="text-[11px] text-slate-400">
                  Transparent indicative store valuation based on today's gold rate and certified weight.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="font-serif text-2xl font-bold text-gold-300">
                  Price on Request
                </div>
                <p className="text-[11px] text-slate-400">
                  This exclusive masterpiece or bridal trousseau design is customized to order. Contact our master artisan for exact quotation based on your desired weight and gemstone specifications.
                </p>
              </div>
            )}
          </div>

          {/* Available Customizations / Variations */}
          {product.variations && product.variations.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Available Customisation & Finishes:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variations.map((v: string) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSelectedVariation(v)}
                    className={`text-xs px-3.5 py-2 rounded-xl border transition-all text-left ${
                      selectedVariation === v
                        ? 'bg-gold-500/20 text-gold-300 border-gold-500 font-bold shadow-gold-glow'
                        : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {selectedVariation === v && <Check className="w-3.5 h-3.5 inline mr-1 text-gold-400" />}
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Specs Breakdown Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
            <h3 className="font-serif font-semibold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Authentic Jewellery Specifications</span>
              <span className="text-[10px] text-gold-400 font-mono">ID: {sku}</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 text-slate-300">
              <div><span className="text-slate-400">Unique Design ID:</span> <strong className="text-gold-300 font-mono">{sku}</strong></div>
              <div><span className="text-slate-400">Metal Purity:</span> <strong className="text-slate-100">{product.purity}</strong></div>
              <div><span className="text-slate-400">Net Weight:</span> <strong className="text-slate-100">{product.weightGrams} grams</strong></div>
              <div><span className="text-slate-400">Category / Type:</span> <strong className="text-slate-100">{product.jewelleryType || product.material}</strong></div>
              <div><span className="text-slate-400">Making Charges:</span> <strong className="text-slate-100">{product.makingCharges ? `₹${product.makingCharges.toLocaleString('en-IN')}` : 'Included'}</strong></div>
              <div><span className="text-slate-400">Crafting Time:</span> <strong className="text-slate-100">Ready in Store / 10 Days Bespoke</strong></div>
              <div className="col-span-2">
                <span className="text-slate-400">Stone & Diamond Info:</span>{' '}
                <strong className="text-slate-100 block sm:inline mt-0.5 sm:mt-0">
                  {product.stoneInformation || 'Solid 22K/18K Gold (No Stone Setting)'}
                </strong>
              </div>
            </div>
          </div>

          {/* Primary Call to Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                onClick={() => setIsEnquiryModalOpen(true)}
                className="flex-1 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 font-bold py-4 px-6 rounded-2xl shadow-gold-glow flex items-center justify-center gap-2 text-sm transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" /> Enquire About This Design
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                title={inWishlist ? 'Remove from Shortlist' : 'Add to Shortlist'}
                className="p-4 glass-panel rounded-2xl border border-slate-700 hover:border-rose-500/50 transition-colors"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`} />
              </button>
            </div>

            {/* Direct WhatsApp Quick Enquiry Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs transition-colors shadow-lg"
            >
              <MessageSquare className="w-4 h-4" /> Enquire via WhatsApp (Instant Reply from Hyderabad Showroom)
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-[11px] text-center">
            <div className="glass-panel p-3 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-gold-400 mx-auto mb-1" />
              <span className="text-slate-300 font-medium block">BIS 100% Hallmarked</span>
            </div>
            <div className="glass-panel p-3 rounded-xl border border-slate-800">
              <Award className="w-4 h-4 text-gold-400 mx-auto mb-1" />
              <span className="text-slate-300 font-medium block">Certified Gemstones</span>
            </div>
            <div className="glass-panel p-3 rounded-xl border border-slate-800">
              <Scale className="w-4 h-4 text-gold-400 mx-auto mb-1" />
              <span className="text-slate-300 font-medium block">Lifetime Buyback</span>
            </div>
          </div>

          {/* AI Comparison & Advice Widget */}
          <div className="glass-panel-gold p-4 rounded-2xl border border-gold-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gold-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold-400" /> "Ratna" AI Jewellery Advisor
              </span>
              <button
                onClick={handleAICompare}
                disabled={isComparing}
                className="text-xs bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 px-3 py-1 rounded-full border border-gold-500/40 flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                {isComparing ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Side-by-Side Compare'}
              </button>
            </div>

            {compareResult && (
              <div className="text-xs text-slate-200 bg-slate-900/90 p-3 rounded-xl space-y-2 border border-slate-800 animate-fadeIn">
                <p className="font-semibold text-gold-300">Expert Recommendation:</p>
                <p className="leading-relaxed">{compareResult.recommendation}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          sku: sku,
          image: imageList[0],
          price: hasPrice ? discountedPrice : 0,
          isPriceOnRequest: !hasPrice,
          purity: product.purity,
          material: product.material,
          weightGrams: product.weightGrams
        }}
      />
    </div>
  );
};
