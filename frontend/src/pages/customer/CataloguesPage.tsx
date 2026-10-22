import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Download, Eye, Sparkles, Filter, ChevronLeft, ChevronRight, X, Send, MessageSquare, ShieldCheck, FileText } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { EnquiryModal } from '../../components/common/EnquiryModal';

export const CataloguesPage: React.FC = () => {
  const [catalogues, setCatalogues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeViewerCatalogue, setActiveViewerCatalogue] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedCatalogueForEnquiry, setSelectedCatalogueForEnquiry] = useState<any | null>(null);

  const categories = [
    { label: 'All Collections', value: 'all' },
    { label: 'Bridal Trousseau', value: 'Bridal' },
    { label: 'Temple Jewellery', value: 'Temple Jewellery' },
    { label: 'Solitaire & Diamond', value: 'Diamond' },
    { label: 'Antique & Polki', value: 'Antique' },
    { label: 'Sterling Silver', value: 'Silver' }
  ];

  useEffect(() => {
    setIsLoading(true);
    const url = selectedCategory === 'all'
      ? '/api/catalogues'
      : `/api/catalogues?category=${encodeURIComponent(selectedCategory)}`;

    apiFetch(url)
      .then(res => res.json())
      .then(data => {
        setCatalogues(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [selectedCategory]);

  const handleDownload = async (catalogue: any) => {
    // Increment count on server
    try {
      await apiFetch(`/api/catalogues/${catalogue.id}/download`, { method: 'POST' });
      setCatalogues(prev => prev.map(c => c.id === catalogue.id ? { ...c, downloadCount: (c.downloadCount || 0) + 1 } : c));
    } catch {}

    // Create client-side printable PDF view / download link
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${catalogue.title} — Venkateshwara Jewellery Catalogue</title>
            <style>
              body { font-family: 'Georgia', serif; margin: 40px; color: #1e293b; background: #fff; }
              .header { text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #aa820a; }
              .sub { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #64748b; margin-top: 5px; }
              .title { font-size: 26px; font-weight: bold; margin-top: 20px; color: #0f172a; }
              .desc { font-size: 13px; line-height: 1.6; color: #475569; max-width: 600px; margin: 10px auto 0; }
              .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; margin-top: 30px; }
              .card { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; page-break-inside: avoid; }
              .card img { width: 100%; height: 260px; object-fit: cover; }
              .card-body { padding: 15px; }
              .badge { display: inline-block; font-size: 10px; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-weight: bold; }
              .sku { font-size: 11px; color: #64748b; font-family: monospace; float: right; }
              .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">VENKATESHWARAA JEWELLERY</div>
              <div class="sub">Customised Jewellery Since 1978 • Jubilee Hills, Hyderabad</div>
              <div class="title">${catalogue.title}</div>
              <div class="desc">${catalogue.description}</div>
            </div>
            <div class="grid">
              ${(catalogue.previewImages || [catalogue.coverImage]).map((img: string, i: number) => `
                <div class="card">
                  <img src="${img}" alt="Jewellery Design" />
                  <div class="card-body">
                    <span class="badge">Certified 22K/18K Hallmarked</span>
                    <span class="sku">ID: VJ-CAT-${String(i+1).padStart(3, '0')}</span>
                    <h3 style="font-size: 16px; margin: 10px 0 5px;">Masterpiece Design Edition ${i+1}</h3>
                    <p style="font-size: 12px; color: #64748b; margin: 0;">Handcrafted in Hyderabad • Custom weights & gemstones available on request</p>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="footer">
              <p>For bespoke enquiries or showroom appointments, please contact +91 98765 43210 or visit our flagship boutique at Road No. 36, Jubilee Hills, Hyderabad.</p>
              <p>© ${new Date().getFullYear()} Venkateshwaraa Jewellery Pvt Ltd. All rights reserved.</p>
            </div>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const openViewer = (cat: any) => {
    setActiveViewerCatalogue(cat);
    setCurrentPage(0);
  };

  const viewerImages = activeViewerCatalogue
    ? activeViewerCatalogue.previewImages && activeViewerCatalogue.previewImages.length > 0
      ? activeViewerCatalogue.previewImages
      : [activeViewerCatalogue.coverImage]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" /> Digital Lookbooks & PDF Editions
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100">
          Exclusive Digital Catalogues
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          Explore our curated lookbooks featuring magnificent bridal trousseau sets, sacred temple gold sculptures, VVS diamond solitaires, and antique Polki heirloom designs. View high-resolution galleries or download printable catalogues.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-2">
        {categories.map(c => (
          <button
            key={c.value}
            onClick={() => setSelectedCategory(c.value)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === c.value
                ? 'bg-gold-500 text-slate-950 font-bold shadow-gold-glow'
                : 'glass-panel text-slate-300 hover:text-white border-slate-700'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Catalogues Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-400 space-y-3">
          <Sparkles className="w-8 h-8 text-gold-400 animate-spin mx-auto" />
          <p className="font-serif text-slate-200">Loading fine jewellery digital lookbooks...</p>
        </div>
      ) : catalogues.length === 0 ? (
        <div className="text-center py-20 glass-panel p-8 rounded-3xl max-w-md mx-auto space-y-4 border border-gold-500/20">
          <BookOpen className="w-12 h-12 text-gold-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-slate-100">No Catalogues Found</h3>
          <p className="text-xs text-slate-400">Please choose a different category or contact our concierge for custom collection lookbooks.</p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="bg-gold-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-full"
          >
            Show All Catalogues
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {catalogues.map(cat => (
            <div
              key={cat.id}
              className="group glass-panel rounded-3xl overflow-hidden border border-gold-500/20 hover:border-gold-500/50 transition-all duration-300 shadow-luxury flex flex-col justify-between"
            >
              {/* Cover Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                <img
                  src={cat.coverImage}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-gold-500 text-slate-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {cat.category}
                  </span>
                  {cat.isFeatured && (
                    <span className="bg-burgundy-900/90 text-gold-300 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-gold-500/30">
                      Featured Edition
                    </span>
                  )}
                </div>

                {/* Quick Meta */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] text-slate-300 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60">
                  <span>{cat.pageCount} Pages • {cat.itemCount} Designs</span>
                  <span className="text-gold-400 font-semibold">{cat.downloadCount || 0} Downloads</span>
                </div>
              </div>

              {/* Information Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-slate-100 group-hover:text-gold-300 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openViewer(cat)}
                      className="flex-1 bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-gold-glow"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Online
                    </button>
                    <button
                      onClick={() => handleDownload(cat)}
                      title="Download / Print PDF"
                      className="glass-panel hover:bg-slate-800 text-gold-300 text-xs font-semibold py-2.5 px-4 rounded-xl border border-gold-500/30 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCatalogueForEnquiry(cat);
                      setIsEnquiryModalOpen(true);
                    }}
                    className="w-full text-center text-xs text-slate-400 hover:text-gold-300 transition-colors py-1 flex items-center justify-center gap-1"
                  >
                    <Send className="w-3 h-3 text-gold-400" /> Enquire About This Collection
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Lookbook Fullscreen Viewer Modal */}
      {activeViewerCatalogue && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-[#0B0F17] border border-gold-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-gold-500/20 bg-slate-900/90 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gold-400 uppercase tracking-widest font-semibold block">
                  {activeViewerCatalogue.category} Catalogue
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-100">
                  {activeViewerCatalogue.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(activeViewerCatalogue)}
                  className="bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
                <button
                  onClick={() => setActiveViewerCatalogue(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Stage */}
            <div className="flex-1 overflow-hidden relative flex items-center justify-center p-4 bg-slate-950/60">
              <div className="relative max-h-[60vh] aspect-[4/3] rounded-2xl overflow-hidden border border-gold-500/30 shadow-2xl">
                <img
                  src={viewerImages[currentPage] || activeViewerCatalogue.coverImage}
                  alt={`Page ${currentPage + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-gold-300 text-[10px] font-bold px-3 py-1 rounded-full border border-gold-500/30">
                  Plate {currentPage + 1} of {viewerImages.length}
                </div>
                <div className="absolute bottom-3 inset-x-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-100 block">
                      Plate #{currentPage + 1}: {activeViewerCatalogue.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Certified 22K (916) BIS Hallmarked & Natural Gemstones
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCatalogueForEnquiry({
                        ...activeViewerCatalogue,
                        name: `${activeViewerCatalogue.title} (Plate #${currentPage + 1})`
                      });
                      setIsEnquiryModalOpen(true);
                    }}
                    className="bg-gold-500 hover:bg-gold-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap"
                  >
                    <Send className="w-3 h-3" /> Enquire This Design
                  </button>
                </div>
              </div>

              {/* Prev/Next Buttons */}
              {viewerImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentPage(prev => (prev > 0 ? prev - 1 : viewerImages.length - 1))}
                    className="absolute left-4 p-3 rounded-full glass-panel text-gold-300 hover:scale-110 transition-all border-gold-500/30"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => (prev < viewerImages.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 p-3 rounded-full glass-panel text-gold-300 hover:scale-110 transition-all border-gold-500/30"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {viewerImages.length > 1 && (
              <div className="p-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-center gap-2 overflow-x-auto">
                {viewerImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                      currentPage === idx ? 'border-gold-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        product={
          selectedCatalogueForEnquiry
            ? {
                name: selectedCatalogueForEnquiry.title,
                sku: `CAT-${selectedCatalogueForEnquiry.category?.toUpperCase() || 'LOOKBOOK'}`,
                image: selectedCatalogueForEnquiry.coverImage,
                isPriceOnRequest: true,
                material: selectedCatalogueForEnquiry.category
              }
            : null
        }
        defaultMessage={
          selectedCatalogueForEnquiry
            ? `Hello, I reviewed the digital catalogue "${selectedCatalogueForEnquiry.title}". Please share pricing and showroom viewing availability for this collection.`
            : undefined
        }
      />
    </div>
  );
};
