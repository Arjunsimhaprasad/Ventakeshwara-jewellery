import React, { useState, useEffect, FormEvent } from 'react';
import { Plus, Edit, Trash2, X, Package, ShieldCheck } from 'lucide-react';
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
  const [material, setMaterial] = useState('Gold');
  const [jewelleryType, setJewelleryType] = useState('Necklace');
  const [purity, setPurity] = useState('22K (916)');
  const [weightGrams, setWeightGrams] = useState('25.0');
  const [makingCharges, setMakingCharges] = useState('5000');
  const [price, setPrice] = useState('150000');
  const [discountPercentage, setDiscountPercentage] = useState('0');
  const [stockQuantity, setStockQuantity] = useState('5');
  const [status, setStatus] = useState('active');
  const [imageUrl, setImageUrl] = useState('');

  const fetchProducts = () => {
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
      setMaterial(prod.material);
      setJewelleryType(prod.jewelleryType);
      setPurity(prod.purity);
      setWeightGrams(prod.weightGrams.toString());
      setMakingCharges(prod.makingCharges.toString());
      setPrice(prod.price.toString());
      setDiscountPercentage(prod.discountPercentage.toString());
      setStockQuantity(prod.stockQuantity.toString());
      setStatus(prod.status);
      setImageUrl(prod.images?.[0]?.imageUrl || '');
    } else {
      setEditingId(null);
      setName('');
      setSku(`VJ-NEW-${Math.floor(100 + Math.random() * 900)}`);
      setMaterial('Gold');
      setJewelleryType('Necklace');
      setPurity('22K (916)');
      setWeightGrams('25.0');
      setMakingCharges('5000');
      setPrice('150000');
      setDiscountPercentage('0');
      setStockQuantity('5');
      setStatus('active');
      setImageUrl('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80');
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const payload = {
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku,
      material,
      jewelleryType,
      purity,
      weightGrams: parseFloat(weightGrams),
      makingCharges: parseFloat(makingCharges),
      price: parseFloat(price),
      discountPercentage: parseFloat(discountPercentage),
      stockQuantity: parseInt(stockQuantity),
      status,
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
    if (!token || !confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">Inventory Manager</span>
          <h1 className="font-serif text-3xl font-bold text-slate-100 flex items-center gap-2">
            <Package className="w-8 h-8 text-gold-400" /> Products & Catalogue
          </h1>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-full shadow-gold-glow flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Jewellery Item
        </button>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-gold-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">Jewellery Item</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Metal & Purity</th>
              <th className="p-4">Making Charges</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {isLoading ? (
              <tr><td colSpan={8} className="p-8 text-center text-slate-400">Loading products...</td></tr>
            ) : products.map(prod => (
              <tr key={prod.id} className="hover:bg-slate-800/40">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={prod.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
                    alt={prod.name}
                    className="w-10 h-10 object-cover rounded-lg bg-slate-950"
                  />
                  <div>
                    <p className="font-semibold text-slate-100 font-serif line-clamp-1">{prod.name}</p>
                    <p className="text-[10px] text-slate-400">{prod.jewelleryType}</p>
                  </div>
                </td>
                <td className="p-4 font-mono text-slate-300">{prod.sku}</td>
                <td className="p-4">{prod.material} • {prod.purity}</td>
                <td className="p-4">₹{prod.makingCharges?.toLocaleString('en-IN')}</td>
                <td className="p-4 font-serif font-bold text-gold-300">₹{prod.price?.toLocaleString('en-IN')}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    prod.stockQuantity <= 2 ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {prod.stockQuantity} in stock
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                    prod.status === 'active' ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {prod.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleOpenModal(prod)} className="p-1.5 text-slate-400 hover:text-gold-300">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteProduct(prod.id)} className="p-1.5 text-slate-400 hover:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0F172A] border border-gold-500/40 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-100">
                {editingId ? 'Edit Product Specs' : 'Add New Heritage Jewellery Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Product Name *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">SKU Code *</label>
                  <input type="text" required value={sku} onChange={(e) => setSku(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Material</label>
                  <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Purity</label>
                  <input type="text" value={purity} onChange={(e) => setPurity(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Net Weight (g)</label>
                  <input type="number" step="0.001" value={weightGrams} onChange={(e) => setWeightGrams(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Making Charges (₹)</label>
                  <input type="number" value={makingCharges} onChange={(e) => setMakingCharges(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Price (₹) *</label>
                  <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Stock Quantity</label>
                  <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Image URL</label>
                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200" />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-gold-500 text-slate-950 font-bold rounded-xl shadow-gold-glow">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
