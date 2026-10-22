import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Trash2, X, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../services/api';

export const CategoriesPage: React.FC = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchCategories = () => {
    setIsLoading(true);
    apiFetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat?: any) => {
    if (cat) {
      setEditingId(cat.id);
      setName(cat.name);
      setSlug(cat.slug);
      setDescription(cat.description || '');
      setImageUrl(cat.imageUrl || '');
      setIsActive(cat.isActive ?? true);
    } else {
      setEditingId(null);
      setName('');
      setSlug('');
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80');
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const payload = {
      name,
      slug: finalSlug,
      description,
      imageUrl,
      isActive
    };

    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this category? Associated designs will retain their specifications.')) return;
    try {
      const res = await apiFetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
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
            Taxonomy & Showcase Collections
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-7 h-7 text-gold-400" /> 14 Jewellery Categories Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Gold, Diamond, Silver, Bridal, Necklaces, Chains, Bangles, Bracelets, Rings, Earrings, Pendants, Antique, Traditional, Temple Jewellery.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-gold-glow transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      {/* Grid of Categories */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-400">Loading jewellery categories...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-gold-500/40 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-slate-900">
                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-slate-900/90 text-gold-300 text-[10px] font-mono px-2 py-0.5 rounded border border-gold-500/30">
                  /{cat.slug}
                </span>
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded ${
                  cat.isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                }`}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-100">{cat.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{cat.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenModal(cat)}
                    className="p-1.5 text-slate-400 hover:text-gold-300 rounded hover:bg-slate-800"
                    title="Edit category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                    title="Delete category"
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
          <div className="relative w-full max-w-md bg-[#0F172A] border border-gold-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-gold-500/20 bg-slate-900 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-slate-100">
                {editingId ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Temple Jewellery, Bridal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Slug URL identifier</label>
                <input
                  type="text"
                  placeholder="e.g. temple-jewellery"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Description of jewellery in this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCat"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-gold-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="activeCat" className="text-slate-300 font-medium cursor-pointer">
                  Category is Active on Storefront
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
