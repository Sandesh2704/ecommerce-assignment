import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, Product } from "../types/types";


interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  remove: (id: number) => void;
  getTotalPrice: () => number;
  getShipping: () => number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                totalPrice: (item.quantity + quantity) * item.price,
              }
            : item
        );
      }

      const newItem: CartItem = {
        ...product,
        quantity,
        totalPrice: product.price * quantity,
      };

      return [...prev, newItem];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
              totalPrice: item.price * quantity,
            }
          : item
      )
    );
  };

  const remove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getShipping = () => {
    const subtotal = getTotalPrice();
    return subtotal > 50 ? 0 : 10;
  };

  const cartCount = items.length;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        remove,
        getTotalPrice,
        getShipping,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};