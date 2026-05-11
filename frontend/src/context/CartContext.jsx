import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'komn26_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  function addItem(productId, variantId, qty = 1) {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === productId && i.variantId === variantId
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === productId && i.variantId === variantId
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }
      return [...prev, { productId, variantId, qty }];
    });
  }

  function removeItem(productId, variantId) {
    setCartItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.variantId === variantId)
      )
    );
  }

  function updateQty(productId, variantId, qty) {
    if (qty <= 0) {
      removeItem(productId, variantId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.variantId === variantId
          ? { ...i, qty }
          : i
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const totalItems = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addItem, removeItem, updateQty, clearCart, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
