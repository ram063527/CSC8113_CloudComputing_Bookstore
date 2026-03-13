import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // redirect to the page user tried to visit (optional)
  const redirectTo = useMemo(() => {
    const from = location.state?.from;
    return typeof from === "string" ? from : "/";
  }, [location.state]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // mock only
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) return setError("Please enter your full name.");
    if (!email.trim() || !email.includes("@")) return setError("Please enter a valid email.");
    if (!password.trim() || password.length < 4) return setError("Password must be at least 4 characters.");

    // Mock login (later: call API)
    login({ name: fullName.trim(), email: email.trim() });

    navigate(redirectTo, { replace: true });
  };

  return (
    <main style={{ padding: "24px 0" }}>
      <div className="container">
        <div
          style={{
            maxWidth: 520,
            margin: "0 auto",
            background: "white",
            border: "1px solid rgba(0,0,0,0.10)",
            borderRadius: 18,
            padding: 18,
            boxShadow: "0 18px 40px rgba(2,6,23,.10)",
          }}
        >
          <h1 style={{ margin: "6px 0 6px", letterSpacing: "-0.02em" }}>Login</h1>
          <p style={{ marginTop: 0, color: "rgba(11,18,32,.70)" }}>
            Sign in to continue shopping and access admin dashboard.
          </p>

          {error && (
            <div
              style={{
                background: "#fee2e2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                padding: "10px 12px",
                borderRadius: 12,
                marginBottom: 12,
                fontWeight: 700,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Full name</label>
            <input
              className="search-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g., Chaithanya Virupaksha"
              style={{ width: "100%", marginBottom: 12 }}
            />

            <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Email</label>
            <input
              className="search-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: "100%", marginBottom: 12 }}
            />

            <label style={{ fontWeight: 800, display: "block", marginBottom: 6 }}>Password</label>
            <input
              type="password"
              className="search-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              style={{ width: "100%", marginBottom: 14 }}
            />

            <button className="primary-btn" style={{ width: "100%" }} type="submit">
              Sign in
            </button>

            <button
              className="ghost-btn"
              type="button"
              style={{ width: "100%", marginTop: 10 }}
              onClick={() => navigate("/", { replace: true })}
            >
              Continue as guest
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}