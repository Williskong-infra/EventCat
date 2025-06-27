import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

export interface CartItem {
  id: string;
  eventId: string;
  quantity: number;
  event: {
    id: string;
    title: string;
    price?: number;
    // Add more event fields as needed
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (eventId: string, quantity?: number) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeCartItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (eventId: string, quantity = 1) => {
    const token = localStorage.getItem('token');
    await axios.post('/api/cart/add', { eventId, quantity }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchCart();
  };

  const updateCartItem = async (cartItemId: string, quantity: number) => {
    const token = localStorage.getItem('token');
    await axios.post('/api/cart/update', { cartItemId, quantity }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchCart();
  };

  const removeCartItem = async (cartItemId: string) => {
    const token = localStorage.getItem('token');
    await axios.post('/api/cart/remove', { cartItemId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchCart();
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    await axios.post('/api/cart/clear', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchCart();
  };

  useEffect(() => {
    if (localStorage.getItem('token')) fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateCartItem, removeCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}; 