"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

type CartItem = {
  _id: string; // the item ID in the cart array
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  };
  quantity: number;
};

type Cart = {
  _id: string;
  items: CartItem[];
} | null;

interface CartContextType {
  cart: Cart;
  cartCount: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCartData: () => void; // call this locally after checkout
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const cartCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  const refreshCart = async () => {
    if (!user) {
      setCart(null);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      } else {
        setCart(null);
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) return alert("Please log in to add items to cart!");
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity })
      });
      if (res.ok) await refreshCart();
    } catch (error) {
      console.error(error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const res = await fetch("/api/cart/update", {
        method: "POST", // The backend route uses POST based on what we saw earlier
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity })
      });
      if (res.ok) await refreshCart();
    } catch (error) {
      console.error(error);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      });
      if (res.ok) await refreshCart();
    } catch (error) {
      console.error(error);
    }
  };

  const clearCartData = () => {
    setCart(null);
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, isLoading, addToCart, updateQuantity, removeItem, refreshCart, clearCartData }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
