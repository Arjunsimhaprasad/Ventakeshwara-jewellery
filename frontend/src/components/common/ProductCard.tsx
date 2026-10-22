import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Sparkles, MessageSquare, Send } from 'lucide-react';
import { useTiltTransform } from '../../hooks/useTiltTransform';
import { useWishlist } from '../../hooks/useWishlist';
import { EnquiryModal } from './EnquiryModal';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  sku?: string; // Unique Design ID
  material: string;
  jewelleryType?: string;
  purity: string;
  weightGrams: number;
  price: number;
  discountPercentage?: number;
  image: string;
  isFeatured?: boolean;
  isPriceOnRequest?: boolean;
  stockQuantity?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  slug,
  sku = 'VJ-DSG-001',
  material,
  jewelleryType,
  purity,
  weightGrams,
  price,
  discountPercentage = 0,
  image,
  isFeatured,
  isPriceOnRequest = false
}) => {
  const { tiltStyle, handlePointerMove, handlePointerLeave } = useTiltTransform(6, 1.02);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [isHeartPulsing, setIsHeartPulsing] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const inWishlist = isInWishlist(id);
  const hasPrice = price > 0 && !isPriceOnRequest;
  const discountedPrice = hasPrice ? price * (1 - (discountPercentage || 0) / 100) : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHeartPulsing(true);
    toggleWishlist(id);
    setTimeout(() => setIsHeartPulsing(false), 300);
  };

  const handleEnquireClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEnquiryModalOpen(true);
  };

  // WhatsApp quick trigger
  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hello Venkateshwara Jewellery! I am interested in exploring:
• Design: ${name}
• Design ID: ${sku}
• Purity: ${purity}
• Weight: ${weightGrams}g
Please share pricing and design details.`
  )}`;

  return (
    <>
      <div
        style={tiltStyle}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        className="group relative bg-[#131B2A] rounded-2xl overflow-hidden border border-gold-500/20 hover:border-gold-500/50 transition-colors duration-300 shadow-luxury flex flex-col h-full"
      >
        {/* Image & Overlay Container */}
        <div className="relative aspect-square overflow-hidden bg-slate-900/50">
          <Link to={`/products/${id}`} className="block w-full h-full">
            <img
              src={image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
              alt={name}
              className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {isFeatured && (
              <span className="inline-flex items-center gap-1 bg-gold-500/90 text-slate-950 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md backdrop-blur-md">
                <Sparkles className="w-3 h-3" /> Masterpiece
              </span>
            )}
            <span className="inline-block bg-slate-900/80 text-gold-300 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-gold-500/30 backdrop-blur-sm">
              ID: {sku}
            </span>
          </div>

          {/* Shortlist Heart Micro-Interaction */}
          <button
            onClick={handleWishlistClick}
            aria-label="Save to Shortlist"
            title="Save to Shortlist"
            className={`absolute top-3 right-3 z-10 p-2.5 rounded-full glass-panel transition-transform duration-200 ${
              isHeartPulsing ? 'scale-125' : 'hover:scale-110'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                inWishlist ? 'fill-rose-500 text-rose-500' : 'text-slate-300 hover:text-rose-400'
              }`}
            />
          </button>

          {/* Quick Action Overlay */}
          <div className="absolute inset-x-3 bottom-3 z-10 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-0 sm:translate-y-2 group-hover:translate-y-0 flex gap-2">
            <Link
              to={`/products/${id}`}
              className="flex-1 bg-slate-900/90 hover:bg-slate-900 text-slate-200 text-[11px] sm:text-xs font-medium py-2.5 rounded-xl border border-slate-700/90 flex items-center justify-center gap-1.5 transition-colors backdrop-blur-sm"
            >
              <Eye className="w-3.5 h-3.5 text-gold-400" /> View Details
            </Link>
            <button
              onClick={handleEnquireClick}
              className="flex-1 bg-gold-500 hover:bg-gold-400 text-slate-950 text-[11px] sm:text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-gold-glow"
            >
              <Send className="w-3.5 h-3.5" /> Enquire
            </button>
          </div>
        </div>

        {/* Product Information Body */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-gold-400/90 font-medium tracking-wide uppercase mb-1">
              <span className="truncate max-w-[140px]">{material} • {purity}</span>
              <span className="shrink-0">{weightGrams}g</span>
            </div>
            <Link to={`/products/${id}`} className="hover:underline">
              <h3 className="font-serif text-base font-semibold text-slate-100 line-clamp-1 group-hover:text-gold-300 transition-colors">
                {name}
              </h3>
            </Link>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            {/* Price or Price on Request */}
            <div>
              {hasPrice ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gold-400 font-serif">
                    ₹{discountedPrice.toLocaleString('en-IN')}
                  </span>
                  {discountPercentage > 0 && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs font-serif font-bold text-gold-300 uppercase tracking-wider bg-gold-500/10 px-2.5 py-1 rounded border border-gold-500/30">
                  Price on Request
                </span>
              )}
            </div>

            {/* Direct WhatsApp Quick Enquiry Icon */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Quick WhatsApp Enquiry for this design"
              className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/50 transition-colors flex items-center gap-1 text-[11px] font-semibold"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        product={{
          id,
          name,
          sku,
          image,
          price: hasPrice ? discountedPrice : 0,
          isPriceOnRequest: !hasPrice,
          purity,
          material,
          weightGrams
        }}
      />
    </>
  );
};
