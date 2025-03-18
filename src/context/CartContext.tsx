
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ProductData } from '../components/ProductCard';

interface CartItem {
  product: ProductData;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: ProductData) => void;
  removeFromCart: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Define helper functions first
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }
  return [];
};

const saveCartToStorage = (cart: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromStorage());

  const addToCart = (product: ProductData) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        const newCart = prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        saveCartToStorage(newCart);
        return newCart;
      }
      const newCart = [...prevItems, { product, quantity: 1 }];
      saveCartToStorage(newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => {
      const newCart = prevItems.filter(item => item.product.id !== productId);
      saveCartToStorage(newCart);
      return newCart;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
