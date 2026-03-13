import { API } from "../config/api";

export async function addToCart(bookId, quantity = 1) {
  const res = await fetch(`${API.cart}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, quantity }),
  });

  if (!res.ok) throw new Error("Failed to add item to cart");
  return res.json();
}