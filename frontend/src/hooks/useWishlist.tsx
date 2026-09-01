import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { apiFetch } from '../services/api';

interface WishlistContextType {
  wishlistProductIds: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);

  const fetchWishlist = async () => {
    if (!token) {
      const local = localStorage.getItem('vj_wishlist');
      if (local) setWishlistProductIds(JSON.parse(local));
      return;
    }

    try {
      const res = await apiFetch('/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWishlistProductIds((data.items || []).map((i: any) => i.productId));
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  const isInWishlist = (productId: string) => wishlistProductIds.includes(productId);

  const toggleWishlist = async (productId: string) => {
    const exists = isInWishlist(productId);

    if (!token) {
      const updated = exists
        ? wishlistProductIds.filter(id => id !== productId)
        : [...wishlistProductIds, productId];
      setWishlistProductIds(updated);
      localStorage.setItem('vj_wishlist', JSON.stringify(updated));
      return;
    }

    try {
      if (exists) {
        await apiFetch(`/api/wishlist/items/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await apiFetch('/api/wishlist/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId })
        });
      }
      fetchWishlist();
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistProductIds, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
