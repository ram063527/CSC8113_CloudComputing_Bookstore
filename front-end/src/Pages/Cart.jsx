import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, total, setQty, removeItem, clear } = useCart();

  return (
    <main className="container" style={{ paddingTop: 18 }}>
      <h1 style={{ marginBottom: 6 }}>Your Cart</h1>
      <p style={{ color: "rgba(0,0,0,0.60)", marginTop: 0 }}>
        Items are stored locally for now (API will be connected after deployment).
      </p>

      {items.length === 0 ? (
        <div style={{ padding: 18, background: "white", borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)" }}>
          <p>Your cart is empty.</p>
          <Link to="/" className="primary-btn small-btn">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((x) => (
              <div
                key={x.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr auto",
                  gap: 12,
                  alignItems: "center",
                  background: "white",
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,0.08)",
                  padding: 12,
                }}
              >
                <img
                  src={x.image}
                  alt={x.title}
                  style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 10 }}
                />

                <div>
                  <div style={{ fontWeight: 800 }}>{x.title}</div>
                  <div style={{ color: "rgba(0,0,0,0.60)", fontSize: 13 }}>{x.author}</div>
                  <div style={{ marginTop: 6, fontWeight: 800 }}>£{x.price.toFixed(2)}</div>
                </div>

                <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button className="ghost-btn small-btn" onClick={() => setQty(x.id, x.qty - 1)}>-</button>
                    <div style={{ minWidth: 26, textAlign: "center", fontWeight: 800 }}>{x.qty}</div>
                    <button className="ghost-btn small-btn" onClick={() => setQty(x.id, x.qty + 1)}>+</button>
                  </div>
                  <button className="ghost-btn small-btn" onClick={() => removeItem(x.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "white",
              borderRadius: 14,
              border: "1px solid rgba(0,0,0,0.08)",
              padding: 14,
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 18 }}>Total: £{total.toFixed(2)}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="ghost-btn" onClick={clear}>Clear</button>
              <Link to="/checkout" className="primary-btn">Checkout</Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
}