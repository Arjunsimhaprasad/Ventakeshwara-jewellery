import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { useWishlist } from '../../hooks/useWishlist';

export const WishlistPage: React.FC = () => {
  const { wishlistProductIds } = useWishlist();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">Saved Favourites</span>
        <h1 className="font-serif text-3xl font-bold text-slate-100 flex items-center gap-3">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> My Wishlist ({products.length})
        </h1>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-slate-400">Loading saved wishlist items...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl border border-slate-800 space-y-4">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-300 text-sm">Your wishlist is currently empty.</p>
          <Link
            to="/catalog"
            className="inline-block bg-gold-500 hover:bg-gold-400 text-slate-950 text-xs font-bold px-6 py-2.5 rounded-full"
          >
            Explore Collections
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
              material={product.material}
              purity={product.purity}
              weightGrams={product.weightGrams}
              price={product.price}
              discountPercentage={product.discountPercentage}
              image={product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
              isFeatured={product.isFeatured}
              stockQuantity={product.stockQuantity}
            />
          ))}
        </div>
      )}
    </div>
  );
};
