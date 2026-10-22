import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, X, Download, Eye, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../services/api';

export const CataloguesPage: React.FC = () => {
  const { token } = useAuth();
  const [catalogues, setCatalogues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Bridal');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pageCount, setPageCount] = useState('24');
  const [itemCount, setItemCount] = useState('30');
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchCatalogues = () => {
    setIsLoading(true);
    apiFetch('/api/catalogues')
      .then(res => res.json())
      .then(data => {
        setCatalogues(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCatalogues();
  }, []);

  const handleOpenModal = (cat?: any) => {
    if (cat) {
      setEditingId(cat.id);
      setTitle(cat.title);
      setSlug(cat.slug);
      setCategory(cat.category);
      setDescription(cat.description || '');
      setCoverImage(cat.coverImage);
      setPdfUrl(cat.pdfUrl || '');
      setPageCount(cat.pageCount?.toString() || '24');
      setItemCount(cat.itemCount?.toString() || '30');
      setIsFeatured(cat.isFeatured || false);
    } else {
      setEditingId(null);
      setTitle('');
      setSlug('');
      setCategory('Bridal');
      setDescription('');
      setCoverImage('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80');
      setPdfUrl('/catalogues/sample.pdf');
      setPageCount('24');
      setItemCount('30');
      setIsFeatured(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const payload = {
      title,
      slug: finalSlug,
      category,
      description,
      coverImage,
      pdfUrl,
      pageCount: parseInt(pageCount) || 20,
      itemCount: parseInt(itemCount) || 25,
      isFeatured
    };

    try {
      const url = editingId ? `/api/catalogues/${editingId}` : '/api/catalogues';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCatalogues();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this catalogue?')) return;
    try {
      const res = await apiFetch(`/api/catalogues/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCatalogues(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">
            Digital Publications
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-gold-400" /> Digital PDF Catalogues Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Upload and curate high-resolution collection lookbooks for customer viewing and PDF downloads.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-gold-glow transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Catalogue
        </button>
      </div>

      {/* Grid of Catalogues */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-400">Loading digital catalogues...</div>
      ) : catalogues.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl border border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-serif text-lg text-slate-200 font-bold">No Catalogues Created</h3>
          <p className="text-xs text-slate-400">Add your first collection lookbook to share with customers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogues.map(cat => (
            <div
              key={cat.id}
              className="glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-gold-500/40 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] bg-slate-900">
                <img src={cat.coverImage} alt={cat.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-gold-500 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {cat.category}
                </span>
                {cat.isFeatured && (
                  <span className="absolute top-2 right-2 bg-burgundy-900/90 text-gold-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gold-500/30">
                    Featured
                  </span>
                )}
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-100">{cat.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{cat.description}</p>
                  <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
                    <span>{cat.pageCount} Pages • {cat.itemCount} Designs</span>
                    <span className="text-gold-400 font-semibold">{cat.downloadCount || 0} Downloads</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenModal(cat)}
                    className="p-2 text-slate-400 hover:text-gold-300 rounded-lg hover:bg-slate-800"
                    title="Edit catalogue"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                    title="Delete catalogue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0F172A] border border-gold-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gold-500/20 bg-slate-900 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-slate-100">
                {editingId ? 'Edit Digital Lookbook' : 'Add New Digital Catalogue'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Catalogue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Heritage Bridal Lookbook 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                  >
                    <option value="Bridal">Bridal Trousseau</option>
                    <option value="Temple Jewellery">Temple Jewellery</option>
                    <option value="Diamond">Solitaire & Diamond</option>
                    <option value="Gold">Gold Masterpieces</option>
                    <option value="Antique">Antique & Polki</option>
                    <option value="Silver">Sterling Silver</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">URL Slug (optional)</label>
                  <input
                    type="text"
                    placeholder="auto-generated-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Page Count</label>
                  <input
                    type="number"
                    value={pageCount}
                    onChange={(e) => setPageCount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Designs Featured Count</label>
                  <input
                    type="number"
                    value={itemCount}
                    onChange={(e) => setItemCount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Summary of designs included in this lookbook..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredCat"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-gold-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="featuredCat" className="text-slate-300 font-medium cursor-pointer">
                  Feature on Storefront Homepage
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold px-6 py-2 rounded-xl shadow-gold-glow"
                >
                  Save Lookbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
