import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { apiFetch } from '../services/api';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    discountPercentage: number;
    material: string;
    purity: string;
    images?: { imageUrl: string }[];
  };
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchCart = async () => {
    if (!token) {
      const local = localStorage.getItem('vj_cart');
      if (local) setItems(JSON.parse(local));
      return;
    }

    try {
      const res = await apiFetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!token) {
      const existing = items.find(i => i.productId === productId);
      let updated: CartItem[];
      if (existing) {
        updated = items.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
      } else {
        updated = [...items, { id: `local-${Date.now()}`, productId, quantity }];
      }
      setItems(updated);
      localStorage.setItem('vj_cart', JSON.stringify(updated));
      setIsCartOpen(true);
      return;
    }

    try {
      const res = await apiFetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });
      if (res.ok) {
        await fetchCart();
        setIsCartOpen(true);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!token) {
      const updated = items.map(i => i.id === itemId ? { ...i, quantity } : i);
      setItems(updated);
      localStorage.setItem('vj_cart', JSON.stringify(updated));
      return;
    }

    try {
      const res = await apiFetch(`/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });
      if (res.ok) fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!token) {
      const updated = items.filter(i => i.id !== itemId);
      setItems(updated);
      localStorage.setItem('vj_cart', JSON.stringify(updated));
      return;
    }

    try {
      const res = await apiFetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const clearCart = async () => {
    if (!token) {
      setItems([]);
      localStorage.removeItem('vj_cart');
      return;
    }

    try {
      await apiFetch('/api/cart', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => {
    const price = i.product ? i.product.price * (1 - i.product.discountPercentage / 100) : 0;
    return sum + (price * i.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      items, itemCount, subtotal, addToCart, updateQuantity, removeFromCart, clearCart, isCartOpen, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
