import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import books from "../mock/books";
import { useCart } from "../context/CartContext";

function StarRating({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="rating">
      <span className="stars">
        {"★".repeat(full)}
        {half ? "½" : ""}
        {"☆".repeat(5 - full - (half ? 1 : 0))}
      </span>
      <span className="rating-value">{value} / 5</span>
    </div>
  );
}

export default function BookDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const book = books.find((item) => String(item.id) === String(id));

  if (!book) {
    return (
      <div className="container page-shell">
        <h2>Book not found</h2>
        <Link to="/" className="primary-btn small-btn">
          Back Home
        </Link>
      </div>
    );
  }

  function handleAdd() {
    addItem(book, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="container page-shell">
      <Link to="/" className="ghost-btn small-btn" style={{ marginBottom: 20, display: "inline-flex" }}>
        ← Back to Shop
      </Link>

      <div className="details-layout">
        <img src={book.image} alt={book.title} className="details-image" />

        <div className="details-content">
          <span className="book-category">{book.category}</span>
          <h1>{book.title}</h1>
          <p className="book-author">by {book.author}</p>
          <StarRating value={book.rating} />
          <p className="details-price">£{book.price.toFixed(2)}</p>
          <p className="details-description">{book.description}</p>

          <div className="book-actions" style={{ marginTop: 24 }}>
            <button
              className={`primary-btn${added ? " btn-added" : ""}`}
              onClick={handleAdd}
            >
              {added ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
            <Link to="/cart" className="ghost-btn">
              Go to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}