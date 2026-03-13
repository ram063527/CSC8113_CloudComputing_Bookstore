import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "bookstore_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{id,title,author,price,image,qty}]

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setItems(JSON.parse(raw));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (book, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === book.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [
        ...prev,
        {
          id: book.id,
          title: book.title,
          author: book.author,
          price: Number(book.price),
          image: book.image,
          qty,
        },
      ];
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

  const setQty = (id, qty) =>
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty } : x)).filter((x) => x.qty > 0)
    );

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((s, x) => s + x.qty, 0), [items]);
  const total = useMemo(() => items.reduce((s, x) => s + x.price * x.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, setQty, clear, count, total }),
    [items, count, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}