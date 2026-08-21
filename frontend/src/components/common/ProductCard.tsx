import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { useTiltTransform } from '../../hooks/useTiltTransform';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  material: string;
  purity: string;
  weightGrams: number;
  price: number;
  discountPercentage: number;
  image: string;
  isFeatured?: boolean;
  stockQuantity: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  slug,
  material,
  purity,
  weightGrams,
  price,
  discountPercentage,
  image,
  isFeatured,
  stockQuantity
}) => {
  const { tiltStyle, handlePointerMove, handlePointerLeave } = useTiltTransform(6, 1.02);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [isHeartPulsing, setIsHeartPulsing] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const inWishlist = isInWishlist(id);
  const discountedPrice = price * (1 - discountPercentage / 100);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHeartPulsing(true);
    toggleWishlist(id);
    setTimeout(() => setIsHeartPulsing(false), 300);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    await addToCart(id, 1);
    setTimeout(() => setIsAddingToCart(false), 400);
  };

  return (
    <div
      style={tiltStyle}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="group relative bg-[#131B2A] rounded-2xl overflow-hidden border border-gold-500/20 hover:border-gold-500/50 transition-colors duration-300 shadow-luxury flex flex-col h-full"
    >
      {/* Image & Overlay Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-900/50">
        <img
          src={image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isFeatured && (
            <span className="inline-flex items-center gap-1 bg-gold-500/90 text-slate-950 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md backdrop-blur-md">
              <Sparkles className="w-3 h-3" /> Heritage Featured
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="inline-block bg-burgundy-800/90 text-gold-300 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-gold-500/30">
              {discountPercentage}% Off
            </span>
          )}
        </div>

        {/* Wishlist Heart Micro-Interaction */}
        <button
          onClick={handleWishlistClick}
          aria-label="Add to wishlist"
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

        {/* Hover Quick Action overlay */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2">
          <Link
            to={`/products/${id}`}
            className="flex-1 bg-slate-900/80 hover:bg-slate-900 text-slate-200 text-xs font-medium py-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> View Specs
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={stockQuantity === 0}
            className={`flex-1 ${
              isAddingToCart ? 'scale-105 bg-gold-400' : 'bg-gold-500 hover:bg-gold-400'
            } text-slate-950 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-gold-glow disabled:opacity-50`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> {stockQuantity === 0 ? 'Out of Stock' : 'Add to Bag'}
          </button>
        </div>
      </div>

      {/* Product Information Footer */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-gold-400/90 font-medium tracking-wide uppercase mb-1">
            <span>{material} • {purity}</span>
            <span>{weightGrams}g</span>
          </div>
          <Link to={`/products/${id}`} className="hover:underline">
            <h3 className="font-serif text-base font-semibold text-slate-100 line-clamp-1 group-hover:text-gold-300 transition-colors">
              {name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-baseline justify-between">
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
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            Certified 22K/18K
          </span>
        </div>
      </div>
    </div>
  );
};
