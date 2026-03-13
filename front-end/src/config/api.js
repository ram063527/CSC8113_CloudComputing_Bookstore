const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:9000";

export const API = {
  catalog: `${API_BASE}/catalog`,
  cart:    `${API_BASE}/cart`,
};
