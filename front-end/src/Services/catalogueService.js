import { API } from "../config/api";

export async function getProducts(page = 1) {
  const res = await fetch(`${API.catalog}?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function searchProducts({ query, genre, author, minPrice, maxPrice, page = 1 } = {}) {
  const params = new URLSearchParams({ page });
  if (query)    params.set("query",    query);
  if (genre)    params.set("genre",    genre);
  if (author)   params.set("author",   author);
  if (minPrice) params.set("minPrice", minPrice);
  if (maxPrice) params.set("maxPrice", maxPrice);

  const res = await fetch(`${API.catalog}/search?${params}`);
  if (!res.ok) throw new Error("Failed to search products");
  return res.json();
}

export async function getProductByCode(code) {
  const res = await fetch(`${API.catalog}/${code}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}
