import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const STATUS_CONFIG = {
  AVAILABLE:    { label: "Available",    color: "#16a34a", bg: "#dcfce7", dot: "#22c55e" },
  OUT_OF_STOCK: { label: "Out of Stock", color: "#b45309", bg: "#fef9c3", dot: "#f59e0b" },
  DISCONTINUED: { label: "Discontinued", color: "#6b7280", bg: "#f3f4f6", dot: "#9ca3af" },
};

export default function BookCard({ book }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const isAvailable = book.status === "AVAILABLE";
  const status = STATUS_CONFIG[book.status] || STATUS_CONFIG.DISCONTINUED;

  function handleAddToCart(e) {
    e.preventDefault();
    if (!isAvailable) return;
    addItem(book, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="book-card">
      <div className="book-image-wrap">
        {book.imageUrl ? (
          <img
            src={book.imageUrl}
            alt={book.name}
            className="book-image"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "grid";
            }}
          />
        ) : null}
        <div
          className="book-image book-image-placeholder"
          style={{ display: book.imageUrl ? "none" : "grid" }}
        >
          📖
        </div>

        {/* Availability badge top-right of image */}
        <span
          className="availability-badge"
          style={{ background: status.bg, color: status.color }}
        >
          <span
            className="availability-dot"
            style={{ background: status.dot }}
          />
          {status.label}
        </span>
      </div>

      <div className="book-content">
        <span className="book-price">£{Number(book.price).toFixed(2)}</span>
        <h3 className="book-title">{book.name}</h3>
        <p className="book-author">{book.author}</p>

        <div className="book-actions">
          <Link to={`/book/${book.code}`} className="primary-btn small-btn">
            View
          </Link>
          <button
            className={`ghost-btn small-btn${added ? " btn-added" : ""}`}
            type="button"
            disabled={!isAvailable}
            onClick={handleAddToCart}
          >
            {added ? "✓ Added!" : isAvailable ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </article>
  );
}
