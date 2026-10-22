import React, { useState, useEffect, FormEvent } from 'react';
import { Plus, Edit, Trash2, X, Package, ShieldCheck, Sparkles, Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const ProductsPage: React.FC = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [material, setMaterial] = useState('22K Yellow Gold');
  const [jewelleryType, setJewelleryType] = useState('Temple Jewellery');
  const [purity, setPurity] = useState('22K (916) BIS Hallmarked');
  const [weightGrams, setWeightGrams] = useState('25.0');
  const [makingCharges, setMakingCharges] = useState('5000');
  const [price, setPrice] = useState('150000');
  const [isPriceOnRequest, setIsPriceOnRequest] = useState(false);
  const [stoneInformation, setStoneInformation] = useState('');
  const [variationsStr, setVariationsStr] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('0');
  const [status, setStatus] = useState('active');
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const jewelleryTypesList = [
    'Temple Jewellery', 'Bridal', 'Gold', 'Diamond', 'Silver',
    'Necklaces', 'Chains', 'Bangles', 'Bracelets', 'Rings',
    'Earrings', 'Pendants', 'Antique', 'Traditional'
  ];

  const fetchProducts = () => {
    setIsLoading(true);
    fetch('/api/products?status=all')
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
    fetchProducts();
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []));
  }, []);

  const handleOpenModal = (prod?: any) => {
    if (prod) {
      setEditingId(prod.id);
      setName(prod.name);
      setSku(prod.sku);
      setCategoryId(prod.categoryId || '');
      setMaterial(prod.material || 'Gold');
      setJewelleryType(prod.jewelleryType || 'Necklace');
      setPurity(prod.purity || '22K (916)');
      setWeightGrams(prod.weightGrams?.toString() || '25.0');
      setMakingCharges(prod.makingCharges?.toString() || '5000');
      setPrice(prod.price?.toString() || '0');
      setIsPriceOnRequest(prod.isPriceOnRequest || prod.price === 0);
      setStoneInformation(prod.stoneInformation || '');
      setVariationsStr((prod.variations || []).join(', '));
      setDiscountPercentage(prod.discountPercentage?.toString() || '0');
      setStatus(prod.status || 'active');
      setIsFeatured(prod.isFeatured || false);
      setDescription(prod.description || '');
      setImageUrl(prod.images?.[0]?.imageUrl || '');
    } else {
      setEditingId(null);
      setName('');
      setSku(`VJ-DSG-${Math.floor(100 + Math.random() * 900)}`);
      setCategoryId(categories[0]?.id || '');
      setMaterial('22K Yellow Gold');
      setJewelleryType('Temple Jewellery');
      setPurity('22K (916) BIS Hallmarked');
      setWeightGrams('32.5');
      setMakingCharges('8000');
      setPrice('225000');
      setIsPriceOnRequest(false);
      setStoneInformation('Natural Rubies and Emerald accents');
      setVariationsStr('22K Yellow Gold, Antique Matte Gold Finish');
      setDiscountPercentage('0');
      setStatus('active');
      setIsFeatured(false);
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80');
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const variations = variationsStr
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

    const numericPrice = isPriceOnRequest ? 0 : parseFloat(price) || 0;

    const payload = {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku,
      categoryId: categoryId || null,
      description: description || `${material} ${jewelleryType} piece with ${purity}.`,
      material,
      jewelleryType,
      purity,
      weightGrams: parseFloat(weightGrams) || 10,
      makingCharges: parseFloat(makingCharges) || 0,
      price: numericPrice,
      isPriceOnRequest: isPriceOnRequest || numericPrice === 0,
      stoneInformation,
      variations,
      discountPercentage: parseFloat(discountPercentage) || 0,
      stockQuantity: 5,
      status,
      isFeatured,
      images: imageUrl ? [{ imageUrl, sortOrder: 0 }] : []
    };

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this jewellery design?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">
            Atelier Vault & Showcase
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 flex items-center gap-2">
            <Package className="w-7 h-7 text-gold-400" /> Jewellery Designs & Inventory
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Curate designs across 14 categories, manage Unique Design IDs (SKUs), metal purities, weights, and Price on Request settings.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-gold-glow transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Design
        </button>
      </div>

      {/* Table of Designs */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-400">Loading jewellery designs...</div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Design Piece</th>
                  <th className="p-4">Unique Design ID</th>
                  <th className="p-4">Category & Material</th>
                  <th className="p-4">Purity & Net Wt</th>
                  <th className="p-4">Indicative Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {products.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
                          alt={prod.name}
                          className="w-11 h-11 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-serif font-semibold text-slate-100 truncate max-w-[200px]">
                            {prod.name}
                          </p>
                          {prod.isFeatured && (
                            <span className="text-[9px] bg-gold-500/20 text-gold-300 px-1.5 py-0.5 rounded font-bold uppercase">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-900 text-gold-300 font-mono text-[11px] font-bold px-2 py-1 rounded border border-slate-800">
                        {prod.sku}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-200 block">{prod.jewelleryType || 'Jewellery'}</span>
                      <span className="text-slate-400 text-[10px]">{prod.material}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-200 block">{prod.purity}</span>
                      <span className="text-gold-400 font-semibold">{prod.weightGrams}g</span>
                    </td>
                    <td className="p-4">
                      {prod.isPriceOnRequest || !prod.price ? (
                        <span className="bg-gold-500/10 text-gold-300 border border-gold-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          Price on Request
                        </span>
                      ) : (
                        <span className="font-serif font-bold text-gold-300 text-sm">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        prod.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {prod.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(prod)}
                          className="p-1.5 text-slate-400 hover:text-gold-300 rounded hover:bg-slate-800"
                          title="Edit design"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                          title="Delete design"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#0F172A] border border-gold-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gold-500/20 bg-slate-900 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-slate-100">
                {editingId ? 'Edit Jewellery Design' : 'Add New Jewellery Design'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Design Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Temple Lakshmi Nakshi Haar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Unique Design ID (SKU) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VJ-TMP-NK-001"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-gold-300 font-mono rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Jewellery Category *</label>
                  <select
                    value={jewelleryType}
                    onChange={(e) => setJewelleryType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                  >
                    {jewelleryTypesList.map(jt => (
                      <option key={jt} value={jt}>{jt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Metal & Material</label>
                  <input
                    type="text"
                    placeholder="e.g. 22K Yellow Gold, Polki"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Purity Specification</label>
                  <input
                    type="text"
                    placeholder="e.g. 22K (916) BIS Hallmarked"
                    value={purity}
                    onChange={(e) => setPurity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Net Weight (grams) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Making Charges (₹)</label>
                  <input
                    type="number"
                    value={makingCharges}
                    onChange={(e) => setMakingCharges(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Indicative Valuation (₹)</label>
                  <input
                    type="number"
                    disabled={isPriceOnRequest}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5 disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Price on Request Toggle */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-slate-200 block">Show as "Price on Request"</strong>
                  <span className="text-[11px] text-slate-400">
                    Recommended for rare master bridal sets, bespoke uncut polki, or high-value solitaires.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isPriceOnRequest}
                  onChange={(e) => setIsPriceOnRequest(e.target.checked)}
                  className="w-5 h-5 rounded text-gold-500 bg-slate-900 border-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Stone & Diamond Information</label>
                <input
                  type="text"
                  placeholder="e.g. Natural Burmese Potta Rubies, Zambian Emeralds, VVS1 Certified Solitaires"
                  value={stoneInformation}
                  onChange={(e) => setStoneInformation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Variations (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. 22K Yellow Gold, Antique Matte Finish, Sizes 12 to 24"
                  value={variationsStr}
                  onChange={(e) => setVariationsStr(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">High-Resolution Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Craftsmanship Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed notes on filigree, deity motif, karigar technique..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-2.5"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-gold-500 bg-slate-900 border-slate-700"
                  />
                  <span className="text-slate-300 font-medium">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={status === 'active'}
                    onChange={(e) => setStatus(e.target.checked ? 'active' : 'inactive')}
                    className="w-4 h-4 rounded text-gold-500 bg-slate-900 border-slate-700"
                  />
                  <span className="text-slate-300 font-medium">Active in Showcase</span>
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
                  Save Design
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
