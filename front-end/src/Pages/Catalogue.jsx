import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import { searchProducts } from "../Services/catalogueService";

const GENRES = [
  "All", "Fiction", "Non-Fiction", "Science", "Technology",
  "History", "Biography", "Fantasy", "Mystery", "Self-Help",
];

export default function Catalogue() {
  const location = useLocation();
  const navigate = useNavigate();

  const urlSearch = useMemo(() => {
    return new URLSearchParams(location.search).get("q") || "";
  }, [location.search]);

  const [books,      setBooks]      = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [genre,      setGenre]      = useState("All");
  const [page,       setPage]       = useState(1);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [urlSearch, genre]);

  // Fetch whenever search, genre or page changes
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

  // Staff pick — best available book from current results, no extra call
  const staffPick = useMemo(
    () => books.find((b) => b.status === "AVAILABLE") || books[0],
    [books],
  );

  function resetFilters() {
    setGenre("All");
    setPage(1);
    navigate("/"); // clears ?q= from URL
  }

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
              <a href="#shop" className="primary-btn">Browse Books</a>
            </div>
          </div>

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
                      width: "100%", height: 200, objectFit: "cover",
                      borderRadius: 18, marginBottom: 16,
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100%", height: 200, borderRadius: 18, marginBottom: 16,
                    background: "#e0e7ff", display: "grid", placeItems: "center", fontSize: "3rem",
                  }}>
                    📖
                  </div>
                )}
                <h3 style={{ margin: "0 0 6px", fontSize: "1.2rem", lineHeight: 1.3 }}>
                  {staffPick.name}
                </h3>
                <p style={{ margin: "0 0 16px", color: "#6b7280", fontSize: "0.9rem" }}>
                  by {staffPick.author}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 900, fontSize: "1.3rem" }}>
                    £{Number(staffPick.price).toFixed(2)}
                  </span>
                  <a href="#shop" className="primary-btn small-btn">View in Shop →</a>
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

          {/* Genre chips */}
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

          {/* Reset filters — only shown when something is active */}
          {(genre !== "All" || urlSearch) && (
            <div style={{ marginBottom: 16 }}>
              <button className="ghost-btn small-btn" onClick={resetFilters}>
                ✕ Reset Filters
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              padding: 24, textAlign: "center", color: "#ef4444",
              background: "#fef2f2", borderRadius: 14, marginBottom: 24,
            }}>
              ⚠️ Could not load books: {error}
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="books-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="book-card skeleton-card" />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && books.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
              No books found. Try a different search or genre.
            </div>
          )}

          {/* Books grid */}
          {!loading && !error && books.length > 0 && (
            <div className="books-grid">
              {books.map((book) => (
                <BookCard key={book.code} book={book} />
              ))}
            </div>
          )}

          {/* Pagination with integrated count */}
          {!loading && totalPages >= 1 && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, marginTop: 24, flexWrap: "wrap",
            }}>
              <button
                className="ghost-btn small-btn"
                disabled={page === 1}
                onClick={() => setPage(1)}
              >« First</button>
              <button
                className="ghost-btn small-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >‹ Prev</button>

              <span style={{
                padding: "8px 14px", background: "white",
                border: "1px solid #e5e7eb", borderRadius: 999,
                fontWeight: 700, fontSize: "0.9rem", color: "#374151",
              }}>
                Page {page} of {totalPages} &nbsp;·&nbsp; {totalItems} books
              </span>

              <button
                className="ghost-btn small-btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >Next ›</button>
              <button
                className="ghost-btn small-btn"
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
              >Last »</button>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
