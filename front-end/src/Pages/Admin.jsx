import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import books from "../mock/books";

const serviceStatus = [
  { name: "Catalogue Service", status: "ok", version: "v1", latency: "~118ms", pods: 2 },
  { name: "Cart Service", status: "ok", version: "v1", latency: "~95ms", pods: 2 },
  { name: "PostgreSQL", status: "ok", version: "StatefulSet", latency: "—", pods: 1 },
  { name: "API Gateway", status: "warn", version: "mock", latency: "—", pods: 0 },
];

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container page-shell">
        <div className="simple-panel" style={{ textAlign: "center", padding: 40 }}>
          <h2 style={{ marginBottom: 12 }}>🔒 Admin Access Required</h2>
          <p style={{ color: "#6b7280", marginBottom: 20 }}>
            You must be logged in to view the admin dashboard.
          </p>
          <button className="primary-btn" onClick={() => navigate("/login")}>
            Log In
          </button>
        </div>
      </div>
    );
  }

  const totalBooks = books.length;
  const avgPrice = (books.reduce((s, b) => s + b.price, 0) / books.length).toFixed(2);
  const categories = [...new Set(books.map((b) => b.category))].length;

  return (
    <div className="container page-shell">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: "0 0 6px" }}>Admin Dashboard</h1>
        <p style={{ margin: 0, color: "#6b7280" }}>
          Logged in as <strong>{user.name}</strong> · {user.email}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Books", value: totalBooks, icon: "📚" },
          { label: "Categories", value: categories, icon: "🗂" },
          { label: "Avg Price", value: `£${avgPrice}`, icon: "💷" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 18,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 4px 12px rgba(15,23,42,0.05)",
            }}
          >
            <span style={{ fontSize: "2rem" }}>{s.icon}</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: "1.5rem", letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ color: "#6b7280", fontWeight: 600, fontSize: "0.9rem" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Service health */}
      <div className="simple-panel" style={{ marginBottom: 28 }}>
        <h2 style={{ margin: "0 0 18px", fontSize: "1.2rem" }}>Service Health</h2>
        <div style={{ display: "grid", gap: 10 }}>
          {serviceStatus.map((svc) => (
            <div
              key={svc.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "#f9fafb",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: svc.status === "ok" ? "#22c55e" : "#f59e0b",
                    boxShadow: svc.status === "ok"
                      ? "0 0 0 4px rgba(34,197,94,0.15)"
                      : "0 0 0 4px rgba(245,158,11,0.18)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontWeight: 800 }}>{svc.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                    {svc.version} · {svc.pods > 0 ? `${svc.pods} pod${svc.pods > 1 ? "s" : ""}` : "mock mode"}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>{svc.latency}</span>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    background: svc.status === "ok" ? "#dcfce7" : "#fef9c3",
                    color: svc.status === "ok" ? "#166534" : "#854d0e",
                  }}
                >
                  {svc.status === "ok" ? "Healthy" : "Mock"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book inventory table */}
      <div className="simple-panel">
        <h2 style={{ margin: "0 0 18px", fontSize: "1.2rem" }}>Book Inventory</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.92rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                {["Title", "Author", "Category", "Price", "Rating"].map((h) => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 800, color: "#374151" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr
                  key={b.id}
                  style={{ borderBottom: "1px solid #f3f4f6" }}
                >
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>{b.title}</td>
                  <td style={{ padding: "10px 12px", color: "#6b7280" }}>{b.author}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        background: "#eef2ff",
                        color: "#4f46e5",
                        padding: "3px 8px",
                        borderRadius: 999,
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      {b.category}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: 800 }}>£{b.price.toFixed(2)}</td>
                  <td style={{ padding: "10px 12px", color: "#f59e0b", fontWeight: 700 }}>
                    ★ {b.rating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
