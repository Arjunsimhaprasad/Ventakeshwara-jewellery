import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Send, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { useWishlist } from '../../hooks/useWishlist';
import { EnquiryModal } from '../../components/common/EnquiryModal';

export const WishlistPage: React.FC = () => {
  const { wishlistProductIds } = useWishlist();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBulkEnquiryOpen, setIsBulkEnquiryOpen] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const allProducts = Array.isArray(data) ? data : [];
        setProducts(allProducts.filter(p => wishlistProductIds.includes(p.id)));
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [wishlistProductIds]);

  // Bulk WhatsApp Enquiry for all shortlisted designs
  const bulkWhatsappText = encodeURIComponent(
    `Hello Venkateshwara Jewellery! I have shortlisted ${products.length} designs on your website and would like to enquire about their availability, pricing, and customization:\n\n` +
    products.map((p, idx) => `${idx + 1}. ${p.name} (Design ID: ${p.sku || 'N/A'}, Purity: ${p.purity}, Weight: ${p.weightGrams}g)`).join('\n') +
    `\n\nPlease share details and consultation booking options.`
  );
  const bulkWhatsappUrl = `https://wa.me/919876543210?text=${bulkWhatsappText}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" /> Curation Atelier
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100 flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> My Shortlisted Designs ({products.length})
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Save designs you admire for consultation, bridal trousseau planning, or custom atelier commissioning.
          </p>
        </div>

        {products.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsBulkEnquiryOpen(true)}
              className="bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-gold-glow transition-all"
            >
              <Send className="w-3.5 h-3.5" /> Enquire About All ({products.length})
            </button>
            <a
              href={bulkWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Shortlist
            </a>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-400 space-y-3">
          <Sparkles className="w-8 h-8 text-gold-400 animate-spin mx-auto" />
          <p className="font-serif text-slate-200">Loading your shortlisted designs...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border border-slate-800 space-y-4 max-w-lg mx-auto p-8">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-slate-200">No Shortlisted Designs Yet</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Click the heart icon on any necklace, ring, bangle, or temple jewellery design to save it here for consultation.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-slate-950 text-xs font-bold px-6 py-3 rounded-full shadow-gold-glow"
          >
            Explore Jewellery Designs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Bulk Enquiry Modal */}
      <EnquiryModal
        isOpen={isBulkEnquiryOpen}
        onClose={() => setIsBulkEnquiryOpen(false)}
        defaultMessage={
          `Hello, I would like to enquire about my ${products.length} shortlisted designs:\n` +
          products.map(p => `• ${p.name} (ID: ${p.sku})`).join('\n') +
          `\nPlease share pricing, hallmarking details, and schedule an appointment.`
        }
      />
    </div>
  );
};
