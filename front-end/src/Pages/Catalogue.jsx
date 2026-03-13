import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "../components/BookCard";
import { searchProducts } from "../Services/catalogueService";

// Hardcoded — no genres endpoint exists on the API.
// These map directly to the genre values in your seeded database.
// Update this list if you add new genres.
const GENRES = [
  "All",
  "Fiction",
  "Non-Fiction",
  "Science",
  "Technology",
  "History",
  "Biography",
  "Fantasy",
  "Mystery",
  "Self-Help",
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Catalogue() {
  const urlParams = useQuery();
  const urlSearch = urlParams.get("q") || "";

  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genre, setGenre] = useState("All");
  const [page, setPage] = useState(1);

  // Whenever URL search term, genre, or page changes → hit the API
  useEffect(() => {
    setLoading(true);
    setError(null);

    searchProducts({
      query: urlSearch || undefined,
      genre: genre !== "All" ? genre : undefined,
      page,
    })
      .then((res) => {
        setBooks(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalItems(res.totalElements || 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [urlSearch, genre, page]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [urlSearch, genre]);

  // Staff pick — first AVAILABLE book, no extra API call
  const staffPick = useMemo(
    () => books.find((b) => b.status === "AVAILABLE") || books[0],
    [books],
  );

  return (
    <main>
      {/* ── HERO ───────────────────────────────────────── */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">📚 New arrivals every week</span>
            <h1>Your next great read is here</h1>
            <p>
              Browse thousands of titles across fiction, non-fiction, science,
              technology, history and more. Fast delivery, great prices.
            </p>
            <div className="hero-actions">
              <a href="#shop" className="primary-btn">
                Browse Books
              </a>
            </div>
          </div>

          {/* Staff Pick — first available book from real API */}
          {staffPick && (
            <div className="hero-card">
              <div className="hero-card-top">
                <span>⭐ Staff Pick</span>
              </div>
              <div style={{ padding: "0 4px 16px" }}>
                {staffPick.imageUrl ? (
                  <img
                    src={staffPick.imageUrl}
                    alt={staffPick.name}
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 18,
                      marginBottom: 16,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: 18,
                      marginBottom: 16,
                      background: "#e0e7ff",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "3rem",
                    }}
                  >
                    📖
                  </div>
                )}
                <h3
                  style={{
                    margin: "0 0 6px",
                    fontSize: "1.2rem",
                    lineHeight: 1.3,
                  }}
                >
                  {staffPick.name}
                </h3>
                <p
                  style={{
                    margin: "0 0 16px",
                    color: "#6b7280",
                    fontSize: "0.9rem",
                  }}
                >
                  by {staffPick.author}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: 900, fontSize: "1.3rem" }}>
                    £{Number(staffPick.price).toFixed(2)}
                  </span>
                  <a href="#shop" className="primary-btn small-btn">
                    View in Shop →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SHOP ───────────────────────────────────────── */}
      <section className="shop-section" id="shop">
        <div className="container">
          <div style={{ marginBottom: 18 }}>
            <p className="section-tag">Our Catalogue</p>
            <h2 style={{ margin: "4px 0 0" }}>All Books</h2>
            {urlSearch && (
              <p className="section-subtext">
                Results for <strong>"{urlSearch}"</strong>
              </p>
            )}
          </div>

          {/* Genre chips — filter via backend search */}
          <div className="category-row">
            {GENRES.map((g) => (
              <button
                key={g}
                className={`category-chip ${genre === g ? "active-chip" : ""}`}
                onClick={() => setGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="results-bar">
            <span>
              {loading
                ? "Loading…"
                : `${totalItems} book${totalItems !== 1 ? "s" : ""} found · Page ${page} of ${totalPages}`}
            </span>
            {(genre !== "All" || urlSearch) && (
              <button
                className="ghost-btn small-btn"
                onClick={() => {
                  setGenre("All");
                  setPage(1);
                }}
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Error state */}
          {error && (
            <div
              style={{
                padding: 24,
                textAlign: "center",
                color: "#ef4444",
                background: "#fef2f2",
                borderRadius: 14,
                marginBottom: 24,
              }}
            >
              ⚠️ Could not load books: {error}
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="books-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="book-card skeleton-card" />
              ))}
            </div>
          )}

          {/* Books grid */}
          {!loading && !error && books.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
              No books found. Try a different search or genre.
            </div>
          )}

          {!loading && !error && books.length > 0 && (
            <div className="books-grid">
              {books.map((book) => (
                <BookCard key={book.code} book={book} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                marginTop: 18,
              }}
            >
              <button
                className="ghost-btn small-btn"
                disabled={page === 1}
                onClick={() => setPage(1)}
              >
                « First
              </button>
              <button
                className="ghost-btn small-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ‹ Prev
              </button>
              <span style={{ fontWeight: 700, padding: "8px 10px" }}>
                {page}
              </span>
              <button
                className="ghost-btn small-btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next ›
              </button>
              <button
                className="ghost-btn small-btn"
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
              >
                Last »
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
